import React, { useState, useEffect, useMemo } from 'react';
import {
  AILearningBridgeResult,
  LearningMission,
  UserProfile,
  StudentAnswers,
  ScaffoldingLevels,
  TeacherMissionFeedback
} from '../types';
import { PhotoZoomModal } from './PhotoZoomModal';
import { toast } from './Toast';
import {
  Camera,
  Sparkles,
  Eye,
  BookOpen,
  Target,
  Brain,
  Lightbulb,
  HelpCircle,
  Wrench,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Volume2,
  ZoomIn,
  RotateCw,
  PenTool,
  Save,
  Play,
  Share2,
  Compass,
  Award,
  ChevronRight,
  Sparkle,
  MessageSquare,
  Heart,
  Star
} from 'lucide-react';

interface InteractiveLearningWorkflowProps {
  learningBridge: AILearningBridgeResult;
  photoUrl: string;
  imageLabel?: string;
  mission: LearningMission | null;
  currentUser: UserProfile;
  teacherFeedback?: TeacherMissionFeedback;
  initialStep?: number;
  initialThinking?: string;
  initialProblemSolving?: string;
  initialScaffoldingHistory?: { questionId: string; level: 1 | 2 | 3 | 4; hintText: string; requestedAt: string }[];
  initialUnlockedLevels?: number[];
  onSaveDraftProgress?: (progress: {
    activeStep: number;
    studentThinking: string;
    problemSolving: string;
    scaffoldingHistory: { questionId: string; level: 1 | 2 | 3 | 4; hintText: string; requestedAt: string }[];
    unlockedScaffoldLevels: number[];
  }) => void;
  onCompleteChallenge: (
    answers: StudentAnswers,
    scaffoldingUsed: { questionId: string; level: 1 | 2 | 3 | 4; hintText: string; requestedAt: string }[]
  ) => void;
  onRetakePhoto: () => void;
  onLaunchPresentation?: () => void;
  onOpenReflection?: () => void;
}

export const InteractiveLearningWorkflow: React.FC<InteractiveLearningWorkflowProps> = ({
  learningBridge,
  photoUrl,
  imageLabel,
  mission,
  currentUser,
  teacherFeedback,
  initialStep,
  initialThinking,
  initialProblemSolving,
  initialScaffoldingHistory,
  initialUnlockedLevels,
  onSaveDraftProgress,
  onCompleteChallenge,
  onRetakePhoto,
  onLaunchPresentation,
  onOpenReflection
}) => {
  // Current active step in the 9-step learning journey (starts at Step 4 Contextual Problem or Step 3)
  const [activeStep, setActiveStep] = useState<number>(() => {
    if (typeof initialStep === 'number' && initialStep >= 1) return initialStep;
    return 4;
  });
  const [isPhotoZoomOpen, setIsPhotoZoomOpen] = useState(false);

  // Storage key for student draft
  const draftKey = `narasa_workflow_draft_${currentUser.id}_${mission?.id || 'exploration'}`;

  // Student Input States
  const [studentThinking, setStudentThinking] = useState<string>(() => {
    if (initialThinking) return initialThinking;
    try {
      const saved = localStorage.getItem(draftKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.studentThinking) return parsed.studentThinking;
      }
    } catch (e) {}
    return '';
  });

  const [problemSolving, setProblemSolving] = useState<string>(() => {
    if (initialProblemSolving) return initialProblemSolving;
    try {
      const saved = localStorage.getItem(draftKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.problemSolving) return parsed.problemSolving;
      }
    } catch (e) {}
    return '';
  });

  // Scaffolding state: unlocked levels (1 to 4)
  const [unlockedScaffoldLevels, setUnlockedScaffoldLevels] = useState<number[]>(() => {
    if (Array.isArray(initialUnlockedLevels) && initialUnlockedLevels.length > 0) return initialUnlockedLevels;
    return [1];
  });
  const [scaffoldingHistory, setScaffoldingHistory] = useState<
    { questionId: string; level: 1 | 2 | 3 | 4; hintText: string; requestedAt: string }[]
  >(() => {
    if (Array.isArray(initialScaffoldingHistory) && initialScaffoldingHistory.length > 0) return initialScaffoldingHistory;
    try {
      const saved = localStorage.getItem(draftKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed?.scaffoldingHistory)) return parsed.scaffoldingHistory;
      }
    } catch (e) {}
    return [];
  });

  const [lastSavedTime, setLastSavedTime] = useState<string | null>(() => {
    return new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  });
  const [isSavingToCloud, setIsSavingToCloud] = useState<boolean>(false);

  // Sync state if initial props change (e.g. cloud resume loaded after mount)
  useEffect(() => {
    if (initialThinking && !studentThinking) setStudentThinking(initialThinking);
    if (initialProblemSolving && !problemSolving) setProblemSolving(initialProblemSolving);
    if (initialStep && initialStep !== activeStep) setActiveStep(initialStep);
    if (Array.isArray(initialScaffoldingHistory) && initialScaffoldingHistory.length > scaffoldingHistory.length) {
      setScaffoldingHistory(initialScaffoldingHistory);
    }
    if (Array.isArray(initialUnlockedLevels) && initialUnlockedLevels.length > unlockedScaffoldLevels.length) {
      setUnlockedScaffoldLevels(initialUnlockedLevels);
    }
  }, [initialThinking, initialProblemSolving, initialStep, initialScaffoldingHistory, initialUnlockedLevels]);

  // Real-time Debounced Auto-save to LocalStorage AND Database Cloud (/api/student-drafts & Supabase)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSavingToCloud(true);
      const now = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

      // 1. LocalStorage
      try {
        localStorage.setItem(
          draftKey,
          JSON.stringify({
            studentThinking,
            problemSolving,
            scaffoldingHistory,
            unlockedScaffoldLevels,
            activeStep,
            lastSavedAt: now
          })
        );
      } catch (e) {}

      // 2. Parent callback -> Saves directly to Database Cloud
      if (onSaveDraftProgress) {
        onSaveDraftProgress({
          activeStep,
          studentThinking,
          problemSolving,
          scaffoldingHistory,
          unlockedScaffoldLevels
        });
      }

      setLastSavedTime(now);
      setIsSavingToCloud(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [studentThinking, problemSolving, scaffoldingHistory, unlockedScaffoldLevels, activeStep, draftKey, onSaveDraftProgress]);

  // Read aloud helper for elementary students
  const handleReadAloud = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Derive scaffolding hints from AI learning bridge or mission
  const scaffoldingLevels: ScaffoldingLevels = useMemo(() => {
    const q1 = learningBridge.questions?.[0];
    if (q1?.scaffolding) {
      return q1.scaffolding;
    }
    const obj = learningBridge.detectedObject || 'objek di fotomu';
    const mat = learningBridge.material || 'materi pelajaran';
    return {
      level1: `Amati bentuk, warna, dan posisi ${obj}. Bagian mana yang paling menarik perhatianmu?`,
      level2: `Bagaimana bagian tersebut berhubungan dengan konsep ${mat}? Coba hubungkan dengan materi yang diajarkan guru.`,
      level3: `Bayangkan jika ${obj} ini digunakan sehari-hari. Masalah apa yang bisa dipecahkan atau dicegah?`,
      level4: `Tuliskan solusimu dalam 2 langkah mudah: 1) Langkah awal yang dilakukan, 2) Hasil akhir yang diharapkan.`
    };
  }, [learningBridge]);

  // Unlock and record scaffolding level
  const handleUnlockScaffold = (level: 1 | 2 | 3 | 4) => {
    if (!unlockedScaffoldLevels.includes(level)) {
      setUnlockedScaffoldLevels((prev) => [...prev, level]);
    }
    const hintText =
      level === 1
        ? scaffoldingLevels.level1
        : level === 2
        ? scaffoldingLevels.level2
        : level === 3
        ? scaffoldingLevels.level3
        : scaffoldingLevels.level4;

    if (!scaffoldingHistory.some((h) => h.level === level)) {
      const now = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      setScaffoldingHistory((prev) => [
        ...prev,
        {
          questionId: `scaffold-${level}`,
          level,
          hintText,
          requestedAt: now
        }
      ]);
    }
  };

  // Contextual problem questions
  const contextualProblem = useMemo(() => {
    if (learningBridge.guidingQuestions && learningBridge.guidingQuestions.length > 0) {
      return learningBridge.guidingQuestions[0];
    }
    return `Bagaimana karakteristik ${learningBridge.detectedObject} ini berkaitan dengan fenomena nyata dan materi ${learningBridge.material}?`;
  }, [learningBridge]);

  const secondaryProblem = useMemo(() => {
    if (learningBridge.guidingQuestions && learningBridge.guidingQuestions.length > 1) {
      return learningBridge.guidingQuestions[1];
    }
    return `Apa keteraturan atau solusi inovatif yang bisa kita kembangkan dari pengamatan objek nyata ini?`;
  }, [learningBridge]);

  // Submission handler
  const handleCompleteWorkflow = () => {
    const thinkingText = studentThinking.trim() || 'Mengamati keteraturan dan struktur objek nyata di sekitar kita.';
    const solutionText = problemSolving.trim() || 'Merumuskan solusi pemecahan masalah kontekstual berdasarkan konsep materi.';

    const formattedAnswers: StudentAnswers = {
      studentThinking: thinkingText,
      problemSolving: solutionText,
      decomposition: thinkingText,
      patternRecognition: learningBridge.learningBridge || thinkingText,
      abstraction: learningBridge.material || 'Konsep Kunci',
      algorithmicThinking: solutionText,
      challengeAnswer: `${thinkingText} | Solusi: ${solutionText}`,
      reason: solutionText,
      evidence: thinkingText,
      strategy: solutionText,
      conclusion: solutionText
    };

    onCompleteChallenge(formattedAnswers, scaffoldingHistory);
    try {
      localStorage.removeItem(draftKey);
    } catch (e) {}
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5 sm:space-y-6 text-left">
      {/* Main Step Navigation Ribbon (Clean & Un-complicated) */}
      <div className="bg-white rounded-2xl p-2.5 sm:p-3 border border-slate-200 shadow-2xs flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {[
            { step: 1, label: 'Objek & Foto', icon: '📸' },
            { step: 3, label: 'NARASA AI', icon: '✨' },
            { step: 4, label: 'Masalah Kontekstual', icon: '🎯' },
            { step: 5, label: 'Murid Berpikir', icon: '💡' },
            { step: 6, label: 'Scaffolding', icon: '📐' },
            { step: 7, label: 'Pemecahan Masalah', icon: '⚙️' }
          ].map((item) => {
            const isActive = activeStep === item.step || (item.step === 1 && activeStep === 2);
            return (
              <button
                key={item.step}
                onClick={() => setActiveStep(item.step)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-Time Teacher Affirmation & Step Feedback Banner */}
      {teacherFeedback && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-5 text-white shadow-lg border-2 border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-3">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-3 bg-white/20 rounded-2xl text-yellow-200 shrink-0 shadow-inner">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-black uppercase tracking-wider bg-white/25 px-2.5 py-0.5 rounded-full border border-white/30">
                  Penguatan dari Guru: {teacherFeedback.teacherName}
                </span>
                <span className="text-xs font-black bg-amber-300 text-amber-950 px-2.5 py-0.5 rounded-full shadow-2xs">
                  {teacherFeedback.badgeReward || '🌟'} Nilai: {teacherFeedback.overallScore}/100 ({teacherFeedback.predicate})
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-white/95 leading-relaxed">
                “{teacherFeedback.overallReinforcement}”
              </p>
              {teacherFeedback.overallFeedback && (
                <p className="text-[11px] text-white/80 italic">
                  Catatan Guru: {teacherFeedback.overallFeedback}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* OBJEK NYATA & FOTO                                                        */}
      {/* ========================================================================= */}
      {(activeStep === 1 || activeStep === 2) && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-amber-100 text-amber-800 text-sm">📸</span>
                <h2 className="text-lg sm:text-xl font-bold text-[#25324B] font-display">
                  Objek Nyata & Foto
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Pengamatan objek konkret nyata di lingkungan sekitar sekolah atau rumah melalui fotografi.
              </p>
            </div>

            <button
              onClick={onRetakePhoto}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5 text-slate-500" />
              <span>Foto Objek Lain</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Captured Photo Container */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-100 group shadow-2xs aspect-4/3 max-h-[340px] flex items-center justify-center">
              <img
                src={photoUrl}
                alt={learningBridge.detectedObject}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
              />
              <button
                onClick={() => setIsPhotoZoomOpen(true)}
                className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 backdrop-blur-sm shadow-md transition-all cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>Perbesar Foto</span>
              </button>
            </div>

            {/* Real Object Summary */}
            <div className="space-y-4">
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">
                  Objek Nyata Teramati:
                </span>
                <h3 className="text-xl font-black text-amber-950 font-display">
                  {learningBridge.detectedObject}
                </h3>
                <p className="text-xs text-amber-900/80 leading-relaxed font-medium">
                  {learningBridge.observation}
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Konteks Lingkungan:
                </span>
                <p className="text-xs text-slate-700 font-semibold">
                  {learningBridge.context || 'Lingkungan belajar dan sekitar murid.'}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {learningBridge.compatibilityReason}
                </p>
              </div>

              <button
                onClick={() => setActiveStep(3)}
                className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>Lanjut ke Analisis NARASA AI</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* NARASA AI (PEMINDAIAN CERDAS & KAITAN KURIKULUM)                           */}
      {/* ========================================================================= */}
      {activeStep === 3 && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-sky-100 text-sky-800 text-sm">✨</span>
                <h2 className="text-lg sm:text-xl font-bold text-[#25324B] font-display">
                  Analisis Pintar NARASA AI
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                AI menghubungkan foto objek nyatamu dengan materi kurikulum dan tujuan pembelajaran.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Kesesuaian: {learningBridge.compatibility}</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Hubungan Materi */}
            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-sky-800 block">
                📚 Mata Pelajaran & Materi
              </span>
              <strong className="text-sm font-black text-sky-950 block">
                {learningBridge.subject} • {learningBridge.material}
              </strong>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {learningBridge.learningBridge}
              </p>
            </div>

            {/* Target Belajar */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-800 block">
                🎯 Target Pembelajaran
              </span>
              <p className="text-xs text-indigo-950 font-bold leading-relaxed">
                {learningBridge.learningTarget}
              </p>
              <span className="inline-block text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md">
                Level Kognitif: {learningBridge.cognitiveLevel || 'HOTS'}
              </span>
            </div>

            {/* Taksonomi Belajar */}
            <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 block">
                🌱 Tingkat Penalaran
              </span>
              <strong className="text-sm font-black text-teal-950 block">
                {learningBridge.soloTaxonomyLevel || 'Relational'}
              </strong>
              <p className="text-xs text-slate-600 leading-relaxed">
                {learningBridge.soloDescription || 'Menghubungkan fakta di foto dengan konsep sains/matematika secara utuh.'}
              </p>
            </div>
          </div>

          {/* Simple Material Summary Modal / Card */}
          {learningBridge.simpleMaterialSummary && (
            <div className="bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/40 p-5 rounded-2xl border border-blue-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-blue-900 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  Bekal Belajar Murid: Ringkasan Konsep Inti
                </span>
                <button
                  onClick={() => handleReadAloud(learningBridge.simpleMaterialSummary || '')}
                  className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
                  title="Dengarkan Suara"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Dengarkan</span>
                </button>
              </div>
              <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-white/90 p-4 rounded-xl border border-blue-100 max-h-48 overflow-y-auto">
                {learningBridge.simpleMaterialSummary}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setActiveStep(1)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-50 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Objek & Foto</span>
            </button>

            <button
              onClick={() => setActiveStep(4)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-all"
            >
              <span>Lanjut ke Masalah Kontekstual</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MASALAH KONTEKSTUAL (PERMASALAHAN NYATA DARI OBJEK)                        */}
      {/* ========================================================================= */}
      {activeStep === 4 && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-blue-100 text-blue-800 text-sm">🎯</span>
                <h2 className="text-lg sm:text-xl font-bold text-[#25324B] font-display">
                  Masalah Kontekstual
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Tantangan dan permasalahan nyata yang ditemukan dari pengamatan objek di lingkungan sekitar.
              </p>
            </div>

            <button
              onClick={() => handleReadAloud(`${contextualProblem}. ${secondaryProblem}`)}
              className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center gap-1.5 border border-blue-200 cursor-pointer transition-colors"
            >
              <Volume2 className="w-4 h-4 text-blue-600" />
              <span>Dengarkan Pertanyaan</span>
            </button>
          </div>

          {/* Contextual Problem Big Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-blue-50/90 via-indigo-50/50 to-white border-2 border-blue-200 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-blue-900 uppercase tracking-wider">
                Pertanyaan Pemantik & Masalah Nyata:
              </span>
            </div>

            <div className="space-y-3">
              <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-2xs space-y-1">
                <span className="text-[10px] font-bold text-blue-600 uppercase">Tantangan Utama 1</span>
                <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  "{contextualProblem}"
                </p>
              </div>

              {secondaryProblem && (
                <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase">Tantangan Penyelidikan 2</span>
                  <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    "{secondaryProblem}"
                  </p>
                </div>
              )}
            </div>

            <div className="p-3 bg-blue-100/60 rounded-xl text-xs text-blue-950 font-medium flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Objek foto <strong>{learningBridge.detectedObject}</strong> menyimpan petunjuk menarik. Sekarang, giliranmu berpikir dan menguraikan analisismu!
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setActiveStep(3)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-50 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke NARASA AI</span>
            </button>

            <button
              onClick={() => setActiveStep(5)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-all"
            >
              <span>Lanjut ke Murid Berpikir</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MURID BERPIKIR (GAGASAN, ANALISIS & HIPOTESIS MURID)                       */}
      {/* ========================================================================= */}
      {activeStep === 5 && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-indigo-100 text-indigo-800 text-sm">💡</span>
                <h2 className="text-lg sm:text-xl font-bold text-[#25324B] font-display">
                  Murid Berpikir
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Tuangkan pemikiran awal, hal yang kamu amati, atau hipotesis analisismu dengan bahasamu sendiri.
              </p>
            </div>

            <button
              onClick={() => setActiveStep(6)}
              className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs flex items-center gap-1.5 border border-purple-200 cursor-pointer transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-purple-600" />
              <span>Butuh Bantuan? Buka Scaffolding 📐</span>
            </button>
          </div>

          {/* Quick Problem Reminder */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950">
            <span className="font-bold block text-indigo-900">Pertanyaan Masalah Kontekstual:</span>
            <p className="text-slate-700 mt-0.5 font-medium">"{contextualProblem}"</p>
          </div>

          {/* Quick Starter Chips */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 block">Pancingan Ide Menulis:</span>
            <div className="flex flex-wrap gap-1.5">
              {[
                `Saya mengamati pada foto ${learningBridge.detectedObject}...`,
                `Menurut saya, hal ini terjadi karena...`,
                `Keteraturan atau pola yang saya temukan adalah...`,
                `Hubungannya dengan materi ${learningBridge.material} adalah...`
              ].map((starter, sIdx) => (
                <button
                  key={sIdx}
                  onClick={() => {
                    if (!studentThinking.includes(starter)) {
                      setStudentThinking((prev) => (prev ? `${prev} ${starter}` : starter));
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors cursor-pointer border border-slate-200"
                >
                  + "{starter.substring(0, 32)}..."
                </button>
              ))}
            </div>
          </div>

          {/* Teacher Step 5 Feedback Card if Available */}
          {teacherFeedback?.stepFeedbacks?.[5] && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-indigo-50 border-2 border-amber-300 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>Umpan Balik & Penguatan Guru (Ruang Berpikir):</span>
                </span>
                {teacherFeedback.stepFeedbacks[5].score && (
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded-full">
                    Skor: {teacherFeedback.stepFeedbacks[5].score}
                  </span>
                )}
              </div>
              {teacherFeedback.stepFeedbacks[5].reinforcement && (
                <p className="text-xs font-semibold text-amber-900 bg-white/80 p-2.5 rounded-xl border border-amber-200">
                  ✨ <strong>Penguatan Guru:</strong> “{teacherFeedback.stepFeedbacks[5].reinforcement}”
                </p>
              )}
              {teacherFeedback.stepFeedbacks[5].feedback && (
                <p className="text-xs text-slate-700 bg-white/60 p-2.5 rounded-xl border border-slate-200">
                  📝 <strong>Catatan Koreksi:</strong> {teacherFeedback.stepFeedbacks[5].feedback}
                </p>
              )}
            </div>
          )}

          {/* Student Thinking Textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="student-thinking-input" className="font-bold text-slate-800 flex items-center gap-1.5">
                <PenTool className="w-3.5 h-3.5 text-indigo-600" />
                <span>Ruang Berpikir & Analisis Murid:</span>
              </label>
              <span className="text-slate-600 font-medium">
                {studentThinking.length} karakter
              </span>
            </div>

            <textarea
              id="student-thinking-input"
              rows={5}
              value={studentThinking}
              onChange={(e) => setStudentThinking(e.target.value)}
              placeholder={`Ceritakan apa yang kamu pikirkan tentang ${learningBridge.detectedObject} ini, apa yang kamu amati, dan mengapa hal tersebut bisa terjadi...`}
              className="w-full p-4 rounded-2xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm text-slate-800 leading-relaxed outline-none shadow-2xs"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setActiveStep(4)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-50 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Masalah Kontekstual</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveStep(6)}
                className="px-4 py-2.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <span>Lihat Bimbingan (Scaffolding)</span>
                <HelpCircle className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setActiveStep(7)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-all"
              >
                <span>Lanjut ke Pemecahan Masalah</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCAFFOLDING (BIMBINGAN BERTINGKAT RAMAH DARI AI & GURU)                    */}
      {/* ========================================================================= */}
      {activeStep === 6 && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-purple-100 text-purple-800 text-sm">📐</span>
                <h2 className="text-lg sm:text-xl font-bold text-[#25324B] font-display">
                  Scaffolding (Bantuan Tutor Bertingkat)
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Petunjuk ramah bertahap untuk memandu pikiranmu saat menghadapi tantangan atau kesulitan.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                Level Terbuka: {unlockedScaffoldLevels.length} / 4
              </span>
            </div>
          </div>

          {/* 4-Tier Interactive Scaffolding Cards */}
          <div className="space-y-3.5">
            {[
              {
                level: 1 as const,
                title: '💡 Petunjuk Pemantik (Observasi Dasar)',
                desc: scaffoldingLevels.level1,
                badge: 'Petunjuk Ringan'
              },
              {
                level: 2 as const,
                title: '🔑 Konsep Kunci & Pertanyaan Penuntun',
                desc: scaffoldingLevels.level2,
                badge: 'Konsep Materi'
              },
              {
                level: 3 as const,
                title: '🌟 Analogi Nyata (Perumpamaan)',
                desc: scaffoldingLevels.level3,
                badge: 'Contoh Nyata'
              },
              {
                level: 4 as const,
                title: '🛠️ Panduan Langkah Praktis',
                desc: scaffoldingLevels.level4,
                badge: 'Langkah Aksi'
              }
            ].map((scaffold) => {
              const isUnlocked = unlockedScaffoldLevels.includes(scaffold.level);

              return (
                <div
                  key={scaffold.level}
                  className={`p-4 sm:p-5 rounded-2xl border-2 transition-all ${
                    isUnlocked
                      ? 'bg-purple-50/60 border-purple-200 shadow-2xs'
                      : 'bg-slate-50/80 border-slate-200 opacity-75'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-black text-slate-800">
                          {scaffold.title}
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 border border-purple-200">
                          {scaffold.badge}
                        </span>
                      </div>
                      {isUnlocked ? (
                        <p className="text-xs text-slate-700 leading-relaxed font-medium pt-1">
                          {scaffold.desc}
                        </p>
                      ) : (
                        <p className="text-xs text-slate-500 italic pt-1">
                          Klik tombol di sebelah kanan untuk membuka petunjuk tingkat ini.
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5">
                      {isUnlocked ? (
                        <button
                          onClick={() => handleReadAloud(scaffold.desc)}
                          className="p-2 rounded-xl bg-white border border-purple-200 text-purple-700 hover:bg-purple-100 transition-colors cursor-pointer"
                          title="Dengarkan Petunjuk"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnlockScaffold(scaffold.level)}
                          className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-2xs transition-all cursor-pointer"
                        >
                          Buka Petunjuk 🔓
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setActiveStep(5)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-50 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Murid Berpikir</span>
            </button>

            <button
              onClick={() => setActiveStep(7)}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-all"
            >
              <span>Lanjut ke Pemecahan Masalah</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PEMECAHAN MASALAH (SOLUSI AKHIR & TINDAKAN NYATA)                         */}
      {/* ========================================================================= */}
      {activeStep === 7 && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-teal-100 text-teal-800 text-sm">⚙️</span>
                <h2 className="text-lg sm:text-xl font-bold text-[#25324B] font-display">
                  Pemecahan Masalah
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Rancang solusi konkret atau kesimpulan terstruktur berdasarkan pemikiran dan bantuan scaffolding yang kamu peroleh.
              </p>
            </div>

            <button
              onClick={() => setActiveStep(6)}
              className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs flex items-center gap-1.5 border border-purple-200 cursor-pointer transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-purple-600" />
              <span>Tinjau Scaffolding 📐</span>
            </button>
          </div>

          {/* Quick Problem & Thinking Recap */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs">
              <span className="font-bold text-blue-900 block">Masalah Kontekstual:</span>
              <p className="text-slate-700 mt-0.5 font-medium leading-relaxed">
                "{contextualProblem}"
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs">
              <span className="font-bold text-indigo-900 block">Gagasan Berpikirmu:</span>
              <p className="text-slate-700 mt-0.5 font-medium leading-relaxed line-clamp-3">
                {studentThinking || 'Belum menulis gagasan awal.'}
              </p>
            </div>
          </div>

          {/* Teacher Step 7 Feedback Card if Available */}
          {teacherFeedback?.stepFeedbacks?.[7] && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-50 to-amber-50 border-2 border-teal-300 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-950 flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>Umpan Balik & Penguatan Guru (Solusi):</span>
                </span>
                {teacherFeedback.stepFeedbacks[7].score && (
                  <span className="text-xs font-bold text-teal-700 bg-teal-100 px-2.5 py-0.5 rounded-full">
                    Skor: {teacherFeedback.stepFeedbacks[7].score}
                  </span>
                )}
              </div>
              {teacherFeedback.stepFeedbacks[7].reinforcement && (
                <p className="text-xs font-semibold text-teal-950 bg-white/80 p-2.5 rounded-xl border border-teal-200">
                  ✨ <strong>Penguatan Guru:</strong> “{teacherFeedback.stepFeedbacks[7].reinforcement}”
                </p>
              )}
              {teacherFeedback.stepFeedbacks[7].feedback && (
                <p className="text-xs text-slate-700 bg-white/60 p-2.5 rounded-xl border border-slate-200">
                  📝 <strong>Catatan Solusi:</strong> {teacherFeedback.stepFeedbacks[7].feedback}
                </p>
              )}
            </div>
          )}

          {/* Problem Solving Textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="problem-solving-input" className="font-bold text-slate-800 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-teal-600" />
                <span>Solusi & Rencana Aksi Pemecahan Masalah:</span>
              </label>
              <span className="text-slate-600 font-medium">
                {problemSolving.length} karakter
              </span>
            </div>

            <textarea
              id="problem-solving-input"
              rows={5}
              value={problemSolving}
              onChange={(e) => setProblemSolving(e.target.value)}
              placeholder={`Tuliskan solusi nyata pemecahan masalahmu. Contoh:\n- Hal pertama yang dilakukan...\n- Cara menerapkan konsep ${learningBridge.material}...\n- Hasil dan kesimpulan yang dicapai...`}
              className="w-full p-4 rounded-2xl border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 text-sm text-slate-800 leading-relaxed outline-none shadow-2xs"
            />
          </div>

          {/* Primary Action Button: Finish & Generate Presentation */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-50 via-blue-50 to-purple-50 border-2 border-teal-300 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-0.5 text-left">
              <strong className="text-sm font-black text-slate-900 block">
                Siap Menampilkan Hasil Karyamu ke Kelas? 🎉
              </strong>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hasil pemecahan masalahmu akan langsung diubah otomatis menjadi slide presentasi dan dilanjutkan dengan Refleksi.
              </p>
            </div>

            <button
              onClick={handleCompleteWorkflow}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-teal-600 via-blue-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 text-white font-extrabold text-sm sm:text-base shadow-md active:scale-98 transition-all flex items-center justify-center gap-2.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>🚀 Selesaikan & Buat Slide Presentasi</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setActiveStep(6)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-50 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Scaffolding</span>
            </button>
          </div>
        </div>
      )}

      {/* Lightbox Photo Zoom Modal */}
      <PhotoZoomModal
        isOpen={isPhotoZoomOpen}
        onClose={() => setIsPhotoZoomOpen(false)}
        photoUrl={photoUrl}
        title={`📸 Objek Pengamatan: ${learningBridge.detectedObject}`}
        subtitle={`Materi: ${learningBridge.material} • ${learningBridge.subject}`}
      />
    </div>
  );
};
