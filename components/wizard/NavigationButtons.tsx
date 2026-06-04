import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

type Props = {
  currentStep: number;
  totalSteps?: number;
  onBack: () => void;
  onContinue: () => void;
  continueDisabled?: boolean;
  loading?: boolean;
  continueLabel?: string;
};

export default function NavigationButtons({
  currentStep,
  totalSteps = 7,
  onBack,
  onContinue,
  continueDisabled,
  loading,
  continueLabel = 'Continuar →',
}: Props) {
  return (
    <div className="mt-10 flex flex-col-reverse items-stretch justify-between gap-4 sm:flex-row sm:items-center">
      <Button
        type="button"
        variant="secondary"
        onClick={onBack}
        disabled={currentStep === 1 || loading}
        className="sm:w-auto"
      >
        ← Volver
      </Button>
      <span className="text-center text-sm text-text-tertiary sm:flex-1">
        Paso {currentStep} de {totalSteps}
      </span>
      <Button
        type="button"
        onClick={onContinue}
        disabled={continueDisabled || loading}
        className="sm:w-auto"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generando tu borrador...
          </>
        ) : (
          continueLabel
        )}
      </Button>
    </div>
  );
}
