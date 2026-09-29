import React from 'react';
import { LEARNING_WORKFLOW_STEPS, LearningWorkflowStep } from '../types';
import { ChevronRight, CheckCircle2, Sparkles } from 'lucide-react';

interface LearningWorkflowBreadcrumbProps {
  currentStepNumber: number; // 1 to 9
  onSelectStep?: (stepNumber: number) => void;
  variant?: 'banner' | 'stepper' | 'compact';
  title?: string;
  subtitle?: string;
}

export const LearningWorkflowBreadcrumb: React.FC<LearningWorkflowBreadcrumbProps> = ({
  currentStepNumber,
  onSelectStep,
  variant = 'stepper',
  title = 'Alur Kegiatan Pembelajaran NARASA',
  subtitle = 'Objek nyata → Foto → NARASA AI → Masalah kontekstual → Murid berpikir → Scaffolding → Pemecahan masalah → Presentasi → Refleksi'
}) => {
  const currentStep = LEARNING_WORKFLOW_STEPS.find((s) => s.stepNumber === currentStepNumber) || LEARNING_WORKFLOW_STEPS[0];

  if (variant === 'compact') {
    return (
      <div className="bg-white/95 rounded-2xl p-2.5 sm:p-3 border border-indigo-100 shadow-2xs flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
            {currentStepNumber}
          </span>
          <span className="text-xs font-black text-slate-800">
            {currentStep.title}
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {LEARNING_WORKFLOW_STEPS.map((s) => {
            const isCompleted = s.stepNumber < currentStepNumber;
            const isCurrent = s.stepNumber === currentStepNumber;
            return (
              <div
                key={s.id}
                title={`${s.stepNumber}. ${s.title}`}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  isCurrent
                    ? 'w-5 bg-blue-600'
                    : isCompleted
                    ? 'bg-emerald-500'
                    : 'bg-slate-200'
                }`}
              />
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-white via-indigo-50/30 to-blue-50/20 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-indigo-100 shadow-xs space-y-3">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-indigo-50/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-indigo-100 text-indigo-700 text-xs">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 font-display">
              {title}
            </h3>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
              {currentStepNumber} / 9
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-0.5 truncate max-w-2xl">
            {subtitle}
          </p>
        </div>

        {/* Current step active pill */}
        <div className={`self-start sm:self-auto px-2.5 py-1 rounded-xl border text-[11px] font-black flex items-center gap-1.5 shadow-2xs ${currentStep.color.bg} ${currentStep.color.border} ${currentStep.color.text}`}>
          <span className="text-sm">{currentStep.icon}</span>
          <span>Sedang Aktif: {currentStep.title}</span>
        </div>
      </div>

      {/* 9-Step Interactive Scrollable Chain */}
      <div className="overflow-x-auto pb-1.5 no-scrollbar scroll-smooth">
        <div className="flex items-center gap-1.5 min-w-max px-0.5">
          {LEARNING_WORKFLOW_STEPS.map((step, idx) => {
            const isCompleted = step.stepNumber < currentStepNumber;
            const isCurrent = step.stepNumber === currentStepNumber;
            const isUpcoming = step.stepNumber > currentStepNumber;
            const isLast = idx === LEARNING_WORKFLOW_STEPS.length - 1;

            return (
              <React.Fragment key={step.id}>
                <div
                  onClick={() => {
                    if (onSelectStep) {
                      onSelectStep(step.stepNumber);
                    }
                  }}
                  className={`group relative flex items-center gap-2 px-3 py-2 rounded-2xl border transition-all select-none ${
                    onSelectStep ? 'cursor-pointer' : ''
                  } ${
                    isCurrent
                      ? 'bg-blue-600 text-white border-blue-700 ring-2 ring-blue-400/40 shadow-sm scale-102 z-10'
                      : isCompleted
                      ? 'bg-emerald-50/90 text-emerald-950 border-emerald-200/90 hover:bg-emerald-100/90 shadow-2xs'
                      : 'bg-white/80 text-slate-500 hover:text-slate-800 border-slate-200 hover:bg-slate-50'
                  }`}
                  title={`${step.stepNumber}. ${step.title}: ${step.description}`}
                >
                  {/* Step Number or Check */}
                  <span
                    className={`w-5 h-5 rounded-lg flex items-center justify-center font-black text-[10px] shrink-0 ${
                      isCurrent
                        ? 'bg-white text-blue-700 font-black'
                        : isCompleted
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.stepNumber}
                  </span>

                  <span className="text-sm leading-none shrink-0">{step.icon}</span>

                  <div className="flex flex-col text-left pr-1">
                    <span
                      className={`text-[10px] sm:text-[11px] font-black truncate max-w-[110px] ${
                        isCurrent
                          ? 'text-white'
                          : isCompleted
                          ? 'text-emerald-950 group-hover:text-emerald-900'
                          : 'text-slate-500'
                      }`}
                    >
                      {step.shortTitle}
                    </span>
                    <span
                      className={`text-[8.5px] font-semibold tracking-tight uppercase ${
                        isCurrent
                          ? 'text-blue-100'
                          : isCompleted
                          ? 'text-emerald-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.category}
                    </span>
                  </div>
                </div>

                {!isLast && (
                  <ChevronRight
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isCompleted ? 'text-emerald-400' : 'text-slate-300'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
