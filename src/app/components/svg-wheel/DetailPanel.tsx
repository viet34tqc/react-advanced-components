'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp, Router, X } from 'lucide-react';

interface DetailPanelProps {
  active: number | null;
  sliceLabel: string;
  onClose: () => void;
  onNavigateNext: () => void;
  onNavigatePrev: () => void;
}

export const DetailPanel = ({
  active,
  sliceLabel,
  onClose,
  onNavigateNext,
  onNavigatePrev,
}: DetailPanelProps) => {
  return (
    <div
      className={cn('h-full p-6 transition-all duration-700 flex-shrink-0', {
        'w-[400px] opacity-100': active !== null,
        'w-0 opacity-0 p-0': active === null,
      })}
    >
      {active !== null && (
        // The content in this component is just for demo
        <div className="h-full flex flex-col w-[360px]">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700">
            <h2 className="text-2xl font-bold text-slate-100">{sliceLabel}</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X />
            </button>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-lg">
              <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                <Router />
              </div>
              <div className="flex-1">
                <div className="text-sm text-slate-400 mb-1">
                  Router / 11:22:33:44:06:01
                </div>
                <div className="flex items-center gap-2 text-red-400 font-medium">
                  <span className="text-lg">×</span>
                  <span>Sehr instabil</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-700">
            <div className="flex gap-2">
              <Button variant="outline" onClick={onNavigateNext}>
                <ArrowUp />
              </Button>
              <Button variant="outline" onClick={onNavigatePrev}>
                <ArrowDown />
              </Button>
            </div>
            <Button>ESC</Button>
          </div>
        </div>
      )}
    </div>
  );
};
