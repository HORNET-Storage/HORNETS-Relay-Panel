![nostr Badge](https://img.shields.io/badge/nostr-8e30eb?style=flat) ![Go Badge](https://img.shields.io/badge/Go-00ADD8?logo=go&logoColor=white) ![React Badge](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black) ![TypeScript Badge](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white) <img src="https://static.wixstatic.com/media/e9326a_3823e7e6a7e14488954bb312d11636da~mv2.png" height="20">

# Dashboard Panel for H.O.R.N.E.T Storage Nostr Relay

This repository is home to the hornet storage panel which is a typescript / react web application designed for managing a hornet storage nostr multimedia relay which can be found here: https://github.com/HORNET-Storage/HORNETS-Nostr-Relay

## ⚡ What You Need Before Starting

**Before installing, ensure you have:**
1. **A Nostr browser extension** ([Alby](https://getalby.com/), [nos2x](https://github.com/fiatjaf/nos2x), etc.) - **REQUIRED**
2. **Node.js 16+** and **yarn** installed
3. **The HORNETS relay service** running (see [here](https://github.com/HORNET-Storage/HORNETS-Nostr-Relay))

**Without these, the panel will not function.**

### Live Demo
We have a live demo that can be found at http://hornetstorage.net for anyone that wants to see what the panel looks like.

## Key Features
- Manage your hornet-storage relay config directly from the panel
- Switch between our new whitelist and blacklist model for accepting nostr notes
- Decide from which of the supported nostr kinds to enable
- Choose which supported transport protocols to enable such as libp2p and websockets
- Enable / disable which media extensions are accepted by the relay such as png and mp4
- View statistics about stored notes and media
- Upload relay icons with integrated Blossom server support

## 🔑 Important Prerequisites

### NIP-07 Browser Extension Required
**The HORNETS Relay Panel requires a NIP-07 compatible Nostr browser extension to function.**

You must install one of these browser extensions before using the panel:
- **[Alby](https://getalby.com/)** - Bitcoin Lightning & Nostr browser extension
- **[nos2x](https://github.com/fiatjaf/nos2x)** - Simple Nostr browser extension
- **[Flamingo](https://flamingo.me/)** - Nostr browser extension
- **[Horse](https://github.com/freakonometrics/horse)** - Nostr browser extension

The panel uses **NIP-07** ([window.nostr capability](https://nostr-nips.com/nip-07)) for:
- User authentication and login
- Event signing for relay configuration
- File uploads with cryptographic verification

**📖 Learn more about NIP-07**: [https://nostr-nips.com/nip-07](https://nostr-nips.com/nip-07)

## 🚀 Quick Start

**Essential steps to get running:**

1. **Install a NIP-07 browser extension** (required - see above)
2. **Install dependencies**: `npm install -g serve` and `yarn install` 
3. **Start development**: `yarn start`
4. **For production**: `yarn build` then `serve -s build`

**For full deployment with reverse proxy, see the detailed setup guide below.**

## Previews
*All preview images are taken from the live demo*

![image](https://github.com/HORNET-Storage/hornet-storage-panel/assets/138120736/e842844c-9010-4541-b84a-0487580107b9)

![image](https://github.com/HORNET-Storage/hornet-storage-panel/assets/138120736/cd725852-be97-4851-b014-4de00aa445d1)

![image](https://github.com/HORNET-Storage/hornet-storage-panel/assets/138120736/ff763518-d399-408b-b0b4-487292ef57d6)

---

# 🏗️ Advanced Setup Guide

## Project Architecture

The HORNETS Relay Panel is built with a microservices architecture comprising:

### Integrated Architecture
The panel is now **integrated directly into the relay server** for simplified deployment:

- **Relay + Panel Server**: Port 9002 - Serves both the React app (static files) and panel API
- **[Relay WebSocket](https://github.com/HORNET-Storage/HORNETS-Nostr-Relay)**: Port 9001 - WebSocket service for Nostr relay functionality  
- **[Wallet Service](https://github.com/HORNET-Storage/Super-Neutrino-Wallet)**: Port 9003 - Backend service for wallet operations
- **[Media Moderation](https://github.com/HORNET-Storage/NestShield)**: Port 8000 - Content moderation and filtering service

### Hybrid Architecture
```
Client Request (http://localhost or your-domain.com)
     ↓
Nginx Proxy (Port 80/443) - Optional but recommended for production
     ↓
┌─────────────────────────────────────────────────────────┐
│  Route Distribution:                                    │
│  ┌─────────────────────────┐ ┌─────────────────────────┐ │
│  │ / → Relay + Panel       │ │ /wallet/ → Wallet API   │ │
│  │ (Port 9002)             │ │ (Port 9003)             │ │
│  │ ├── /api/* → Panel API  │ │                         │ │
│  │ └── /* → React App      │ │                         │ │
│  └─────────────────────────┘ └─────────────────────────┘ │
│                                                         │
│  WebSocket Connection:                                  │
│  ┌─────────────────────────┐                           │
│  │ ws:// → Relay WebSocket │                           │
│  │ (Port 9001)             │                           │
│  └─────────────────────────┘                           │
└─────────────────────────────────────────────────────────┘
```

## 🔧 Deployment Options

### Direct Access (Development)
For development, you can run services directly:
- **Relay + Panel**: `http://localhost:9002` (no proxy needed)
- **Wallet Service**: `http://localhost:9003` (direct API calls)

### Nginx Proxy (Production Recommended)
For production deployment, nginx handles:
1. **Wallet Service Proxying**: `/wallet/*` → `localhost:9003`
2. **SSL Termination**: Single certificate for entire application
3. **WebSocket Proxying**: Proper upgrade headers for relay WebSocket
4. **Static Asset Caching**: Optimal performance for React app
5. **Security Headers**: CORS, CSP, and other protections

## 📋 Prerequisites

### Required Software
- [Node.js](https://nodejs.org/en/) version **>=16.0.0**
- [Yarn](https://yarnpkg.com/) package manager
- [Git](https://git-scm.com/) for version control
- **[serve](https://www.npmjs.com/package/serve)** for production builds: `npm install -g serve`

### Optional (For Production)
- [Nginx](https://nginx.org/) for reverse proxy *(Linux server configuration)*
- SSL certificate (Let's Encrypt recommended)
- Domain name

### Browser Requirements
- **NIP-07 compatible browser extension** (see Important Prerequisites section above)

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/HORNET-Storage/HORNETS-Relay-Panel.git
cd HORNETS-Relay-Panel
```

### 2. Install Dependencies
```bash
yarn install
```

### 3. Environment Configuration

#### Development Setup
For development, create `.env.development` with your local service URLs:
```env
REACT_APP_BASE_URL=http://localhost:9002
REACT_APP_WALLET_BASE_URL=http://localhost:9003
REACT_APP_ASSETS_BUCKET=http://localhost
REACT_APP_DEMO_MODE=false
REACT_APP_BASENAME=

# Nostr relay configuration for profile fetching
REACT_APP_OWN_RELAY_URL=ws://localhost:9001
# REACT_APP_NOSTR_RELAY_URLS=wss://your-relay1.com,wss://your-relay2.com,wss://your-relay3.com

# More info https://create-react-app.dev/docs/advanced-configuration
ESLINT_NO_DEV_ERRORS=true
TSC_COMPILE_ON_ERROR=true
```

#### Production Setup
For production, minimal environment configuration is needed thanks to **dynamic URL detection**:

##### For Production Deployment  
Create `.env.production` for production builds:

```env
# Demo mode (set to false for production)
REACT_APP_DEMO_MODE=false

# Router configuration for /panel/ path
REACT_APP_BASENAME=/panel
PUBLIC_URL=/panel

# Optional: Custom Nostr relay URLs (comma-separated list)
# REACT_APP_NOSTR_RELAY_URLS=wss://your-relay1.com,wss://your-relay2.com

# Development optimizations
ESLINT_NO_DEV_ERRORS=true
TSC_COMPILE_ON_ERROR=true
```

##### For Development with Separate Services
If you're running services on different ports during development:

```env
# Development with separate services
REACT_APP_BASE_URL=http://localhost:9002
REACT_APP_WALLET_BASE_URL=http://localhost:9003
REACT_APP_OWN_RELAY_URL=ws://localhost:9001
REACT_APP_DEMO_MODE=false
```

**🎯 Key Improvement**: The panel now runs **integrated with the relay server**, meaning:
- ✅ **Single origin serving** - Panel and API from same host:port
- ✅ **No reverse proxy needed** - Go server handles both static files and API
- ✅ **Automatic URL detection** - Works on any domain without configuration
- ✅ **Simplified deployment** - Build once, deploy anywhere

### 4. Start Development Server

#### Using provided script (recommended - handles Node.js compatibility)
```bash
./start-app.sh        # Linux/macOS
start.bat             # Windows
```

#### Using yarn directly
```bash
yarn start
```

The development server will start on `http://localhost:3000`

## 🚀 Deployment

### Scenario 1: With Reverse Proxy (Recommended)

#### Step 1: Build the Application
```bash
# Production build
yarn build

# Using provided script (handles Node.js compatibility)
./build.bat           # Windows
yarn build            # Linux/macOS
```

#### Step 1.5: Test Production Build Locally (Optional)
Before deploying, you can test the production build locally:
```bash
# Install serve globally if not already installed
npm install -g serve

# Serve the production build
npx serve -s build
```
The production build will be available at `http://localhost:3000`

#### Step 2: Configure Nginx
Create an nginx configuration file:
```bash
# Create the configuration file
sudo nano /etc/nginx/sites-available/hornets-relay
```

Add this configuration (adjust domains and paths as needed):
```nginx
# WebSocket connection upgrade mapping
map $http_upgrade $connection_upgrade {
    default upgrade;
    '' close;
}

server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain

    # Forward client IP and protocol
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Host $host;

    # Wallet service proxying
    location /wallet/ {
        rewrite ^/wallet/(.*)$ /$1 break;
        proxy_pass http://127.0.0.1:9003;
    }

    # Media moderation service (optional)
    location /moderate/ {
        rewrite ^/moderate/(.*)$ /$1 break;
        proxy_pass http://127.0.0.1:8000;
    }

    # Panel access - Admin dashboard
    location /panel {
        return 301 /panel/;
    }
    
    location /panel/ {
        proxy_pass http://127.0.0.1:9002/;
        
        # Handle React Router (SPA routing)
        proxy_intercept_errors on;
        error_page 404 = @panel_fallback;
    }
    
    location @panel_fallback {
        proxy_pass http://127.0.0.1:9002/;
    }

    # Default location - Relay service with WebSocket support
    location / {
        proxy_pass http://127.0.0.1:9001;
        
        # WebSocket headers
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Extended timeouts for WebSocket connections
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
        proxy_connect_timeout 60s;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

Enable the configuration:
```bash
sudo ln -s /etc/nginx/sites-available/hornets-relay /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
```

#### Step 3: Serve Built Files
Copy the built files to your web server:
```bash
# Example for nginx
sudo cp -r build/* /var/www/html/front/
```

#### Step 4: Start Services
Ensure all backend services are running:
```bash
# Start in order of dependency
./relay-service &        # Port 9001
./panel-api &            # Port 9002  
./wallet-service &       # Port 9003
./media-moderation &     # Port 8000 (optional)
```

#### Step 5: Start Nginx
```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Scenario 2: Direct Access (Development/Testing)

#### Step 1: Build with Root Path
Update `.env.production`:
```env
REACT_APP_BASENAME=
PUBLIC_URL=
# Note: API URLs are now auto-detected, no need to specify them!
```

#### Step 2: Build and Serve
```bash
yarn build
# Serve the build folder (default port 3000)
serve -s build
```

#### Step 3: Configure CORS
Ensure your backend services accept requests from the frontend origin.

## 🌐 Tunneling & Remote Access

### Using ngrok
```bash
# Install ngrok
npm install -g ngrok

# With reverse proxy setup (random domain)
ngrok http 80

# With reverse proxy setup (custom domain - requires ngrok pro)
ngrok http --url=your-domain.ngrok.io 80

# Direct access to React app (without reverse proxy)
ngrok http 3000

# Example output:
# Forwarding https://abc123.ngrok.io -> http://localhost:80
```

### Environment Variables for Tunneling
**Great news!** Thanks to dynamic URL detection, **no environment variable changes are needed** when using tunnels. The panel automatically adapts to any domain:

- ✅ `ngrok http 80` → Panel works immediately at `https://abc123.ngrok.io/front/`
- ✅ Custom domain tunnel → Panel works immediately  
- ✅ Any hosting provider → Panel works immediately

**No rebuilds or environment changes required!**

## 🔧 Configuration Options

> **🚀 Major Improvement**: The panel now uses **dynamic URL detection** instead of hardcoded environment variables. This means **one build works everywhere** - no more environment-specific builds or complex URL configuration!

### REACT_APP_BASENAME
Controls where the React app is served from:
- `/front` - App accessible at `https://domain.com/front/`
- `/admin` - App accessible at `https://domain.com/admin/`
- `` (empty) - App accessible at `https://domain.com/`

### Service URLs
**🎯 Auto-Detection**: Service URLs are now automatically detected in production:
- **Panel API**: `${window.location.origin}/panel` (auto-detected)
- **Wallet Service**: `${window.location.origin}/wallet` (auto-detected)  
- **Relay WebSocket**: `wss://${window.location.host}` (auto-detected)

**Manual Override** (development only):
- **REACT_APP_BASE_URL**: Panel API endpoint (dev mode only)
- **REACT_APP_WALLET_BASE_URL**: Wallet service endpoint (dev mode only)
- **REACT_APP_NOSTR_RELAY_URLS**: Additional Nostr relays (optional)

### Demo Mode
Set `REACT_APP_DEMO_MODE=true` to enable demo functionality with mock data.

## 🐛 Troubleshooting

### Common Issues

#### 1. Node.js Compatibility
**Error**: `digital envelope routines::unsupported`
**Solution**: Scripts include `NODE_OPTIONS=--openssl-legacy-provider`

#### 2. Build Memory Issues
**Error**: `JavaScript heap out of memory`
**Solution**: Increase memory allocation:
```bash
export NODE_OPTIONS="--openssl-legacy-provider --max-old-space-size=4096"
```

#### 3. API Connection Issues
**Error**: Network errors or 404s
**Solution**: Verify service URLs in environment variables and ensure backend services are running.

#### 3.1. CORS Configuration Issues
**Error**: `Access to fetch at 'X' from origin 'Y' has been blocked by CORS policy`
**Solution**: Ensure your backend services are configured to accept requests from your frontend origin:

For development with direct access:
```env
# Frontend running on http://localhost:3000
# Backend services must allow this origin in their CORS configuration
REACT_APP_BASE_URL=http://localhost:9002
REACT_APP_WALLET_BASE_URL=http://localhost:9003
```

For production with reverse proxy (recommended):
```env
# All services behind same domain - no CORS issues
REACT_APP_BASE_URL=https://your-domain.com/panel
REACT_APP_WALLET_BASE_URL=https://your-domain.com/wallet
```

**Note**: When using direct port access, each backend service must be configured to allow your frontend's origin in their CORS settings. Using a reverse proxy eliminates CORS issues entirely.

#### 4. Routing Issues with Reverse Proxy
**Error**: 404 on refresh or direct URL access
**Solution**: Configure nginx to handle React Router:
```nginx
location /front/ {
    try_files $uri $uri/ /front/index.html;
}
```

#### 5. WebSocket Connection Failures
**Error**: WebSocket connection refused
**Solution**: Ensure proper WebSocket configuration in nginx:
```nginx
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection $connection_upgrade;
```

### Service Dependencies
Start services in this order:
1. Relay Service (Port 9001) - Core WebSocket functionality
2. Panel API (Port 9002) - Main backend
3. Wallet Service (Port 9003) - Payment processing
4. Media Moderation (Port 8000) - Content filtering (optional)
5. Frontend (Port 3000) - User interface

### Health Checks
- Nginx health: `curl http://localhost/health`
- Individual services: `curl http://localhost:PORT/health`

## 📚 Development vs Production

### Development
- Hot reloading enabled
- Source maps included
- Verbose error messages
- Direct API calls to localhost ports

### Production
- Optimized builds with minification
- Source maps excluded
- Error boundaries for user-friendly errors
- Proxied API calls through reverse proxy

## 🔒 Security Considerations

### Production Security
- Use HTTPS in production
- Configure proper CORS policies
- Implement rate limiting
- Regular security headers via nginx
- Keep dependencies updated

### Environment Variables
- Never commit `.env.production` to version control
- Use secure random values for secrets
- Regularly rotate API keys and tokens

---

## Developer Information

### Basic Development Commands

Development mode
```
yarn install && yarn start
```

Production mode
```
yarn install && yarn build
```

*.bat and .sh files are included for starting the panel in dev mode and for creating a production build if needed*

#### Requirements
- [Node.js](https://nodejs.org/en/) version _>=16.0.0_
- [yarn](https://yarnpkg.com/)
- [git](https://git-scm.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- 🐜 This panel relies heavily on the [Ant Design](https://ant.design/) component library with some modifications
- Based on the [Lightence](https://github.com/altence/lightence-ant-design-react-template) template
- Part of the HORNETS Storage ecosystem

### Credit
This panel was created using the lightence template which can be found [here](https://github.com/altence/lightence-ant-design-react-template)

## 📞 Support

For issues and support:
- GitHub Issues: Report bugs and request features
- Community: Join our discussions
- Documentation: Check the wiki for detailed guides

---

**Note**: This panel is designed to work with the HORNETS Storage ecosystem:
- **[HORNETS Nostr Relay](https://github.com/HORNET-Storage/HORNETS-Nostr-Relay)** - Core relay service (required)
- **[Super Neutrino Wallet](https://github.com/HORNET-Storage/Super-Neutrino-Wallet)** - Payment processing (required for paid features)
- **[NestShield](https://github.com/HORNET-Storage/NestShield)** - Media moderation service (optional)

Ensure you have at minimum the relay service running for basic functionality.