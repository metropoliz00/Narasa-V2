export type UserRole = 'teacher' | 'student' | 'school_admin' | 'central_admin' | 'admin';

export interface Subject {
  id: string; // e.g., 'matematika'
  name: string; // e.g., 'Matematika'
}

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  gender?: 'male' | 'female';
  avatar: string;
  schoolName: string;
  schoolId: string;
  className: string;
  classId: string;
  email: string;
  status?: 'active' | 'inactive';
  nisnNip?: string;
  username?: string;
  password?: string;
  phone?: string;
  joinedDate?: string;
  isGroup?: boolean;
  groupId?: string;
  groupMembers?: string[];
  groupLeader?: string;
  groupMotto?: string;
}

export interface StudentGroup {
  id: string;
  name: string;
  schoolId: string;
  schoolName: string;
  classId: string;
  className: string;
  leaderId?: string;
  leaderName?: string;
  memberIds: string[];
  memberNames: string[];
  avatar: string;
  email: string;
  username?: string;
  password?: string;
  motto?: string;
  color?: string;
  createdAt: string;
  accountUserId: string; // Associated UserProfile.id
}

export type CognitiveLevel = 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6' | 'C4-C6';
export type TargetCompetency = 'literacy' | 'numeracy' | 'both';
export type CompatibilityLevel = 'Strong' | 'Moderate' | 'Weak';

export interface MissionFeatures {
  adaptiveDifficulty: boolean;
  scaffolding: boolean;
  reasoning: boolean;
  evidence: boolean;
  reflection: boolean;
  presentation: boolean;
  peerQuestion: boolean;
}

export interface LearningMission {
  id: string;
  idMapel: string; // ID Mapel untuk memisahkan tampilan setiap mapel
  title: string;
  grade: string;
  phase: string;
  subject: string;
  material: string;
  cp: string; // Capaian Pembelajaran
  tp: string; // Tujuan Pembelajaran
  indicators: string[];
  targetCompetency: TargetCompetency;
  cognitiveLevel: CognitiveLevel;
  strictCurriculumMode: boolean;
  features: MissionFeatures;
  description: string;
  isActive: boolean;
  createdAt: string;
  suggestedObjects?: string[];
}

export interface ScaffoldingLevels {
  level1: string; // Petunjuk kecil
  level2: string; // Pertanyaan penuntun
  level3: string; // Masalah dipecah menjadi langkah kecil
  level4: string; // Contoh analog sederhana
}

// 9-Step Standard Learning Flow for NARASA
// Objek nyata → Foto → NARASA AI → Masalah kontekstual → Murid berpikir → Scaffolding → Pemecahan masalah → Presentasi → Refleksi
export interface LearningWorkflowStep {
  id: string;
  stepNumber: number;
  title: string;
  shortTitle: string;
  badge: string;
  icon: string;
  category: 'Observasi' | 'AI & Konteks' | 'Penalaran' | 'Aksi & Berbagi';
  description: string;
  color: {
    bg: string;
    border: string;
    text: string;
    badgeBg: string;
    badgeText: string;
    ring: string;
  };
}

export const LEARNING_WORKFLOW_STEPS: LearningWorkflowStep[] = [
  {
    id: 'real_object',
    stepNumber: 1,
    title: 'Objek Nyata',
    shortTitle: 'Objek Nyata',
    badge: '1. Objek Nyata',
    icon: '🔍',
    category: 'Observasi',
    description: 'Mengamati dan memilih benda atau fenomena konkret nyata di lingkungan sekitar sekolah/rumah.',
    color: {
      bg: 'bg-amber-50/90',
      border: 'border-amber-200/90',
      text: 'text-amber-950',
      badgeBg: 'bg-amber-100/90',
      badgeText: 'text-amber-800',
      ring: 'ring-amber-300'
    }
  },
  {
    id: 'photo',
    stepNumber: 2,
    title: 'Foto',
    shortTitle: 'Foto',
    badge: '2. Foto',
    icon: '📸',
    category: 'Observasi',
    description: 'Mengambil atau mengunggah foto jelas dari objek nyata yang sedang diamati.',
    color: {
      bg: 'bg-orange-50/90',
      border: 'border-orange-200/90',
      text: 'text-orange-950',
      badgeBg: 'bg-orange-100/90',
      badgeText: 'text-orange-800',
      ring: 'ring-orange-300'
    }
  },
  {
    id: 'narasa_ai',
    stepNumber: 3,
    title: 'NARASA AI',
    shortTitle: 'NARASA AI',
    badge: '3. NARASA AI',
    icon: '✨',
    category: 'AI & Konteks',
    description: 'Pemindaian visual cerdas untuk menganalisis objek, mendeteksi materi, dan membangun jembatan belajar.',
    color: {
      bg: 'bg-sky-50/90',
      border: 'border-sky-200/90',
      text: 'text-sky-950',
      badgeBg: 'bg-sky-100/90',
      badgeText: 'text-sky-800',
      ring: 'ring-sky-300'
    }
  },
  {
    id: 'contextual_problem',
    stepNumber: 4,
    title: 'Masalah Kontekstual',
    shortTitle: 'Masalah Kontekstual',
    badge: '4. Masalah Kontekstual',
    icon: '🎯',
    category: 'AI & Konteks',
    description: 'Menemukan kaitan objek dengan masalah nyata di lingkungan, konsep materi pelajaran, & pertanyaan pemantik.',
    color: {
      bg: 'bg-blue-50/90',
      border: 'border-blue-200/90',
      text: 'text-blue-950',
      badgeBg: 'bg-blue-100/90',
      badgeText: 'text-blue-800',
      ring: 'ring-blue-300'
    }
  },
  {
    id: 'student_thinking',
    stepNumber: 5,
    title: 'Murid Berpikir',
    shortTitle: 'Murid Berpikir',
    badge: '5. Murid Berpikir',
    icon: '💡',
    category: 'Penalaran',
    description: 'Murid berpikir kritis membongkar bagian objek (Dekomposisi) & menemukan keteraturan (Pengenalan Pola).',
    color: {
      bg: 'bg-indigo-50/90',
      border: 'border-indigo-200/90',
      text: 'text-indigo-950',
      badgeBg: 'bg-indigo-100/90',
      badgeText: 'text-indigo-800',
      ring: 'ring-indigo-300'
    }
  },
  {
    id: 'scaffolding',
    stepNumber: 6,
    title: 'Scaffolding',
    shortTitle: 'Scaffolding',
    badge: '6. Scaffolding',
    icon: '📐',
    category: 'Penalaran',
    description: 'Bantuan tutor adaptif bertingkat 4 level (pemantik, konsep kunci, analogi, panduan langkah) saat murid butuh arahan.',
    color: {
      bg: 'bg-purple-50/90',
      border: 'border-purple-200/90',
      text: 'text-purple-950',
      badgeBg: 'bg-purple-100/90',
      badgeText: 'text-purple-800',
      ring: 'ring-purple-300'
    }
  },
  {
    id: 'problem_solving',
    stepNumber: 7,
    title: 'Pemecahan Masalah',
    shortTitle: 'Pemecahan Masalah',
    badge: '7. Pemecahan Masalah',
    icon: '⚙️',
    category: 'Penalaran',
    description: 'Menyaring intisari informasi (Abstraksi) & merancang rencana aksi solusi yang terstruktur (Algoritma).',
    color: {
      bg: 'bg-teal-50/90',
      border: 'border-teal-200/90',
      text: 'text-teal-950',
      badgeBg: 'bg-teal-100/90',
      badgeText: 'text-teal-800',
      ring: 'ring-teal-300'
    }
  },
  {
    id: 'presentation',
    stepNumber: 8,
    title: 'Presentasi',
    shortTitle: 'Presentasi',
    badge: '8. Presentasi',
    icon: '🎤',
    category: 'Aksi & Berbagi',
    description: 'Menyusun dan menampilkan slide presentasi interaktif hasil pemecahan masalah kepada guru dan teman sekelas.',
    color: {
      bg: 'bg-emerald-50/90',
      border: 'border-emerald-200/90',
      text: 'text-emerald-950',
      badgeBg: 'bg-emerald-100/90',
      badgeText: 'text-emerald-800',
      ring: 'ring-emerald-300'
    }
  },
  {
    id: 'reflection',
    stepNumber: 9,
    title: 'Refleksi',
    shortTitle: 'Refleksi',
    badge: '9. Refleksi',
    icon: '🌱',
    category: 'Aksi & Berbagi',
    description: 'Mengevaluasi pengalaman belajar, pemahaman konsep, tantangan, dan komitmen aksi tindak lanjut.',
    color: {
      bg: 'bg-rose-50/90',
      border: 'border-rose-200/90',
      text: 'text-rose-950',
      badgeBg: 'bg-rose-100/90',
      badgeText: 'text-rose-800',
      ring: 'ring-rose-300'
    }
  }
];

export type STEMStage =
  | 'decomposition' // 1. Memecah masalah
  | 'pattern_recognition' // 2. Mengenali pola
  | 'abstraction' // 3. Menyaring informasi penting
  | 'algorithmic_thinking' // 4. Membuat langkah sistematis
  | 'challenge'
  | 'reasoning'
  | 'evidence'
  | 'strategy';

export interface STEMStageDefinition {
  id: STEMStage;
  stepNumber: number;
  title: string;
  badge: string;
  iconName: string;
  description: string;
  guidingPrompt: string;
  criticalQuestions?: string[];
  placeholder: string;
  microcopy: string;
}

export const STEM_STAGES_CONFIG: STEMStageDefinition[] = [
  {
    id: 'decomposition',
    stepNumber: 1,
    title: 'Dekomposisi (Membongkar Bagian Objek)',
    badge: 'Dekomposisi',
    iconName: 'Layers',
    description: 'Seperti membongkar balok mainan lego, kita pisahkan objek fotomu menjadi bagian-bagian yang lebih kecil agar mudah diselidiki fungsi dan perannya satu per satu.',
    guidingPrompt: 'Yuk amati fotomu baik-baik! Apa saja bagian-bagian atau benda penting yang tampak di fotomu? Coba ceritakan apa fungsi atau tugas masing-masing bagian itu!',
    criticalQuestions: [
      'Apa saja bagian atau elemen penyusun utama yang kamu lihat pada objek fotomu dari luar hingga ke dalam?',
      'Bagaimana bagian-bagian tersebut saling bekerja sama? Apa yang akan terjadi jika salah satu bagian penting rusak atau hilang?',
      'Mengapa objek ini dirancang dengan bentuk dan bagian seperti itu dalam kehidupan nyata?'
    ],
    placeholder: 'Contoh:\n1) Bagian-bagian utama: ...\n2) Hubungan kerja & jika hilang: ...\n3) Alasan rancangan bentuknya: ...',
    microcopy: '🔍 Amati fotomu! Bongkar jadi bagian-bagian kecil seperti mainan balok agar mudah kamu pahami.'
  },
  {
    id: 'pattern_recognition',
    stepNumber: 2,
    title: 'Pengenalan Pola (Menemukan Keteraturan)',
    badge: 'Pengenalan Pola',
    iconName: 'LayoutGrid',
    description: 'Menjadi detektif cilik! Kita cari tahu apakah ada bentuk yang berulang, susunan yang berbaris rapi, atau kejadian teratur yang mirip dengan materi pelajaran kita.',
    guidingPrompt: 'Perhatikan lagi fotomu lebih dekat! Adakah bentuk yang berulang, garis yang teratur, jadwal berkala, atau kemiripan dengan materi yang sedang kita pelajari? Ceritakan pola apa yang kamu temukan!',
    criticalQuestions: [
      'Pola susunan, bentuk berulang, simetri, atau keteraturan apa yang paling jelas terlihat pada fotomu?',
      'Bagaimana pola keteraturan pada objek ini membuktikan kaidah atau konsep dalam materi pelajaran kita?',
      'Jika objek ini diperbanyak atau digunakan di kondisi berbeda, apakah polanya akan tetap sama? Mengapa?'
    ],
    placeholder: 'Contoh:\n1) Pola yang saya temukan: ...\n2) Hubungan dengan materi pelajaran: ...\n3) Prediksi jika kondisi berubah: ...',
    microcopy: '🧩 Jadi detektif pola! Temukan rahasia keteraturan atau kesamaan yang tersembunyi pada fotomu.'
  },
  {
    id: 'abstraction',
    stepNumber: 3,
    title: 'Abstraksi (Memilih yang Paling Penting)',
    badge: 'Abstraksi',
    iconName: 'Filter',
    description: 'Pakai kacamata fokus detektif! Kita pilih informasi utama yang paling penting untuk dipelajari, dan kita simpan atau abaikan dulu detail kecil (seperti hiasan atau debu) yang tidak terlalu berpengaruh.',
    guidingPrompt: 'Bayangkan kamu mau menceritakan rahasia benda di fotomu ke temanmu! Hal apa yang PALING PENTING dia ketahui untuk memahami pelajaran kita, dan detail apa yang cuma hiasan sehingga bisa diabaikan dulu?',
    criticalQuestions: [
      'Informasi atau ciri kunci apa yang PALING PENTING agar orang lain langsung mengerti fungsi dan konsep objek ini?',
      'Detail atau hiasan apa (seperti warna cat latar, bayangan, atau goresan debu) yang BISA DIABAIKAN dulu karena tidak mempengaruhi cara kerja utamanya?',
      'Prinsip atau pelajaran berharga apa dari objek ini yang bisa kamu terapkan ke masalah atau benda lain?'
    ],
    placeholder: 'Contoh:\n1) Ciri paling penting (wajib): ...\n2) Detail yang bisa diabaikan dulu: ...\n3) Prinsip umum yang bisa diterapkan ke hal lain: ...',
    microcopy: '🎯 Pakai kacamata fokus! Ambil petunjuk utamanya saja, kesampingkan detail yang tidak terlalu penting.'
  },
  {
    id: 'algorithmic_thinking',
    stepNumber: 4,
    title: 'Berpikir Algoritma (Menyusun Rencana Solusi)',
    badge: 'Berpikir Algoritma',
    iconName: 'ListOrdered',
    description: 'Menjadi kapten pembuat rencana! Kita susun urutan langkah yang jelas dan runtut seperti resep makanan yang lezat agar kamu atau temanmu bisa menyelesaikan tantangan dengan sukses.',
    guidingPrompt: 'Sekarang giliranmu membuat petunjuk aksi! Susunlah urutan yang rapi dan teratur yang bisa diikuti untuk memahami atau memanfaatkan objek fotomu dari awal sampai selesai!',
    criticalQuestions: [
      'Bagaimana urutan instruksi yang paling runtut dan logis untuk memanfaatkan atau membuktikan cara kerja objek ini?',
      'Bagian mana yang paling krusial/penting dan rentan keliru? Apa yang harus diperiksa agar rencana tidak gagal?',
      'Bagaimana caramu membuktikan bahwa urutan rencana yang kamu buat adalah cara yang paling praktis dan efektif?'
    ],
    placeholder: 'Mulai dengan ...\nLalu lakukan ...\nPeriksa hasil akhir & pastikan ...',
    microcopy: '📋 Susun rencana aksimu! Buat petunjuk terstruktur yang runtut dan mudah dipraktikkan siapa saja.'
  }
];

export interface ExplorationQuestion {
  id: string;
  stage: STEMStage;
  title: string;
  question: string;
  criticalQuestions?: string[];
  subtext?: string;
  placeholder?: string;
  inputType: 'text' | 'number' | 'choice';
  options?: string[];
  scaffolding: ScaffoldingLevels;
  conceptTag: string;
}

export interface AILearningBridgeResult {
  detectedObject: string;
  compatibility: CompatibilityLevel;
  compatibilityReason: string;
  observation: string; // 👁️ Yang Saya Lihat
  context: string;
  learningBridge: string; // 🔗 Hubungannya dengan Pelajaran
  explanation?: string; // Legacy alias
  criticalQuestion?: string; // Legacy alias
  simpleMaterialSummary?: string; // 📖 Ringkasan Materi Sederhana untuk Murid
  soloTaxonomyLevel?: 'Pre-structural' | 'Uni-structural' | 'Multi-structural' | 'Relational' | 'Extended Abstract'; // 🎯 Taksonomi SOLO Eksplorasi
  soloDescription?: string; // Penjelasan level pemahaman SOLO
  guidingQuestions: string[]; // 💡 Pertanyaan Pematik untuk Murid
  subject: string; // 📚 Materi
  material: string;
  learningTarget: string; // 🎯 Target Belajar
  cognitiveLevel: CognitiveLevel;
  questions: ExplorationQuestion[];
  alternativeContextSuggestion?: string;
}

export interface PresentationSlide {
  id: string;
  slideNumber: number;
  title: string;
  subtitle?: string;
  content: string;
  bullets?: string[];
  image?: string;
  speakingNotes: string; // 🎙️ Bantuan Berbicara
  speakerNotes?: string; // Compatibility alias
  layout: 'title' | 'split-photo' | 'observation' | 'reasoning' | 'solution' | 'reflection' | 'conclusion' | 'decomposition' | 'pattern' | 'abstraction' | 'algorithm';
  keyHighlight?: string;
  supportVisualType?: 'decomposition' | 'pattern' | 'abstraction' | 'algorithm' | 'reflection' | 'summary' | 'photo';
  badge?: string;
  tags?: string[];
  stageId?: string;
}

export interface PeerQuestion {
  id: string;
  askerName: string;
  avatar: string;
  question: string;
  presenterAnswer?: string;
  aiCoachHint?: string;
  timestamp: string;
}

export interface StudentAnswers {
  // 9-Step Learning Workflow: Langkah 5 & 7
  studentThinking?: string; // Langkah 5: Murid Berpikir
  problemSolving?: string; // Langkah 7: Pemecahan Masalah

  // 4 Pola Berpikir Komputasional
  decomposition?: string;
  patternRecognition?: string;
  abstraction?: string;
  algorithmicThinking?: string;

  // Compatibility fields
  challengeAnswer?: string;
  reason?: string;
  evidence?: string;
  strategy?: string;
  conclusion?: string;
  [key: string]: any;
}

export type LearningBridgeResult = AILearningBridgeResult;

export interface StudentReflection {
  q1Found: string; // Apa yang kamu temukan?
  q2Learned: string; // Apa yang kamu pelajari?
  q3Hardest: string; // Bagian mana yang paling sulit?
  q4Solved: string; // Bagaimana kamu menyelesaikannya?
  q5Improvement: string; // Apa yang akan kamu lakukan lebih baik berikutnya?
}

export interface StepFeedbackItem {
  stepNumber: number; // 1 s/d 9
  stepName: string; // e.g. "Langkah 5: Murid Berpikir (Dekomposisi & Pola)"
  feedback: string; // Catatan koreksi & bimbingan guru
  reinforcement: string; // Penguatan positif / pujian guru (Teacher Affirmation)
  score?: number; // Nilai langkah (0-100)
  badgeAwarded?: string; // e.g. 'Bintang Penalaran Kritis 🌟', 'Penemu Pola Handal 🔍', 'Master Algoritma ⚙️'
  teacherName: string;
  teacherAvatar?: string;
  gradedAt: string;
}

export interface TeacherMissionFeedback {
  id?: string;
  sessionId: string;
  studentId: string;
  studentName: string;
  missionId?: string;
  overallScore: number; // 0 - 100
  predicate: 'Sangat Mahir' | 'Mahir' | 'Cakap' | 'Perlu Bimbingan';
  overallFeedback: string; // Ulasan & umpan balik umum guru
  overallReinforcement: string; // Kalimat penguatan motivasi utama dari guru
  stepFeedbacks: Record<number, StepFeedbackItem>; // stepNumber (1..9) -> detail feedback langkah
  badgeReward?: string; // Apresiasi lencana/bintang khusus
  teacherId?: string;
  teacherName: string;
  teacherAvatar?: string;
  status: 'reviewed' | 'needs_revision' | 'completed';
  updatedAt: string;
}

export interface StudentActivitySession {
  id: string;
  missionId: string;
  missionTitle: string;
  subject: string;
  studentId: string;
  studentName: string;
  image: string;
  imageLabel: string;
  learningBridge: AILearningBridgeResult;
  answers: StudentAnswers;
  scaffoldingHistory: {
    questionId: string;
    level: 1 | 2 | 3 | 4;
    hintText: string;
    requestedAt: string;
  }[];
  reflection: StudentReflection;
  presentation: PresentationSlide[];
  peerQuestions: PeerQuestion[];
  completedAt: string;
  status: 'draft' | 'completed';
  metrics: {
    literacyScore: number;
    numeracyScore: number;
    reasoningScore: number;
    scaffoldingUsedCount: number;
  };
  teacherFeedback?: TeacherMissionFeedback; // Umpan balik & penguatan terintegrasi guru
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  color: string;
}

export interface StudentProgressProfile {
  studentId: string;
  name: string;
  className: string;
  activitiesCount: number;
  explorationsCount: number;
  presentationsCount: number;
  reflectionsCount: number;
  scaffoldingCount: number;
  literacyProgress: {
    locate: number; // Menemukan informasi
    understand: number; // Memahami
    interpret: number; // Interpretasi
    infer: number; // Inferensi
    evaluate: number; // Evaluasi
    argument: number; // Argumentasi/Alasan
    communicate: number; // Komunikasi
  };
  numeracyProgress: {
    identify: number; // Info kuantitatif
    represent: number; // Representasi
    calculate: number; // Perhitungan
    apply: number; // Penerapan
    strategy: number; // Strategi
    reason: number; // Penalaran
    evaluate: number; // Evaluasi
    communicate: number; // Komunikasi matematis
  };
  overallLiteracy: number;
  overallNumeracy: number;
  overallReasoning: number;
  overallCommunication: number;
  recentBadges: string[];
}

export interface TeacherInsight {
  id: string;
  title: string;
  type: 'strength' | 'need_scaffold' | 'pedagogical_tip';
  content: string;
  evidenceData: string;
  targetMissions: string[];
  actionRecommendation: string;
}

export interface AssessmentRecord {
  id: string;
  studentId: string;
  studentName: string;
  type: 'pre' | 'post';
  literacyScore: number;
  numeracyScore: number;
  reasoningScore: number;
  date: string;
  notes: string;
}

export type QuizQuestionType = 'single_choice' | 'multiple_choice' | 'true_false' | 'essay';

export interface QuizQuestionOption {
  id: string;
  text: string;
}

export interface TrueFalseStatement {
  id: string; // e.g. "s1", "s2", "s3"
  statement: string; // Teks pernyataan penalaran kritis
  correctAnswer: boolean; // true = Benar, false = Salah
}

export interface QuizQuestion {
  id: string;
  questionType?: QuizQuestionType; // 'single_choice' | 'multiple_choice' | 'true_false' | 'essay'
  question: string;
  scenario?: string; // Teks konteks / skenario singkat
  stimulusText?: string; // Teks wacana / bacaan literasi-numerasi berpikir kritis
  image?: string; // Gambar atau foto konteks nyata
  showImage?: boolean; // Sakelar/pengaturan apakah gambar soal ditampilkan (default: true)
  options?: QuizQuestionOption[]; // Untuk single_choice dan multiple_choice
  correctOptionId?: string; // Untuk single_choice
  correctOptionIds?: string[]; // Untuk multiple_choice (Pilihan Ganda Kompleks)
  correctBooleanAnswer?: boolean; // Untuk true_false tunggal (kompatibilitas)
  statements?: TrueFalseStatement[]; // Untuk soal Benar/Salah: 1 pertanyaan dengan 3 pernyataan
  essayRubric?: string; // Panduan rubrik koreksi guru
  sampleAnswer?: string; // Kunci jawaban acuan / poin penalaran penting
  maxScore?: number; // Skor maksimal soal uraian
  criticalThinkingSkill?: string; // Misal: Analisis Bukti Visual, Sintesis Solusi, Penalaran Sebab-Akibat
  competencyType: 'literacy' | 'numeracy' | 'reasoning' | 'both';
  cognitiveLevel: 'C3' | 'C4' | 'C5' | 'C6';
  soloTaxonomyLevel?: 'Pre-structural' | 'Uni-structural' | 'Multi-structural' | 'Relational' | 'Extended Abstract';
  soloDescription?: string;
  conceptTag: string;
  explanation: string;
}

export interface ConceptQuiz {
  id: string;
  missionId?: string;
  title: string;
  subject: string;
  grade: string;
  phase: string;
  topic: string;
  description: string;
  durationMinutes: number;
  targetCompetency: TargetCompetency;
  passingScore: number;
  totalQuestions: number;
  questions: QuizQuestion[];
  isPublished: boolean;
  isAiGenerated?: boolean;
  contextImage?: string;
  showContextImage?: boolean; // Sakelar/pengaturan apakah gambar utama paket soal ditampilkan (default: true)
  createdAt: string;
}

export interface EssayGradingRecord {
  score: number; // Nilai yang diberikan guru
  maxScore: number; // Nilai maksimum soal
  feedback: string; // Catatan koreksi & umpan balik guru
  gradedAt: string;
  teacherName: string;
}

export interface QuizSubmission {
  id: string;
  quizId: string;
  quizTitle: string;
  subject: string;
  userId: string;
  userName: string;
  userAvatar: string;
  isGroup: boolean;
  groupMembers?: string[];
  className: string;
  classId: string;
  schoolName: string;
  schoolId: string;
  score: number; // 0 - 100
  objectiveScore?: number; // Nilai otomatis dari PG, PG Kompleks, Benar/Salah
  essayScore?: number; // Nilai manual dari koreksi guru
  correctCount: number;
  totalQuestions: number;
  literacyScore: number;
  numeracyScore: number;
  reasoningScore: number;
  predicate: 'Sangat Mahir' | 'Mahir' | 'Cakap' | 'Perlu Bimbingan';
  feedback: string;
  selectedAnswers: Record<string, any>; // questionId -> optionId | optionIds[] | boolean | string
  essayGrading?: Record<string, EssayGradingRecord>; // questionId -> detail koreksi guru
  hasEssay?: boolean; // Apakah ada soal uraian
  needsManualGrading?: boolean; // Menandai apakah menunggu koreksi guru
  isGradedByTeacher?: boolean; // Ditandai setelah guru menyimpan koreksi
  teacherFeedback?: string;
  essayAnswers?: Record<string, string>;
  completedAt: string;
  timeSpentSeconds: number;
}

// ==================== GROUP OBSERVATION RUBRIC & SCORES ====================
export interface ObservationRubricIndicators {
  participation: number; // 1-4: Keaktifan & Partisipasi dalam Diskusi
  collaboration: number; // 1-4: Kerjasama & Gotong Royong
  criticalThinking: number; // 1-4: Penalaran Kritis & Ide Solusi
  responsibility: number; // 1-4: Tanggung Jawab & Kontribusi Pembagian Tugas
  communication: number; // 1-4: Komunikasi & Sikap Menghargai Rekan
}

export interface MemberObservationScore {
  studentId: string;
  studentName: string;
  isLeader?: boolean;
  indicators: ObservationRubricIndicators;
  totalScore: number; // 0 - 100
  predicate: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Perlu Bimbingan';
  notes?: string;
}

export interface GroupObservationRecord {
  id: string;
  groupId: string;
  groupName: string;
  classId: string;
  className: string;
  teacherId: string;
  teacherName: string;
  missionId?: string;
  missionTitle?: string;
  activityTopic: string;
  date: string;
  groupCohesion: number; // 1-4: Kekompakan dan Dinamika Tim
  taskQuality: number; // 1-4: Kualitas & Ketercapaian Hasil Eksplorasi
  averageGroupScore: number; // 0-100 Rata-rata skor anggota
  groupNotes: string; // Catatan observasi guru untuk kelompok
  memberScores: MemberObservationScore[];
  createdAt: string;
}

// ==================== PRESENTATION ACCESS SETTING ====================
export type PresentationAccessMode = 'both' | 'group_only' | 'individual_only';

export interface PresentationSettings {
  mode: PresentationAccessMode; // 'both' | 'group_only' | 'individual_only'
  allowPeerQuestions: boolean;
  notesForStudents?: string;
  updatedAt: string;
}

// ==================== SCHOOL PROFILE & DATA SETTINGS ====================
export interface SchoolProfile {
  id: string; // e.g. 'SDN01'
  name: string; // 'SDN 01 Nusantara'
  npsn: string; // '20104050'
  level: string; // 'SD / MI'
  status: 'Negeri' | 'Swasta';
  accreditation: 'A (Unggul)' | 'B (Baik)' | 'C' | 'Belum Terakreditasi';
  curriculum: string; // 'Kurikulum Merdeka'
  headmaster: string; // 'Dra. Hj. Siti Nurjanah, M.Pd.'
  headmasterNip: string; // '197203151998032004'
  supervisorName?: string; // Pengawas Pembina Dinas
  supervisorNip?: string;
  phone: string; // '(021) 7890123'
  email: string; // 'sdn01nusantara@kemdikbud.go.id'
  website?: string; // 'https://sdn01nusantara.sch.id'
  address: string; // 'Jl. Pendidikan Merdeka No. 45'
  rtRw?: string; // '005/002'
  village?: string; // 'Menteng'
  district?: string; // 'Menteng'
  city: string; // 'Kota Jakarta Pusat'
  province: string; // 'DKI Jakarta'
  postalCode: string; // '10310'
  motto?: string; // 'Cerdas, Berkarakter, dan Berdaya Nalar Kritis'
  logoUrl?: string; // Logo sekolah
  academicYear: string; // '2024/2025'
  activeSemester: 'Ganjil' | 'Genap';
  category?: string; // 'Sekolah Penggerak' | 'Sekolah Rujukan'
  totalStudents?: number;
  totalTeachers?: number;
  classesList?: string[];
  updatedAt?: string;
}

// ==================== STUDENT EFFECTIVE PROMPTING & CURIOSITY STUDIO ====================
export interface StudentPromptEvaluation {
  id?: string;
  studentPrompt: string;
  promptScore: number; // 0 - 100
  promptLevel: 'Pemula Cilik' | 'Penjelajah Gagasan' | 'Master Prompter AI';
  detectedComponents: {
    role: boolean;
    context: boolean;
    inquiry: boolean;
    format: boolean;
  };
  coachFeedback: string;
  boostedPrompt: string;
  fullExplanation: {
    conceptIntro: string;
    curiosityAnswer: string;
    typesAndClassification: string[];
    deepFacts: string[];
    funAnalogy: string;
    miniMission: string;
    nextCuriosityQuestions: string[];
  };
  rawContentMarkdown?: string;
  createdAt?: string;
}

