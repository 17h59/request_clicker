import { create } from 'zustand';

export interface ConsoleLog {
  id: number;
  timestamp: Date;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

export interface GameState {
  // Currency
  totalRequests: number;

  // Production
  requestsPerClick: number;
  baseRequestsPerSecond: number;
  currentMultiplier: number;

  // Owned upgrades (for stackable items)
  ownedUpgrades: Record<string, number>;

  // Unlocked features
  unlockedMethods: string[];
  unlockedPacketSizes: number[];
  unlockedDurations: number[];
  unlockedDelays: number[];

  // Utilities
  hasAutoSave: boolean;
  hasProxies: boolean;
  hasUserAgents: boolean;
  hasStats: boolean;

  // Demo/Passive mode
  isDemoMode: boolean;

  // Console
  consoleLogs: ConsoleLog[];
  isConsoleOpen: boolean;

  // Performance warning
  hasShownPerformanceWarning: boolean;
  isGamePaused: boolean;

  // Attack configuration
  attackConfig: {
    target: string;
    method: string;
    packetSize: number;
    duration: number;
    delay: number;
  };

  // Attack state
  isAttacking: boolean;
  attackStats: {
    successfulRequests: number;
    failedRequests: number;
    requestsPerSecond: number;
  };

  // Actions
  addRequests: (amount: number) => void;
  handleClick: () => void;
  purchaseUpgrade: (upgradeId: string, cost: number, effect: any, stackable?: boolean) => boolean;
  setAttackConfig: (config: Partial<GameState['attackConfig']>) => void;
  setAttacking: (attacking: boolean) => void;
  updateAttackStats: (stats: Partial<GameState['attackStats']>) => void;
  addConsoleLog: (type: ConsoleLog['type'], message: string) => void;
  toggleConsole: () => void;
  toggleDemoMode: () => void;
  showPerformanceWarning: () => void;
  resumeAfterWarning: () => void;
  resetGame: () => void;
  loadGame: (state: Partial<GameState>) => void;

  // Computed
  getRequestsPerSecond: () => number;
  getCostForStackable: (baseUpgrade: any) => number;
}

const initialState = {
  totalRequests: 0,
  requestsPerClick: 1,
  baseRequestsPerSecond: 0,
  currentMultiplier: 1,
  ownedUpgrades: {},
  unlockedMethods: ['http_flood'],
  unlockedPacketSizes: [64],
  unlockedDurations: [60],
  unlockedDelays: [500],
  hasAutoSave: false,
  hasProxies: false,
  hasUserAgents: false,
  hasStats: false,
  isDemoMode: false,
  consoleLogs: [],
  isConsoleOpen: true,
  hasShownPerformanceWarning: false,
  isGamePaused: false,
  attackConfig: {
    target: '',
    method: 'http_flood',
    packetSize: 64,
    duration: 60,
    delay: 500
  },
  isAttacking: false,
  attackStats: {
    successfulRequests: 0,
    failedRequests: 0,
    requestsPerSecond: 0
  }
};

export const useGameStore = create<GameState>((set, get) => ({
  ...initialState,

  addRequests: (amount: number) => {
    set((state) => ({
      totalRequests: state.totalRequests + amount
    }));
  },

  handleClick: () => {
    const { requestsPerClick, addRequests } = get();
    addRequests(requestsPerClick);
  },

  purchaseUpgrade: (upgradeId: string, cost: number, effect: any, stackable = false) => {
    const state = get();

    if (state.totalRequests < cost) {
      return false;
    }

    set((state) => {
      const newState: Partial<GameState> = {
        totalRequests: state.totalRequests - cost
      };

      // Handle stackable upgrades
      if (stackable) {
        newState.ownedUpgrades = {
          ...state.ownedUpgrades,
          [upgradeId]: (state.ownedUpgrades[upgradeId] || 0) + 1
        };
      } else {
        newState.ownedUpgrades = {
          ...state.ownedUpgrades,
          [upgradeId]: 1
        };
      }

      // Apply effects
      if (effect.requestsPerClick !== undefined) {
        newState.requestsPerClick = effect.requestsPerClick;
      }

      if (effect.requestsPerSecond !== undefined) {
        newState.baseRequestsPerSecond = state.baseRequestsPerSecond + effect.requestsPerSecond;
      }

      if (effect.unlockMethod !== undefined) {
        newState.unlockedMethods = [...state.unlockedMethods, effect.unlockMethod];
      }

      if (effect.unlockPacketSize !== undefined) {
        newState.unlockedPacketSizes = [...state.unlockedPacketSizes, effect.unlockPacketSize];
      }

      if (effect.unlockDuration !== undefined) {
        newState.unlockedDurations = [...state.unlockedDurations, effect.unlockDuration];
      }

      if (effect.unlockDelay !== undefined) {
        newState.unlockedDelays = [...state.unlockedDelays, effect.unlockDelay];
      }

      if (effect.multiplier !== undefined) {
        newState.currentMultiplier = effect.multiplier;
      }

      if (effect.autoSave !== undefined) {
        newState.hasAutoSave = effect.autoSave;
      }

      if (effect.unlockProxies !== undefined) {
        newState.hasProxies = effect.unlockProxies;
      }

      if (effect.unlockUserAgents !== undefined) {
        newState.hasUserAgents = effect.unlockUserAgents;
      }

      if (effect.unlockStats !== undefined) {
        newState.hasStats = effect.unlockStats;
      }

      return newState;
    });

    return true;
  },

  setAttackConfig: (config: Partial<GameState['attackConfig']>) => {
    set((state) => ({
      attackConfig: { ...state.attackConfig, ...config }
    }));
  },

  setAttacking: (attacking: boolean) => {
    set({ isAttacking: attacking });
    if (!attacking) {
      set({
        attackStats: {
          successfulRequests: 0,
          failedRequests: 0,
          requestsPerSecond: 0
        }
      });
    }
  },

  updateAttackStats: (stats: Partial<GameState['attackStats']>) => {
    set((state) => ({
      attackStats: { ...state.attackStats, ...stats }
    }));
  },

  addConsoleLog: (type: ConsoleLog['type'], message: string) => {
    set((state) => {
      const newLog: ConsoleLog = {
        id: Date.now(),
        timestamp: new Date(),
        type,
        message
      };

      // Keep only last 100 logs
      const newLogs = [...state.consoleLogs, newLog].slice(-100);

      return { consoleLogs: newLogs };
    });
  },

  toggleConsole: () => {
    set((state) => ({ isConsoleOpen: !state.isConsoleOpen }));
  },

  toggleDemoMode: () => {
    set((state) => ({ isDemoMode: !state.isDemoMode }));
  },

  showPerformanceWarning: () => {
    set({ isGamePaused: true, hasShownPerformanceWarning: true });
  },

  resumeAfterWarning: () => {
    set({ isGamePaused: false });
  },

  resetGame: () => {
    set(initialState);
    localStorage.removeItem('ddos-idle-save');
  },

  loadGame: (state: Partial<GameState>) => {
    set(state);
  },

  getRequestsPerSecond: () => {
    const { baseRequestsPerSecond, currentMultiplier } = get();
    return baseRequestsPerSecond * currentMultiplier;
  },

  getCostForStackable: (upgrade: any) => {
    const { ownedUpgrades } = get();
    const owned = ownedUpgrades[upgrade.id] || 0;
    return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier || 1.15, owned));
  }
}));
