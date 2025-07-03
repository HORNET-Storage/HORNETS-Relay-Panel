![nostr Badge](https://img.shields.io/badge/nostr-8e30eb?style=flat) ![Go Badge](https://img.shields.io/badge/Go-00ADD8?logo=go&logoColor=white) ![React Badge](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black) ![TypeScript Badge](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white) <img src="https://static.wixstatic.com/media/e9326a_3823e7e6a7e14488954bb312d11636da~mv2.png" height="20">

# Dashboard Panel for H.O.R.N.E.T Storage Nostr Relay

This repository is home to the hornet storage panel which is a typescript / react web application designed for managing a hornet storage nostr multimedia relay which can be found here: https://github.com/HORNET-Storage/HORNETS-Nostr-Relay

### Live Demo
We have a live demo that can be found at http://hornetstorage.net for anyone that wants to see what the panel looks like.

## Key Features
- Manage your hornet-storage relay config directly from the panel
- Switch between our new whitelist and blacklist model for accepting nostr notes
- Decide from which of the supported nostr kinds to enable
- Choose which supported transport protocols to enable such as libp2p and websockets
- Enable / disable which media extensions are accepted by the relay such as png and mp4
- View statistics about stored notes and media

## Previews
*All preview images are taken from the live demo*

![image](https://github.com/HORNET-Storage/hornet-storage-panel/assets/138120736/e842844c-9010-4541-b84a-0487580107b9)

![image](https://github.com/HORNET-Storage/hornet-storage-panel/assets/138120736/cd725852-be97-4851-b014-4de00aa445d1)

![image](https://github.com/HORNET-Storage/hornet-storage-panel/assets/138120736/ff763518-d399-408b-b0b4-487292ef57d6)

---

# 🏗️ Advanced Setup Guide

## Project Architecture

The HORNETS Relay Panel is built with a microservices architecture comprising:

### Services
- **Frontend (React App)**: Port 3000 (dev) - The admin dashboard interface
- **Panel API**: Port 9002 - Backend service for panel operations
- **Relay Service**: Port 9001 - WebSocket service for Nostr relay functionality
- **Wallet Service**: Port 9003 - Backend service for wallet operations
- **Transcribe API**: Port 8000 - Service for transcription features

### Reverse Proxy Architecture
```
Client Request
     ↓
Nginx (Port 80/443)
     ↓
┌─────────────────────────────────────────────────────────────┐
│  Route Distribution:                                        │
│  ┌─────────────────┐ ┌─────────────────┐ ┌──────────────┐   │
│  │  / → Relay      │ │ /front/ → React │ │ /panel/ → API│   │
│  │  (Port 9001)    │ │ (Port 3000)     │ │ (Port 9002)  │   │
│  └─────────────────┘ └─────────────────┘ └──────────────┘   │
│  ┌─────────────────┐ ┌─────────────────┐                    │
│  │ /wallet/ → Wallet│ │/transcribe/ → API│                   │
│  │ (Port 9003)     │ │ (Port 8000)     │                    │
│  └─────────────────┘ └─────────────────┘                    │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Why Use a Reverse Proxy?

### Benefits of Reverse Proxy Setup (Recommended)
1. **Security**: Single entry point with centralized security headers
2. **SSL/TLS Termination**: Handle HTTPS certificates at the proxy level
3. **Load Balancing**: Distribute traffic across service instances
4. **Clean URLs**: User-friendly paths (`/front/`, `/panel/`) instead of ports
5. **Single Domain**: All services accessible from one domain
6. **WebSocket Support**: Proper handling of WebSocket connections for the relay
7. **Tunnel Compatibility**: Works seamlessly with ngrok and other tunneling services

### Direct Access (Development Only)
While possible, direct port access has limitations:
- Multiple ports to manage
- CORS issues between services
- No unified SSL certificate
- Poor user experience with port numbers in URLs

## 📋 Prerequisites

### Required Software
- [Node.js](https://nodejs.org/en/) version **>=16.0.0**
- [Yarn](https://yarnpkg.com/) package manager
- [Git](https://git-scm.com/) for version control

### Optional (For Production)
- [Nginx](https://nginx.org/) for reverse proxy
- SSL certificate (Let's Encrypt recommended)
- Domain name

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
For development, you can use the default configuration or create `.env.development`:
```bash
# Optional - defaults work for local development
REACT_APP_BASE_URL=http://localhost:9002
REACT_APP_WALLET_BASE_URL=http://localhost:9003
REACT_APP_DEMO_MODE=false
```

#### Production Setup
Copy the example environment file and customize:
```bash
cp .env.production.example .env.production
```

Edit `.env.production` with your actual values:
```env
# Production Environment Configuration
REACT_APP_BASE_URL=https://your-domain.com/panel
REACT_APP_WALLET_BASE_URL=https://your-domain.com/wallet
REACT_APP_ASSETS_BUCKET=https://your-domain.com
REACT_APP_DEMO_MODE=false

# Router configuration for reverse proxy
REACT_APP_BASENAME=/front
PUBLIC_URL=/front

# Development optimizations
ESLINT_NO_DEV_ERRORS=true
TSC_COMPILE_ON_ERROR=true
```

### 4. Start Development Server

#### Using yarn (standard)
```bash
yarn start
```

#### Using provided script (handles Node.js compatibility)
```bash
./start-app.sh        # Linux/macOS
start.bat             # Windows
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

#### Step 2: Configure Nginx
Use the provided configuration as a starting point:
```bash
# Copy the configuration file
sudo cp hornet_services_updated.conf /etc/nginx/sites-available/hornets-relay
sudo ln -s /etc/nginx/sites-available/hornets-relay /etc/nginx/sites-enabled/
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
./relay-service &      # Port 9001
./panel-api &          # Port 9002  
./wallet-service &     # Port 9003
./transcribe-api &     # Port 8000
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
REACT_APP_BASE_URL=http://localhost:9002
REACT_APP_WALLET_BASE_URL=http://localhost:9003
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
When using tunnels, update your `.env.production`:
```env
REACT_APP_BASE_URL=https://your-tunnel-url.com/panel
REACT_APP_WALLET_BASE_URL=https://your-tunnel-url.com/wallet
```

## 🔧 Configuration Options

### REACT_APP_BASENAME
Controls where the React app is served from:
- `/front` - App accessible at `https://domain.com/front/`
- `/admin` - App accessible at `https://domain.com/admin/`
- `` (empty) - App accessible at `https://domain.com/`

### Service URLs
- **REACT_APP_BASE_URL**: Panel API endpoint
- **REACT_APP_WALLET_BASE_URL**: Wallet service endpoint
- **REACT_APP_ASSETS_BUCKET**: Static assets URL

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
4. Transcribe API (Port 8000) - Additional features
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

**Note**: This panel is designed to work with the [HORNETS Nostr Relay](https://github.com/HORNET-Storage/HORNETS-Nostr-Relay). Ensure you have the relay service running for full functionality.