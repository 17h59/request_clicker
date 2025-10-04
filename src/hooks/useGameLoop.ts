import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { sendSingleRequest, sendBatchRequests } from '../utils/sendRequest';

const PERFORMANCE_WARNING_THRESHOLD = 1000; // RPS threshold
const BATCH_THRESHOLD = 10; // Start batching when RPS >= 10
const BATCH_SIZE = 50; // Send requests in batches of 50

export function useGameLoop() {
  const {
    addRequests,
    getRequestsPerSecond,
    hasAutoSave,
    isDemoMode,
    isAttacking,
    updateAttackStats,
    isGamePaused,
    hasShownPerformanceWarning,
    showPerformanceWarning
  } = useGameStore();

  const lastTickRef = useRef<number>(Date.now());
  const lastRPSCheckRef = useRef<number>(0);
  const accumulatedRequestsRef = useRef<number>(0);
  const lastStatsUpdateRef = useRef<number>(Date.now());
  const lastRequestCountRef = useRef<number>(0);

  useEffect(() => {
    // Main game loop
    const interval = setInterval(() => {
      const state = useGameStore.getState();

      // Don't run game loop if paused or not attacking
      if (state.isGamePaused || !state.isAttacking) {
        return;
      }

      const now = Date.now();
      const deltaTime = (now - lastTickRef.current) / 1000; // Convert to seconds
      lastTickRef.current = now;

      const rps = state.getRequestsPerSecond();

      // Check for performance warning (only once)
      if (rps >= PERFORMANCE_WARNING_THRESHOLD && !state.hasShownPerformanceWarning) {
        showPerformanceWarning();
        return;
      }

      // Add requests based on RPS
      const requestsThisTick = rps * deltaTime;
      if (requestsThisTick > 0) {
        state.addRequests(requestsThisTick);

        // Send actual requests to backend (not in demo mode)
        if (!state.isDemoMode && state.attackConfig.target) {
          accumulatedRequestsRef.current += requestsThisTick;

          // Use batching for high RPS, individual requests for low RPS
          if (rps >= BATCH_THRESHOLD) {
            // Batch requests: send in chunks
            if (accumulatedRequestsRef.current >= BATCH_SIZE) {
              const batchCount = Math.floor(accumulatedRequestsRef.current);
              accumulatedRequestsRef.current -= batchCount;

              sendBatchRequests(batchCount).catch(() => {
                // Silently fail to avoid blocking the game loop
              });
            }
          } else {
            // Low RPS: send individual requests
            while (accumulatedRequestsRef.current >= 1) {
              accumulatedRequestsRef.current--;
              sendSingleRequest().catch(() => {
                // Silently fail to avoid blocking the game loop
              });
            }
          }
        }
      }

      // Demo mode: Simulate attack stats
      if (state.isDemoMode) {
        const fakeSuccessful = state.attackStats.successfulRequests + Math.floor(Math.random() * 50) + 10;
        const fakeFailed = state.attackStats.failedRequests + Math.floor(Math.random() * 5);
        const fakeRPS = Math.floor(Math.random() * 100) + 50;

        state.updateAttackStats({
          successfulRequests: fakeSuccessful,
          failedRequests: fakeFailed,
          requestsPerSecond: fakeRPS
        });
      }

      // Calculate actual RPS from successful + failed requests
      const nowStats = Date.now();
      const statsTimeDelta = (nowStats - lastStatsUpdateRef.current) / 1000;

      if (statsTimeDelta >= 1) { // Update RPS every second
        const currentTotalRequests = state.attackStats.successfulRequests + state.attackStats.failedRequests;
        const requestsDelta = currentTotalRequests - lastRequestCountRef.current;
        const actualRPS = requestsDelta / statsTimeDelta;

        state.updateAttackStats({
          requestsPerSecond: Math.round(actualRPS)
        });

        lastStatsUpdateRef.current = nowStats;
        lastRequestCountRef.current = currentTotalRequests;
      }

      // Log RPS changes for debugging
      if (Math.abs(rps - lastRPSCheckRef.current) > 10) {
        lastRPSCheckRef.current = rps;
      }
    }, 100); // Run at 10 FPS for smooth updates

    return () => clearInterval(interval);
  }, [isGamePaused, isAttacking, hasShownPerformanceWarning]);

  // Auto-save functionality
  useEffect(() => {
    if (hasAutoSave) {
      const saveInterval = setInterval(() => {
        saveGame();
      }, 30000); // Save every 30 seconds

      return () => clearInterval(saveInterval);
    }
  }, [hasAutoSave]);

  return null;
}

export function saveGame() {
  const state = useGameStore.getState();
  const saveData = {
    totalRequests: state.totalRequests,
    requestsPerClick: state.requestsPerClick,
    baseRequestsPerSecond: state.baseRequestsPerSecond,
    currentMultiplier: state.currentMultiplier,
    ownedUpgrades: state.ownedUpgrades,
    unlockedMethods: state.unlockedMethods,
    unlockedPacketSizes: state.unlockedPacketSizes,
    unlockedDurations: state.unlockedDurations,
    unlockedDelays: state.unlockedDelays,
    hasAutoSave: state.hasAutoSave,
    hasProxies: state.hasProxies,
    hasUserAgents: state.hasUserAgents,
    hasStats: state.hasStats,
    attackConfig: state.attackConfig,
    hasShownPerformanceWarning: state.hasShownPerformanceWarning
  };

  localStorage.setItem('ddos-idle-save', JSON.stringify(saveData));
}

export function loadGame() {
  const saved = localStorage.getItem('ddos-idle-save');
  if (saved) {
    try {
      const saveData = JSON.parse(saved);
      useGameStore.getState().loadGame(saveData);
      return true;
    } catch (e) {
      console.error('Failed to load save:', e);
      return false;
    }
  }
  return false;
}
