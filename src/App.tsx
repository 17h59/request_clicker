import { useEffect, useState } from 'react';
import { useGameStore } from './store/gameStore';
import { useGameLoop, saveGame, loadGame } from './hooks/useGameLoop';
import { Clicker } from './components/Clicker';
import { Stats } from './components/Stats';
import { UpgradeShop } from './components/UpgradeShop';
import { AttackConfig } from './components/AttackConfig';
import { Console } from './components/Console';
import { PerformanceWarning } from './components/PerformanceWarning';
import { formatNumber } from './utils/formatNumber';

function App() {
  const { totalRequests, resetGame, isDemoMode, toggleDemoMode, isAttacking, attackConfig } = useGameStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Load game on mount
  useEffect(() => {
    loadGame();
  }, []);

  // Initialize game loop
  useGameLoop();

  const handleSave = () => {
    saveGame();
    alert('Game saved!');
  };

  const handleLoad = () => {
    const success = loadGame();
    if (success) {
      alert('Game loaded!');
    } else {
      alert('No save found!');
    }
  };

  const handleReset = () => {
    if (showResetConfirm) {
      resetGame();
      setShowResetConfirm(false);
      alert('Game reset!');
    } else {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-black text-primary scanlines">
      {/* Header */}
      <header className="border-b-2 border-primary/30 bg-black/90">
        <div className="container flex items-center justify-between px-4 py-4 mx-auto">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold neon-text">REQUEST_CLICKER</h1>
            <div className="px-3 py-1 text-xs border-2 rounded border-primary/50 text-secondary">
              v1.0.0
            </div>
          </div>
          <div className="flex items-center space-x-6">
            {isAttacking && attackConfig.target && (
              <div className="px-4 py-2 border-2 rounded border-primary/50 bg-primary/10">
                <span className="text-xs text-gray-400">ATTACKING:</span>{' '}
                <span className="font-mono font-bold text-primary neon-text">{attackConfig.target}</span>
              </div>
            )}
            <div className="text-2xl font-bold">
              <span className="text-gray-400 text-sm">TOTAL REQUESTS:</span>{' '}
              <span className="neon-text">{formatNumber(totalRequests)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-6 mx-auto">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column */}
          <div className="space-y-6">
            <Clicker />
            <Stats />
          </div>

          {/* Middle Column */}
          <div className="space-y-6">
            <div className="h-[600px]">
              <UpgradeShop />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <AttackConfig />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-primary/30 bg-black/90">
        <div className="container flex items-center justify-between px-4 py-4 mx-auto">
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm border-2 rounded border-primary/50 text-primary hover:bg-primary/20 hover:border-primary transition-all"
            >
              SAVE
            </button>
            <button
              onClick={handleLoad}
              className="px-4 py-2 text-sm border-2 rounded border-primary/50 text-primary hover:bg-primary/20 hover:border-primary transition-all"
            >
              LOAD
            </button>
            <button
              onClick={handleReset}
              className={`px-4 py-2 text-sm border-2 rounded transition-all ${
                showResetConfirm
                  ? 'border-red-500 text-red-500 bg-red-500/20 pulse-glow'
                  : 'border-primary/50 text-primary hover:bg-primary/20 hover:border-primary'
              }`}
            >
              {showResetConfirm ? 'CONFIRM RESET?' : 'RESET'}
            </button>
          </div>

          <div className="text-xs text-gray-400">
            <span className="text-red-500">⚠</span> FOR EDUCATIONAL PURPOSES ONLY
          </div>
        </div>
      </footer>

      {/* Console Panel */}
      <Console />

      {/* Performance Warning Modal */}
      <PerformanceWarning />
    </div>
  );
}

export default App;
