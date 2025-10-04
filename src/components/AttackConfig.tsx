import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { io, Socket } from 'socket.io-client';

function isHostLocal(host: string) {
  return (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host.startsWith('::1') ||
    host.startsWith('192.168') ||
    host.startsWith('10.') ||
    host.startsWith('172.')
  );
}

function getSocketURL() {
  const host = window.location.host.split(':')[0];
  const isLocal = isHostLocal(host);
  const socketURL = isLocal ? `http://${host}:3000` : '/';
  return socketURL;
}

const attackMethodNames: Record<string, string> = {
  http_flood: 'HTTP Flood',
  http_bypass: 'HTTP Bypass',
  http_slowloris: 'HTTP Slowloris',
  tcp_flood: 'TCP Flood',
  minecraft_ping: 'Minecraft Ping'
};

type ConnectionStatus = 'connecting' | 'connected' | 'error' | 'idle';

export function AttackConfig() {
  const {
    attackConfig,
    setAttackConfig,
    unlockedMethods,
    unlockedPacketSizes,
    unlockedDurations,
    unlockedDelays,
    isAttacking,
    setAttacking,
    updateAttackStats,
    addConsoleLog,
    isDemoMode,
    toggleDemoMode
  } = useGameStore();

  const [socket, setSocket] = useState<Socket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const newSocket = io(getSocketURL());
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setConnectionStatus('connected');
      addConsoleLog('info', '✓ Backend server connected');
      console.log('[Backend] Connected to:', getSocketURL());
    });

    newSocket.on('disconnect', () => {
      setConnectionStatus('idle');
      addConsoleLog('warning', '⚠ Disconnected from backend server');
      console.log('[Backend] Disconnected');
    });

    newSocket.on('connect_error', (error) => {
      setConnectionStatus('error');
      addConsoleLog('error', `✗ Backend connection failed: ${error.message}`);
      console.error('[Backend] Connection error:', error);
      console.error('[Backend] Attempted URL:', getSocketURL());
      console.error('[Backend] Error details:', {
        message: error.message,
        description: error.description,
        context: error.context
      });
    });

    newSocket.on('stats', (data) => {
      // Backend sends stats with log messages and totalPackets
      if (data.log) {
        addConsoleLog('info', data.log);
      }

      if (data.totalPackets !== undefined) {
        updateAttackStats({
          successfulRequests: data.totalPackets || 0,
          failedRequests: 0,
          requestsPerSecond: 0
        });
      }
    });

    newSocket.on('attackEnd', () => {
      addConsoleLog('info', '⏸ Attack ended by backend');
      setAttacking(false);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const handleStartAttack = () => {
    if (!attackConfig.target && !isDemoMode) {
      setErrorMessage('Please enter a target URL');
      addConsoleLog('error', '✗ No target URL specified');
      return;
    }

    setErrorMessage('');

    // Demo mode
    if (isDemoMode) {
      setAttacking(true);
      addConsoleLog('info', `🎮 [DEMO MODE] Attack started`);
      addConsoleLog('info', `Target: ${attackConfig.target || 'demo-target.example.com'}`);
      return;
    }

    // Check backend connection for real mode
    if (!socket || connectionStatus !== 'connected') {
      setErrorMessage('Backend server not connected. Make sure the backend is running on port 3000.');
      addConsoleLog('error', '✗ Cannot start attack: Backend not connected');
      console.error('[Attack] Backend not connected. Status:', connectionStatus);
      console.error('[Attack] Socket:', socket);
      return;
    }

    // Enable the game - requests will be sent on-demand by clicks and bots
    setAttacking(true);
    addConsoleLog('info', `🎯 Attack enabled on ${attackConfig.target}`);
    addConsoleLog('info', `⚙ Method: ${attackMethodNames[attackConfig.method]}`);
    addConsoleLog('info', `📦 Packet Size: ${attackConfig.packetSize}kb`);
    addConsoleLog('success', '✓ Game started - Click to send requests, bots will auto-send');
    console.log('[Attack] Game enabled - on-demand request mode');
  };

  const handleStopAttack = () => {
    addConsoleLog('info', '⏸ Stopping attack...');

    // Simply disable the game - no requests will be sent
    setAttacking(false);
    addConsoleLog('success', '✓ Game stopped - No more requests will be sent');
    console.log('[Attack] Game stopped - on-demand request mode disabled');
  };

  const getStatusColor = () => {
    if (isAttacking) return 'border-primary shadow-glow';
    if (connectionStatus === 'error') return 'border-red-500';
    if (connectionStatus === 'connected') return 'border-primary/50';
    return 'border-gray-500';
  };

  const getStatusText = () => {
    if (isAttacking) return 'ATTACK ACTIVE';
    if (connectionStatus === 'connecting') return 'CONNECTING...';
    if (connectionStatus === 'error') return 'BACKEND NOT CONNECTED';
    if (connectionStatus === 'connected') return 'READY';
    return 'IDLE';
  };

  const getStatusIndicatorColor = () => {
    if (isAttacking) return 'bg-primary pulse-glow';
    if (connectionStatus === 'error') return 'bg-red-500';
    if (connectionStatus === 'connected') return 'bg-primary';
    if (connectionStatus === 'connecting') return 'bg-yellow-500 animate-pulse';
    return 'bg-gray-500';
  };

  const getStartButtonClass = () => {
    const baseClass = "flex-1 px-6 py-3 font-bold transition-all border-2 rounded";
    if (connectionStatus === 'connected' || isDemoMode) {
      return `${baseClass} border-primary text-primary hover:bg-primary/20 hover:shadow-glow`;
    }
    return `${baseClass} border-primary/30 text-primary/40 cursor-not-allowed`;
  };

  return (
    <div className={`p-6 border-2 rounded-lg bg-black/60 transition-all ${getStatusColor()}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-primary neon-text">ATTACK CONFIGURATION</h2>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getStatusIndicatorColor()}`}></div>
          <span className="text-sm text-secondary">{getStatusText()}</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Demo Mode Toggle */}
        <div className="p-3 border-2 rounded border-secondary/30 bg-secondary/5">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isDemoMode}
              onChange={toggleDemoMode}
              className="w-5 h-5 rounded cursor-pointer accent-secondary"
            />
            <div>
              <span className="text-sm font-bold text-secondary">Demo Mode</span>
              <p className="text-xs text-gray-400">
                Game runs normally but NO real requests are sent to targets
              </p>
            </div>
          </label>
        </div>

        {/* Target URL - Always editable */}
        <div>
          <label className="block mb-1 text-sm text-gray-400">Target URL</label>
          <input
            type="text"
            value={attackConfig.target}
            onChange={(e) => setAttackConfig({ target: e.target.value })}
            placeholder={isDemoMode ? "demo-target.example.com" : "http://example.com"}
            className="w-full px-4 py-2 font-mono bg-black border-2 rounded border-primary/50 text-secondary focus:border-primary focus:outline-none"
          />
          <p className="mt-1 text-xs text-gray-500">
            Can be changed at any time - changes apply to new requests
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Attack Method */}
          <div>
            <label className="block mb-1 text-sm text-gray-400">Method</label>
            <select
              value={attackConfig.method}
              onChange={(e) => setAttackConfig({ method: e.target.value })}
              className="w-full px-4 py-2 font-mono bg-black border-2 rounded border-primary/50 text-secondary focus:border-primary focus:outline-none"
            >
              {unlockedMethods.map((method) => (
                <option key={method} value={method}>
                  {attackMethodNames[method] || method}
                </option>
              ))}
            </select>
          </div>

          {/* Packet Size */}
          <div>
            <label className="block mb-1 text-sm text-gray-400">Packet Size</label>
            <select
              value={attackConfig.packetSize}
              onChange={(e) => setAttackConfig({ packetSize: parseInt(e.target.value) })}
              className="w-full px-4 py-2 font-mono bg-black border-2 rounded border-primary/50 text-secondary focus:border-primary focus:outline-none"
            >
              {unlockedPacketSizes.sort((a, b) => a - b).map((size) => (
                <option key={size} value={size}>
                  {size}kb
                </option>
              ))}
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block mb-1 text-sm text-gray-400">Duration</label>
            <select
              value={attackConfig.duration}
              onChange={(e) => setAttackConfig({ duration: parseInt(e.target.value) })}
              className="w-full px-4 py-2 font-mono bg-black border-2 rounded border-primary/50 text-secondary focus:border-primary focus:outline-none"
            >
              {unlockedDurations.sort((a, b) => a - b).map((duration) => (
                <option key={duration} value={duration}>
                  {duration >= 999999 ? 'Unlimited' : `${duration}s`}
                </option>
              ))}
            </select>
          </div>

          {/* Delay */}
          <div>
            <label className="block mb-1 text-sm text-gray-400">Packet Delay</label>
            <select
              value={attackConfig.delay}
              onChange={(e) => setAttackConfig({ delay: parseInt(e.target.value) })}
              className="w-full px-4 py-2 font-mono bg-black border-2 rounded border-primary/50 text-secondary focus:border-primary focus:outline-none"
            >
              {unlockedDelays.sort((a, b) => b - a).map((delay) => (
                <option key={delay} value={delay}>
                  {delay}ms
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          {!isAttacking ? (
            <button
              onClick={handleStartAttack}
              disabled={connectionStatus !== 'connected' && !isDemoMode}
              className={getStartButtonClass()}
            >
              {isDemoMode ? '🎮 START DEMO ATTACK' : '▶ START ATTACK'}
            </button>
          ) : (
            <button
              onClick={handleStopAttack}
              className="flex-1 px-6 py-3 font-bold text-red-500 transition-all border-2 border-red-500 rounded hover:bg-red-500/20"
            >
              ⏸ STOP ATTACK
            </button>
          )}
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="p-3 text-sm text-red-500 border-2 border-red-500 rounded bg-red-500/10">
            ✗ {errorMessage}
            {connectionStatus === 'error' && (
              <p className="mt-2 text-xs">
                Backend server may not be running. Run: <code className="font-bold">npm run dev:server</code>
              </p>
            )}
          </div>
        )}

        {/* Backend Connection Info */}
        {connectionStatus === 'error' && !isDemoMode && (
          <div className="p-3 text-xs border-2 rounded text-gray-400 border-gray-600 bg-gray-900/50">
            <p className="font-bold">Backend Connection Debug Info:</p>
            <p>• URL: {getSocketURL()}</p>
            <p>• Status: {connectionStatus}</p>
            <p>• Check browser console (F12) for detailed error logs</p>
          </div>
        )}
      </div>
    </div>
  );
}
