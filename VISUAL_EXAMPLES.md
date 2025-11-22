# Visual Examples - TinyLink Styling Guide 🎨

This guide shows practical examples of how to use the new styling classes throughout the
application.

---

## 🎯 Quick Reference

### Gradient Borders

#### Basic Gradient Border

```jsx
<div className="glass rounded-xl p-6 border-4 border-transparent shadow-rainbow-glow"
     style={{ 
       backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #667eea, #764ba2, #ec4899)',
       backgroundOrigin: 'padding-box, border-box',
       backgroundClip: 'padding-box, border-box'
     }}>
  Beautiful gradient border card
</div>
```

#### Neon Glow Border

```jsx
<div className="border-neon-indigo rounded-xl p-6">
  Card with neon indigo glow
</div>
```

#### Rainbow Animated Border

```jsx
<div className="border-rainbow rounded-xl p-6">
  Animated multi-color border
</div>
```

---

## 💫 Shadow Effects

### Colored Glows

```jsx
// Indigo glow
<div className="shadow-indigo-glow">...</div>

// Purple glow
<div className="shadow-purple-glow">...</div>

// Pink glow
<div className="shadow-pink-glow">...</div>

// Rainbow glow (multi-color)
<div className="shadow-rainbow-glow">...</div>
```

---

## 🎨 Text Effects

### Gradient Text

```jsx
// Static gradient
<h1 className="gradient-text text-4xl font-bold">
  Beautiful Gradient
</h1>

// Animated vibrant gradient
<h1 className="gradient-text-vibrant text-4xl font-bold">
  Animated Gradient
</h1>
```

---

## 🃏 Card Styles

### Stats Card with Gradient Border

```jsx
<div className="glass rounded-2xl p-6 border-4 border-transparent card-hover shadow-indigo-glow"
     style={{ 
       backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #667eea, #764ba2, #ec4899)',
       backgroundOrigin: 'padding-box, border-box',
       backgroundClip: 'padding-box, border-box'
     }}>
  <div className="text-4xl font-bold gradient-text">42</div>
  <div className="text-sm text-gray-600">Total Links</div>
</div>
```

### Info Card with Neon Border

```jsx
<div className="glass rounded-xl p-6 border-neon-purple hover:shadow-purple-glow transition-all">
  <h3 className="font-bold text-lg mb-2">Feature Title</h3>
  <p className="text-gray-600">Feature description with neon purple border</p>
</div>
```

---

## 🔘 Button Variations

### Primary Button (Gradient)

```jsx
<button className="px-6 py-3 btn-gradient text-white rounded-xl font-bold ripple shadow-lg">
  Click Me
</button>
```

### Custom Gradient Button

```jsx
<button className="px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 
                   text-white rounded-xl font-bold border-2 border-white/20 
                   hover:shadow-rainbow-glow transition-all">
  Beautiful Button
</button>
```

---

## 📝 Input Fields

### Gradient Input

```jsx
<input 
  className="w-full px-5 py-3.5 border-3 border-indigo-300 rounded-xl
             bg-gradient-to-r from-white to-indigo-50/30
             focus:ring-4 focus:ring-indigo-500/30 focus:border-indigo-500
             hover:border-indigo-400 shadow-md hover:shadow-lg transition-all"
  placeholder="Beautiful input field"
/>
```

### Error State Input

```jsx
<input 
  className="w-full px-5 py-3.5 border-3 border-red-400 rounded-xl
             bg-red-50 focus:ring-4 focus:ring-red-500/30 focus:border-red-500"
  placeholder="Error state input"
/>
```

---

## 🎯 Icon Containers

### Gradient Icon Box

```jsx
<div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 
                rounded-xl flex items-center justify-center shadow-purple-glow 
                border-2 border-white/50 hover:scale-110 transition-transform">
  <IconComponent className="h-6 w-6 text-white" />
</div>
```

### Neon Icon Circle

```jsx
<div className="w-10 h-10 border-neon-indigo rounded-full flex items-center justify-center">
  <IconComponent className="h-5 w-5 text-indigo-600" />
</div>
```

---

## 📦 Container Layouts

### Main Container with Gradient Border

```jsx
<div className="container-gradient-border animate-scale-in">
  <div className="container-gradient-border-inner p-8">
    <h2 className="gradient-text-vibrant text-3xl font-bold mb-4">
      Container Title
    </h2>
    <p className="text-gray-700">
      Content with animated gradient border wrapper
    </p>
  </div>
</div>
```

### Glass Container with Hover Effect

```jsx
<div className="glass rounded-2xl p-8 border-4 border-indigo-300 
                hover:border-indigo-400 card-hover shadow-xl 
                hover:shadow-rainbow-glow transition-all">
  Glass morphism container with gradient border
</div>
```

---

## 🎪 Special Effects

### Loading Spinner (Enhanced)

```jsx
<div className="relative">
  <div className="animate-spin rounded-full h-10 w-10 border-3 
                  border-transparent border-t-indigo-600 
                  border-r-purple-600 border-b-pink-600 shadow-purple-glow">
  </div>
</div>
```

### Pulsing Indicator Dot

```jsx
<div className="flex items-center gap-2">
  <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 
                  rounded-full animate-pulse">
  </div>
  <span className="text-sm text-gray-600">Status: Active</span>
</div>
```

### Animated Badge

```jsx
<span className="inline-flex items-center gap-2 px-4 py-2 
                 bg-gradient-to-r from-indigo-100 to-purple-100 
                 border-2 border-indigo-300 rounded-full text-sm font-bold 
                 text-indigo-700 animate-pulse-soft">
  New Feature
</span>
```

---

## 🎨 Color Combinations

### Indigo Theme

- Border: `border-indigo-300` to `border-indigo-400` (hover)
- Background: `from-indigo-50 to-purple-50`
- Shadow: `shadow-indigo-glow`
- Text: `text-indigo-600` to `text-indigo-700`

### Purple Theme

- Border: `border-purple-300` to `border-purple-400` (hover)
- Background: `from-purple-50 to-pink-50`
- Shadow: `shadow-purple-glow`
- Text: `text-purple-600` to `text-purple-700`

### Pink Theme

- Border: `border-pink-300` to `border-pink-400` (hover)
- Background: `from-pink-50 to-rose-50`
- Shadow: `shadow-pink-glow`
- Text: `text-pink-600` to `text-pink-700`

---

## 🔄 Animation Classes

### Available Animations

- `animate-fade-in-up` - Fade in from bottom
- `animate-scale-in` - Scale up from 90% to 100%
- `animate-pulse-soft` - Gentle opacity pulse
- `animate-float` - Floating up and down
- `animate-border-glow` - Pulsing border glow
- `animate-shimmer` - Shimmer effect
- `animate-gradient` - Gradient position shift

### Usage with Delay

```jsx
<div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
  Delayed animation
</div>
```

---

## 🎯 Best Practices

### 1. Consistent Color Scheme

Use the indigo → purple → pink gradient throughout for consistency:

```jsx
gradient: linear-gradient(135deg, #667eea, #764ba2, #ec4899)
```

### 2. Border Thickness

- Standard cards: `border-2` or `border-3`
- Featured elements: `border-4` or `border-5`
- Subtle dividers: `border` or `border-2`

### 3. Shadow Layering

Combine shadows for depth:

```jsx
className="shadow-lg hover:shadow-xl hover:shadow-rainbow-glow"
```

### 4. Hover States

Always add transitions for smooth interactions:

```jsx
className="transition-all duration-300 hover:scale-105"
```

### 5. Responsive Design

Use responsive classes for mobile:

```jsx
className="border-2 sm:border-3 lg:border-4"
```

---

## 🚀 Complete Component Examples

### Feature Card

```jsx
<div className="glass rounded-2xl p-8 border-4 border-transparent 
                card-hover shadow-indigo-glow animate-fade-in-up"
     style={{ 
       backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #667eea, #764ba2, #ec4899)',
       backgroundOrigin: 'padding-box, border-box',
       backgroundClip: 'padding-box, border-box',
       animationDelay: '0.1s'
     }}>
  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 
                  rounded-2xl flex items-center justify-center shadow-purple-glow 
                  border-2 border-white/50 mb-6">
    <IconComponent className="h-8 w-8 text-white" />
  </div>
  <h3 className="text-2xl font-bold mb-3 gradient-text">Feature Title</h3>
  <p className="text-gray-600 leading-relaxed">
    Feature description with beautiful styling
  </p>
</div>
```

### Call-to-Action Section

```jsx
<div className="glass rounded-3xl p-12 text-center border-4 border-white/40 
                hover:border-purple-200 shadow-xl hover:shadow-rainbow-glow 
                transition-all animate-scale-in">
  <h2 className="text-4xl font-bold mb-4">
    <span className="gradient-text-vibrant">Ready to Get Started?</span>
  </h2>
  <p className="text-gray-600 mb-8">
    Join thousands of users who trust our service
  </p>
  <button className="px-8 py-4 btn-gradient text-white rounded-xl font-bold 
                     ripple shadow-lg border-2 border-white/20 
                     hover:shadow-rainbow-glow">
    Get Started Now
  </button>
</div>
```

### Stats Grid

```jsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {stats.map((stat, index) => (
    <div key={index}
         className="glass rounded-2xl p-6 border-4 border-transparent 
                    card-hover shadow-indigo-glow animate-scale-in"
         style={{ 
           backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #667eea, #764ba2, #ec4899)',
           backgroundOrigin: 'padding-box, border-box',
           backgroundClip: 'padding-box, border-box',
           animationDelay: `${index * 0.1}s`
         }}>
      <div className="text-4xl font-extrabold gradient-text mb-2">
        {stat.value}
      </div>
      <div className="text-sm font-semibold text-gray-600 uppercase">
        {stat.label}
      </div>
    </div>
  ))}
</div>
```

---

## 🎉 Tips for Maximum Impact

1. **Layer Effects**: Combine borders, shadows, and gradients for richness
2. **Use Animations Sparingly**: Add delays to stagger animations
3. **Maintain Consistency**: Use the same color palette throughout
4. **Test Responsively**: Ensure effects work on all screen sizes
5. **Optimize Performance**: Use CSS transforms for smooth animations

---

**Happy Styling! 🎨✨**
