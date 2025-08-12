# 🚀 Admin Dashboard Commands - Run from Root Directory

You can now run your admin dashboard from the root directory (`/Users/lawless/Documents/GitHub/GeniusAI`) using these npm scripts:

## 🎯 Quick Start Commands

### Primary Commands
```bash
# Start the admin dashboard (development mode)
npm run dashboard

# Alternative command (same as above)
npm run admin
```

### Development Commands
```bash
# Start development server
npm run dashboard:dev

# Build for production
npm run dashboard:build

# Start production server (after build)
npm run dashboard:start

# Install dashboard dependencies
npm run dashboard:install
```

### Deployment Commands
```bash
# Build and export for static hosting
npm run dashboard:export

# Deploy to Vercel (requires Vercel CLI)
npm run dashboard:vercel

# Full deployment pipeline (build + embed + worker deploy)
npm run dashboard:deploy
```

### Maintenance Commands
```bash
# Run linter
npm run dashboard:lint
```

## 🌐 Access Your Dashboard

After running `npm run dashboard`, your admin dashboard will be available at:
**http://localhost:3001**

**Demo Login Credentials:**
- Password: `admin123`

## 🔧 How It Works

All these commands use the `cd admin-dashboard &&` prefix to:
1. Change directory to the admin-dashboard folder
2. Run the specified npm command in that context
3. Return to the root directory when done

## 📁 Project Structure
```
GeniusAI/                    ← Root directory (run commands from here)
├── admin-dashboard/         ← Next.js admin dashboard
│   ├── package.json        ← Dashboard-specific dependencies
│   ├── src/                ← Dashboard source code
│   └── ...
├── package.json            ← Root package.json with dashboard scripts
├── server.js               ← Main backend server
└── ...
```

## 🚫 No More Crashes!

The main server (`server.js`) won't interfere with your dashboard anymore. The dashboard runs independently on port 3001, while the main server (when configured) would run on port 3000.

## 🎨 What You Get

Your admin dashboard includes:
- **Professional Login Screen** with gradient design
- **8+ Dashboard Views** (Overview, Organizations, Users, Agents, etc.)
- **Interactive Components** (charts, tables, modals)
- **Responsive Design** for all devices
- **Mock Data** for realistic demo experience
- **Vercel-Ready** deployment configuration

---

**Quick Start:** Just run `npm run dashboard` and open http://localhost:3001! 🚀
