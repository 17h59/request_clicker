import { useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, Terminal } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

export function Console() {
  const { consoleLogs, isConsoleOpen, toggleConsole } = useGameStore();
  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (isConsoleOpen && consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleLogs, isConsoleOpen]);

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <span className="text-primary">✓</span>;
      case 'error':
        return <span className="text-red-500">✗</span>;
      case 'warning':
        return <span className="text-yellow-500">⚠</span>;
      case 'info':
      default:
        return <span className="text-secondary">→</span>;
    }
  };

  const getLogColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-primary';
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      case 'info':
      default:
        return 'text-secondary';
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t-2 bg-black/95 border-primary/30">
      {/* Console Header */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b-2 cursor-pointer border-primary/30 hover:bg-primary/5"
        onClick={toggleConsole}
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold text-primary">CONSOLE</span>
          <span className="px-2 py-0.5 text-xs border rounded border-primary/50 text-secondary">
            {consoleLogs.length} logs
          </span>
        </div>
        <button className="p-1 transition-all rounded hover:bg-primary/20">
          {isConsoleOpen ? (
            <ChevronDown className="w-4 h-4 text-primary" />
          ) : (
            <ChevronUp className="w-4 h-4 text-primary" />
          )}
        </button>
      </div>

      {/* Console Content */}
      {isConsoleOpen && (
        <div className="h-48 p-4 space-y-1 overflow-y-auto font-mono text-xs">
          {consoleLogs.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>No console logs yet. Start an attack to see activity...</p>
            </div>
          ) : (
            <>
              {consoleLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-2">
                  <span className="text-gray-500">[{formatTime(log.timestamp)}]</span>
                  {getLogIcon(log.type)}
                  <span className={getLogColor(log.type)}>{log.message}</span>
                </div>
              ))}
              <div ref={consoleEndRef} />
            </>
          )}
        </div>
      )}
    </div>
  );
}
