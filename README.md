# Request_Clicker 🖱️⚡ (Stress Testing Idle Game)

A unique idle/clicker game built on top of [MikuMikuBeam](https://github.com/sammwyy/MikuMikuBeam), where network stress testing meets incremental game mechanics. Progress through upgrades to unlock more powerful attack methods while sending **real HTTP requests** to your configured targets.

![Screenshot](docs/screenshot.png)

## 🎮 Concept

**Request_Clicker transforms network stress testing into a progression-based game:**
- Click to manually send HTTP requests
- Buy bots to automate request generation
- Unlock attack methods (HTTP Flood, HTTP Bypass, TCP Flood, etc.)
- Upgrade packet sizes, speeds, and multipliers
- Build a powerful stress testing infrastructure through gameplay

Every click and every bot sends **real requests** through proxies to your target. This is not a simulation - it's a functional stress tester gamified.

## ✨ Features

- 🎮 **Idle Game Mechanics**: Click to earn requests, buy upgrades, automate with bots
- ⚡ **Real Stress Testing**: Every request in-game is a real HTTP request via proxies
- 🛒 **Progressive Unlocks**: Start with basic clicks, unlock advanced attack methods
- 📊 **Live Statistics**: Real-time RPS, success/failure rates, active bots counter
- 🎨 **Hacker Aesthetic**: Terminal-style UI with Matrix green and cyber vibes
- 🔧 **Configurable Parameters**: Attack method, packet size, duration, delay
- 🖥️ **Console Logging**: Detailed logs showing each request with proxy info
- 🎭 **Demo Mode**: Play the game without sending real requests
- 💾 **Save/Load System**: Progress persists via localStorage
- 🐳 **Docker Ready**: Can be containerized for deployment

## 🏗️ Architecture

```
Frontend (React + Vite)          Backend (Node.js + Express)
http://localhost:5173            http://localhost:3000
        │                                 │
        ├─ Clicker Button                 ├─ POST /api/attack/single
        ├─ Upgrade Shop                   ├─ POST /api/attack/batch
        ├─ Stats Display                  ├─ Proxy rotation system
        ├─ Game Loop (bots)               ├─ User-Agent rotation
        └─ Console Logs                   └─ Request sending via workers
                │                                 │
                └─────────────────────────────────┘
                       API REST + Socket.io
                                │
                        ┌───────┴────────┐
                        │  Target Server │
                        │  (configured)  │
                        └────────────────┘
```

## 🚀 Setup & Installation

### Prerequisites

- **Node.js** v18 or higher
- **npm** (comes with Node.js)

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/request-clicker.git
   cd request-clicker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create required files:**
   ```bash
   mkdir -p data
   touch data/proxies.txt data/uas.txt
   ```

4. **Add proxies and user agents:**
   - `data/proxies.txt`: One proxy per line
     - Format: `protocol://host:port` or `protocol://user:pass@host:port`
     - Example: `socks4://127.0.0.1:1080`
   
   - `data/uas.txt`: One user agent per line
     - Example: `Mozilla/5.0 (Windows NT 10.0; Win64; x64)...`

5. **Start the game:**
   ```bash
   npm run dev
   ```

6. **Open in browser:**
   - Navigate to `http://localhost:5173`
   - Both frontend and backend start automatically

## 🎯 How to Play

### Starting the Game

1. **Set Target URL**: Enter the target URL in the Attack Configuration panel
2. **Press "START ATTACK"**: Enables the game (allows clicking and bot generation)
3. **Click "SEND REQUEST"**: Each click sends real HTTP requests
4. **Buy Upgrades**: Use earned requests to purchase upgrades in the shop

### Progression System

**Currency**: Total Requests Sent
- Earned by clicking manually
- Earned automatically by owned bots (idle generation)
- Used to purchase upgrades

**Upgrade Categories**:
- **Clicking Power**: Increase requests per click (1 → 2 → 5 → 10 → 25 → 100)
- **Auto-Bots**: Generate requests passively (0.1 RPS → 1 RPS → 10 RPS → 100 RPS → 1000 RPS)
- **Attack Methods**: Unlock HTTP Flood, HTTP Bypass, TCP Flood, HTTP Slowloris, Minecraft Ping
- **Packet Size**: Increase from 64kb → 128kb → 256kb → 512kb → 1MB
- **Speed**: Reduce delay between packets (500ms → 250ms → 100ms → 50ms → 10ms → 1ms)
- **Duration**: Extend attack duration (60s → 120s → 300s → 600s → Unlimited)
- **Multipliers**: Boost all bot production (2x → 5x → 10x)
- **Utilities**: Auto-save, proxy pools, statistics display

### Demo Mode

Located in Attack Configuration panel:
- **Enabled**: Game functions normally WITHOUT sending real requests (safe testing)
- **Disabled**: Every request is sent to the backend and target (real stress testing)

Recommended to start in Demo Mode to understand mechanics before real testing.

## 📊 Game Mechanics

### Request Sending System

**Manual Clicks**:
- Each click calls `/api/attack/single` for each `requestsPerClick`
- Example: With "Better Click" upgrade, 1 click = 2 real HTTP requests

**Automated Bots**:
- Bots generate requests per second (RPS) continuously
- Low RPS (< 10): Individual requests via `/api/attack/single`
- High RPS (≥ 10): Batched requests via `/api/attack/batch` (up to 50 per batch)

**Backend Processing**:
1. Receives request from frontend
2. Randomly selects proxy + user agent
3. Creates HTTP client with proxy
4. Sends HTTP request to target
5. Returns success/failure status
6. Frontend updates stats and logs

### Statistics Tracking

Real-time stats displayed in System Status panel:
- **RPS**: Requests Per Second (calculated from actual sent requests)
- **Active Bots**: Number of bot upgrades owned
- **Total Requests**: Cumulative requests sent (game currency)
- **Success Rate**: Shown in Attack Configuration when active

### Console Logging

Detailed logs with timestamps:
- `✅ Request successful from socks4://IP:PORT to https://target.com`
- `❌ Request failed: Connection timeout`
- `🖱 Manual click: +N requests`

Logs are sampled to prevent spam (5% success, 10% failures, 100% batches).

## ⚙️ Available Commands

```bash
# Development (frontend + backend together)
npm run dev

# Frontend only (Vite dev server)
npm run dev:client

# Backend only (Node.js API server)
npm run dev:server

# Production build
npm run build

# Production start
npm run start
```

## 🔧 Attack Methods

Unlockable through progression:

1. **HTTP Flood** (default): Random HTTP GET/POST requests
2. **HTTP Bypass** (10k requests): Mimics real browser behavior with cookies/headers
3. **TCP Flood** (50k requests): Raw TCP packet flooding
4. **HTTP Slowloris** (100k requests): Keeps connections open to exhaust server
5. **Minecraft Ping** (250k requests): Spams Minecraft server status requests

Each method uses the configured proxy pool and user agents for anonymity.

## 📁 Project Structure

```
request-clicker/
├── src/                          # Frontend source
│   ├── components/               # React components
│   │   ├── Clicker.tsx          # Main click button
│   │   ├── Stats.tsx            # Statistics display
│   │   ├── UpgradeShop.tsx      # Upgrade purchase interface
│   │   ├── AttackConfig.tsx     # Target & method configuration
│   │   └── Console.tsx          # Log display
│   ├── store/
│   │   └── gameStore.ts         # Zustand state management
│   ├── hooks/
│   │   └── useGameLoop.ts       # Main game loop (bot generation)
│   ├── utils/
│   │   └── sendRequest.ts       # API call functions
│   └── data/
│       └── upgrades.ts          # Upgrade definitions
├── server/                       # Backend source
│   ├── index.ts                 # Express server + Socket.io
│   ├── utils/
│   │   ├── singleRequestUtils.js   # Single/batch request logic
│   │   └── clientUtils.js          # HTTP client creation
│   └── workers/                 # Attack workers (legacy continuous mode)
├── data/
│   ├── proxies.txt              # Proxy list (REQUIRED)
│   └── uas.txt                  # User agent list (REQUIRED)
└── docs/                        # Screenshots and documentation
```

## 🐛 Troubleshooting

### Port Already in Use

**Windows:**
```bash
taskkill /F /IM node.exe
npm run dev
```

**Linux/Mac:**
```bash
killall node
npm run dev
```

### Backend Connection Failed

1. Verify backend is running on port 3000
2. Check browser console (F12) for errors
3. Ensure both servers started with `npm run dev`
4. Check `data/proxies.txt` and `data/uas.txt` exist

### Requests Failing

- Ensure `data/proxies.txt` contains valid, working proxies
- Format: `socks4://IP:PORT` or `http://IP:PORT`
- Test proxies individually before adding to list
- Some targets may block proxy traffic

### Missing Dependencies

```bash
npm install
npm run dev
```

## ⚠️ Legal & Ethical Disclaimer

**FOR EDUCATIONAL PURPOSES ONLY**

This tool is designed for:
- Learning about network protocols and stress testing
- Testing your own servers and applications
- Understanding idle game mechanics with real-world integration

**DO NOT use this tool to:**
- Attack systems you don't own or have permission to test
- Perform unauthorized stress tests
- Engage in any illegal activity

Unauthorized network attacks are **illegal** in most jurisdictions. Always obtain explicit written permission before stress testing any system. The authors are not responsible for misuse.

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs via Issues
- Suggest new upgrade types
- Improve game balance
- Add new attack methods
- Enhance UI/UX

## 📝 Technical Details

### Batching System

When RPS ≥ 10, requests are batched for performance:
- Accumulates fractional requests from bots
- Sends batches of 50 requests via `/api/attack/batch`
- Backend processes in parallel with `Promise.all()`
- Reduces API overhead while maintaining throughput

### State Management

Uses Zustand for global game state:
- `totalRequests`: Game currency
- `requestsPerClick`: Manual click power
- `requestsPerSecond`: Bot generation rate
- `ownedUpgrades`: Purchased items
- `unlockedFeatures`: Available attack methods/parameters
- `attackStats`: Success/failure counters, RPS calculation

### Performance Optimizations

- Request sampling for logs (prevents console spam)
- Batch processing for high RPS (>= 10 RPS)
- Proxy/User-Agent caching
- Configurable timeouts (5s single, 10s batch)
- Real-time RPS calculated once per second

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Based on [MikuMikuBeam](https://github.com/sammwyy/MikuMikuBeam) by sammwyy.

## 🎮 Credits

- **Original Concept**: MikuMikuBeam by sammwyy
- **Game Design**: Request_Clicker adaptation
- **Idle Game Inspiration**: Cookie Clicker, Universal Paperclips

---

**Happy Testing! 🚀**

*Remember: With great power comes no responsibility.*