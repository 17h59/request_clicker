import { useGameStore } from '../store/gameStore';

export async function sendSingleRequest() {
  const state = useGameStore.getState();
  const { attackConfig, isDemoMode, attackStats, updateAttackStats, addConsoleLog } = state;

  // In demo mode, don't send real requests
  if (isDemoMode) {
    return { success: true, demo: true };
  }

  // Don't send if no target
  if (!attackConfig.target) {
    return { success: false, error: 'No target set' };
  }

  try {
    const response = await fetch('http://localhost:3000/api/attack/single', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        target: attackConfig.target,
        method: attackConfig.method,
        packetSize: attackConfig.packetSize
      }),
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });

    const data = await response.json();

    // Update stats based on success/failure
    if (data.success) {
      updateAttackStats({
        successfulRequests: attackStats.successfulRequests + 1
      });
      // Log detailed success with 5% probability to avoid spam
      if (Math.random() < 0.05) {
        addConsoleLog('success', `✅ ${data.message}`);
      }
    } else {
      updateAttackStats({
        failedRequests: attackStats.failedRequests + 1
      });
      // Log failures with 10% probability
      if (Math.random() < 0.1) {
        addConsoleLog('error', `❌ ${data.message || 'Request failed'}`);
      }
    }

    return { success: data.success, message: data.message };
  } catch (error: any) {
    // Update failed count
    updateAttackStats({
      failedRequests: attackStats.failedRequests + 1
    });
    // Log connection errors with 10% probability
    if (Math.random() < 0.1) {
      addConsoleLog('error', `❌ Connection error: ${error.message || 'Unknown error'}`);
    }
    return { success: false, error };
  }
}

// Batch send multiple requests (for bot generation)
export async function sendBatchRequests(count: number) {
  const state = useGameStore.getState();
  const { attackConfig, isDemoMode, attackStats, updateAttackStats, addConsoleLog } = state;

  // In demo mode, don't send real requests
  if (isDemoMode) {
    return { success: true, demo: true, count };
  }

  // Don't send if no target
  if (!attackConfig.target) {
    return { success: false, error: 'No target set' };
  }

  try {
    // Send batch request to backend
    const response = await fetch('http://localhost:3000/api/attack/batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        target: attackConfig.target,
        method: attackConfig.method,
        packetSize: attackConfig.packetSize,
        count: Math.min(count, 100) // Limit batch size to 100
      }),
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    const data = await response.json();

    // Update stats with batch results
    if (data.success) {
      updateAttackStats({
        successfulRequests: attackStats.successfulRequests + (data.successful || 0),
        failedRequests: attackStats.failedRequests + (data.failed || 0)
      });
      // Log batch results
      if (data.successful > 0) {
        addConsoleLog('success', `✅ Batch: ${data.successful} successful, ${data.failed || 0} failed`);
      }
    }

    return { success: data.success, successful: data.successful, failed: data.failed };
  } catch (error: any) {
    // Count all as failed if request fails
    updateAttackStats({
      failedRequests: attackStats.failedRequests + count
    });
    addConsoleLog('error', `❌ Batch request failed: ${error.message || 'Unknown error'}`);
    return { success: false, error, count };
  }
}
