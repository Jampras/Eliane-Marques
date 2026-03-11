import React from 'react';

interface ProgressBarProps {
  progress: number;
  count: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, count }) => {
  const roundedProgress = Math.round(progress);

  return (
    <div className="sticky top-[56px] z-30 border-b border-[color:var(--linho)] bg-[color:var(--aveia)] py-3 sm:py-4 md:top-[64px]">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <span className="text-[9px] uppercase tracking-[0.18em] text-[color:var(--argila)]">Progresso</span>
        <span className="font-ornament text-[1rem] italic text-[color:var(--taupe)]">{count} concluidos</span>
      </div>
      <div className="h-[3px] w-full overflow-hidden bg-[color:var(--linho)]/70">
        <div
          role="progressbar"
          aria-label="Progresso do checklist"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={roundedProgress}
          className="h-full bg-[color:var(--argila)] transition-all duration-700 ease-out"
          style={{ width: `${roundedProgress}%` }}
        />
      </div>
    </div>
  );
};