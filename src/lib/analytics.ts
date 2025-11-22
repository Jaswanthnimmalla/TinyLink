// Analytics utility functions for parsing device, browser, and location data

interface DeviceInfo {
  device: string;
  browser: string;
  os: string;
}

interface GeoLocation {
  country: string;
  countryCode: string;
  city: string;
  region: string;
}

/**
 * Parse User-Agent string to extract device, browser, and OS info
 */
export function parseUserAgent(userAgent: string): DeviceInfo {
  const ua = userAgent.toLowerCase();
  
  // Detect device type
  let device = 'Desktop';
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
    device = 'Tablet';
  } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
    device = 'Mobile';
  }
  
  // Detect browser
  let browser = 'Unknown';
  if (ua.includes('edg/') || ua.includes('edge/')) {
    browser = 'Edge';
  } else if (ua.includes('opr/') || ua.includes('opera')) {
    browser = 'Opera';
  } else if (ua.includes('chrome') && !ua.includes('edg')) {
    browser = 'Chrome';
  } else if (ua.includes('safari') && !ua.includes('chrome')) {
    browser = 'Safari';
  } else if (ua.includes('firefox')) {
    browser = 'Firefox';
  } else if (ua.includes('msie') || ua.includes('trident/')) {
    browser = 'Internet Explorer';
  }
  
  // Detect OS
  let os = 'Unknown';
  if (ua.includes('windows nt 10.0')) {
    os = 'Windows 10/11';
  } else if (ua.includes('windows nt 6.3')) {
    os = 'Windows 8.1';
  } else if (ua.includes('windows nt 6.2')) {
    os = 'Windows 8';
  } else if (ua.includes('windows nt 6.1')) {
    os = 'Windows 7';
  } else if (ua.includes('windows')) {
    os = 'Windows';
  } else if (ua.includes('mac os x')) {
    const match = ua.match(/mac os x ([\d_]+)/);
    os = match ? `macOS ${match[1].replace(/_/g, '.')}` : 'macOS';
  } else if (ua.includes('android')) {
    const match = ua.match(/android ([\d.]+)/);
    os = match ? `Android ${match[1]}` : 'Android';
  } else if (ua.includes('iphone') || ua.includes('ipad')) {
    const match = ua.match(/os ([\d_]+)/);
    os = match ? `iOS ${match[1].replace(/_/g, '.')}` : 'iOS';
  } else if (ua.includes('linux')) {
    os = 'Linux';
  } else if (ua.includes('cros')) {
    os = 'Chrome OS';
  }
  
  return { device, browser, os };
}

/**
 * Get geolocation data from IP address using ipapi.co (free API)
 */
export async function getGeolocation(ipAddress: string): Promise<GeoLocation | null> {
  try {
    // Skip localhost/private IPs
    if (ipAddress === '127.0.0.1' || ipAddress === '::1' || ipAddress.startsWith('192.168.') || ipAddress.startsWith('10.')) {
      return {
        country: 'Local',
        countryCode: 'LOCAL',
        city: 'Localhost',
        region: 'Development'
      };
    }
    
    // Call free geolocation API
    const response = await fetch(`https://ipapi.co/${ipAddress}/json/`, {
      headers: {
        'User-Agent': 'TinyLink-Analytics/1.0'
      }
    });
    
    if (!response.ok) {
      console.error('Geolocation API error:', response.status);
      return null;
    }
    
    const data = await response.json();
    
    // Check for rate limit or error
    if (data.error || data.reason) {
      console.error('Geolocation error:', data.reason || data.error);
      return null;
    }
    
    return {
      country: data.country_name || 'Unknown',
      countryCode: data.country_code || 'XX',
      city: data.city || 'Unknown',
      region: data.region || 'Unknown'
    };
  } catch (error) {
    console.error('Error fetching geolocation:', error);
    return null;
  }
}

/**
 * Extract IP address from request headers (handles proxies)
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, get the first one
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP.trim();
  }
  
  // Fallback (this won't work in production but useful for development)
  return '127.0.0.1';
}

/**
 * Get country flag emoji from country code
 */
export function getCountryFlag(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌍';
  
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  
  return String.fromCodePoint(...codePoints);
}

/**
 * Format device icon
 */
export function getDeviceIcon(device: string): string {
  switch (device.toLowerCase()) {
    case 'mobile': return '📱';
    case 'tablet': return '📱';
    case 'desktop': return '💻';
    default: return '🖥️';
  }
}

/**
 * Format browser icon
 */
export function getBrowserIcon(browser: string): string {
  switch (browser.toLowerCase()) {
    case 'chrome': return '🟢';
    case 'safari': return '🔵';
    case 'firefox': return '🟠';
    case 'edge': return '🔷';
    case 'opera': return '🔴';
    default: return '🌐';
  }
}