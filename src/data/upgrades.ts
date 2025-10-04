export interface Upgrade {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  stackable?: boolean;
  costMultiplier?: number;
  defaultUnlocked?: boolean;
  effect: {
    requestsPerClick?: number;
    requestsPerSecond?: number;
    unlockMethod?: string;
    unlockPacketSize?: number;
    unlockDuration?: number;
    unlockDelay?: number;
    multiplier?: number;
    autoSave?: boolean;
    unlockProxies?: boolean;
    unlockUserAgents?: boolean;
    unlockStats?: boolean;
  };
}

export interface UpgradeCategory {
  id: string;
  name: string;
  icon: string;
  upgrades: Upgrade[];
}

export const upgradeCategories: UpgradeCategory[] = [
  {
    id: 'clicking',
    name: 'Clicking Power',
    icon: 'Zap',
    upgrades: [
      {
        id: 'better_click',
        name: 'Better Click',
        description: 'Increase requests per click to 2',
        baseCost: 50,
        effect: { requestsPerClick: 2 }
      },
      {
        id: 'power_click',
        name: 'Power Click',
        description: 'Increase requests per click to 5',
        baseCost: 500,
        effect: { requestsPerClick: 5 }
      },
      {
        id: 'mega_click',
        name: 'Mega Click',
        description: 'Increase requests per click to 10',
        baseCost: 5000,
        effect: { requestsPerClick: 10 }
      },
      {
        id: 'ultra_click',
        name: 'Ultra Click',
        description: 'Increase requests per click to 25',
        baseCost: 50000,
        effect: { requestsPerClick: 25 }
      },
      {
        id: 'god_click',
        name: 'God Click',
        description: 'Increase requests per click to 100',
        baseCost: 500000,
        effect: { requestsPerClick: 100 }
      }
    ]
  },
  {
    id: 'bots',
    name: 'Auto-Bots',
    icon: 'Bot',
    upgrades: [
      {
        id: 'basic_bot',
        name: 'Basic Bot',
        description: '+0.1 RPS per bot (1 req every 10s)',
        baseCost: 100,
        stackable: true,
        costMultiplier: 1.3,
        effect: { requestsPerSecond: 0.1 }
      },
      {
        id: 'advanced_bot',
        name: 'Advanced Bot',
        description: '+1 RPS per bot',
        baseCost: 2000,
        stackable: true,
        costMultiplier: 1.3,
        effect: { requestsPerSecond: 1 }
      },
      {
        id: 'server_bot',
        name: 'Server Bot',
        description: '+10 RPS per bot',
        baseCost: 30000,
        stackable: true,
        costMultiplier: 1.35,
        effect: { requestsPerSecond: 10 }
      },
      {
        id: 'cloud_instance',
        name: 'Cloud Instance',
        description: '+100 RPS per instance',
        baseCost: 500000,
        stackable: true,
        costMultiplier: 1.4,
        effect: { requestsPerSecond: 100 }
      },
      {
        id: 'botnet_node',
        name: 'Botnet Node',
        description: '+1,000 RPS per node',
        baseCost: 10000000,
        stackable: true,
        costMultiplier: 1.5,
        effect: { requestsPerSecond: 1000 }
      }
    ]
  },
  {
    id: 'attack_methods',
    name: 'Attack Methods',
    icon: 'Wifi',
    upgrades: [
      {
        id: 'http_flood',
        name: 'HTTP Flood',
        description: 'Basic HTTP Flood attack method',
        baseCost: 0,
        defaultUnlocked: true,
        effect: { unlockMethod: 'http_flood' }
      },
      {
        id: 'http_bypass',
        name: 'HTTP Bypass',
        description: 'Unlock HTTP Bypass attack (mimics real requests)',
        baseCost: 50000,
        effect: { unlockMethod: 'http_bypass' }
      },
      {
        id: 'tcp_flood',
        name: 'TCP Flood',
        description: 'Unlock TCP Flood attack',
        baseCost: 250000,
        effect: { unlockMethod: 'tcp_flood' }
      },
      {
        id: 'http_slowloris',
        name: 'HTTP Slowloris',
        description: 'Unlock Slowloris attack (keeps connections open)',
        baseCost: 500000,
        effect: { unlockMethod: 'http_slowloris' }
      },
      {
        id: 'minecraft_ping',
        name: 'Minecraft Ping',
        description: 'Unlock Minecraft Ping attack',
        baseCost: 1250000,
        effect: { unlockMethod: 'minecraft_ping' }
      }
    ]
  },
  {
    id: 'packet_size',
    name: 'Packet Size',
    icon: 'ScrollText',
    upgrades: [
      {
        id: 'packet_64kb',
        name: '64KB Packets',
        description: 'Basic 64kb packet size',
        baseCost: 0,
        defaultUnlocked: true,
        effect: { unlockPacketSize: 64 }
      },
      {
        id: 'packet_128kb',
        name: '128KB Packets',
        description: 'Unlock 128kb packet size',
        baseCost: 125000,
        effect: { unlockPacketSize: 128 }
      },
      {
        id: 'packet_256kb',
        name: '256KB Packets',
        description: 'Unlock 256kb packet size',
        baseCost: 500000,
        effect: { unlockPacketSize: 256 }
      },
      {
        id: 'packet_512kb',
        name: '512KB Packets',
        description: 'Unlock 512kb packet size',
        baseCost: 2500000,
        effect: { unlockPacketSize: 512 }
      },
      {
        id: 'packet_1mb',
        name: '1MB Packets',
        description: 'Unlock 1024kb packet size',
        baseCost: 10000000,
        effect: { unlockPacketSize: 1024 }
      }
    ]
  },
  {
    id: 'speed',
    name: 'Speed',
    icon: 'Zap',
    upgrades: [
      {
        id: 'delay_500ms',
        name: 'Default Delay',
        description: 'Packet delay: 500ms',
        baseCost: 0,
        defaultUnlocked: true,
        effect: { unlockDelay: 500 }
      },
      {
        id: 'reduced_delay_1',
        name: 'Reduced Delay 1',
        description: 'Packet delay: 250ms',
        baseCost: 50000,
        effect: { unlockDelay: 250 }
      },
      {
        id: 'reduced_delay_2',
        name: 'Reduced Delay 2',
        description: 'Packet delay: 100ms',
        baseCost: 250000,
        effect: { unlockDelay: 100 }
      },
      {
        id: 'reduced_delay_3',
        name: 'Reduced Delay 3',
        description: 'Packet delay: 50ms',
        baseCost: 1000000,
        effect: { unlockDelay: 50 }
      },
      {
        id: 'reduced_delay_4',
        name: 'Reduced Delay 4',
        description: 'Packet delay: 10ms',
        baseCost: 5000000,
        effect: { unlockDelay: 10 }
      },
      {
        id: 'minimal_delay',
        name: 'Minimal Delay',
        description: 'Packet delay: 1ms',
        baseCost: 25000000,
        effect: { unlockDelay: 1 }
      }
    ]
  },
  {
    id: 'duration',
    name: 'Duration',
    icon: 'Wand2',
    upgrades: [
      {
        id: 'duration_60s',
        name: 'Default Duration',
        description: 'Attack duration: 60 seconds',
        baseCost: 0,
        defaultUnlocked: true,
        effect: { unlockDuration: 60 }
      },
      {
        id: 'extended_duration_1',
        name: 'Extended Duration 1',
        description: 'Attack duration: 120 seconds',
        baseCost: 100000,
        effect: { unlockDuration: 120 }
      },
      {
        id: 'extended_duration_2',
        name: 'Extended Duration 2',
        description: 'Attack duration: 300 seconds',
        baseCost: 500000,
        effect: { unlockDuration: 300 }
      },
      {
        id: 'extended_duration_3',
        name: 'Extended Duration 3',
        description: 'Attack duration: 600 seconds',
        baseCost: 2500000,
        effect: { unlockDuration: 600 }
      },
      {
        id: 'marathon_mode',
        name: 'Marathon Mode',
        description: 'Unlimited attack duration',
        baseCost: 10000000,
        effect: { unlockDuration: 999999 }
      }
    ]
  },
  {
    id: 'multipliers',
    name: 'Multipliers',
    icon: 'Zap',
    upgrades: [
      {
        id: 'multiplier_2x',
        name: '2x Multiplier',
        description: 'All bots generate 2x requests',
        baseCost: 500000,
        effect: { multiplier: 2 }
      },
      {
        id: 'multiplier_5x',
        name: '5x Multiplier',
        description: 'All bots generate 5x requests',
        baseCost: 5000000,
        effect: { multiplier: 5 }
      },
      {
        id: 'multiplier_10x',
        name: '10x Multiplier',
        description: 'All bots generate 10x requests',
        baseCost: 50000000,
        effect: { multiplier: 10 }
      }
    ]
  },
  {
    id: 'utilities',
    name: 'Utilities',
    icon: 'Wand2',
    upgrades: [
      {
        id: 'auto_save',
        name: 'Auto-Save',
        description: 'Game saves automatically every 30 seconds',
        baseCost: 5000,
        effect: { autoSave: true }
      },
      {
        id: 'proxy_pool',
        name: 'Proxy Pool',
        description: 'Unlock proxy configuration',
        baseCost: 250000,
        effect: { unlockProxies: true }
      },
      {
        id: 'user_agent_pool',
        name: 'User Agent Pool',
        description: 'Unlock UA configuration',
        baseCost: 250000,
        effect: { unlockUserAgents: true }
      },
      {
        id: 'statistics_display',
        name: 'Statistics Display',
        description: 'Show detailed stats panel',
        baseCost: 50000,
        effect: { unlockStats: true }
      }
    ]
  }
];
