# Lumina AI - Production-Ready Frontend

## Tech Stack

- **React 18** + Vite (blazing fast dev server)
- **Tailwind CSS** (dark theme, custom design system)
- **Framer Motion** (smooth animations everywhere)
- **Three.js + @react-three/fiber** (stunning 3D hero scene)
- **Chart.js** (sentiment & keyword analytics)
- **React Router v6** (seamless navigation)
- **Axios** (API client with interceptors)

## Prerequisites

- Node.js 20+ (critical for Three.js peer dependencies)
- Windows 11 / macOS / Linux

## Quick Start

```bash
cd frontend

# Install dependencies
npm install

# Create .env
cp .env.example .env

# Start dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

## Environment Setup

Create `.env`:
```
VITE_API_URL=http://localhost:8000
```

Make sure your backend is running:
```bash
cd lumina_backend
uvicorn main:app --reload --port 8000
```

## 3D Scene Troubleshooting

If you see a **black screen** at `/login`:

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for WebGL errors

**Common issues:**
- GPU acceleration disabled → enable in browser settings
- Old graphics card → fallback to CPU rendering (already configured)
- Three.js version mismatch → delete `node_modules` and `npm install`

**Test the 3D scene:**
- Go to `/login` page
- You should see an **animated rotating orb** with particles
- If orb isn't rotating, check console for errors

## Project Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── client.js              # Axios instance + auth interceptors
│   ├── components/
│   │   ├── three/                 # 3D components
│   │   │   ├── HeroScene.jsx      # Main 3D canvas
│   │   │   └── BrainMesh.jsx      # Rotating wireframe
│   │   ├── ui/                    # Reusable UI
│   │   │   ├── GlassCard.jsx      # Glassmorphism
│   │   │   ├── NeonButton.jsx     # Gradient button
│   │   │   ├── StatCard.jsx       # Animated stat
│   │   │   ├── LoadingPipeline.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── charts/                # Analytics charts
│   │   │   ├── SentimentChart.jsx
│   │   │   ├── KeywordsChart.jsx
│   │   │   └── WordTable.jsx
│   │   └── chat/
│   │       └── ChatBox.jsx        # Chat interface
│   ├── context/
│   │   └── AuthContext.jsx        # Auth state management
│   ├── hooks/
│   │   └── useAnalysis.js         # Analysis flow hook
│   ├── pages/
│   │   ├── Login.jsx              # Auth page with 3D hero
│   │   ├── Signup.jsx             # Registration page
│   │   ├── Dashboard.jsx          # Main analyze page
│   │   └── Result.jsx             # Results & analytics
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css                  # Tailwind + custom styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Design System

### Colors
- **Background**: `#0a0a0f` (deep space)
- **Primary**: `#6c63ff` (electric violet)
- **Accent**: `#00d4ff` (cyan)
- **Text**: `#f0f0ff` (off-white)

### Components
- **GlassCard**: Glassmorphism with backdrop blur
- **NeonButton**: Gradient with glow effect
- **StatCard**: Animated number counter
- **Charts**: Dark-themed Chart.js with custom colors

### Animations
All pages fade in on mount. Interactive elements have:
- Hover states (scale, glow)
- Tap states (squeeze effect)
- Staggered children animations

## Key Features

### 1. **Authentication Flow**
- Sign up with email/password
- Login with auto-token storage
- Protected routes with loading state
- Auto-logout on 401

### 2. **Dashboard**
- Paste YouTube URL
- See animated loading pipeline
- View past analyses in grid
- Click to load results

### 3. **Result Page**
- Embedded YouTube video
- AI-generated summary
- 4 stat cards (animated count-up)
- Sentiment arc chart
- Top keywords chart
- Word frequency table
- Chat interface with RAG

### 4. **3D Rendering**
- HeroScene: Full-screen 3D background on Login/Signup
- Particle field (2000 animated points)
- Central glowing orb with wireframe
- Three point lights for atmosphere
- BrainMesh: Small rotating wireframe decoration

## Performance Optimizations

- Vite for instant HMR (Hot Module Reload)
- Code splitting at route level
- Three.js Canvas with `frameloop="demand"`
- Image lazy loading
- CSS class utility caching (Tailwind)

## Building for Production

```bash
npm run build
```

Creates optimized bundle in `dist/` folder. Deploy to:
- Vercel (recommended, $0 cost)
- Netlify
- AWS Amplify
- Any static host

## API Integration

All API calls through `api/client.js`:
```javascript
// Automatically attaches auth token
await client.post('/api/analyze', { youtube_url: url })
await client.get('/api/history')
await client.post('/api/chat', { video_id, question })
```

## Styling Guide

### Adding New Components
Use Tailwind classes with custom colors:
```jsx
<div className="bg-bg-secondary border border-white/10 rounded-2xl p-6 glass glow-primary">
  {content}
</div>
```

### Custom Animations
Use Framer Motion:
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  whileHover={{ scale: 1.05 }}
  transition={{ duration: 0.5 }}
>
  {content}
</motion.div>
```

## Testing Checklist

- [ ] Login page loads with rotating 3D orb
- [ ] Can sign up with new email/password
- [ ] Can login with saved credentials
- [ ] Dashboard shows past analyses
- [ ] URL paste triggers animation
- [ ] Charts render correctly on result page
- [ ] Chat sends and receives messages
- [ ] Mobile responsive (tablet & phone)
- [ ] Dark theme throughout
- [ ] All buttons have hover effects

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android)

## Known Limitations

- 3D scene disabled on mobile (too heavy) — uses fallback gradient
- Chart.js tooltip styling must be customized per chart
- No offline support (requires backend)

## Debugging Tips

1. **Black screen on login?** 
   → Check DevTools Console for WebGL errors

2. **API calls failing?**
   → Verify backend is running on port 8000
   → Check VITE_API_URL in .env

3. **Slow page loads?**
   → Check Network tab for large assets
   → Verify Vite dev server is hot-reloading

4. **Mobile styling broken?**
   → Check responsive breakpoints in Tailwind
   → Use `hidden md:block` for desktop-only elements

## Next Steps

1. Deploy backend to cloud (Heroku, Railway, etc.)
2. Update VITE_API_URL to production backend
3. Deploy frontend to Vercel/Netlify
4. Add custom domain
5. Set up analytics (Vercel Analytics, Mixpanel)

---

**Built with ❤️ for portfolio impact**
