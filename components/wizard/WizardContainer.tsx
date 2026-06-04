'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import StepIndicator from './StepIndicator';
import NavigationButtons from './NavigationButtons';
import {
  Step1Tipo,
  Step2Empresa,
  Step3Datos,
  Step4Hechos,
  Step5Docs,
  Step6Pretensiones,
  Step7Revision,
} from './wizard-steps';
import {
  initialWizardData,
  loadWizardData,
  saveGeneratedDocument,
  saveWizardData,
} from '@/lib/wizard-store';
import type { WizardData } from '@/lib/types';

export default function WizardContainer() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>(initialWizardData);
  const [checks, setChecks] = useState([false, false, false, false]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setWizardData(loadWizardData());
    setHydrated(true);
  }, []);

  const update = useCallback((patch: Partial<WizardData>) => {
    setWizardData((prev) => {
      const next = { ...prev, ...patch };
      saveWizardData(next);
      return next;
    });
  }, []);

  const canContinue = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!wizardData.step1?.tipo;
      case 2:
        return !!wizardData.step2?.nombreEmpresa?.trim() && !!wizardData.step2?.sector;
      case 3: {
        const s = wizardData.step3;
        return !!(s?.nombreCompleto && s.dniNie && s.direccion && s.codigoPostal && s.ciudad && s.email);
      }
      case 4: {
        const s = wizardData.step4;
        return !!(
          s?.fechaCompraContrato &&
          s.importeEuros > 0 &&
          s.descripcionLoQueSeAcordo?.length >= 20 &&
          s.descripcionLoQueOcurrio?.length >= 20 &&
          s.fechaProblema &&
          s.intentosResolucion?.trim()
        );
      }
      case 5:
        return true;
      case 6:
        return (wizardData.step6?.pretensiones?.length ?? 0) > 0;
      case 7:
        return checks.every(Boolean);
      default:
        return false;
    }
  };

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/generar-documento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wizardData }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Error desconocido');
      saveGeneratedDocument(json.documento);
      router.push('/resultado');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al generar');
    } finally {
      setLoading(false);
    }
  };

  const onContinue = () => {
    if (currentStep === 7) {
      void generate();
      return;
    }
    setCurrentStep((s) => Math.min(7, s + 1));
  };

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center text-text-secondary">
        Cargando formulario...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <StepIndicator currentStep={currentStep} />
      {error && (
        <div className="mb-4 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
          <button type="button" className="ml-2 underline" onClick={() => void generate()}>
            Reintentar
          </button>
        </div>
      )}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="card-surface"
        >
          {currentStep === 1 && (
            <Step1Tipo data={wizardData.step1} onChange={(d) => update({ step1: d })} />
          )}
          {currentStep === 2 && (
            <Step2Empresa data={wizardData.step2} onChange={(d) => update({ step2: d })} />
          )}
          {currentStep === 3 && (
            <Step3Datos data={wizardData.step3} onChange={(d) => update({ step3: d })} />
          )}
          {currentStep === 4 && (
            <Step4Hechos data={wizardData.step4} onChange={(d) => update({ step4: d })} />
          )}
          {currentStep === 5 && (
            <Step5Docs data={wizardData.step5} onChange={(d) => update({ step5: d })} />
          )}
          {currentStep === 6 && (
            <Step6Pretensiones data={wizardData.step6} onChange={(d) => update({ step6: d })} />
          )}
          {currentStep === 7 && (
            <Step7Revision
              data={wizardData}
              checks={checks}
              onChecks={(i, v) => setChecks((c) => c.map((x, j) => (j === i ? v : x)))}
              onEdit={setCurrentStep}
            />
          )}
        </motion.div>
      </AnimatePresence>
      <NavigationButtons
        currentStep={currentStep}
        onBack={() => setCurrentStep((s) => Math.max(1, s - 1))}
        onContinue={onContinue}
        continueDisabled={!canContinue()}
        loading={loading}
        continueLabel={currentStep === 7 ? 'Generar mi reclamación' : 'Continuar →'}
      />
    </div>
  );
}
