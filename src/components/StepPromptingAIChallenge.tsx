import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Zap,
  Send,
  Check,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  BookOpen,
  Brain,
  Award,
  MessageSquare,
  RotateCw,
  ChevronDown,
  ChevronUp,
  Copy,
  PlusCircle,
  ArrowRight,
  Target,
  FileText,
  Compass,
  Flame,
  Info
} from 'lucide-react';
import { STEMStage, LearningMission, StudentPromptEvaluation } from '../types';
import { AIClientService } from '../services/aiClientService';
import { toast } from './Toast';

interface StepPromptingAIChallengeProps {
  stageId: STEMStage;
  stageTitle: string;
  stepNumber: number;
  material: string;
  subject: string;
  detectedObject: string;
  observation?: string;
  currentAnswer: string;
  onApplyToAnswer: (textToAppendOrReplace: string) => void;
}

export const StepPromptingAIChallenge: React.FC<StepPromptingAIChallengeProps> = ({
  stageId,
  stageTitle,
  stepNumber,
  material,
  subject,
  detectedObject,
  observation,
  currentAnswer,
  onApplyToAnswer
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<'magic_chips' | 'free_writing'>('magic_chips');
  const [promptText, setPromptText] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('scientist');
  const [selectedCuriosity, setSelectedCuriosity] = useState<string>('c1');
  const [selectedFormat, setSelectedFormat] = useState<string>('f1');
  const [isLoading, setIsLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<StudentPromptEvaluation | null>(null);
  const [copied, setCopied] = useState(false);

  // Role chips tailored for kids
  const roleOptions = [
    {
      id: 'scientist',
      label: '🧑‍🔬 Ilmuwan Sains Ramah',
      promptPiece: 'Jadilah seorang ilmuwan sains cilik yang ramah dan seru.'
    },
    {
      id: 'detective',
      label: '🕵️ Detektif Pola & Logika',
      promptPiece: 'Jadilah seorang detektif cerdas yang suka membongkar misteri dan pola tersembunyi.'
    },
    {
      id: 'engineer',
      label: '📐 Insinyur & Perancang Cilik',
      promptPiece: 'Jadilah seorang insinyur cerdas yang memahami cara kerja dan rancangan sistematis.'
    },
    {
      id: 'storyteller',
      label: '🎨 Pencerita Hebat & Asyik',
      promptPiece: 'Jadilah pencerita petualangan yang pandai menjelaskan hal rumit menjadi mudah dipahami.'
    }
  ];

  // Computational Thinking stage-specific curiosity options tailored to the material and object
  const getStageCuriosityOptions = () => {
    const obj = detectedObject || 'objek ini';
    const mat = material || 'materi pelajaran';

    switch (stageId) {
      case 'decomposition':
        return [
          {
            id: 'c1',
            label: `🔬 Bagian tersembunyi apa yang menyusun ${obj} dan apa peran fungsinya?`,
            text: `Apa saja bagian-bagian tersembunyi atau komponen utama yang menyusun "${obj}" ini, dan bagaimana peran masing-masing bagian tersebut dalam mendukung konsep materi "${mat}"?`
          },
          {
            id: 'c2',
            label: `🧩 Bagaimana setiap elemen kecil pada ${obj} saling bekerja sama?`,
            text: `Bagaimana hubungan kerja antara bagian-bagian pada "${obj}" ini? Apa yang akan terjadi pada sistem kerjanya jika salah satu komponen penting hilang atau rusak?`
          },
          {
            id: 'c3',
            label: `⚠️ Mengapa ${obj} dirancang dengan bagian-bagian seperti itu?`,
            text: `Mengapa manusia atau alam merancang susunan bagian "${obj}" dengan bentuk dan posisi seperti itu? Apa alasan ilmiahnya jika dikaitkan dengan materi "${mat}"?`
          }
        ];
      case 'pattern_recognition':
        return [
          {
            id: 'c1',
            label: `📊 Pola atau keteraturan apa yang paling konsisten pada ${obj}?`,
            text: `Keteraturan susunan, bentuk berulang, simetri, atau pola waktu apa yang paling nyata terlihat pada "${obj}" yang membuktikan prinsip materi "${mat}"?`
          },
          {
            id: 'c2',
            label: `🔄 Mengapa ${obj} mengikuti siklus/pola yang teratur?`,
            text: `Mengapa pola keteraturan pada "${obj}" ini bisa terjadi secara konstan? Bagaimana pola ini membantu kita memahami materi "${mat}" lebih mudah?`
          },
          {
            id: 'c3',
            label: `🔮 Apakah polanya akan tetap sama jika kondisi sekitar berubah?`,
            text: `Jika "${obj}" ini digunakan di kondisi berbeda atau diperbanyak jumlahnya, apakah pola keteraturannya akan tetap bertahan? Mengapa demikian?`
          }
        ];
      case 'abstraction':
        return [
          {
            id: 'c1',
            label: `🎯 Informasi kunci apa yang PALING ESENSIAL dari ${obj}?`,
            text: `Ciri atau informasi kunci apa yang PALING ESENSIAL dari "${obj}" agar siapa pun langsung paham konsep inti "${mat}" tanpa kebingungan?`
          },
          {
            id: 'c2',
            label: `🧹 Detail apa yang bisa diabaikan agar fokus pada inti masalah?`,
            text: `Detail atau hiasan kecil apa pada "${obj}" (seperti warna cat latar, bayangan, atau corak dekorasi) yang BISA DIABAIKAN agar fokus penalaran kita tertuju murni pada konsep "${mat}"?`
          },
          {
            id: 'c3',
            label: `💡 Prinsip umum apa yang bisa diterapkan ke benda lain?`,
            text: `Prinsip atau hukum umum apa dari pengamatan "${obj}" ini yang bisa kita bawa dan terapkan ke benda atau permasalahan sains lain di kehidupan sehari-hari?`
          }
        ];
      case 'algorithmic_thinking':
        return [
          {
            id: 'c1',
            label: `📋 Urutan langkah 1, 2, 3 apa yang paling runtut untuk menguji ${obj}?`,
            text: `Bagaimana urutan instruksi langkah demi langkah (Langkah 1, Langkah 2, Langkah 3...) yang paling runtut dan logis untuk memanfaatkan, membuktikan, atau membuat solusi terkait "${obj}" dan "${mat}"?`
          },
          {
            id: 'c2',
            label: `⚡ Titik kritis mana yang rawan salah dalam langkah-langkahnya?`,
            text: `Dalam urutan langkah tersebut, tahapan mana yang paling kritis dan rawan terjadi kegagalan jika kita kurang teliti? Bagaimana cara mengantisipasinya?`
          },
          {
            id: 'c3',
            label: `🧪 Bagaimana membuktikan urutan langkah ini berhasil secara efektif?`,
            text: `Bagaimana cara membuktikan secara terukur bahwa urutan langkah yang disusun adalah cara tercepat, paling praktis, dan akurat dalam memahami "${obj}"?`
          }
        ];
      default:
        return [
          {
            id: 'c1',
            label: `🔍 Apa rahasia ilmiah terbesar dari ${obj} terkait ${mat}?`,
            text: `Apa rahasia sains dan matematika terbesar dari "${obj}" ini yang berkaitan langsung dengan materi "${mat}"?`
          }
        ];
    }
  };

  const curiosityOptions = getStageCuriosityOptions();

  // Output format options
  const formatOptions = [
    {
      id: 'f1',
      label: '🦸 Analogi Seru & Fakta Kunci',
      text: 'Jelaskan dengan bahasa ramah anak, sertakan 1 analogi seru seperti pahlawan atau kartun, dan daftar fakta pentingnya!'
    },
    {
      id: 'f2',
      label: '📋 Poin-Poin Runtut & Jenisnya',
      text: 'Tuliskan dalam bentuk daftar poin 1-2-3 yang runtut, rincian komponen atau jenisnya, dan kesimpulan utamanya!'
    },
    {
      id: 'f3',
      label: '🧪 Eksperimen Mini / Aksi Nyata',
      text: 'Berikan penjelasan intinya disertai 1 ide eksperimen mini atau penyelidikan nyata yang bisa langsung saya coba di sekolah!'
    },
    {
      id: 'f4',
      label: '🧩 Solusi Masalah & Tips Praktis',
      text: 'Jelaskan cara menyelesaikan masalah terkait konsep ini langkah demi langkah dengan tips praktis yang mudah diingat!'
    }
  ];

  // Auto-compose prompt when chips or stage changes
  useEffect(() => {
    if (activeTab === 'magic_chips') {
      const parts: string[] = [];
      const roleFound = roleOptions.find((r) => r.id === selectedRole);
      if (roleFound) parts.push(roleFound.promptPiece);

      parts.push(
        `Saya adalah murid SD yang sedang meneliti objek nyata "${detectedObject || 'objek di foto'}" pada tantangan Berpikir Komputasional Langkah ${stepNumber} (${stageTitle}) untuk materi "${material}" (${subject}).`
      );

      const curiosityFound = curiosityOptions.find((c) => c.id === selectedCuriosity) || curiosityOptions[0];
      if (curiosityFound) {
        parts.push(curiosityFound.text);
      }

      const formatFound = formatOptions.find((f) => f.id === selectedFormat);
      if (formatFound) {
        parts.push(formatFound.text);
      } else {
        parts.push('Tolong jelaskan secara lengkap, ramah anak, dan mudah dipahami!');
      }

      setPromptText(parts.join(' '));
    }
  }, [selectedRole, selectedCuriosity, selectedFormat, activeTab, stageId, stepNumber, detectedObject, material, subject]);

  // Live Component Detection
  const pLower = promptText.toLowerCase();
  const hasRole = /jadilah|sebagai|kamu adalah|guru|ilmuwan|detektif|insinyur|pakar|ahli|sahabat|mentor|pahlawan/.test(pLower);
  const hasContext =
    /materi|objek|foto|langkah|tahap|komputasional|dekomposisi|pola|abstraksi|algoritma/.test(pLower) ||
    (material && pLower.includes(material.toLowerCase())) ||
    (detectedObject && pLower.includes(detectedObject.toLowerCase()));
  const hasInquiry = /\?|mengapa|kenapa|bagaimana|rahasia|misteri|apa jadinya|kenapa bisa|apakah|keteraturan|fungsi|bagian/.test(pLower);
  const hasFormat = /jelaskan|analogi|contoh|langkah|daftar|poin|cerita|eksperimen|tabel|singkat|tahap|format|runtut/.test(pLower);

  const detectedCount = [hasRole, hasContext, hasInquiry, hasFormat].filter(Boolean).length;

  const handleSendPrompt = async (customPrompt?: string) => {
    const textToSend = (customPrompt || promptText).trim();
    if (!textToSend) return;

    setIsLoading(true);
    try {
      const missionPayload: LearningMission = {
        id: `mission-ct-${stageId}`,
        idMapel: subject.toLowerCase().replace(/\s+/g, '_') || 'matematika',
        title: `Tantangan Berpikir Komputasional: ${stageTitle}`,
        description: `Eksplorasi ${stageTitle} pada objek ${detectedObject} dengan materi ${material}`,
        subject: subject,
        grade: 'Kelas 5',
        phase: 'Fase C',
        material: material,
        cp: `Memahami konsep ${material} melalui fenomena nyata sekitar`,
        tp: `Mengembangkan pemahaman ${material} menggunakan 4 langkah berpikir komputasional`,
        indicators: [`Investigasi ${stageTitle}`],
        targetCompetency: 'both',
        cognitiveLevel: 'C4-C6',
        strictCurriculumMode: false,
        features: {
          adaptiveDifficulty: true,
          scaffolding: true,
          reasoning: true,
          evidence: true,
          reflection: true,
          presentation: true,
          peerQuestion: true
        },
        isActive: true,
        createdAt: new Date().toISOString()
      };

      const res = await AIClientService.coachStudentPrompt({
        studentPrompt: textToSend,
        mission: missionPayload,
        objectHint: detectedObject,
        photoObservation: observation
      });

      setEvaluation(res);

      if (res.promptScore >= 80) {
        confetti({
          particleCount: 55,
          spread: 65,
          origin: { y: 0.65 }
        });
        toast.success(
          'Prompt AI Sangat Tajam! 🌟',
          `Skor Efektivitas: ${res.promptScore}/100. Rahasia materi telah terbuka!`
        );
      } else {
        toast.info(
          'Jawaban AI Telah Siap! 💡',
          `Skor: ${res.promptScore}/100. Kamu bisa memasukkan temuan ini ke jawaban tantanganmu.`
        );
      }
    } catch (e) {
      console.error(e);
      toast.error('Gagal menghubungi AI', 'Silakan coba kembali dalam beberapa saat.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsertFindingsIntoAnswer = () => {
    if (!evaluation) return;
    const exp = evaluation.fullExplanation;

    const findingsSummary = [
      `💡 Hasil Investigasi AI (${stageTitle} • Materi: ${material}):`,
      `• Konsep Inti: ${exp.conceptIntro}`,
      `• Rahasia Objek: ${exp.curiosityAnswer}`,
      exp.typesAndClassification && exp.typesAndClassification.length > 0
        ? `• Komponen/Pola Penting: ${exp.typesAndClassification.slice(0, 2).join('; ')}`
        : '',
      exp.funAnalogy ? `• Analogi: ${exp.funAnalogy}` : ''
    ]
      .filter(Boolean)
      .join('\n');

    let newAnswer = '';
    if (!currentAnswer.trim()) {
      newAnswer = findingsSummary;
    } else {
      newAnswer = `${currentAnswer.trim()}\n\n${findingsSummary}`;
    }

    onApplyToAnswer(newAnswer);
    toast.success(
      'Temuan AI Berhasil Dimasukkan! ✨',
      `Hasil investigasi prompt AI telah ditambahkan ke kotak jawaban Langkah ${stepNumber}.`
    );
  };

  const handleCopyMaterial = () => {
    if (!evaluation) return;
    const exp = evaluation.fullExplanation;
    const fullText = `📚 HASIL INVESTIGASI PROMPTING AI (${stageTitle} - ${material})
Prompt: "${evaluation.studentPrompt}"
Skor: ${evaluation.promptScore}/100 (${evaluation.promptLevel})

🌟 KONSEP UTAMA:
${exp.conceptIntro}

🔍 RAHASIA PENYELIDIKAN:
${exp.curiosityAnswer}

🏷️ RINCIAN & JENIS:
${exp.typesAndClassification.join('\n')}

🦸 ANALOGI:
${exp.funAnalogy}

🧪 MISI MINI:
${exp.miniMission}`;

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    toast.info('Tersalin ke Clipboard!', 'Ringkasan materi investigasi AI telah disalin.');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl sm:rounded-3xl border-2 border-purple-200 bg-gradient-to-br from-purple-50/80 via-white to-indigo-50/60 shadow-sm overflow-hidden transition-all duration-300">
      {/* Header Bar with Toggle & Challenge Badge */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-3.5 sm:p-4.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white flex items-center justify-between gap-3 cursor-pointer select-none"
      >
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/30 shadow-inner">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-2xs">
                Termasuk Dalam Tantangan Langkah {stepNumber}
              </span>
              <span className="text-[10px] font-bold text-purple-100 hidden sm:inline">
                Formula R-K-T-F Terhubung Materi
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-black tracking-wide leading-tight truncate">
              🪄 Tantangan Prompting AI: Asah Nalar Kritis & Gali Rahasia Materi
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-bold text-purple-100 hidden md:inline">
            {isExpanded ? 'Sembunyikan' : 'Buka Tantangan Prompting'}
          </span>
          <button
            type="button"
            className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
            title={isExpanded ? 'Tutup Panel' : 'Buka Panel'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Collapsible Challenge Body */}
      {isExpanded && (
        <div className="p-4 sm:p-6 space-y-5 animate-in fade-in duration-200">
          {/* Mission & Stage Context Explainer */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-purple-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg">🎯</span>
                <span className="text-xs font-black text-purple-950 uppercase tracking-wide">
                  Tujuan Tantangan Prompting di Tahap {stageTitle}:
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Tantang AI untuk membongkar rahasia materi{' '}
                <strong className="text-purple-700 underline decoration-purple-300 font-bold">{material}</strong> pada objek foto{' '}
                <strong className="text-slate-900 font-bold">"{detectedObject}"</strong>. Jawaban AI dapat langsung kamu masukkan untuk menyempurnakan jawaban tantanganmu di bawah!
              </p>
            </div>
            <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
              <span className="text-[10px] font-black px-2.5 py-1 rounded-xl bg-purple-100 text-purple-900 border border-purple-200">
                Mata Pelajaran: {subject}
              </span>
            </div>
          </div>

          {/* Formula R-K-T-F Quick Guide Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] sm:text-[11px]">
            <div
              className={`p-2 rounded-xl border transition-all ${
                hasRole
                  ? 'bg-purple-100/90 border-purple-300 text-purple-900 font-bold shadow-2xs'
                  : 'bg-white border-slate-200 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-1 font-black text-purple-800">
                <span>{hasRole ? '✅' : '○'}</span>
                <span>1. Role (R)</span>
              </div>
              <span className="text-[10px] block mt-0.5 text-slate-600">Peran khusus AI</span>
            </div>

            <div
              className={`p-2 rounded-xl border transition-all ${
                hasContext
                  ? 'bg-purple-100/90 border-purple-300 text-purple-900 font-bold shadow-2xs'
                  : 'bg-white border-slate-200 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-1 font-black text-purple-800">
                <span>{hasContext ? '✅' : '○'}</span>
                <span>2. Konteks (K)</span>
              </div>
              <span className="text-[10px] block mt-0.5 text-slate-600">{detectedObject.slice(0, 14)}... & materi</span>
            </div>

            <div
              className={`p-2 rounded-xl border transition-all ${
                hasInquiry
                  ? 'bg-purple-100/90 border-purple-300 text-purple-900 font-bold shadow-2xs'
                  : 'bg-white border-slate-200 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-1 font-black text-purple-800">
                <span>{hasInquiry ? '✅' : '○'}</span>
                <span>3. Tanya (T)</span>
              </div>
              <span className="text-[10px] block mt-0.5 text-slate-600">Rasa ingin tahu mendalam</span>
            </div>

            <div
              className={`p-2 rounded-xl border transition-all ${
                hasFormat
                  ? 'bg-purple-100/90 border-purple-300 text-purple-900 font-bold shadow-2xs'
                  : 'bg-white border-slate-200 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-1 font-black text-purple-800">
                <span>{hasFormat ? '✅' : '○'}</span>
                <span>4. Format (F)</span>
              </div>
              <span className="text-[10px] block mt-0.5 text-slate-600">Analogi & poin runtut</span>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2 p-1 bg-slate-200/80 rounded-2xl max-w-sm">
            <button
              type="button"
              onClick={() => setActiveTab('magic_chips')}
              className={`flex-1 py-1.5 px-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'magic_chips'
                  ? 'bg-white text-purple-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Rakit Cepat (Chips)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('free_writing')}
              className={`flex-1 py-1.5 px-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'free_writing'
                  ? 'bg-white text-purple-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              <span>Tulis Prompt Bebas</span>
            </button>
          </div>

          {/* Tab 1: Magic Chips Picker */}
          {activeTab === 'magic_chips' && (
            <div className="space-y-3.5 animate-in fade-in">
              {/* 1. Pilih Peran */}
              <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-purple-100 shadow-2xs space-y-1.5">
                <span className="text-[11px] font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center text-[10px] font-black">
                    1
                  </span>
                  <span>Pilih Peran AI (Role):</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {roleOptions.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedRole(r.id)}
                      className={`text-left p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                        selectedRole === r.id
                          ? 'bg-purple-50 border-purple-400 text-purple-950 shadow-2xs ring-1 ring-purple-300'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-purple-50/40'
                      }`}
                    >
                      <span>{r.label}</span>
                      {selectedRole === r.id && <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Pilih Pertanyaan Rasa Ingin Tahu (Stage Specific) */}
              <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-purple-100 shadow-2xs space-y-1.5">
                <span className="text-[11px] font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center text-[10px] font-black">
                    2
                  </span>
                  <span>Pilih Rasa Ingin Tahu Khusus Tahap {stageTitle} (Tanya):</span>
                </span>
                <div className="space-y-1.5">
                  {curiosityOptions.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedCuriosity(c.id)}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        selectedCuriosity === c.id
                          ? 'bg-indigo-50 border-indigo-400 text-indigo-950 font-bold shadow-2xs ring-1 ring-indigo-300'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-indigo-50/40'
                      }`}
                    >
                      <span>{c.label}</span>
                      {selectedCuriosity === c.id && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Format Jawaban */}
              <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-purple-100 shadow-2xs space-y-1.5">
                <span className="text-[11px] font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-black">
                    3
                  </span>
                  <span>Pilih Format Penjelasan yang Diinginkan:</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {formatOptions.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setSelectedFormat(f.id)}
                      className={`text-left p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                        selectedFormat === f.id
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-2xs ring-1 ring-emerald-300'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-emerald-50/40'
                      }`}
                    >
                      <span>{f.label}</span>
                      {selectedFormat === f.id && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Prompt Editor & Send Box */}
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border-2 border-purple-200 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs font-black text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-purple-600" />
                <span>Prompt Rakitanmu untuk AI:</span>
              </label>

              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
                  detectedCount >= 3
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}
              >
                {detectedCount}/4 Formula R-K-T-F Lengkap
              </span>
            </div>

            <textarea
              rows={3}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Tuliskan atau sesuaikan pertanyaan eksplorasimu di sini..."
              className="w-full p-3 rounded-xl border-2 border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 text-xs sm:text-sm font-medium leading-relaxed resize-none transition-all outline-hidden text-slate-800"
            />

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
              <span className="text-[11px] text-slate-500 font-medium">
                Tip: Makin lengkap formulanya, makin akurat dan memukau penjelasan rahasia materi yang kamu dapatkan!
              </span>

              <button
                type="button"
                onClick={() => handleSendPrompt()}
                disabled={isLoading || !promptText.trim()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-indigo-700 active:scale-95 text-white font-black text-xs sm:text-sm transition-all shadow-md shadow-purple-500/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                {isLoading ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin text-white" />
                    <span>Menganalisis & Menggali Materi...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-amber-300" />
                    <span>Tantang AI & Buka Rahasia Materi 🚀</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Result Card & Direct Action into Answer */}
          {evaluation && (
            <div className="space-y-4 pt-2 border-t-2 border-purple-100 animate-in fade-in duration-300">
              {/* Score & Feedback Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-50/90 via-white to-purple-50/90 border-2 border-indigo-200 shadow-2xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center font-black text-base shadow-xs shrink-0">
                      {evaluation.promptScore}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-black text-slate-900 uppercase">
                          Skor Ketajaman Prompt
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-extrabold border border-indigo-200">
                          {evaluation.promptLevel}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                        {evaluation.coachFeedback}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyMaterial}
                    className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                    <span>{copied ? 'Tersalin!' : 'Salin Semua'}</span>
                  </button>
                </div>

                {/* Boosted Prompt Tip */}
                {evaluation.boostedPrompt && (
                  <div className="p-2.5 rounded-xl bg-purple-50/80 border border-purple-200 text-xs text-purple-900 font-medium">
                    <span className="font-bold text-purple-950 block text-[10px] uppercase tracking-wide">
                      💡 Versi Prompt Makin Tajam:
                    </span>
                    <span className="italic">“{evaluation.boostedPrompt}”</span>
                  </div>
                )}
              </div>

              {/* Detailed Material Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* 1. Konsep Utama */}
                <div className="p-3.5 rounded-2xl bg-white border-2 border-blue-100 shadow-2xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-blue-900 font-black">
                    <span>🌟</span>
                    <span>Konsep Inti Terkait Materi:</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {evaluation.fullExplanation.conceptIntro}
                  </p>
                </div>

                {/* 2. Rahasia Penyelidikan */}
                <div className="p-3.5 rounded-2xl bg-white border-2 border-indigo-100 shadow-2xs space-y-1.5">
                  <div className="flex items-center gap-1.5 text-indigo-900 font-black">
                    <span>🔍</span>
                    <span>Rahasia Sains & Matematika Objek:</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {evaluation.fullExplanation.curiosityAnswer}
                  </p>
                </div>

                {/* 3. Komponen / Jenis Penting */}
                {evaluation.fullExplanation.typesAndClassification &&
                  evaluation.fullExplanation.typesAndClassification.length > 0 && (
                    <div className="p-3.5 rounded-2xl bg-white border-2 border-emerald-100 shadow-2xs space-y-1.5">
                      <div className="flex items-center gap-1.5 text-emerald-900 font-black">
                        <span>🏷️</span>
                        <span>Komponen / Pola / Klasifikasi:</span>
                      </div>
                      <ul className="space-y-1 text-slate-700 font-medium list-disc list-inside">
                        {evaluation.fullExplanation.typesAndClassification.map((item, idx) => (
                          <li key={idx} className="leading-snug">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* 4. Analogi Seru */}
                {evaluation.fullExplanation.funAnalogy && (
                  <div className="p-3.5 rounded-2xl bg-white border-2 border-amber-100 shadow-2xs space-y-1.5">
                    <div className="flex items-center gap-1.5 text-amber-900 font-black">
                      <span>🦸</span>
                      <span>Analogi Seru Ramah Anak:</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-medium italic">
                      “{evaluation.fullExplanation.funAnalogy}”
                    </p>
                  </div>
                )}
              </div>

              {/* Crucial Action: Apply findings directly into the student challenge answer */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border-2 border-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
                <div className="space-y-0.5 text-left">
                  <span className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Lengkapi Jawaban Tantangan Langkah {stepNumber}:</span>
                  </span>
                  <p className="text-[11px] text-emerald-800 font-medium">
                    Klik tombol ini untuk memasukkan temuan AI di atas langsung ke kotak jawaban tantanganmu di bawah!
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleInsertFindingsIntoAnswer}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-200" />
                  <span>✨ Masukkan Temuan AI ke Jawaban Langkah {stepNumber}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
