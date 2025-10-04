import { useGameStore } from '../store/gameStore';
import { formatNumber } from '../utils/formatNumber';
import { sendSingleRequest } from '../utils/sendRequest';

export function Clicker() {
  const { handleClick, requestsPerClick, addConsoleLog, isAttacking, isGamePaused, isDemoMode } = useGameStore();

  const handleClickWithLog = async () => {
    if (!isAttacking || isGamePaused) return;

    handleClick();

    // Send multiple requests based on requestsPerClick power
    if (!isDemoMode) {
      // Send requestsPerClick number of requests
      for (let i = 0; i < requestsPerClick; i++) {
        sendSingleRequest().catch(() => {
          // Silently fail to avoid blocking the UI
        });
      }
    }

    if (Math.random() < 0.05) { // Log 5% of clicks to avoid spam
      addConsoleLog('info', `🖱 Manual click: +${formatNumber(requestsPerClick)} requests`);
    }
  };

  const isDisabled = !isAttacking || isGamePaused;

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <button
        onClick={handleClickWithLog}
        disabled={isDisabled}
        className={`relative w-64 h-64 text-2xl font-bold transition-all duration-150 border-4 rounded-lg ${
          isDisabled
            ? 'cursor-not-allowed bg-black/30 border-gray-700 text-gray-600'
            : 'cursor-pointer bg-black/60 border-primary hover:border-secondary hover:shadow-glow-lg active:scale-95'
        }`}
      >
        <span className={isDisabled ? '' : 'neon-text'}>
          {isDisabled ? 'ATTACK STOPPED' : 'SEND REQUEST'}
        </span>
      </button>
      <div className="text-lg text-secondary">
        <span className="text-gray-400">Requests/Click:</span>{' '}
        <span className={`font-bold ${isDisabled ? 'text-gray-600' : 'neon-text'}`}>
          {formatNumber(requestsPerClick)}
        </span>
      </div>
      {isDisabled && (
        <p className="text-sm text-gray-500">Press "START ATTACK" to enable clicking</p>
      )}
    </div>
  );
}
