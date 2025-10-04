import { useGameStore } from '../store/gameStore';
import { formatNumber } from '../utils/formatNumber';

export function TargetHealth() {
  const { isAttacking, attackStats, attackConfig } = useGameStore();

  if (!isAttacking) {
    return null;
  }

  const totalRequests = attackStats.successfulRequests + attackStats.failedRequests;
  const successRate = totalRequests > 0
    ? Math.round((attackStats.successfulRequests / totalRequests) * 100)
    : 0;

  return (
    <div className="p-6 border-2 rounded-lg bg-black/60 border-primary/30">
      <h2 className="mb-4 text-xl font-bold text-red-500 neon-text-red">
        ATTACK IN PROGRESS
      </h2>

      <div className="mb-4 space-y-2 font-mono">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Target:</span>
          <span className="text-secondary">{attackConfig.target}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Method:</span>
          <span className="text-secondary">{attackConfig.method}</span>
        </div>
      </div>

      <div className="space-y-3">
        {/* Success Rate Bar */}
        <div>
          <div className="flex justify-between mb-1 text-sm">
            <span className="text-gray-400">Success Rate</span>
            <span className="font-bold text-primary">{successRate}%</span>
          </div>
          <div className="h-6 overflow-hidden border-2 rounded border-primary/50 bg-black/60">
            <div
              className="h-full transition-all duration-300 bg-gradient-to-r from-primary/60 to-primary"
              style={{ width: `${successRate}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 pt-3 border-t-2 border-primary/30">
          <div>
            <div className="text-xs text-gray-400">Successful</div>
            <div className="text-lg font-bold text-primary">
              {formatNumber(attackStats.successfulRequests)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Failed</div>
            <div className="text-lg font-bold text-red-500">
              {formatNumber(attackStats.failedRequests)}
            </div>
          </div>
          <div className="col-span-2">
            <div className="text-xs text-gray-400">Current RPS</div>
            <div className="text-lg font-bold text-secondary">
              {formatNumber(attackStats.requestsPerSecond)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
