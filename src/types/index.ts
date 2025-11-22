export interface Link {
  id: number;
  code: string;
  url: string;
  clicks: number;
  createdAt: Date;
  lastClickedAt: Date | null;
}

export interface CreateLinkRequest {
  url: string;
  customCode?: string;
}

export interface UpdateLinkRequest {
  url?: string;
}

export interface ApiError {
  error: string;
  message?: string;
}

export interface ClickData {
  date: string;
  clicks: number;
}

export interface Stats {
  totalLinks: number;
  totalClicks: number;
  averageClicks: number;
}

export interface HealthStatus {
  ok: boolean;
  version: string;
  timestamp: string;
  database?: {
    connected: boolean;
    error?: string;
  };
}
