import React, { useState } from 'react';
import { Lap, SessionHistory, ThemeConfig } from '../types';
import { formatMilliseconds, formatDelta } from '../utils/time';
import {
  Ghost,
  Trophy,
  TrendingDown,
  TrendingUp,
  Sparkles,
  Copy,
  Check,
  HelpCircle,
  Download,
  Trash2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { InfoButton } from './InfoButton';

interface LapTableProps {
  laps: Lap[];
  ghostSession: SessionHistory | null;
  onSetAsGhost: () => void;
  onClearGhost: () => void;
  theme: ThemeConfig;
  onOpenInfo?: (key: string) => void;
}

export const LapTable: React.FC<LapTableProps> = ({
  laps,
  ghostSession,
  onSetAsGhost,
  onClearGhost,
  theme,
  onOpenInfo,
}) => {
  const [copied, setCopied] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'ghost'>('all');

  // Find fastest and slowest lap for current session (if >= 2 laps)
  let minLapTime = Infinity;
  let maxLapTime = -Infinity;
  if (laps.length >= 2) {
    laps.forEach((l) => {
      if (l.lapTime < minLapTime) minLapTime = l.lapTime;
      if (l.lapTime > maxLapTime) maxLapTime = l.lapTime;
    });
  }

  const handleCopyLaps = () => {
    if (laps.length === 0) return;
    const text = laps
      .map((l, index) => {
        const lapFmt = formatMilliseconds(l.lapTime).displayTime;
        const splitFmt = formatMilliseconds(l.totalTime).displayTime;
        const prevLap = index > 0 ? laps[index - 1] : null;
        const paceDiff = prevLap ? formatDelta(l.lapTime - prevLap.lapTime).text : 'Baseline';
        return `Lap ${l.lapNumber} | Lap Time: ${lapFmt} | Split: ${splitFmt} | Pace: ${paceDiff}`;
      })
      .join('\n');
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleDownloadCSV = () => {
    if (laps.length === 0) return;
    const rows = [
      ['Lap Number', 'Lap Time (Round Duration)', 'Split Time (Cumulative)', 'Pace Diff vs Prev Lap (ms)'],
      ...laps.map((l, index) => {
        const prevLap = index > 0 ? laps[index - 1] : null;
        const paceDelta = prevLap ? (l.lapTime - prevLap.lapTime) : 0;
        return [
          l.lapNumber,
          formatMilliseconds(l.lapTime).displayTime,
          formatMilliseconds(l.totalTime).displayTime,
          (paceDelta / 1000).toFixed(2) + 's',
        ];
      }),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `timeframe-laps-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-3xl px-2 sm:px-4 mt-8">
      {/* Educational Banner Toggle */}
      <div className="mb-4 rounded-2xl bg-black/40 border border-white/10 overflow-hidden backdrop-blur-md">
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="w-full px-4 py-2.5 flex items-center justify-between text-left text-xs font-semibold text-white/80 hover:text-white transition-colors"
        >
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-4 h-4 text-purple-400" />
            <span>Understanding Lap Times, Split Times & Ghost Lap</span>
          </div>
          {showExplanation ? <ChevronUp className="w-4 h-4 text-white/50" /> : <ChevronDown className="w-4 h-4 text-white/50" />}
        </button>

        {showExplanation && (
          <div className="px-4 pb-4 pt-1 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs border-t border-white/5">
            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5">
              <span className="font-bold text-purple-300 block mb-1">⏱️ Lap Time</span>
              <p className="text-white/60 leading-relaxed">
                The exact duration of a <strong>single round</strong> or interval from the previous lap press to this one.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5">
              <span className="font-bold text-sky-300 block mb-1">📊 Split Time</span>
              <p className="text-white/60 leading-relaxed">
                The <strong>total elapsed duration</strong> on the stopwatch clock from initial start to when the lap button was clicked.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5">
              <span className="font-bold text-emerald-300 block mb-1">👻 Ghost Lap</span>
              <p className="text-white/60 leading-relaxed">
                Races your current lap against your <strong>previous saved session</strong>. Instantly see if you are faster or slower!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Laps Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 px-1">
        <div className="flex items-center space-x-2">
          <h3 className="text-sm font-bold tracking-wide uppercase text-white/90">
            Laps & Splits
          </h3>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-white font-mono font-bold">
            {laps.length}
          </span>
          {onOpenInfo && (
            <InfoButton
              onClick={() => onOpenInfo('ghost')}
              size="xs"
              title="Learn about Ghost Lap Benchmark"
            />
          )}
          {ghostSession && (
            <span className="flex items-center space-x-1 text-[11px] px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Ghost className="w-3 h-3" />
              <span>Ghost Session Active ({ghostSession.laps.length} Laps)</span>
            </span>
          )}
        </div>

        {/* Action Buttons */}
        {laps.length > 0 && (
          <div className="flex items-center space-x-1.5 flex-wrap">
            <button
              onClick={onSetAsGhost}
              title="Save this session into local memory as your new Ghost baseline"
              className="text-xs px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/40 flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Save as Ghost</span>
            </button>

            {ghostSession && (
              <button
                onClick={onClearGhost}
                title="Remove saved ghost baseline"
                className="text-xs px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-white/50 hover:text-rose-300 border border-white/5 transition-all flex items-center space-x-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear Ghost</span>
              </button>
            )}

            <button
              onClick={handleCopyLaps}
              className="text-xs px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 flex items-center space-x-1 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownloadCSV}
              title="Download CSV spreadsheet"
              className="text-xs px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 flex items-center space-x-1 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">CSV</span>
            </button>
          </div>
        )}
      </div>

      {/* When no laps have been recorded yet */}
      {laps.length === 0 ? (
        <div className="p-8 rounded-3xl bg-black/30 border border-white/5 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-3">
            <Ghost className="w-6 h-6 text-purple-400/70" />
          </div>
          <h4 className="text-sm font-semibold text-white/90 mb-1">
            {ghostSession ? 'Ready to Race Against Your Ghost Session' : 'Lap Tracking & Ghost Lap Benchmark'}
          </h4>
          <p className="text-xs text-white/50 max-w-md leading-relaxed mb-4">
            {ghostSession
              ? `You have a saved ghost baseline of ${ghostSession.laps.length} laps (${formatMilliseconds(ghostSession.totalTime).displayTime} total). Start the timer and press 'L' to see real-time delta pace indicators!`
              : "Press the 'Lap' button or hit [L] on your keyboard while the stopwatch is running to record splits. After finishing, you can lock your run as a Ghost Benchmark to compete against yourself."}
          </p>
          {ghostSession && (
            <div className="flex items-center space-x-2 text-xs text-purple-300/80 bg-purple-950/40 px-3.5 py-1.5 rounded-xl border border-purple-500/20">
              <span>Ghost Target Best Lap: <strong>{formatMilliseconds(ghostSession.bestLap).displayTime}</strong></span>
              <button
                onClick={onClearGhost}
                className="ml-2 text-rose-400 hover:text-rose-300 underline cursor-pointer text-[11px]"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Laps Table */
        <div className="rounded-3xl bg-black/50 border border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto no-scrollbar touch-pan-x">
            <div className="min-w-[460px]">
              {/* Table Column Headers */}
              <div className="grid grid-cols-12 px-4 py-3 bg-white/[0.04] border-b border-white/10 text-[11px] font-bold tracking-wider uppercase text-white/50">
                <div className="col-span-2">Lap #</div>
                <div className="col-span-3">Lap Time (Round)</div>
                <div className="col-span-3">Split Time (Total)</div>
                <div className="col-span-2">Pace Diff</div>
                <div className="col-span-2 text-right">Ghost Comparison</div>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-white/5">
                {/* Laps rendered newest first */}
                {[...laps].reverse().map((lap) => {
              const originalIndex = laps.findIndex((l) => l.id === lap.id);
              const prevLap = originalIndex > 0 ? laps[originalIndex - 1] : null;

              // Lap-to-lap pace delta (compared to immediate previous lap in this session)
              let paceDeltaInfo = null;
              if (prevLap) {
                const paceDiffMs = lap.lapTime - prevLap.lapTime;
                paceDeltaInfo = formatDelta(paceDiffMs);
              }

              // Ghost lap comparison (compared to matching lap in ghost session)
              const ghostLap = ghostSession?.laps.find((g) => g.lapNumber === lap.lapNumber);
              let ghostDeltaInfo = null;
              if (ghostLap) {
                const deltaMs = lap.lapTime - ghostLap.lapTime;
                ghostDeltaInfo = formatDelta(deltaMs);
              }

              const isFastest = laps.length >= 2 && lap.lapTime === minLapTime;
              const isSlowest = laps.length >= 2 && lap.lapTime === maxLapTime;

              const lapFmt = formatMilliseconds(lap.lapTime);
              const splitFmt = formatMilliseconds(lap.totalTime);

              return (
                <div
                  key={lap.id}
                  className={`grid grid-cols-12 px-4 py-3 items-center text-xs sm:text-sm transition-colors hover:bg-white/[0.03] ${
                    isFastest ? 'bg-emerald-500/10' : isSlowest ? 'bg-rose-500/10' : ''
                  }`}
                >
                  {/* Lap Number & PB Badges */}
                  <div className="col-span-2 flex items-center space-x-1.5 font-bold text-white">
                    <span>#{lap.lapNumber}</span>
                    {isFastest && (
                      <span className="flex items-center text-emerald-400" title="Personal Best / Fastest Lap">
                        <Trophy className="w-3.5 h-3.5 fill-current" />
                      </span>
                    )}
                  </div>

                  {/* Lap Time (Single Round Duration) */}
                  <div className="col-span-3 font-mono font-semibold text-white tabular-nums flex items-baseline">
                    <span>{lapFmt.minutes}:{lapFmt.seconds}</span>
                    <span className="text-[11px] text-white/50 ml-0.5">.{lapFmt.milliseconds}</span>
                  </div>

                  {/* Split Time (Cumulative Elapsed) */}
                  <div className="col-span-3 font-mono text-white/60 text-xs tabular-nums">
                    {splitFmt.minutes}:{splitFmt.seconds}.{splitFmt.milliseconds}
                  </div>

                  {/* Lap-to-Lap Pace Delta */}
                  <div className="col-span-2 font-mono text-xs">
                    {paceDeltaInfo ? (
                      <span
                        className={`font-semibold ${
                          paceDeltaInfo.isNeutral
                            ? 'text-white/40'
                            : paceDeltaInfo.isPositive
                            ? 'text-rose-400'
                            : 'text-emerald-400'
                        }`}
                        title={paceDeltaInfo.isPositive ? 'Slower than previous lap' : 'Faster than previous lap'}
                      >
                        {paceDeltaInfo.text}
                      </span>
                    ) : (
                      <span className="text-white/30 text-[11px]">Base</span>
                    )}
                  </div>

                  {/* Ghost Session Comparison */}
                  <div className="col-span-2 flex items-center justify-end">
                    {ghostDeltaInfo ? (
                      <div
                        className={`flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                          ghostDeltaInfo.isNeutral
                            ? 'bg-slate-500/20 text-slate-300'
                            : ghostDeltaInfo.isPositive
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                        title={
                          ghostDeltaInfo.isPositive
                            ? `${ghostDeltaInfo.text} slower than ghost session`
                            : `${ghostDeltaInfo.text} faster than ghost session!`
                        }
                      >
                        {ghostDeltaInfo.isPositive ? (
                          <TrendingDown className="w-3 h-3 text-rose-400" />
                        ) : (
                          <TrendingUp className="w-3 h-3 text-emerald-400" />
                        )}
                        <span>{ghostDeltaInfo.text}</span>
                      </div>
                    ) : ghostSession ? (
                      <span className="text-[11px] text-white/30 font-mono">No lap #{lap.lapNumber}</span>
                    ) : (
                      <span className="text-[11px] text-white/20 font-mono">—</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Table Footer with Summary Stats */}
          <div className="px-4 py-2.5 bg-black/40 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-white/60">
            <div className="flex items-center space-x-3">
              <span>Total Laps: <strong>{laps.length}</strong></span>
              {minLapTime !== Infinity && (
                <span>Best: <strong className="text-emerald-300 font-mono">{formatMilliseconds(minLapTime).displayTime}</strong></span>
              )}
            </div>
            <div>
              <span>Total Session Time: <strong className="text-white font-mono">{formatMilliseconds(laps[laps.length - 1].totalTime).displayTime}</strong></span>
            </div>
          </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
