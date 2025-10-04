import { AlertTriangle } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { formatNumber } from '../utils/formatNumber';

export function PerformanceWarning() {
  const { isGamePaused, getRequestsPerSecond, resumeAfterWarning } = useGameStore();

  if (!isGamePaused) {
    return null;
  }

  const rps = getRequestsPerSecond();

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90">
      <div className="max-w-2xl p-8 border-4 rounded-lg border-red-500 bg-black/95">
        <div className="flex items-center gap-4 mb-6">
          <AlertTriangle className="w-16 h-16 text-red-500 animate-pulse" />
          <div>
            <h2 className="text-3xl font-bold text-red-500 neon-text-red">
              ⚠ PERFORMANCE WARNING ⚠
            </h2>
            <p className="text-xl text-red-400">High Request Rate Detected</p>
          </div>
        </div>

        <div className="p-6 mb-6 space-y-4 border-2 rounded border-red-500/50 bg-red-500/10">
          <p className="text-lg font-mono text-secondary">
            <span className="text-red-500">Current RPS:</span>{' '}
            <span className="font-bold text-primary">{formatNumber(rps)}</span> requests/second
          </p>

          <div className="space-y-2 text-sm text-gray-300">
            <p className="font-bold text-red-400">⚠ CRITICAL ALERT:</p>
            <p>
              Your current request rate ({formatNumber(rps)} RPS) is{' '}
              <span className="font-bold text-red-500">extremely high</span> and may cause:
            </p>
            <ul className="pl-6 space-y-1 list-disc text-gray-400">
              <li>Significant performance degradation on target systems</li>
              <li>Potential service outages or crashes</li>
              <li>Network congestion and bandwidth saturation</li>
              <li>Your browser may become unresponsive</li>
            </ul>
          </div>

          <div className="pt-4 mt-4 border-t-2 border-red-500/50">
            <p className="font-bold text-red-500">⚖ LEGAL NOTICE:</p>
            <p className="text-xs text-gray-400">
              This tool is for <span className="text-red-400">EDUCATIONAL PURPOSES ONLY</span>.
              Unauthorized stress testing of systems you do not own or have explicit permission
              to test is <span className="font-bold">ILLEGAL</span> and may result in criminal prosecution.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={resumeAfterWarning}
            className="flex-1 px-6 py-4 font-bold text-black transition-all bg-red-500 border-2 border-red-500 rounded hover:bg-red-600"
          >
            I UNDERSTAND - CONTINUE AT MY OWN RISK
          </button>
        </div>

        <p className="mt-4 text-xs text-center text-gray-500">
          This warning will only appear once per session.
        </p>
      </div>
    </div>
  );
}
