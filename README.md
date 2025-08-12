# 🎛️ GeniusAI Admin Dashboard

**Beautiful Next.js admin dashboard deployed on Cloudflare Workers**

## 🌐 Live Dashboard
**URL:** https://geniusai-v2-worker.dan-30f.workers.dev/admin
**Password:** `admin123`

---

## ✨ Features

### 🎯 **Core Functionality**
- **Real-time System Health** - Comprehensive monitoring with auto-refresh
- **Organizations Management** - Client overview with card/list views
- **User Management** - Role-based access control
- **AI Agents** - Agent monitoring and analytics
- **Task & Pipeline Management** - Workflow automation oversight
- **Analytics & Reports** - Usage trends and performance metrics
- **Install Flow** - Beautiful Slack app installation process

### 🎨 **UI/UX Excellence**
- **Modern Design** - Clean, professional interface
- **Dark Mode Support** - System preference detection
- **Responsive Layout** - Mobile and desktop optimized
- **Real-time Updates** - Live data with auto-refresh
- **Interactive Charts** - Beautiful data visualizations
- **Smooth Animations** - Polished user experience

---

## 🚀 Deployment

### **Quick Deploy**
```bash
# From project root
npm run dashboard:deploy
```
This command:
1. Builds the Next.js dashboard
2. Embeds assets into the worker
3. Deploys to Cloudflare

### **Step-by-Step**
```bash
# 1. Build dashboard
npm run dashboard:build

# 2. Embed into worker
npm run dashboard:embed

# 3. Deploy to Cloudflare
npm run worker:deploy
```

### **Local Development**
```bash
# Run dashboard locally (localhost:3001)
cd admin-dashboard
npm run dev
```

---

## 🔧 Technical Architecture

### **Static Export → Worker Embedding**
1. **Next.js Build** - Generates optimized static files
2. **Asset Embedding** - Converts files into worker-compatible format
3. **Edge Serving** - Served from Cloudflare's global network

### **Performance Benefits**
- ⚡ **Edge Caching** - Globally distributed assets
- 🚀 **Fast Loading** - Optimized bundle sizes
- 💰 **Cost Efficient** - No separate hosting needed
- 🔒 **Secure** - Same security as your API worker

### **File Structure**
```
admin-dashboard/
├── src/
│   ├── components/          # React components
│   │   ├── AgentsView.tsx
│   │   ├── HealthView.tsx
│   │   ├── InstallView.tsx  # ✨ Slack install flow
│   │   └── ...
│   ├── lib/
│   │   └── api.ts          # API client (points to worker)
│   └── types/
│       └── admin.ts        # TypeScript definitions
├── out/                    # Static build output
└── README.md              # This file
```

---

## 🎛️ Configuration

### **API Integration**
The dashboard automatically connects to your worker API:
```typescript
// src/lib/api.ts
const API_BASE_URL = 'https://geniusai-v2-worker.dan-30f.workers.dev/api'
```

### **Environment Variables**
```bash
# admin-dashboard/.env.local (optional)
NEXT_PUBLIC_API_BASE_URL=https://geniusai-v2-worker.dan-30f.workers.dev/api
NEXT_PUBLIC_ADMIN_PASSWORD=admin123
```

---

## 🎨 Customization

### **Branding**
- **Colors:** Edit `tailwind.config.js`
- **Logo:** Replace components in `DashboardLayout.tsx`
- **Typography:** Update font imports in `layout.tsx`

### **Adding New Views**
1. Create component in `src/components/`
2. Add to `DashboardLayout.tsx` navigation
3. Add route case in `renderActiveView()`
4. Rebuild and deploy

---

## 🔍 Debugging

### **Build Issues**
```bash
# Check build logs
cd admin-dashboard
npm run build

# Verify static export
ls -la out/
```

### **API Issues**
```bash
# Test API endpoints
curl -H "Authorization: Bearer admin123" \
  "https://geniusai-v2-worker.dan-30f.workers.dev/api/admin/overview"
```

### **Worker Issues**
```bash
# Check worker logs
npm run worker:logs

# Test worker deployment
curl https://geniusai-v2-worker.dan-30f.workers.dev/admin
```

---

## 📊 Dashboard Features

### **Install Flow** (`/admin#install`)
- ✅ **Slack OAuth** - Secure app installation
- ✅ **OpenAI Setup** - API key configuration
- ✅ **Progress Tracking** - Step-by-step guidance
- ✅ **Error Handling** - Clear error messages

### **Health Monitoring** (`/admin#health`)
- ✅ **System Status** - Real-time health scores
- ✅ **Service Status** - Individual component health
- ✅ **Performance Metrics** - Response times and success rates
- ✅ **Auto-refresh** - Live updates every 30 seconds

### **Organizations** (`/admin#organizations`)
- ✅ **Client Overview** - Organization management
- ✅ **Card/List Views** - Flexible display options
- ✅ **Search & Filter** - Find organizations quickly
- ✅ **Status Management** - Activate/suspend accounts

---

## 🚀 Next Steps

1. **Access Dashboard:** https://geniusai-v2-worker.dan-30f.workers.dev/admin
2. **Login:** Use password `admin123`
3. **Explore Features:** Navigate through all sections
4. **Test Install Flow:** Try the Slack installation process
5. **Monitor Health:** Check system status and metrics

**Your beautiful admin dashboard is now live and fully functional! 🎉** 