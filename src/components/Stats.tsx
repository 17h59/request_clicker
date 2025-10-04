import { useGameStore } from '../store/gameStore';
import { formatNumber } from '../utils/formatNumber';

export function Stats() {
  const { getRequestsPerSecond, ownedUpgrades, hasStats } = useGameStore();
  const rps = getRequestsPerSecond();

  const totalBots = Object.entries(ownedUpgrades).reduce((sum, [key, count]) => {
    if (key.includes('bot') || key.includes('instance') || key.includes('node')) {
      return sum + count;
    }
    return sum;
  }, 0);

  return (
    <div className="p-6 border-2 rounded-lg bg-black/60 border-primary/30">
      <h2 className="mb-4 text-xl font-bold text-primary neon-text">SYSTEM STATUS</h2>
      <div className="space-y-3 font-mono">
        <div className="flex justify-between">
          <span className="text-gray-400">RPS:</span>
          <span className="font-bold text-secondary">{formatNumber(rps)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Active Bots:</span>
          <span className="font-bold text-secondary">{totalBots}</span>
        </div>
        {hasStats && (
          <>
            <div className="flex justify-between">
              <span className="text-gray-400">Upgrades Owned:</span>
              <span className="font-bold text-secondary">
                {Object.keys(ownedUpgrades).length}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
