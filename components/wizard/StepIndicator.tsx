import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';

const LABELS = ['Tipo', 'Empresa', 'Tus datos', 'Los hechos', 'Documentos', 'Qué pides', 'Revisión'];

export default function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="mb-10 overflow-x-auto pb-2">
      <div className="flex min-w-[640px] items-center justify-between">
        {LABELS.map((label, i) => {
          const step = i + 1;
          const done = step < currentStep;
          const active = step === currentStep;
          return (
            <div key={label} className="flex flex-1 flex-col items-center">
              <div className="flex w-full items-center">
                {i > 0 && (
                  <div
                    className={cn('h-0.5 flex-1', done || active ? 'bg-text-primary' : 'bg-border')}
                  />
                )}
                <div
                  className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-medium',
                    done && 'bg-text-primary text-bg-surface',
                    active && 'bg-warning text-white',
                    !done && !active && 'border border-border bg-bg-elevated text-text-tertiary',
                  )}
                >
                  {done ? <Check className="h-4 w-4" /> : step}
                </div>
                {i < LABELS.length - 1 && (
                  <div
                    className={cn('h-0.5 flex-1', done ? 'bg-text-primary' : 'bg-border')}
                  />
                )}
              </div>
              <span className="mt-2 hidden text-xs text-text-secondary sm:block">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
