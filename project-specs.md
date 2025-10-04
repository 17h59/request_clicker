# DDoS Idle Game - Complete Technical Specifications
## "Request Clicker" - Stress Testing Meets Idle Gaming

---

## 🎯 PROJECT OVERVIEW

This project combines the functionality of MikuMikuBeam (a network stress testing tool) with idle/incremental game mechanics. Players start by manually clicking to send requests, then progressively unlock features and automation to build a powerful stress testing infrastructure.

**Core Concept:** Transform MikuMikuBeam's features into unlockable upgrades in an idle game format, while maintaining full stress testing functionality.

**Game Duration:** Designed for 1 hour of gameplay to unlock all features and have sufficient resources for effective stress testing.

**Base Repository:** https://github.com/sammwyy/MikuMikuBeam

---

## 🏗️ ARCHITECTURE

### Technology Stack

**IMPORTANT: This project is built ON TOP OF MikuMikuBeam, not from scratch.**

- **Base:** MikuMikuBeam codebase (clone and modify)
- **Frontend:** React 18+ with Vite (already in Miku Beam)
- **Backend:** Node.js + Express (already in Miku Beam)
- **Workers:** Node.js worker threads (already in Miku Beam)
- **State Management:** React Context API or Zustand for game state
- **Persistence:** localStorage for save/load game progress
- **Styling:** Tailwind CSS or plain CSS (hacker aesthetic)

### Project Structure

```
ddos-idle-game/
├── frontend/                    # Modified from MikuMikuBeam
│   ├── src/
│   │   ├── components/
│   │   │   ├── Clicker.jsx           # Main click button
│   │   │   ├── Stats.jsx             # Display RPS, total requests, etc.
│   │   │   ├── UpgradeShop.jsx       # Shop for buying upgrades
│   │   │   ├── AttackConfig.jsx      # Configuration panel (unlocked features)
│   │   │   └── TargetHealth.jsx      # Visual feedback of target status
│   │   ├── context/
│   │   │   └── GameContext.jsx       # Global game state
│   │   ├── hooks/
│   │   │   └── useGameLoop.js        # Main game loop (auto-generation)
│   │   ├── data/
│   │   │   └── upgrades.js           # Upgrade definitions
│   │   └── App.jsx                   # Main app component
├── backend/                     # UNCHANGED from MikuMikuBeam
│   ├── server.js
│   ├── workers/
│   │   ├── httpFloodAttack.js
│   │   ├── httpBypassAttack.js
│   │   ├── httpSlowlorisAttack.js
│   │   ├── minecraftPingAttack.js
│   │   └── tcpFloodAttack.js
├── data/                        # Proxies and user agents
│   ├── proxies.txt
│   └── uas.txt
└── package.json
```

---

## 🎮 GAME MECHANICS

### Core Loop

1. **Click to send requests** → Earn "total requests sent" as currency
2. **Buy upgrades** with earned requests
3. **Unlock features** progressively (attack methods, parameters, automation)
4. **Automate** with bots and multipliers
5. **Configure and launch** full stress tests once features unlocked

### Currency System

**Primary Currency:** Total Requests Sent
- Earned by clicking (manual)
- Earned automatically by owned bots/upgrades (idle)
- Used to purchase upgrades
- Displayed prominently: "Total Requests: 1,234,567"

### Progression Phases

**Phase 1: Manual Hacker (0-5 minutes)**
- Only clicking available
- Each click sends 1 request
- Buy first basic upgrades

**Phase 2: Script Kiddie (5-20 minutes)**
- Unlock auto-clickers (bots)
- First attack method unlocked (HTTP Flood)
- Basic automation begins

**Phase 3: Infrastructure Builder (20-40 minutes)**
- Unlock more attack methods
- Increase packet size
- More bots and multipliers

**Phase 4: Botnet Operator (40-60 minutes)**
- All features unlocked
- Maximum automation
- Full stress testing capabilities

---

## 🛒 UPGRADE SYSTEM

### Upgrade Categories

All upgrades are purchased with "Total Requests" currency.

#### 1. **Clicking Power** (Increases manual click value)
- **Level 1:** Better Click (10 req) → 2 requests per click
- **Level 2:** Power Click (100 req) → 5 requests per click
- **Level 3:** Mega Click (1,000 req) → 10 requests per click
- **Level 4:** Ultra Click (10,000 req) → 25 requests per click
- **Level 5:** God Click (100,000 req) → 100 requests per click

#### 2. **Auto-Clickers / Bots** (Generates requests per second automatically)
- **Basic Bot** (50 req, stackable) → +1 RPS, can buy multiple
- **Advanced Bot** (500 req, stackable) → +10 RPS
- **Server Bot** (5,000 req, stackable) → +100 RPS
- **Cloud Instance** (50,000 req, stackable) → +1,000 RPS
- **Botnet Node** (500,000 req, stackable) → +10,000 RPS

#### 3. **Attack Methods** (Unlock new attack types from Miku Beam)
- **HTTP Flood** (1,000 req) → Unlocks HTTP Flood attack method
- **HTTP Bypass** (10,000 req) → Unlocks HTTP Bypass (better)
- **TCP Flood** (50,000 req) → Unlocks TCP Flood
- **HTTP Slowloris** (100,000 req) → Unlocks Slowloris
- **Minecraft Ping** (250,000 req) → Unlocks Minecraft Ping

#### 4. **Packet Size** (Increases packet size parameter)
- **64KB Packets** (5,000 req) → Unlock 64kb packet size
- **128KB Packets** (25,000 req) → Unlock 128kb
- **256KB Packets** (100,000 req) → Unlock 256kb
- **512KB Packets** (500,000 req) → Unlock 512kb
- **1MB Packets** (2,000,000 req) → Unlock 1024kb

#### 5. **Speed / Packet Delay** (Reduces delay between packets)
- **Reduced Delay 1** (10,000 req) → Packet delay 250ms (from 500ms)
- **Reduced Delay 2** (50,000 req) → Packet delay 100ms
- **Reduced Delay 3** (200,000 req) → Packet delay 50ms
- **Reduced Delay 4** (1,000,000 req) → Packet delay 10ms
- **Minimal Delay** (5,000,000 req) → Packet delay 1ms

#### 6. **Duration** (Increases attack duration)
- **Extended Duration 1** (20,000 req) → 120 seconds duration
- **Extended Duration 2** (100,000 req) → 300 seconds
- **Extended Duration 3** (500,000 req) → 600 seconds
- **Marathon Mode** (2,000,000 req) → Unlimited duration

#### 7. **Multipliers** (Multiply all production)
- **2x Multiplier** (100,000 req) → All bots generate 2x requests
- **5x Multiplier** (1,000,000 req) → All bots generate 5x requests
- **10x Multiplier** (10,000,000 req) → All bots generate 10x requests

#### 8. **Utilities** (Quality of life)
- **Auto-Save** (1,000 req) → Game saves automatically every 30 seconds
- **Proxy Pool** (50,000 req) → Unlock proxy configuration
- **User Agent Pool** (50,000 req) → Unlock UA configuration
- **Statistics Display** (10,000 req) → Show detailed stats panel

### Upgrade Balance

**Designed for ~1 hour total progression:**
- Early game (0-10 min): Rapid unlocks, cheap upgrades
- Mid game (10-30 min): Moderate pace, unlock key features
- Late game (30-60 min): Expensive upgrades, full automation

**Exponential scaling but accelerated:**
- First bot: 50 requests
- 10th bot: ~5,000 requests
- 50th bot: ~500,000 requests

---

## 🎨 USER INTERFACE

### Visual Theme: Hacker Aesthetic

**Color Palette:**
- Background: Deep black (#000000, #0a0a0a)
- Primary text: Matrix green (#00ff00, #39ff14)
- Secondary text: Cyan (#00ffff, #00d4ff)
- Accent: Neon red (#ff0040) for warnings/target health
- UI elements: Dark gray (#1a1a1a, #2a2a2a)

**Typography:**
- Headings: Bold monospace (JetBrains Mono, Fira Code, Courier New)
- Body: Monospace
- Numbers/Stats: Larger, glowing monospace

**Visual Effects:**
- Subtle scanlines (CRT monitor effect)
- Glow effects on important elements (neon glow)
- Matrix-style falling characters background (VERY subtle, slow, transparent)
- Terminal-style input fields
- ASCII art logo/branding
- Glitch effect on transitions (optional, subtle)

**Sound Effects (optional, toggleable):**
- Mechanical keyboard click sound on manual clicks
- Electronic "beep" on purchase
- Ambient cyberpunk/electronic music (looping, low volume)
- "Success" sound when attack completes

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  [LOGO/TITLE]              TOTAL REQUESTS: 123,456,789      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────┐  ┌────────────────────────────┐  │
│  │                      │  │                            │  │
│  │   MAIN CLICKER       │  │   UPGRADE SHOP             │  │
│  │                      │  │                            │  │
│  │   [HUGE BUTTON]      │  │  Categories:               │  │
│  │   "SEND REQUEST"     │  │  - Clicking Power          │  │
│  │                      │  │  - Bots                    │  │
│  │   Requests/Click: 10 │  │  - Attack Methods          │  │
│  │                      │  │  - Packet Size             │  │
│  └──────────────────────┘  │  - Speed                   │  │
│                            │  - Duration                │  │
│  ┌──────────────────────┐  │  - Multipliers             │  │
│  │                      │  │                            │  │
│  │   STATS PANEL        │  │  [Scrollable list of      │  │
│  │                      │  │   upgrades with prices    │  │
│  │  RPS: 1,234          │  │   and buy buttons]        │  │
│  │  Active Bots: 45     │  │                            │  │
│  │  Total Sent: 1.2M    │  │                            │  │
│  │                      │  │                            │  │
│  └──────────────────────┘  └────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  ATTACK CONFIGURATION (unlocked features only)       │  │
│  │                                                       │  │
│  │  Target: [____________]  Method: [HTTP Flood ▼]      │  │
│  │  Packet Size: [512kb ▼]  Duration: [60s ▼]           │  │
│  │  Delay: [100ms ▼]                                     │  │
│  │                                                       │  │
│  │  [START ATTACK]  [STOP ATTACK]                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  TARGET HEALTH / PROGRESS BAR                        │  │
│  │  ████████████░░░░░░░░ 60%                            │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  [Settings] [Save] [Load] [Reset]          v1.0.0          │
└─────────────────────────────────────────────────────────────┘
```

### Responsive Behavior
- Desktop: Side-by-side layout (clicker left, shop right)
- Tablet: Stacked layout
- Mobile: Vertical scroll, collapsible sections

---

## 🔧 TECHNICAL IMPLEMENTATION

### Step 1: Clone and Setup MikuMikuBeam

```bash
# Clone the repository
git clone https://github.com/sammwyy/MikuMikuBeam.git
cd MikuMikuBeam

# Install dependencies
npm install

# Create necessary files
mkdir -p data
touch data/proxies.txt data/uas.txt

# Test that it works
npm run dev
```

**Important:** Verify MikuMikuBeam works before modifying anything.

### Step 2: Backend (NO CHANGES NEEDED)

**The backend from MikuMikuBeam remains COMPLETELY UNCHANGED.**

The backend API endpoints are:
- `POST /api/attack/start` - Start an attack
- `POST /api/attack/stop` - Stop an attack
- `GET /api/attack/status` - Get attack status

Workers handle:
- HTTP Flood
- HTTP Bypass
- HTTP Slowloris
- Minecraft Ping
- TCP Flood

**Do not modify the backend or workers.** They already work perfectly.

### Step 3: Frontend Modifications

#### 3.1 Create Game State Management

**File: `src/context/GameContext.jsx`**

Create a React Context to manage:
- Total requests (currency)
- Requests per click
- Requests per second (from bots)
- Owned upgrades (bought items)
- Unlocked features (attack methods, parameters)
- Game settings

```javascript
// Example structure (not full implementation)
const initialState = {
  totalRequests: 0,
  requestsPerClick: 1,
  requestsPerSecond: 0,
  ownedUpgrades: {
    basicBots: 0,
    advancedBots: 0,
    // ... etc
  },
  unlockedFeatures: {
    attackMethods: ['http_flood'], // Start with one unlocked
    packetSizes: [64],
    durations: [60],
    delays: [500]
  }
};
```

#### 3.2 Create Game Loop Hook

**File: `src/hooks/useGameLoop.js`**

This hook runs the main game loop:
- Calculate RPS from owned bots/upgrades
- Add RPS to total requests every second
- Handle auto-save
- Update stats

```javascript
// Use setInterval or requestAnimationFrame
// Every 1 second (or faster): totalRequests += requestsPerSecond
```

#### 3.3 Create Components

**Main Components to Build:**

1. **Clicker Component** (`src/components/Clicker.jsx`)
   - Large clickable button
   - On click: `totalRequests += requestsPerClick`
   - Display current requests per click
   - Visual feedback on click (animation, glow)

2. **Stats Panel** (`src/components/Stats.jsx`)
   - Display: Total Requests, RPS, Active Bots, etc.
   - Real-time updates from game state
   - Format large numbers (1.2M instead of 1200000)

3. **Upgrade Shop** (`src/components/UpgradeShop.jsx`)
   - List all upgrades from `src/data/upgrades.js`
   - Show: Name, description, cost, owned count (for stackable)
   - Buy button (disabled if can't afford)
   - On purchase: deduct cost, apply effect, update state
   - Categories/tabs for organization

4. **Attack Configuration** (`src/components/AttackConfig.jsx`)
   - ONLY show unlocked features in dropdowns
   - Target URL input
   - Method dropdown (only unlocked methods)
   - Packet size dropdown (only unlocked sizes)
   - Duration dropdown (only unlocked durations)
   - Delay dropdown (only unlocked delays)
   - Start/Stop buttons
   - Connect to MikuMikuBeam backend API

5. **Target Health Display** (`src/components/TargetHealth.jsx`)
   - Visual progress bar
   - Shows attack progress when running
   - Optional: Simulated "health" that goes down during attack

#### 3.4 Define Upgrades Data

**File: `src/data/upgrades.js`**

```javascript
export const upgrades = {
  clicking: [
    {
      id: 'better_click',
      name: 'Better Click',
      description: 'Increase requests per click to 2',
      cost: 10,
      effect: { requestsPerClick: 2 }
    },
    // ... more clicking upgrades
  ],
  bots: [
    {
      id: 'basic_bot',
      name: 'Basic Bot',
      description: '+1 RPS',
      baseCost: 50,
      stackable: true,
      costMultiplier: 1.15, // Cost increases by 15% each purchase
      effect: { requestsPerSecond: 1 }
    },
    // ... more bot upgrades
  ],
  attackMethods: [
    {
      id: 'http_flood',
      name: 'HTTP Flood',
      description: 'Unlock HTTP Flood attack',
      cost: 1000,
      effect: { unlockMethod: 'http_flood' }
    },
    // ... more methods
  ],
  // ... other categories
};
```

#### 3.5 Styling

Replace Miku theme with hacker theme:
- Remove all pink/cute styling
- Apply black background, green/cyan text
- Add scanlines CSS
- Add glow effects with CSS box-shadow
- Use monospace fonts throughout

**CSS Effects:**
```css
/* Scanlines */
.scanlines::before {
  background: linear-gradient(
    transparent 50%, 
    rgba(0, 255, 0, 0.03) 50%
  );
  background-size: 100% 4px;
}

/* Neon glow */
.neon-text {
  text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00;
}

/* Terminal button */
.terminal-button {
  background: #0a0a0a;
  border: 2px solid #00ff00;
  color: #00ff00;
  font-family: 'Courier New', monospace;
}
```

### Step 4: Connect Frontend to Backend

When "Start Attack" is clicked:
1. Gather configuration from unlocked features
2. Send POST request to `/api/attack/start` with:
   ```json
   {
     "target": "http://example.com",
     "attackMethod": "http_flood",
     "packetSize": 512,
     "duration": 60,
     "packetDelay": 100
   }
   ```
3. Poll `/api/attack/status` for real-time stats during attack
4. Display stats from backend (packets/sec, total packets, active bots)

**Important:** The backend already handles everything. Just connect the frontend.

### Step 5: Persistence (Save/Load)

**Use localStorage:**

```javascript
// Save game
const saveGame = () => {
  localStorage.setItem('ddos-idle-save', JSON.stringify(gameState));
};

// Load game
const loadGame = () => {
  const saved = localStorage.getItem('ddos-idle-save');
  if (saved) {
    return JSON.parse(saved);
  }
  return null;
};

// Auto-save every 30 seconds (if unlocked)
useEffect(() => {
  if (hasAutoSave) {
    const interval = setInterval(saveGame, 30000);
    return () => clearInterval(interval);
  }
}, [hasAutoSave, gameState]);
```

Buttons:
- **Save:** Manually save to localStorage
- **Load:** Restore from localStorage
- **Reset:** Clear save and restart game

### Step 6: Testing

1. Test clicker works (increments currency)
2. Test upgrades purchase correctly
3. Test RPS calculation and auto-generation
4. Test that only unlocked features appear in config
5. Test attack actually starts and sends requests to backend
6. Test save/load functionality
7. Test full progression from start to finish (~1 hour)

---

## 📊 UPGRADE BALANCE & PROGRESSION

### Earning Rates

**Manual Clicking:**
- Start: 1 request/click
- After all clicking upgrades: 100 requests/click

**Idle Generation (Bots):**
- 1 Basic Bot: 1 RPS
- 10 Basic Bots: 10 RPS
- 1 Advanced Bot: 10 RPS
- Mix of bots + multipliers: Can reach 100,000+ RPS late game

### Progression Curve

**Target progression for 1 hour:**

| Time | Total Requests | Available Actions |
|------|----------------|-------------------|
| 5 min | ~500 | First bot, clicking upgrades |
| 10 min | ~5,000 | HTTP Flood unlocked, more bots |
| 20 min | ~50,000 | HTTP Bypass, packet size increases |
| 30 min | ~500,000 | TCP Flood, more automation |
| 40 min | ~5,000,000 | Slowloris, high packet sizes |
| 60 min | ~50,000,000+ | All features unlocked, full automation |

**Idle vs Active:**
- First 10 minutes: Mostly active clicking needed
- 10-30 minutes: Hybrid (click + idle)
- 30-60 minutes: Mostly idle, occasional purchases

---

## 🎯 FEATURE CHECKLIST

### Core Mechanics
- [ ] Click to send requests (manual generation)
- [ ] Requests currency system
- [ ] Upgrade shop with categories
- [ ] Purchase upgrades with currency
- [ ] Idle generation (RPS from bots)
- [ ] Game loop running at 1 second intervals

### Progression System
- [ ] 5 clicking power upgrades
- [ ] 5 types of bots (stackable)
- [ ] 5 attack method unlocks
- [ ] 5 packet size unlocks
- [ ] 5 speed/delay unlocks
- [ ] 4 duration unlocks
- [ ] 3 multiplier upgrades
- [ ] 4 utility upgrades

### Attack Functionality
- [ ] Target URL input
- [ ] Attack method dropdown (dynamic based on unlocks)
- [ ] Packet size dropdown (dynamic)
- [ ] Duration dropdown (dynamic)
- [ ] Delay dropdown (dynamic)
- [ ] Start attack button → connects to backend
- [ ] Stop attack button
- [ ] Real-time stats display during attack

### UI/UX
- [ ] Hacker aesthetic (black, green, cyan theme)
- [ ] Large clicker button with animation
- [ ] Stats panel (total requests, RPS, bots)
- [ ] Upgrade shop with buy buttons
- [ ] Only show unlocked options in config
- [ ] Responsive design (desktop/mobile)
- [ ] Visual feedback on clicks and purchases

### Persistence
- [ ] Save game to localStorage
- [ ] Load game from localStorage
- [ ] Reset game functionality
- [ ] Auto-save (if upgrade purchased)

### Polish
- [ ] Number formatting (1.2M instead of 1200000)
- [ ] Disable buttons when can't afford
- [ ] Visual indication of owned upgrades
- [ ] Sound effects (optional)
- [ ] Background music (optional)
- [ ] Settings menu (volume, theme options)

---

## 🚀 DEPLOYMENT

### Development
```bash
npm run dev
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
```

### Production Build
```bash
npm run build
npm run start
# Both on http://localhost:3000
```

### Requirements
- Node.js v14+ installed
- npm installed
- `data/proxies.txt` and `data/uas.txt` files created (can be empty)

---

## ⚠️ IMPORTANT NOTES

### Legal & Ethical
- Include disclaimer: "For educational purposes only"
- "Only test on systems you own or have permission to test"
- "Unauthorized access is illegal"
- Same MIT License as MikuMikuBeam

### Technical Constraints
- Do NOT modify backend code (use as-is from Miku Beam)
- Only modify frontend (src/ folder)
- Backend API endpoints remain the same
- Workers remain the same

### Design Philosophy
- **Simple over complex:** Keep mechanics straightforward
- **Fast progression:** Player should reach endgame in ~1 hour
- **Functional first:** Make it work, then make it pretty
- **Based on Miku Beam:** Don't reinvent the wheel, adapt what works

---

## 📚 RESOURCES

### Code References
- **MikuMikuBeam GitHub:** https://github.com/sammwyy/MikuMikuBeam
- Read the backend code to understand API structure
- Read worker files to understand attack methods

### Idle Game Mechanics
- Cookie Clicker for inspiration
- Universal Paperclips for progression phases
- Keep it simpler than both (faster paced)

### Styling
- Matrix color scheme
- Terminal/hacker aesthetic references
- CRT scanlines effect tutorials

---

## ✅ SUCCESS CRITERIA

The project is complete when:
1. ✅ Player can click to earn requests
2. ✅ Player can buy upgrades with requests
3. ✅ Bots generate requests automatically (idle)
4. ✅ All 5 attack methods can be unlocked
5. ✅ All parameters (packet size, duration, delay) can be unlocked and increased
6. ✅ Attack configuration only shows unlocked options
7. ✅ Starting an attack sends real requests via backend
8. ✅ Game can be saved and loaded
9. ✅ Full progression takes approximately 1 hour
10. ✅ UI has hacker aesthetic (not Miku theme)

---

## 🎉 FINAL NOTES

This project is designed to be **achievable in a single development session** by reusing the proven MikuMikuBeam backend and only modifying the frontend to add game mechanics.

**Key Strategy:**
- Start with MikuMikuBeam working
- Replace UI components one by one
- Add game state management
- Connect game progression to attack features
- Test and balance

**Estimated Development Time:** 4-8 hours for experienced developer

Good luck! This will be a unique and fun project. 🚀

---

**Document Version:** 1.0  
**Last Updated:** 2025-10-01  
**Based On:** MikuMikuBeam by sammwyy