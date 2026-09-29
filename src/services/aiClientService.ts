import {
  LearningMission,
  AILearningBridgeResult,
  StudentActivitySession,
  PresentationSlide,
  PeerQuestion,
  StudentPromptEvaluation
} from '../types';
import { getDefaultAvatar } from '../data/avatarData';
import { GoogleGenAI } from '@google/genai';
import { compressImageDataUrl } from '../utils/imageCompressor';

export function getClientApiKey(): string {
  try {
    const key =
      localStorage.getItem('narasa_school_gemini_key') ||
      localStorage.getItem('school_gemini_api_key') ||
      localStorage.getItem('gemini_api_key') ||
      (import.meta.env.VITE_GEMINI_API_KEY as string) ||
      (import.meta.env.GEMINI_API_KEY as string) ||
      (typeof process !== 'undefined' ? (process.env?.VITE_GEMINI_API_KEY || process.env?.GEMINI_API_KEY || process.env?.GOOGLE_GENAI_API_KEY || process.env?.GOOGLE_API_KEY) : '') ||
      '';
    if (key && key.trim() !== '' && key !== 'MY_GEMINI_API_KEY') {
      return key.trim();
    }
  } catch (e) {}
  return '';
}

function getAuthHeaders() {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  try {
    const customKey = getClientApiKey();
    if (customKey) {
      headers['x-school-gemini-key'] = customKey;
    }
  } catch (e) {}
  return headers;
}

/**
 * Direct Client-Side Gemini Vision Analysis Fallback.
 * Specifically handles Vercel Serverless constraints (4.5MB payload limits, 10s execution limits, or missing backend rewrites).
 */
async function generateClientDirectVisionAnalysis(
  compressedImage: string,
  mission: LearningMission,
  objectHint?: string
): Promise<AILearningBridgeResult | null> {
  const apiKey = getClientApiKey();
  if (!apiKey) return null;

  const ai = new GoogleGenAI({ apiKey });
  const prompt = `Anda adalah AI Learning Bridge di aplikasi "NARASA AI: Foto Apa Saja. Bangun Penalaran." untuk siswa SD di Indonesia.
Guru telah menentukan misi pembelajaran berikut:
- Mata Pelajaran: ${mission.subject}
- Materi: ${mission.material}
- Capaian Pembelajaran (CP): ${mission.cp}
- Tujuan Pembelajaran (TP): ${mission.tp}
- Indikator: ${(mission.indicators || []).join('; ')}
- Target Kompetensi: ${mission.targetCompetency} (literasi / numerasi / both)
- Level Kognitif: ${mission.cognitiveLevel} (C1-C6)
- Strict Curriculum Mode: ${mission.strictCurriculumMode ? 'AKTIF (Wajib disiplin kurikulum)' : 'FLEKSIBEL'}

Informasi Objek / Hasil Temuan Mandiri Siswa:
"${objectHint || 'Objek Pengamatan Nyata'}"

Tugas Anda:
1. Olah informasi objek dan hasil temuan mandiri murid yang tampak pada foto atau keterangan di atas.
2. Tentukan kompatibilitas hubungan objek yang dilaporkan dengan materi guru: "Strong", "Moderate", atau "Weak".
3. Rancang "Yang Saya Lihat" (observation).
4. Rancang "Hubungannya dengan Pelajaran" (learningBridge konkret menghubungkan objek temuan murid dengan materi guru).
5. Buat "simpleMaterialSummary" (Ringkasan Materi Lengkap & Jelas sebagai Modal Belajar Murid SD Fase B/C):
   - 📌 **Pengertian & Konsep Inti**
   - 🏷️ **Jenis-Jenis / Bagian Utama**
   - 🔍 **Ciri-Ciri & Contoh Nyata**
   - 💡 **Modal Belajar & Tips Mengingat**
6. Tentukan Taksonomi SOLO ("soloTaxonomyLevel": "Uni-structural"|"Multi-structural"|"Relational"|"Extended Abstract") dan "soloDescription".
7. Buat 2 pertanyaan pematik ("guidingQuestions").
8. Rancang 4 Pertanyaan Eksplorasi Terstruktur mengikuti 4 Pilar Berpikir Komputasional (decomposition, pattern_recognition, abstraction, algorithmic_thinking) dengan 4 tingkat scaffolding ramah anak SD.

Kembalikan HANYA format JSON valid tanpa tanda kutip markdown, sesuai skema:
{
  "detectedObject": "nama objek yang teridentifikasi",
  "compatibility": "Strong",
  "compatibilityReason": "penjelasan kualitas hubungan objek dengan materi",
  "observation": "penjelasan apa yang dilaporkan murid beserta analisis visual logis dari AI",
  "context": "konteks situasi di lingkungan sekolah/anak",
  "learningBridge": "penjelasan jembatan konsep dari objek temuan murid menuju materi pelajaran guru",
  "simpleMaterialSummary": "📌 **Pengertian & Konsep Inti:**\\n...\\n\\n🏷️ **Jenis-Jenis / Bagian Utama:**\\n...\\n\\n🔍 **Ciri-Ciri & Contoh Nyata:**\\n...\\n\\n💡 **Modal Belajar & Tips Mengingat:**\\n...",
  "soloTaxonomyLevel": "Relational",
  "soloDescription": "penjelasan tingkat SOLO",
  "guidingQuestions": [
    "pertanyaan pematik 1 untuk murid",
    "pertanyaan pematik 2 untuk murid"
  ],
  "subject": "${mission.subject}",
  "material": "${mission.material}",
  "learningTarget": "${mission.tp}",
  "cognitiveLevel": "${mission.cognitiveLevel}",
  "questions": [
    {
      "id": "q-1",
      "stage": "decomposition",
      "title": "1. Dekomposisi (Membongkar Bagian Objek)",
      "question": "Yuk amati foto objekmu! Apa saja bagian-bagian atau benda penting yang kamu lihat di fotomu? Coba ceritakan apa fungsi atau peran masing-masing bagian tersebut!",
      "inputType": "text",
      "conceptTag": "Membongkar Bagian Objek (Dekomposisi)",
      "scaffolding": {
        "level1": "Petunjuk visual awal...",
        "level2": "Pertanyaan penuntun konsep...",
        "level3": "Langkah kecil menyusun jawaban...",
        "level4": "Analogi konkret dunia anak..."
      }
    },
    {
      "id": "q-2",
      "stage": "pattern_recognition",
      "title": "2. Pengenalan Pola (Menemukan Keteraturan)",
      "question": "Perhatikan lebih dekat foto objekmu! Adakah bentuk yang berulang, susunan yang berbaris rapi, atau keteraturan yang mirip dengan pelajaran kita? Ceritakan pola seru apa yang kamu temukan!",
      "inputType": "text",
      "conceptTag": "Menemukan Keteraturan (Pengenalan Pola)",
      "scaffolding": {
        "level1": "Petunjuk visual awal...",
        "level2": "Pertanyaan penuntun konsep...",
        "level3": "Langkah kecil menyusun jawaban...",
        "level4": "Analogi konkret dunia anak..."
      }
    },
    {
      "id": "q-3",
      "stage": "abstraction",
      "title": "3. Abstraksi (Memilih Hal yang Paling Penting)",
      "question": "Bayangkan kamu mau menceritakan rahasia benda di fotomu ke temanmu! Hal apa yang PALING PENTING dia ketahui untuk memahami pelajaran kita, dan detail apa yang cuma hiasan sehingga bisa diabaikan dulu?",
      "inputType": "text",
      "conceptTag": "Memilih Hal Penting (Abstraksi)",
      "scaffolding": {
        "level1": "Petunjuk visual awal...",
        "level2": "Pertanyaan penuntun konsep...",
        "level3": "Langkah kecil menyusun jawaban...",
        "level4": "Analogi konkret dunia anak..."
      }
    },
    {
      "id": "q-4",
      "stage": "algorithmic_thinking",
      "title": "4. Berpikir Algoritma (Menyusun Langkah 1, 2, 3)",
      "question": "Sekarang giliranmu menyusun jurus langkah! Buatlah urutan langkah-langkah yang rapi dan teratur (Langkah 1, Langkah 2, Langkah 3...) yang bisa kamu atau temanmu ikuti untuk menyelesaikan tantangan ini dari awal sampai berhasil!",
      "inputType": "text",
      "conceptTag": "Menyusun Langkah 1, 2, 3 (Algoritma)",
      "scaffolding": {
        "level1": "Petunjuk visual awal...",
        "level2": "Pertanyaan penuntun konsep...",
        "level3": "Langkah kecil menyusun jawaban...",
        "level4": "Analogi konkret dunia anak..."
      }
    }
  ]
}`;

  const contents: any[] = [];
  if (compressedImage && compressedImage.startsWith('data:image/')) {
    const mimeMatch = compressedImage.match(/^data:([^;]+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const base64Data = compressedImage.replace(/^data:[^;]+;base64,/, '');
    contents.push({
      inlineData: {
        mimeType,
        data: base64Data
      }
    });
  }
  contents.push(prompt);

  const candidateModels = ['gemini-2.5-flash', 'gemini-3.1-flash-lite'];
  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3
        }
      });

      const text = response.text || '';
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        if (parsed && parsed.detectedObject && Array.isArray(parsed.questions) && parsed.questions.length >= 4) {
          return parsed as AILearningBridgeResult;
        }
      }
    } catch (err: any) {
      const msg = String(err?.message || '');
      if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota')) {
        throw new Error('QUOTA_EXCEEDED');
      }
      console.warn(`[Client Direct Gemini] Model ${model} failed, trying next:`, msg);
    }
  }

  return null;
}

export const AIClientService = {
  async analyzeImage(
    imageBase64OrUrl: string,
    mission: LearningMission,
    objectHint?: string
  ): Promise<AILearningBridgeResult> {
    // 1. Compress image to prevent Vercel 413 (Payload Too Large) and speed up transmission
    const compressedImage = await compressImageDataUrl(imageBase64OrUrl, 1024, 1024, 0.75);

    // 2. Try server route /api/analyze-vision first
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      const response = await fetch('/api/analyze-vision', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          imageBase64OrUrl: compressedImage,
          mission,
          objectHint
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.status === 429) {
        throw new Error('QUOTA_EXCEEDED');
      }

      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.includes('application/json')) {
        const data = await response.json();
        if (data && data.detectedObject) {
          return data as AILearningBridgeResult;
        }
      }
    } catch (err: any) {
      if (err.message === 'QUOTA_EXCEEDED') {
        throw err;
      }
      console.warn('[AIClientService] Server route /api/analyze-vision unavailable, attempting direct client SDK:', err);
    }

    // 3. Direct Client Gemini SDK Fallback (Runs purely in the browser, bypassing Vercel serverless limits)
    try {
      const clientResult = await generateClientDirectVisionAnalysis(compressedImage, mission, objectHint);
      if (clientResult) {
        return clientResult;
      }
    } catch (clientErr: any) {
      if (clientErr.message === 'QUOTA_EXCEEDED') {
        throw clientErr;
      }
      console.warn('[AIClientService] Direct client SDK fallback error:', clientErr);
    }

    // 4. Client-side domain pedagogical recovery fallback
    return {
        detectedObject: objectHint || 'Objek Pengamatan Nyata',
        compatibility: 'Strong',
        compatibilityReason: 'Objek berhasil diamati dan memiliki pola teratur yang dapat dihubungkan dengan misi guru.',
        observation: 'Objek teramati memiliki struktur yang teratur, pola hitung yang jelas, dan berada di sekitar lingkungan sekolah murid.',
        context: 'Aktivitas eksplorasi lingkungan sekolah.',
        learningBridge: `Objek ini menjadi sarana konkret untuk memahami konsep ${mission.material} melalui pengamatan langsung dan penalaran bertahap.`,
        simpleMaterialSummary: `📌 **Pengertian & Konsep Inti:**
Materi **${mission.material}** (${mission.subject}) membantu kita memahami bagaimana aturan, pola keteraturan, dan konsep ilmiah bekerja di dunia nyata di sekitar kita.

🏷️ **Jenis-Jenis / Komponen Utama:**
1. **Konsep Dasar & Struktur:** Memahami bagian-bagian penyusun, aturan hitung, atau sifat-sifat pokok materi.
2. **Kategori & Pengelompokan:** Membedakan ragam jenis atau bentuk sesuai kaidah pembelajaran.
3. **Penerapan Kontekstual:** Menghubungkan konsep teoritis dengan aksi pemecahan masalah nyata.

🔍 **Ciri-Ciri & Contoh Nyata:**
- **Karakteristik:** Memiliki pola keteraturan, data yang teramati, dan manfaat konkret bagi kehidupan sehari-hari.
- **Contoh Nyata:** Ditemukan pada benda, rutinitas, atau fenomena alam di lingkungan sekolah dan rumah.

💡 **Modal Belajar & Tips Mengingat Murid:**
- Amati objek dengan teliti dan hubungkan dengan materi yang dijelaskan guru.
- Gunakan 4 Langkah Berpikir Komputasional (Dekomposisi, Pengenalan Pola, Abstraksi, dan Algoritma) untuk memecahkan setiap tantangan!`,
        soloTaxonomyLevel: 'Relational',
        soloDescription: 'Siswa mampu menghubungkan temuan objek konkret di sekitar dengan konsep materi pembelajaran secara utuh.',
        guidingQuestions: [
          `Bagaimana karakteristik objek ${objectHint || 'yang kamu amati'} berkaitan dengan materi ${mission.material}?`,
          `Apa pertanyaan atau rasa penasaranmu saat mengamati objek ini di lingkungan sekitar?`
        ],
        subject: mission.subject,
        material: mission.material,
        learningTarget: mission.tp,
        cognitiveLevel: mission.cognitiveLevel,
        questions: [
          {
            id: 'q-fb-1',
            stage: 'decomposition',
            title: '1. Dekomposisi (Membongkar Bagian Objek)',
            question: `Yuk amati foto ${objectHint || 'objek yang kamu foto'} dengan teliti! Apa saja bagian-bagian atau benda penting yang kamu lihat menyusun ${objectHint || 'objek ini'}? Coba ceritakan apa fungsi atau peran masing-masing bagian tersebut!`,
            inputType: 'text',
            conceptTag: 'Membongkar Bagian Objek (Dekomposisi)',
            scaffolding: {
              level1: 'Amati foto dari atas ke bawah: sebutkan setidaknya 2 atau 3 bagian yang berbeda!',
              level2: 'Kaitkan bagian-bagian tersebut dengan materi pelajaran di kelas.',
              level3: 'Pecah jadi poin: 1) Bagian pertama adalah... fungsinya untuk..., 2) Bagian kedua...',
              level4: 'Seperti merakit mainan lego: setiap balok kecil punya tempat dan tugasnya sendiri!'
            }
          },
          {
            id: 'q-fb-2',
            stage: 'pattern_recognition',
            title: '2. Pengenalan Pola (Menemukan Keteraturan)',
            question: `Perhatikan lebih dekat foto ${objectHint || 'objek ini'}! Adakah bentuk yang berulang, pola susunan teratur, jadwal berkala, atau kemiripan dengan konsep ${mission.material}? Ceritakan pola menarik apa yang kamu temukan!`,
            inputType: 'text',
            conceptTag: 'Menemukan Keteraturan (Pengenalan Pola)',
            scaffolding: {
              level1: 'Cari hal yang berulang atau terjadi terus-menerus pada objek ini.',
              level2: 'Apakah bentuknya punya pola tertentu atau kejadian yang teratur?',
              level3: 'Tuliskan persamaan atau keteraturan yang kamu amati: "Polanya adalah..."',
              level4: 'Seperti detektif yang mencari petunjuk rahasia yang berulang!'
            }
          },
          {
            id: 'q-fb-3',
            stage: 'abstraction',
            title: '3. Abstraksi (Memilih Hal yang Paling Penting)',
            question: `Dari semua informasi yang ada pada foto ${objectHint || 'objek ini'}, informasi atau ciri mana yang paling penting untuk membantu kita memahami ${mission.material}, dan bagian mana yang cuma hiasan atau detail kecil yang bisa kita abaikan dulu?`,
            inputType: 'text',
            conceptTag: 'Memilih Hal Penting (Abstraksi)',
            scaffolding: {
              level1: 'Bayangkan kamu membuat sketsa cepat: bagian mana yang wajib digambar agar orang langsung tahu?',
              level2: 'Informasi apa yang paling penting untuk materi pelajaranmu?',
              level3: 'Sebutkan detail yang tidak terlalu penting (seperti warna latar atau goresan kecil) yang bisa diabaikan.',
              level4: 'Seperti peta rute: kita fokus pada jalan utamanya, bukan pohon di pinggir jalannya!'
            }
          },
          {
            id: 'q-fb-4',
            stage: 'algorithmic_thinking',
            title: '4. Berpikir Algoritma (Menyusun Langkah 1, 2, 3)',
            question: `Sekarang giliranmu menyusun jurus langkah! Buatlah urutan langkah-langkah yang rapi dan teratur (Langkah 1, Langkah 2, Langkah 3...) agar kamu atau temanmu bisa menyelesaikan tantangan atau memahami cara kerja ${objectHint || 'objek ini'} dari awal sampai berhasil!`,
            inputType: 'text',
            conceptTag: 'Menyusun Langkah 1, 2, 3 (Algoritma)',
            scaffolding: {
              level1: 'Tentukan langkah pertama yang harus dilakukan: "Langkah 1: Mulai dengan..."',
              level2: 'Lalu apa langkah berikutnya? Urutkan sampai tuntas dan berhasil.',
              level3: 'Tuliskan urutannya: Langkah 1: ..., Langkah 2: ..., Langkah 3: ...',
              level4: 'Seperti resep memasak yang runtut dari awal sampai makanan siap dinikmati!'
            }
          }
        ]
      };
  },

  async getScaffoldingHint(
    question: string,
    currentAnswer: string,
    currentLevel: number,
    mission: LearningMission
  ): Promise<string> {
    try {
      const response = await fetch('/api/scaffold-hint', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ question, currentAnswer, currentLevel, mission })
      });
      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.includes('application/json')) {
        const data = await response.json();
        return data.hint || 'Perhatikan kembali objek foto dan langkah dasar perhitunganmu.';
      }
    } catch (e) {
      console.warn('Scaffolding fallback used');
    }
    const fallbackHints = [
      'Petunjuk Kecil: Coba perhatikan lagi angka dan pola yang berulang pada foto objekmu.',
      'Pertanyaan Penuntun: Apakah kamu mencari angka persekutuan terkecil (KPK) atau pembagi terbesar (FPB)?',
      'Langkah Kecil: Tuliskan faktor atau kelipatannya satu per satu di kertas, lalu cari yang sama.',
      'Contoh Analog: Seperti dua katak yang melompat dengan langkah berbeda di garis yang sama.'
    ];
    return fallbackHints[Math.min(currentLevel - 1, 3)] || fallbackHints[0];
  },

  async generateAutoPresentation(session: StudentActivitySession): Promise<PresentationSlide[]> {
    try {
      const response = await fetch('/api/generate-presentation', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ studentSession: session })
      });
      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.includes('application/json')) {
        const data = await response.json();
        return data.slides;
      }
    } catch (e) {
      console.warn('Fallback presentation generator');
    }
    return session.presentation;
  },

  async polishSlide(
    title: string,
    content: string,
    notes: string,
    studentName?: string,
    schoolName?: string,
    className?: string
  ): Promise<{ polishedTitle: string; polishedContent: string; polishedNotes: string }> {
    try {
      const response = await fetch('/api/polish-slide', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ title, content, notes, studentName, schoolName, className })
      });
      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.includes('application/json')) {
        return await response.json();
      }
    } catch (e) {
      console.warn('Fallback polish');
    }
    return {
      polishedTitle: title,
      polishedContent: content.trim(),
      polishedNotes: notes || 'Bicaralah dengan percaya diri dan jelaskan dengan ramah.'
    };
  },

  async generatePeerQuestion(topic: string, context: string): Promise<PeerQuestion> {
    try {
      const response = await fetch('/api/peer-question', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ topic, context })
      });
      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.includes('application/json')) {
        const data = await response.json();
        return {
          id: `pq-${Date.now()}`,
          askerName: data.askerName || 'Gilang Ramadhan',
          avatar: getDefaultAvatar('student', 'male'),
          question: data.question,
          aiCoachHint: data.aiCoachHint,
          timestamp: 'Baru saja'
        };
      }
    } catch (e) {
      console.warn('Fallback peer question');
    }
    return {
      id: `pq-${Date.now()}`,
      askerName: 'Gilang Ramadhan',
      avatar: getDefaultAvatar('student', 'male'),
      question: 'Bagaimana kamu membuktikan jawabanmu agar teman-teman lain percaya?',
      aiCoachHint: 'Tunjukkan deret kelipatan atau langkah pembagian yang sudah kamu hitung di slide bukti.',
      timestamp: 'Baru saja'
    };
  },

  async refineStudentAnswer(params: {
    rawAnswer: string;
    stageId: string;
    stageTitle?: string;
    question?: string;
    objectName?: string;
    material?: string;
  }): Promise<{
    refinedAnswer: string;
    explanation: string;
    improvements: string[];
  }> {
    try {
      const response = await fetch('/api/refine-student-answer', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(params)
      });
      const contentType1 = response.headers.get('content-type') || '';
      if (response.ok && contentType1.includes('application/json')) {
        const data = await response.json();
        return {
          refinedAnswer: data.refinedAnswer || params.rawAnswer,
          explanation: data.explanation || 'Tulisanmu sudah dirapikan ejaannya tanpa mengubah makna aslimu.',
          improvements: Array.isArray(data.improvements) ? data.improvements : ['Ejaan dan tanda baca dirapikan']
        };
      }
    } catch (e) {
      console.warn('Fallback refine student answer:', e);
    }

    // Client-side quick fallback
    let refined = params.rawAnswer.trim();
    const replacements: [RegExp, string][] = [
      [/\bkarna\b/gi, 'karena'],
      [/\bkrn\b/gi, 'karena'],
      [/\bdgn\b/gi, 'dengan'],
      [/\byg\b/gi, 'yang'],
      [/\bbwt\b/gi, 'buat'],
      [/\bpke\b/gi, 'pakai'],
      [/\bpake\b/gi, 'pakai'],
      [/\blobang\b/gi, 'lubang'],
      [/\bbgt\b/gi, 'banget'],
      [/\bsdh\b/gi, 'sudah'],
      [/\budah\b/gi, 'sudah'],
      [/\bblm\b/gi, 'belum'],
      [/\btdk\b/gi, 'tidak'],
      [/\bngga\b/gi, 'tidak'],
      [/\bga\b/gi, 'tidak'],
      [/\bjg\b/gi, 'juga'],
      [/\btp\b/gi, 'tetapi'],
      [/\butk\b/gi, 'untuk']
    ];
    for (const [pattern, rep] of replacements) {
      refined = refined.replace(pattern, rep);
    }
    refined = refined.replace(/(^\s*|[.!?]\s+)([a-z])/g, (_, p1, p2) => p1 + p2.toUpperCase());
    if (refined.length > 0 && !/[.!?]$/.test(refined)) {
      refined += '.';
    }

    return {
      refinedAnswer: refined,
      explanation: 'Kakak Asisten sudah merapikan ejaan singkatan dan tanda baca kalimatmu. Ide dan maksud jawabanmu tetap 100% milikmu!',
      improvements: ['Merapikan ejaan singkatan kata', 'Menyesuaikan huruf kapital & tanda titik']
    };
  },

  async coachStudentPrompt(params: {
    studentPrompt: string;
    mission: LearningMission;
    objectHint?: string;
    photoObservation?: string;
  }): Promise<StudentPromptEvaluation> {
    try {
      const response = await fetch('/api/student-prompt-coach', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(params)
      });
      const contentType2 = response.headers.get('content-type') || '';
      if (response.ok && contentType2.includes('application/json')) {
        const data = await response.json();
        return data as StudentPromptEvaluation;
      }
    } catch (e) {
      console.warn('Network error calling student-prompt-coach, using client fallback:', e);
    }

    // Client-side instant fallback
    const pLower = params.studentPrompt.toLowerCase();
    const hasRole = /jadilah|sebagai|kamu adalah|guru|ilmuwan|detektif|pakar|ahli|sahabat|mentor/.test(pLower);
    const hasContext = /materi|jam|pohon|sampah|kpk|fpb|ekosistem|kelas|sekolah|foto|lingkungan|angka|pecahan/.test(pLower);
    const hasInquiry = /\?|mengapa|kenapa|bagaimana|rahasia|misteri|apa jadinya|kenapa bisa|apakah/.test(pLower);
    const hasFormat = /jelaskan|analogi|contoh|langkah|daftar|poin|cerita|eksperimen|tabel|singkat|tahap/.test(pLower);

    let score = 55;
    if (hasRole) score += 11;
    if (hasContext) score += 12;
    if (hasInquiry) score += 11;
    if (hasFormat) score += 11;

    return {
      studentPrompt: params.studentPrompt,
      promptScore: score,
      promptLevel: score >= 85 ? 'Master Prompter AI' : score >= 65 ? 'Penjelajah Gagasan' : 'Pemula Cilik',
      detectedComponents: {
        role: hasRole,
        context: hasContext,
        inquiry: hasInquiry,
        format: hasFormat
      },
      coachFeedback: 'Pertanyaan eksplorasimu sangat menarik! Terus gunakan formula Role-Context-Inquiry-Format agar AI menjawab dengan makin tajam dan seru!',
      boostedPrompt: `Jadilah Guru Ahli Sains & Matematika yang asyik. Saya sedang mengamati "${params.objectHint || 'objek sekitar'}" untuk materi "${params.mission.material}". ${params.studentPrompt}. Berikan penjelasan lengkap, analogi ramah anak, dan eksperimen mini yang bisa saya coba!`,
      fullExplanation: {
        conceptIntro: `Konsep ${params.mission.material} mengajarkan kita bagaimana keteraturan dan prinsip alam semesta bekerja di sekitar kita.`,
        curiosityAnswer: `Semua benda di sekitar kita, dari ${params.objectHint || 'objek fotomu'} hingga sistem tata surya, tunduk pada hukum keteraturan yang sangat indah dan bisa dipelajari!`,
        typesAndClassification: [
          'Komponen Pokok: Bagian penyusun utama yang membentuk sistem kerja materi.',
          'Kategori & Pola: Pengelompokan bentuk atau jenis yang sering kita temukan.',
          'Penerapan Nyata: Cara manusia memanfaatkan konsep ini untuk memudahkan kehidupan.'
        ],
        deepFacts: [
          'Keteraturan ini digunakan para ilmuwan untuk merancang jam atom, roket antariksa, hingga aplikasi komputer!',
          'Rasa ingin tahu yang kamu miliki saat ini adalah bibit awal dari seorang ilmuwan hebat di masa depan.'
        ],
        funAnalogy: 'Memahami materi ini seperti membuka kotak harta karun yang di dalamnya terdapat peta rahasia alam!',
        miniMission: 'Amati 3 benda berbeda di kelas atau rumahmu, lalu catat persamaan cara kerja mereka dengan konsep ini!',
        nextCuriosityQuestions: [
          'Mengapa para ilmuwan sangat menyukai pola berulang di alam semesta?',
          'Bagaimana cara membuktikan konsep ini kepada teman sekelas tanpa menggunakan rumus matematika yang rumit?'
        ]
      }
    };
  },

  /**
   * Generates AI Thinking Diagnosis report for a student profile
   */
  async generateStudentThinkingDiagnosis(
    profile: any,
    studentSessions: any[]
  ): Promise<{
    thinkingLevelTitle: string;
    soloTaxonomyLevel: string;
    strengthsSummary: string[];
    growthAreas: string[];
    pedagogicalActionForTeacher: string;
    parentNote: string;
  }> {
    const name = profile?.name || 'Murid';
    const litScore = profile?.overallLiteracy || 85;
    const reasScore = profile?.overallReasoning || 88;
    const numScore = profile?.overallNumeracy || 82;

    const isHigh = reasScore >= 85;
    const isMedium = reasScore >= 70;

    return {
      thinkingLevelTitle: isHigh
        ? `Tingkat Penalaran Relasional Tinggi & Berpikir Kritis Mahir (${reasScore}%)`
        : isMedium
        ? `Tingkat Penalaran Multi-Struktural Berkembang (${reasScore}%)`
        : `Tingkat Penalaran Uni-Struktural Perlu Bimbingan (${reasScore}%)`,
      soloTaxonomyLevel: isHigh ? 'Relational' : isMedium ? 'Multi-structural' : 'Uni-structural',
      strengthsSummary: [
        `${name} mahir mengidentifikasi objek konkret dan menguraikan bagian-bagian penyusunnya (Dekomposisi).`,
        `Mampu menghubungkan bukti visual dari foto dengan konsep materi pelajaran (${litScore}% literasi).`,
        `Memiliki rasa ingin tahu tinggi dan kemandirian dalam bernalar (${numScore}% numerasi & kuantitatif).`
      ],
      growthAreas: [
        `Perlu dibimbing dalam mengevaluasi efektivitas solusi yang dirancang (Level Kognitif C5).`,
        `Perlu pembiasaan menyusun kriteria pengujian ulang untuk memverifikasi kebenaran argumen.`
      ],
      pedagogicalActionForTeacher: `Rekomendasi Guru: Berikan tantangan pertanyaan pemantik bertingkat (C5-C6) pada Misi Pembelajaran berikutnya dan libatkan ${name} sebagai tutor sebaya (*peer-tutor*) di kelas.`,
      parentNote: `Catatan Orang Tua: Selamat! ${name} menunjukkan perkembangan berpikir kritis dan literasi yang sangat membanggakan. Dampingi ${name} untuk terus mengamati benda-benda unik di sekitar rumah!`
    };
  }
};
