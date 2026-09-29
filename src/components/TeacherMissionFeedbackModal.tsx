import React, { useState } from 'react';
import {
  StudentActivitySession,
  TeacherMissionFeedback,
  StepFeedbackItem,
  UserProfile
} from '../types';
import { toast } from './Toast';
import {
  X,
  Sparkles,
  CheckCircle2,
  Award,
  Star,
  MessageSquare,
  Heart,
  Save,
  Loader2,
  Eye,
  Camera,
  Layers,
  Brain,
  Wrench,
  Cog,
  Tv,
  HelpCircle,
  TrendingUp,
  Check,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  FileCheck
} from 'lucide-react';

interface TeacherMissionFeedbackModalProps {
  session: StudentActivitySession;
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSaveFeedback: (sessionId: string, feedback: TeacherMissionFeedback) => Promise<boolean | void>;
}

export const TeacherMissionFeedbackModal: React.FC<TeacherMissionFeedbackModalProps> = ({
  session,
  currentUser,
  isOpen,
  onClose,
  onSaveFeedback
}) => {
  if (!isOpen) return null;

  const existingFeedback = session.teacherFeedback;

  // Form State
  const [overallScore, setOverallScore] = useState<number>(
    existingFeedback?.overallScore ?? session.metrics?.reasoningScore ?? 90
  );
  const [predicate, setPredicate] = useState<'Sangat Mahir' | 'Mahir' | 'Cakap' | 'Perlu Bimbingan'>(
    existingFeedback?.predicate ?? (overallScore >= 90 ? 'Sangat Mahir' : overallScore >= 80 ? 'Mahir' : overallScore >= 70 ? 'Cakap' : 'Perlu Bimbingan')
  );
  const [overallFeedback, setOverallFeedback] = useState<string>(
    existingFeedback?.overallFeedback ??
      `Bagus sekali! Eksplorasi pada objek ${session.imageLabel || 'nyata'} menunjukkan penalaran yang runut dan mendalam.`
  );
  const [overallReinforcement, setOverallReinforcement] = useState<string>(
    existingFeedback?.overallReinforcement ??
      `Ibu/Bapak Guru sangat bangga dengan caramu mengamati detail, menguraikan pola, dan merumuskan solusi nyata. Terus pertahankan rasa ingin tahu dan daya nalar kritismu! 🌟`
  );
  const [selectedBadge, setSelectedBadge] = useState<string>(
    existingFeedback?.badgeReward ?? 'Bintang Penalaran Kritis 🌟'
  );

  // Step 5 Feedback (Murid Berpikir: Dekomposisi & Pola)
  const [step5Feedback, setStep5Feedback] = useState<string>(
    existingFeedback?.stepFeedbacks?.[5]?.feedback ??
      'Penguraian komponen objek dan pengenalan polanya sudah cukup tepat dan sistematis.'
  );
  const [step5Reinforcement, setStep5Reinforcement] = useState<string>(
    existingFeedback?.stepFeedbacks?.[5]?.reinforcement ??
      'Hebat! Kamu berhasil melihat detail penting yang menghubungkan objek dengan konsep pelajaran.'
  );
  const [step5Score, setStep5Score] = useState<number>(
    existingFeedback?.stepFeedbacks?.[5]?.score ?? 92
  );

  // Step 7 Feedback (Pemecahan Masalah: Abstraksi & Algoritma)
  const [step7Feedback, setStep7Feedback] = useState<string>(
    existingFeedback?.stepFeedbacks?.[7]?.feedback ??
      'Urutan langkah solusi yang dirancang sangat logis dan aplikatif.'
  );
  const [step7Reinforcement, setStep7Reinforcement] = useState<string>(
    existingFeedback?.stepFeedbacks?.[7]?.reinforcement ??
      'Luar biasa! Algoritma solusimu rapi dan mudah dipraktikkan siapa saja.'
  );
  const [step7Score, setStep7Score] = useState<number>(
    existingFeedback?.stepFeedbacks?.[7]?.score ?? 90
  );

  // Step 9 Feedback (Refleksi)
  const [step9Feedback, setStep9Feedback] = useState<string>(
    existingFeedback?.stepFeedbacks?.[9]?.feedback ??
      'Refleksi diri sangat jujur dan menunjukkan kesadaran metakognitif yang baik.'
  );
  const [step9Reinforcement, setStep9Reinforcement] = useState<string>(
    existingFeedback?.stepFeedbacks?.[9]?.reinforcement ??
      'Mengetahui apa yang sulit dan cara mengatasinya adalah kunci menjadi pembelajar mandiri sejati!'
  );

  const [expandedStep, setExpandedStep] = useState<number | null>(5);
  const [isSaving, setIsSaving] = useState(false);

  const presetReinforcements = [
    '🌟 Luar biasa! Cara berpikirmu sangat runtut, kritis, dan berorientasi solusi nyata.',
    '💡 Keren sekali! Kamu mampu menghubungkan benda di sekitar dengan konsep materi secara cerdas.',
    '🎯 Penalaran kelompok sangat solid! Gotong royong dan pembagian peran terlihat nyata pada hasil karya.',
    '🚀 Pertahankan semangat eksplorasimu! Kamu memiliki potensi besar dalam berpikir komputasional.'
  ];

  const badgesList = [
    { label: 'Bintang Penalaran Kritis 🌟', icon: '🌟', color: 'from-amber-500 to-yellow-500 text-white' },
    { label: 'Penemu Pola Handal 🔍', icon: '🔍', color: 'from-blue-500 to-indigo-500 text-white' },
    { label: 'Master Algoritma & Solusi ⚙️', icon: '⚙️', color: 'from-teal-500 to-emerald-500 text-white' },
    { label: 'Eksplorator Kreatif 🎨', icon: '🎨', color: 'from-purple-500 to-pink-500 text-white' },
    { label: 'Kolaborasi Gotong Royong 🤝', icon: '🤝', color: 'from-rose-500 to-orange-500 text-white' }
  ];

  const handleScoreChange = (score: number) => {
    setOverallScore(score);
    if (score >= 90) setPredicate('Sangat Mahir');
    else if (score >= 80) setPredicate('Mahir');
    else if (score >= 70) setPredicate('Cakap');
    else setPredicate('Perlu Bimbingan');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const nowIso = new Date().toISOString();
      const teacherName = currentUser.name || 'Guru Pembimbing';
      const teacherAvatar = currentUser.avatar || '';

      const stepFeedbacks: Record<number, StepFeedbackItem> = {
        1: {
          stepNumber: 1,
          stepName: 'Objek & Foto Nyata',
          feedback: `Foto objek "${session.imageLabel || 'Objek'}" berhasil diobservasi dengan baik.`,
          reinforcement: 'Pemilihan objek kontekstual yang sangat menarik!',
          score: 95,
          teacherName,
          teacherAvatar,
          gradedAt: nowIso
        },
        5: {
          stepNumber: 5,
          stepName: 'Murid Berpikir (Dekomposisi & Pola)',
          feedback: step5Feedback,
          reinforcement: step5Reinforcement,
          score: step5Score,
          badgeAwarded: 'Penemu Pola Handal 🔍',
          teacherName,
          teacherAvatar,
          gradedAt: nowIso
        },
        6: {
          stepNumber: 6,
          stepName: 'Scaffolding (Bantuan Tutor)',
          feedback: `Murid menggunakan ${session.scaffoldingHistory?.length || 0} bantuan petunjuk. Tingkat kemandirian sangat baik.`,
          reinforcement: 'Bagus sekali berani mencoba dan mandiri dalam bernalar!',
          score: 90,
          teacherName,
          teacherAvatar,
          gradedAt: nowIso
        },
        7: {
          stepNumber: 7,
          stepName: 'Pemecahan Masalah (Abstraksi & Algoritma)',
          feedback: step7Feedback,
          reinforcement: step7Reinforcement,
          score: step7Score,
          badgeAwarded: 'Master Algoritma ⚙️',
          teacherName,
          teacherAvatar,
          gradedAt: nowIso
        },
        8: {
          stepNumber: 8,
          stepName: 'Studio Presentasi',
          feedback: `Menghasilkan ${session.presentation?.length || 0} slide presentasi yang siap dikomunikasikan di depan kelas.`,
          reinforcement: 'Slide tersusun dengan jelas dan percaya diri!',
          score: 90,
          teacherName,
          teacherAvatar,
          gradedAt: nowIso
        },
        9: {
          stepNumber: 9,
          stepName: 'Refleksi Belajar',
          feedback: step9Feedback,
          reinforcement: step9Reinforcement,
          score: 95,
          teacherName,
          teacherAvatar,
          gradedAt: nowIso
        }
      };

      const feedbackData: TeacherMissionFeedback = {
        id: existingFeedback?.id || `feedback-${session.id}`,
        sessionId: session.id,
        studentId: session.studentId,
        studentName: session.studentName,
        missionId: session.missionId,
        overallScore,
        predicate,
        overallFeedback,
        overallReinforcement,
        stepFeedbacks,
        badgeReward: selectedBadge,
        teacherId: currentUser.id,
        teacherName,
        teacherAvatar,
        status: 'reviewed',
        updatedAt: nowIso
      };

      await onSaveFeedback(session.id, feedbackData);

      toast.success(
        'Feedback & Penguatan Berhasil Diterbitkan! 🎉',
        `Catatan dan penguatan langsung muncul pada akun murid (${session.studentName}) dan tersimpan di database.`
      );
      onClose();
    } catch (e: any) {
      toast.error('Gagal Menyimpan Feedback', e?.message || 'Terjadi kesalahan saat menyimpan.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header Modal */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#25324B] via-[#1E293B] to-[#0F172A] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-2xl bg-amber-400/20 border border-amber-300/30 text-amber-300">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-300/30">
                  Pemeriksaan & Penguatan Misi Guru
                </span>
                {existingFeedback ? (
                  <span className="text-[11px] font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Telah Dinilai
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-yellow-300 bg-yellow-500/20 px-2.5 py-0.5 rounded-full border border-yellow-400/30">
                    ⏳ Menunggu Umpan Balik Guru
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold font-display text-white mt-0.5">
                Evaluasi Langkah Belajar: {session.studentName}
              </h2>
              <p className="text-xs text-slate-300">
                Misi: {session.missionTitle} • {session.subject}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
          {/* Top Info Banner with Student Work Summary */}
          <div className="bg-white rounded-2xl p-4.5 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <img
              src={session.image}
              alt={session.imageLabel}
              className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shrink-0 shadow-inner"
            />
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-[#25324B] px-2.5 py-0.5 rounded-lg bg-slate-100">
                  Objek Nyata: {session.imageLabel}
                </span>
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-100">
                  Konsep: {session.learningBridge?.detectedObject || session.imageLabel}
                </span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2">
                <span className="font-semibold text-slate-700">Jembatan Materi:</span>{' '}
                {session.learningBridge?.learningBridge || session.learningBridge?.context || 'Eksplorasi kontekstual terintegrasi kurikulum.'}
              </p>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium pt-1">
                <span>⏱️ Selesai: {session.completedAt || 'Baru saja'}</span>
                <span>•</span>
                <span>💡 {session.scaffoldingHistory?.length || 0}x Bantuan Tutor</span>
                <span>•</span>
                <span>🎤 {session.presentation?.length || 0} Slide Presentasi</span>
              </div>
            </div>
          </div>

          {/* SECTION 1: RINGKASAN PENILAIAN & PENGUATAN UTAMA GURU */}
          <div className="bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-amber-100/40 rounded-3xl p-5 sm:p-6 border-2 border-amber-200/90 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-amber-200/60">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-amber-500 text-white shadow-2xs">
                  <Heart className="w-4 h-4 fill-white" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-amber-950 font-display">
                    Penguatan Belajar & Nilai Utama Guru (Teacher Affirmation)
                  </h3>
                  <p className="text-xs text-amber-800">
                    Pesan ini akan tampil langsung di kartu hasil belajar & beranda akun murid.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right">
                  <span className="text-xs font-bold text-amber-900 block">Predikat</span>
                  <span className="text-xs font-extrabold text-amber-700 bg-amber-200/70 px-2.5 py-0.5 rounded-full border border-amber-300">
                    {predicate}
                  </span>
                </div>
              </div>
            </div>

            {/* Skor Slider & Predikat */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white/80 p-4 rounded-2xl border border-amber-200/80">
              <div className="md:col-span-4 space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Skor Penalaran Akhir:</span>
                  <span className="text-lg font-black text-amber-600 font-display">{overallScore} / 100</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="1"
                  value={overallScore}
                  onChange={(e) => handleScoreChange(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="md:col-span-8 space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>Lencana Bintang Apresiasi Guru:</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {badgesList.map((b) => (
                    <button
                      key={b.label}
                      type="button"
                      onClick={() => setSelectedBadge(b.label)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        selectedBadge === b.label
                          ? 'bg-amber-600 text-white shadow-xs scale-102 ring-2 ring-amber-300'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>{b.icon}</span>
                      <span>{b.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Kalimat Penguatan Utama Guru */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Kalimat Penguatan Guru (Afirmasi Positif & Motivasi):</span>
                </label>
                <span className="text-[11px] text-amber-700 font-medium">Klik template di bawah untuk memilih cepat</span>
              </div>

              {/* Template Cepat */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {presetReinforcements.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setOverallReinforcement(preset)}
                    className="p-2 text-left text-xs bg-white/70 hover:bg-white border border-amber-200/80 rounded-xl text-slate-700 transition-colors shadow-2xs hover:border-amber-400 cursor-pointer line-clamp-2"
                  >
                    {preset}
                  </button>
                ))}
              </div>

              <textarea
                rows={3}
                value={overallReinforcement}
                onChange={(e) => setOverallReinforcement(e.target.value)}
                placeholder="Tuliskan kata-kata penguatan motivasi dan apresiasi untuk murid..."
                className="w-full text-xs font-medium text-slate-800 bg-white border border-amber-300 rounded-2xl p-3 focus:ring-2 focus:ring-amber-400 focus:outline-hidden transition-all shadow-inner"
              />
            </div>

            {/* Catatan Feedback Korektif / Evaluasi Guru */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                <span>Catatan Ulasan & Umpan Balik Guru:</span>
              </label>
              <textarea
                rows={2}
                value={overallFeedback}
                onChange={(e) => setOverallFeedback(e.target.value)}
                placeholder="Tuliskan catatan ulasan materi atau aspek yang sudah baik..."
                className="w-full text-xs text-slate-800 bg-white border border-slate-300 rounded-2xl p-3 focus:ring-2 focus:ring-blue-400 focus:outline-hidden transition-all shadow-inner"
              />
            </div>
          </div>

          {/* SECTION 2: PEMERIKSAAN DETAIL LANGKAH DEMI LANGKAH */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600" />
                <span>Pemeriksaan Respon Murid Tiap Langkah Pembelajaran</span>
              </h3>
              <span className="text-xs text-slate-500">Klik langkah untuk membuka detail jawaban & feedback</span>
            </div>

            {/* STEP 5: MURID BERPIKIR (DEKOMPOSISI & PENGENALAN POLA) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <button
                type="button"
                onClick={() => setExpandedStep(expandedStep === 5 ? null : 5)}
                className="w-full p-4 flex items-center justify-between bg-indigo-50/50 hover:bg-indigo-50 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
                    <Brain className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-900">
                        Murid Berpikir (Dekomposisi & Pola)
                      </span>
                      <span className="text-[10px] font-bold bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded-full">
                        Skor: {step5Score}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {session.answers?.studentThinking || session.answers?.decomposition || session.answers?.reason || 'Jawaban murid tersedia'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-600">
                    {expandedStep === 5 ? 'Tutup' : 'Periksa & Nilai'}
                  </span>
                  {expandedStep === 5 ? (
                    <ChevronUp className="w-4 h-4 text-indigo-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-indigo-600" />
                  )}
                </div>
              </button>

              {expandedStep === 5 && (
                <div className="p-4.5 space-y-4 border-t border-indigo-100 bg-white">
                  {/* Jawaban Murid yang Diisi */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                      Jawaban / Hasil Berpikir Murid:
                    </span>
                    <div className="text-xs text-slate-800 font-medium whitespace-pre-wrap leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                      {session.answers?.studentThinking ||
                        session.answers?.decomposition ||
                        session.answers?.patternRecognition ||
                        session.answers?.reason ||
                        'Murid telah menyelesaikan analisis berpikir dekomposisi dan pola objek.'}
                    </div>
                  </div>

                  {/* Input Feedback Guru untuk Murid Berpikir */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        Catatan Feedback Guru:
                      </label>
                      <textarea
                        rows={2}
                        value={step5Feedback}
                        onChange={(e) => setStep5Feedback(e.target.value)}
                        className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-400 focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-indigo-900 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        Penguatan Guru:
                      </label>
                      <textarea
                        rows={2}
                        value={step5Reinforcement}
                        onChange={(e) => setStep5Reinforcement(e.target.value)}
                        className="w-full text-xs text-slate-800 bg-indigo-50/50 border border-indigo-300 rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-400 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* PEMECAHAN MASALAH (ABSTRAKSI & ALGORITMA) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <button
                type="button"
                onClick={() => setExpandedStep(expandedStep === 7 ? null : 7)}
                className="w-full p-4 flex items-center justify-between bg-teal-50/50 hover:bg-teal-50 transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-xl bg-teal-100 text-teal-700">
                    <Cog className="w-4 h-4" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-teal-900">
                        Pemecahan Masalah (Abstraksi & Algoritma Solusi)
                      </span>
                      <span className="text-[10px] font-bold bg-teal-200 text-teal-800 px-2 py-0.5 rounded-full">
                        Skor: {step7Score}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {session.answers?.problemSolving || session.answers?.algorithmicThinking || session.answers?.strategy || 'Rencana aksi solusi murid'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-teal-600">
                    {expandedStep === 7 ? 'Tutup' : 'Periksa & Nilai'}
                  </span>
                  {expandedStep === 7 ? (
                    <ChevronUp className="w-4 h-4 text-teal-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-teal-600" />
                  )}
                </div>
              </button>

              {expandedStep === 7 && (
                <div className="p-4.5 space-y-4 border-t border-teal-100 bg-white">
                  {/* Jawaban Solusi Murid */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <FileCheck className="w-3.5 h-3.5 text-teal-600" />
                      Rencana Aksi & Langkah Solusi Murid:
                    </span>
                    <div className="text-xs text-slate-800 font-medium whitespace-pre-wrap leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                      {session.answers?.problemSolving ||
                        session.answers?.algorithmicThinking ||
                        session.answers?.abstraction ||
                        session.answers?.strategy ||
                        'Murid telah menyusun urutan langkah penyelesaian masalah secara terstruktur.'}
                    </div>
                  </div>

                  {/* Input Feedback & Penguatan Pemecahan Masalah */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">
                        Catatan Feedback Guru:
                      </label>
                      <textarea
                        rows={2}
                        value={step7Feedback}
                        onChange={(e) => setStep7Feedback(e.target.value)}
                        className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-teal-400 focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-teal-900 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                        Penguatan Guru:
                      </label>
                      <textarea
                        rows={2}
                        value={step7Reinforcement}
                        onChange={(e) => setStep7Reinforcement(e.target.value)}
                        className="w-full text-xs text-slate-800 bg-teal-50/50 border border-teal-300 rounded-xl p-2.5 focus:ring-2 focus:ring-teal-400 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* REFLEKSI 5 PERTANYAAN */}
            {session.reflection && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandedStep(expandedStep === 9 ? null : 9)}
                  className="w-full p-4 flex items-center justify-between bg-purple-50/50 hover:bg-purple-50 transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
                      <HelpCircle className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="text-xs font-bold text-purple-900 block">
                        Refleksi Pembelajaran Murid (5 Pertanyaan)
                      </span>
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {session.reflection.q1Found || session.reflection.q2Learned || 'Refleksi hasil eksplorasi'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-purple-600">
                      {expandedStep === 9 ? 'Tutup' : 'Periksa & Nilai'}
                    </span>
                    {expandedStep === 9 ? (
                      <ChevronUp className="w-4 h-4 text-purple-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-purple-600" />
                    )}
                  </div>
                </button>

                {expandedStep === 9 && (
                  <div className="p-4.5 space-y-4 border-t border-purple-100 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-purple-50/40 rounded-xl border border-purple-100 space-y-1">
                        <span className="font-bold text-purple-900">1. Apa yang kamu temukan?</span>
                        <p className="text-slate-700">{session.reflection.q1Found || '-'}</p>
                      </div>
                      <div className="p-3 bg-purple-50/40 rounded-xl border border-purple-100 space-y-1">
                        <span className="font-bold text-purple-900">2. Apa yang kamu pelajari?</span>
                        <p className="text-slate-700">{session.reflection.q2Learned || '-'}</p>
                      </div>
                      <div className="p-3 bg-purple-50/40 rounded-xl border border-purple-100 space-y-1">
                        <span className="font-bold text-purple-900">3. Bagian yang paling sulit?</span>
                        <p className="text-slate-700">{session.reflection.q3Hardest || '-'}</p>
                      </div>
                      <div className="p-3 bg-purple-50/40 rounded-xl border border-purple-100 space-y-1">
                        <span className="font-bold text-purple-900">4. Bagaimana kamu menyelesaikannya?</span>
                        <p className="text-slate-700">{session.reflection.q4Solved || '-'}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-purple-950 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        Penguatan Refleksi dari Guru:
                      </label>
                      <textarea
                        rows={2}
                        value={step9Reinforcement}
                        onChange={(e) => setStep9Reinforcement(e.target.value)}
                        className="w-full text-xs text-slate-800 bg-purple-50/50 border border-purple-300 rounded-xl p-2.5 focus:ring-2 focus:ring-purple-400 focus:outline-hidden"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Modal with Action Buttons */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Tersimpan otomatis ke Supabase Cloud & Database Server Lokal</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan ke Database...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan & Kirim Penguatan ke Murid 🚀</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
