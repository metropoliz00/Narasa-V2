import {
  UserProfile,
  LearningMission,
  StudentActivitySession,
  AchievementBadge,
  StudentProgressProfile,
  TeacherInsight,
  AssessmentRecord
} from "../types";
import {
  studentBoy1,
  studentBoy2,
  studentGirlHijab,
  studentGirlRibbon,
  teacherMale,
  teacherFemale,
  adminMale,
  adminFemale
} from "./avatarData";

export const INITIAL_SYSTEM_USERS: UserProfile[] = [
  {
    id: "user-student-1790230651893",
    name: "Rudi",
    role: "student",
    gender: "male",
    avatar: studentBoy1,
    schoolName: "UPT SD Negeri Remen 2",
    schoolId: "SDN01",
    className: "Kelas V-A",
    classId: "V-A",
    email: "rudi@narasa.id",
    status: "active",
    nisnNip: "12345",
    username: "12345",
    password: "123456",
    joinedDate: "Hari ini",
    isGroup: false,
    groupMembers: [],
  },
  // --- KELAS V-A ---
  {
    id: "user-student-1",
    name: "Adit Pratama",
    role: "student",
    gender: "male",
    avatar: studentBoy1,
    schoolName: "SDN 01 Nusantara",
    schoolId: "SDN01",
    className: "Kelas V-A",
    classId: "V-A",
    email: "aditpratama@siswa.sdn01.sch.id",
    status: "active",
    nisnNip: "0098451201",
    joinedDate: "Juli 2024",
  },
  {
    id: "user-student-2",
    name: "Siti Rahma",
    role: "student",
    gender: "female",
    avatar: studentGirlHijab,
    schoolName: "SDN 01 Nusantara",
    schoolId: "SDN01",
    className: "Kelas V-A",
    classId: "V-A",
    email: "sitirahma@siswa.sdn01.sch.id",
    status: "active",
    nisnNip: "0098451202",
    joinedDate: "Juli 2024",
  },
  {
    id: "user-student-va-3",
    name: "Ahmad Fauzi",
    role: "student",
    gender: "male",
    avatar: studentBoy2,
    schoolName: "SDN 01 Nusantara",
    schoolId: "SDN01",
    className: "Kelas V-A",
    classId: "V-A",
    email: "ahmadfauzi@siswa.sdn01.sch.id",
    status: "active",
    nisnNip: "0098451205",
    joinedDate: "Juli 2024",
  },
  {
    id: "user-student-va-4",
    name: "Dewi Lestari",
    role: "student",
    gender: "female",
    avatar: studentGirlRibbon,
    schoolName: "SDN 01 Nusantara",
    schoolId: "SDN01",
    className: "Kelas V-A",
    classId: "V-A",
    email: "dewilestari@siswa.sdn01.sch.id",
    status: "active",
    nisnNip: "0098451206",
    joinedDate: "Juli 2024",
  },
  {
    id: "user-student-va-5",
    name: "Rizky Hidayat",
    role: "student",
    gender: "male",
    avatar: studentBoy1,
    schoolName: "SDN 01 Nusantara",
    schoolId: "SDN01",
    className: "Kelas V-A",
    classId: "V-A",
    email: "rizkyhidayat@siswa.sdn01.sch.id",
    status: "active",
    nisnNip: "0098451207",
    joinedDate: "Juli 2024",
  },
  {
    id: "user-student-va-6",
    name: "Putri Ayu",
    role: "student",
    gender: "female",
    avatar: studentGirlHijab,
    schoolName: "SDN 01 Nusantara",
    schoolId: "SDN01",
    className: "Kelas V-A",
    classId: "V-A",
    email: "putriayu@siswa.sdn01.sch.id",
    status: "active",
    nisnNip: "0098451208",
    joinedDate: "Juli 2024",
  },
  {
    id: "user-student-va-7",
    name: "Dimas Saputra",
    role: "student",
    gender: "male",
    avatar: studentBoy2,
    schoolName: "SDN 01 Nusantara",
    schoolId: "SDN01",
    className: "Kelas V-A",
    classId: "V-A",
    email: "dimassaputra@siswa.sdn01.sch.id",
    status: "active",
    nisnNip: "0098451209",
    joinedDate: "Juli 2024",
  },
  {
    id: "user-student-va-8",
    name: "Maya Indah",
    role: "student",
    gender: "female",
    avatar: studentGirlRibbon,
    schoolName: "SDN 01 Nusantara",
    schoolId: "SDN01",
    className: "Kelas V-A",
    classId: "V-A",
    email: "mayaindah@siswa.sdn01.sch.id",
    status: "active",
    nisnNip: "0098451210",
    joinedDate: "Juli 2024",
  },
  {
    id: "user-student-va-9",
    name: "Bayu Nugroho",
    role: "student",
    gender: "male",
    avatar: studentBoy1,
    schoolName: "SDN 01 Nusantara",
    schoolId: "SDN01",
    className: "Kelas V-A",
    classId: "V-A",
    email: "bayunugroho@siswa.sdn01.sch.id",
    status: "active",
    nisnNip: "0098451211",
    joinedDate: "Juli 2024",
  },
  {
    id: "user-student-va-10",
    name: "Anisa Putri",
    role: "student",
    gender: "female",
    avatar: studentGirlHijab,
    schoolName: "SDN 01 Nusantara",
    schoolId: "SDN01",
    className: "Kelas V-A",
    classId: "V-A",
    email: "anisaputri@siswa.sdn01.sch.id",
    status: "active",
    nisnNip: "0098451212",
    joinedDate: "Juli 2024",
  },

  // --- KELAS V-B ---
  {
    id: "user-student-3",
    name: "Budi Santoso",
    role: "student",
    gender: "male",
    avatar: studentBoy2,
    schoolName: "SDN 01 Nusantara",
    schoolId: "SDN01",
    className: "Kelas V-B",
    classId: "V-B",
    email: "budisantoso@siswa.sdn01.sch.id",
    status: "active",
    nisnNip: "0098451203",
    joinedDate: "Juli 2024",
  },
  {
    id: "user-student-vb-2",
    name: "Rina Anggraini",
    role: "student",
    gender: "female",
    avatar: studentGirlHijab,
    schoolName: "SDN 01 Nusantara",
    schoolId: "SDN01",
    className: "Kelas V-B",
    classId: "V-B",
    email: "rinaanggraini@siswa.sdn01.sch.id",
    status: "active",
    nisnNip: "0098451301",
    joinedDate: "Juli 2024",
  },
  {
    id: "user-student-vb-3",
    name: "Farhan Pratama",
    role: "student",
    gender: "male",
    avatar: studentBoy1,
    schoolName: "SDN 01 Nusantara",
    schoolId: "SDN01",
    className: "Kelas V-B",
    classId: "V-B",
    email: "farhanpratama@siswa.sdn01.sch.id",
    status: "active",
    nisnNip: "0098451302",
    joinedDate: "Juli 2024",
  },
  {
    id: "user-student-vb-4",
    name: "Gita Gutawa",
    role: "student",
    gender: "female",
    avatar: studentGirlRibbon,
    schoolName: "SDN 01 Nusantara",
    schoolId: "SDN01",
    className: "Kelas V-B",
    classId: "V-B",
    email: "gitagutawa@siswa.sdn01.sch.id",
    status: "active",
    nisnNip: "0098451303",
    joinedDate: "Juli 2024",
  },
  {
    id: "user-student-vb-5",
    name: "Kevin Sanjaya",
    role: "student",
    gender: "male",
    avatar: studentBoy2,
    schoolName: "SDN 01 Nusantara",
    schoolId: "SDN01",
    className: "Kelas V-B",
    classId: "V-B",
    email: "kevinsanjaya@siswa.sdn01.sch.id",
    status: "active",
    nisnNip: "0098451304",
    joinedDate: "Juli 2024",
  },
  {
    id: "user-student-vb-6",
    name: "Larasati Dewi",
    role: "student",
    gender: "female",
    avatar: studentGirlHijab,
    schoolName: "SDN 01 Nusantara",
    schoolId: "SDN01",
    className: "Kelas V-B",
    classId: "V-B",
    email: "larasatidewi@siswa.sdn01.sch.id",
    status: "active",
    nisnNip: "0098451305",
    joinedDate: "Juli 2024",
  },
  {
    id: "user-student-vb-7",
    name: "Muhammad Iqbal",
    role: "student",
    gender: "male",
    avatar: studentBoy1,
    schoolName: "SDN 01 Nusantara",
    schoolId: "SDN01",
    className: "Kelas V-B",
    classId: "V-B",
    email: "muhammadiqbal@siswa.sdn01.sch.id",
    status: "active",
    nisnNip: "0098451306",
    joinedDate: "Juli 2024",
  },
  {
    id: "user-student-vb-8",
    name: "Nurul Huda",
    role: "student",
    gender: "female",
    avatar: studentGirlRibbon,
    schoolName: "SDN 01 Nusantara",
    schoolId: "SDN01",
    className: "Kelas V-B",
    classId: "V-B",
    email: "nurulhuda@siswa.sdn01.sch.id",
    status: "active",
    nisnNip: "0098451307",
    joinedDate: "Juli 2024",
  },

  // --- KELAS IV-A ---
  {
    id: "user-student-4",
    name: "Nabila Zahra",
    role: "student",
    gender: "female",
    avatar: studentGirlRibbon,
    schoolName: "SDN 01 Nusantara",
    schoolId: "SDN01",
    className: "Kelas IV-A",
    classId: "IV-A",
    email: "nabilazahra@siswa.sdn01.sch.id",
    status: "active",
    nisnNip: "0108451204",
    joinedDate: "Juli 2025",
  },
  {
    id: "user-student-iva-2",
    name: "Aris Munandar",
    role: "student",
    gender: "male",
    avatar: studentBoy1,
    schoolName: "SDN 01 Nusantara",
    schoolId: "SDN01",
    className: "Kelas IV-A",
    classId: "IV-A",
    email: "arismunandar@siswa.sdn01.sch.id",
    status: "active",
    nisnNip: "0108451401",
    joinedDate: "Juli 2025",
  },
  {
    id: "user-student-iva-3",
    name: "Bella Safira",
    role: "student",
    gender: "female",
    avatar: studentGirlHijab,
    schoolName: "SDN 01 Nusantara",
    schoolId: "SDN01",
    className: "Kelas IV-A",
    classId: "IV-A",
    email: "bellasafira@siswa.sdn01.sch.id",
    status: "active",
    nisnNip: "0108451402",
    joinedDate: "Juli 2025",
  },
  {
    id: "user-student-iva-4",
    name: "Candra Kirana",
    role: "student",
    gender: "male",
    avatar: studentBoy2,
    schoolName: "SDN 01 Nusantara",
    schoolId: "SDN01",
    className: "Kelas IV-A",
    classId: "IV-A",
    email: "candrakirana@siswa.sdn01.sch.id",
    status: "active",
    nisnNip: "0108451403",
    joinedDate: "Juli 2025",
  },
  {
    id: "user-student-iva-5",
    name: "Daffa Alfarizi",
    role: "student",
    gender: "male",
    avatar: studentBoy1,
    schoolName: "SDN 01 Nusantara",
    schoolId: "SDN01",
    className: "Kelas IV-A",
    classId: "IV-A",
    email: "daffaalfarizi@siswa.sdn01.sch.id",
    status: "active",
    nisnNip: "0108451404",
    joinedDate: "Juli 2025",
  },
  {
    id: "user-student-iva-6",
    name: "Evelyn Tan",
    role: "student",
    gender: "female",
    avatar: studentGirlRibbon,
    schoolName: "SDN 01 Nusantara",
    schoolId: "SDN01",
    className: "Kelas IV-A",
    classId: "IV-A",
    email: "evelyntan@siswa.sdn01.sch.id",
    status: "active",
    nisnNip: "0108451405",
    joinedDate: "Juli 2025",
  },
  {
    id: "user-student-iva-7",
    name: "Farel Prayoga",
    role: "student",
    gender: "male",
    avatar: studentBoy2,
    schoolName: "SDN 01 Nusantara",
    schoolId: "SDN01",
    className: "Kelas IV-A",
    classId: "IV-A",
    email: "farelprayoga@siswa.sdn01.sch.id",
    status: "active",
    nisnNip: "0108451406",
    joinedDate: "Juli 2025",
  },
  {
    id: "user-student-iva-8",
    name: "Hana Pertiwi",
    role: "student",
    gender: "female",
    avatar: studentGirlHijab,
    schoolName: "SDN 01 Nusantara",
    schoolId: "SDN01",
    className: "Kelas IV-A",
    classId: "IV-A",
    email: "hanapertiwi@siswa.sdn01.sch.id",
    status: "active",
    nisnNip: "0108451407",
    joinedDate: "Juli 2025",
  },
  {
    id: "user-student-5",
    name: "Rizki Pratama",
    role: "student",
    gender: "male",
    avatar: studentBoy1,
    schoolName: "SDN 02 Kenanga",
    schoolId: "SDN02",
    className: "Kelas V-A",
    classId: "V-A",
    email: "rizkipratama@siswa.sdn02.sch.id",
    status: "active",
    nisnNip: "0098451999",
    joinedDate: "Juli 2024",
  },
  {
    id: "user-teacher-1",
    name: "Pak Dedy, S.Pd.",
    role: "teacher",
    gender: "male",
    avatar: teacherMale,
    schoolName: "SDN 01 Nusantara",
    schoolId: "SDN01",
    className: "Guru Kelas V-A",
    classId: "V-A",
    email: "dedy.guru@sdn01nusantara.sch.id",
    status: "active",
    nisnNip: "198504122010011005",
    phone: "0812-3456-7890",
    joinedDate: "Januari 2020",
  },
  {
    id: "user-teacher-3",
    name: "Pak Hendra Wijaya, S.Pd.",
    role: "teacher",
    gender: "male",
    avatar: teacherMale,
    schoolName: "SDN 01 Nusantara",
    schoolId: "SDN01",
    className: "Guru Kelas IV-A",
    classId: "IV-A",
    email: "hendra.wijaya@sdn01nusantara.sch.id",
    status: "active",
    nisnNip: "199103152015031002",
    phone: "0815-5678-1234",
    joinedDate: "Agustus 2022",
  },
  {
    id: "user-school-admin-1",
    name: "Ibu Ratna, S.Kom.",
    role: "school_admin",
    gender: "female",
    avatar: adminFemale,
    schoolName: "SDN 01 Nusantara",
    schoolId: "SDN01",
    className: "Admin Sekolah • SDN 01 Nusantara",
    classId: "ALL",
    email: "admin.sdn01@narasa.id",
    status: "active",
    nisnNip: "198009182006042008",
    phone: "0811-2233-4455",
    joinedDate: "Januari 2019",
  },
  {
    id: "user-central-admin-1",
    name: "Pak Irfan Maulana, M.T.",
    role: "central_admin",
    gender: "male",
    avatar: adminMale,
    schoolName: "Pusat Data",
    schoolId: "CENTRAL",
    className: "Admin Pusat Nasional",
    classId: "ALL",
    email: "pusat@narasa.id",
    status: "active",
    nisnNip: "199302102019031001",
    username: "adminpusat",
    password: "admin123",
    phone: "0812-9988-7766",
    joinedDate: "Mei 2022",
  },
];


export const FREE_EXPLORATION_MISSION: LearningMission = {
  "id": "free-exploration",
  "idMapel": "semua",
  "title": "Eksplorasi Lingkungan Bebas (Bebas Potret Objek Apapun)",
  "grade": "Semua Kelas",
  "phase": "Fase A-F",
  "subject": "Eksplorasi Bebas",
  "material": "Integrasi Tematik Pancasila & Alam Sekitar",
  "cp": "Peserta didik mampu mengamati lingkungan sekitar dan mengidentifikasi fenomena sains, literasi, atau numerasi secara merdeka.",
  "tp": "Mengembangkan rasa ingin tahu dan keterampilan observasi kritis terhadap benda-benda di lingkungan sekolah dan alam.",
  "indicators": [
    "Mengamati objek fisik di sekitar dengan teliti",
    "Menghubungkan objek dengan konsep pembelajaran sains, literasi, atau matematika",
    "Menjelaskan fungsi atau ciri penting dari objek yang diamati"
  ],
  "targetCompetency": "both",
  "cognitiveLevel": "C4-C6",
  "strictCurriculumMode": false,
  "features": {
    "adaptiveDifficulty": true,
    "scaffolding": true,
    "reasoning": true,
    "evidence": true,
    "reflection": true,
    "presentation": true,
    "peerQuestion": true
  },
  "description": "Bebas potret objek apa saja di sekitarmu (tumbuhan, alat, bangunan, ubin, dll). AI NARASA akan mendeteksi objek secara otomatis dan mengaitkannya dengan topik kurikulum yang relevan.",
  "isActive": true,
  "createdAt": "2026-09-01",
  "suggestedObjects": [
    "Tumbuhan atau daun di halaman sekolah",
    "Benda-benda geometri atau pola ubin",
    "Alat peraga atau perkakas"
  ]
};

export const DEFAULT_MISSIONS: LearningMission[] = [
  {
    "id": "mission-kpk-fpb",
    "idMapel": "matematika",
    "title": "Misi 1: Eksplorasi Pola Interval & Keteraturan Berulang",
    "grade": "Kelas V",
    "phase": "Fase C",
    "subject": "Matematika",
    "material": "Kelipatan Persekutuan Terkecil (KPK) & Faktor Persekutuan Terbesar (FPB)",
    "cp": "Peserta didik dapat memahami dan menyelesaikan masalah penalaran yang berkaitan dengan kelipatan and faktor dalam konteks kehidupan sehari-hari.",
    "tp": "Menerapkan konsep KPK dan FPB untuk menyelesaikan masalah nyata terkait interval waktu berulang dan pembagian merata dengan strategi logis.",
    "indicators": [
      "Menemukan informasi kuantitatif berulang atau interval dari objek nyata di sekitar",
      "Menganalisis apakah situasi menuntut persekutuan kelipatan (KPK) atau pembagian faktor terbesar (FPB)",
      "Menyajikan alasan logis dan membuktikan hasil perhitungan secara terstruktur"
    ],
    "targetCompetency": "numeracy",
    "cognitiveLevel": "C4-C6",
    "strictCurriculumMode": true,
    "features": {
      "adaptiveDifficulty": true,
      "scaffolding": true,
      "reasoning": true,
      "evidence": true,
      "reflection": true,
      "presentation": true,
      "peerQuestion": true
    },
    "description": "Amati dan potret objek atau pola berulang di sekitarmu, seperti susunan ubin teratur, deret anak tangga dengan penanda langkah, atau jadwal kegiatan periodik untuk memahami konsep interval dan kelipatan (KPK).",
    "isActive": true,
    "createdAt": "2026-09-10",
    "suggestedObjects": [
      "Pola susunan anak tangga bertingkat",
      "Pola susunan paving block/keramik teratur",
      "Papan jadwal piket & waktu berkala"
    ]
  },
  {
    "id": "mission-kpk-fpb-2",
    "idMapel": "matematika",
    "title": "Misi 2: Pola Putaran Kipas Angin",
    "grade": "Kelas V",
    "phase": "Fase C",
    "subject": "Matematika",
    "material": "Kelipatan Persekutuan Terkecil (KPK) & Faktor Persekutuan Terbesar (FPB)",
    "cp": "Peserta didik dapat memahami dan menyelesaikan masalah penalaran yang berkaitan dengan kelipatan dan faktor dalam konteks kehidupan sehari-hari.",
    "tp": "Menerapkan konsep KPK dan FPB untuk menyelesaikan masalah nyata terkait interval waktu berulang dan pembagian merata dengan strategi logis.",
    "indicators": [
      "Menganalisis putaran berulang kipas angin dengan kecepatan konstan",
      "Menyusun rasio dan kelipatan putaran yang seimbang",
      "Membuktikan hasil hitung persekutuan putaran secara terperinci"
    ],
    "targetCompetency": "numeracy",
    "cognitiveLevel": "C4",
    "strictCurriculumMode": true,
    "features": {
      "adaptiveDifficulty": true,
      "scaffolding": true,
      "reasoning": true,
      "evidence": true,
      "reflection": true,
      "presentation": true,
      "peerQuestion": true
    },
    "description": "Temukan dan potret kipas angin yang berputar di ruang kelas atau lorong sekolah. Hitung jumlah baling-balingnya dan pergerakan konstan berulang untuk memvisualisasikan kelipatan putaran.",
    "isActive": false,
    "createdAt": "2026-09-11",
    "suggestedObjects": [
      "Kipas angin dinding kelas",
      "Kipas angin langit-langit",
      "Baling-baling exhaust fan"
    ]
  },
  {
    "id": "mission-kpk-fpb-3",
    "idMapel": "matematika",
    "title": "Misi 3: Pembagian Ubin Kelas",
    "grade": "Kelas V",
    "phase": "Fase C",
    "subject": "Matematika",
    "material": "Kelipatan Persekutuan Terkecil (KPK) & Faktor Persekutuan Terbesar (FPB)",
    "cp": "Peserta didik dapat memahami dan menyelesaikan masalah penalaran yang berkaitan dengan kelipatan dan faktor dalam konteks kehidupan sehari-hari.",
    "tp": "Menerapkan konsep KPK dan FPB untuk menyelesaikan masalah nyata terkait interval waktu berulang dan pembagian merata dengan strategi logis.",
    "indicators": [
      "Mengidentifikasi pembagian area lantai kelas secara presisi menggunakan ubin",
      "Menghitung faktor persekutuan terbesar (FPB) dari ukuran panjang dan lebar lantai",
      "Menyimpulkan rancangan ubin ideal tanpa tersisa"
    ],
    "targetCompetency": "numeracy",
    "cognitiveLevel": "C5",
    "strictCurriculumMode": true,
    "features": {
      "adaptiveDifficulty": true,
      "scaffolding": true,
      "reasoning": true,
      "evidence": true,
      "reflection": true,
      "presentation": true,
      "peerQuestion": true
    },
    "description": "Temukan dan potret susunan ubin lantai persegi di dalam kelas atau lorong. Hitung bagaimana ubin-ubin tersebut membagi ruangan secara merata untuk memahami konsep faktor pembagi terbesar.",
    "isActive": false,
    "createdAt": "2026-09-12",
    "suggestedObjects": [
      "Ubin lantai kelas persegi",
      "Keramik tangga sekolah",
      "Paving block halaman depan"
    ]
  },
  {
    "id": "mission-kpk-fpb-4",
    "idMapel": "matematika",
    "title": "Misi 4: Susunan Kue Kantin",
    "grade": "Kelas V",
    "phase": "Fase C",
    "subject": "Matematika",
    "material": "Kelipatan Persekutuan Terkecil (KPK) & Faktor Persekutuan Terbesar (FPB)",
    "cp": "Peserta didik dapat memahami dan menyelesaikan masalah penalaran yang berkaitan dengan kelipatan dan faktor dalam konteks kehidupan sehari-hari.",
    "tp": "Menerapkan konsep KPK dan FPB untuk menyelesaikan masalah nyata terkait interval waktu berulang dan pembagian merata dengan strategi logis.",
    "indicators": [
      "Menganalisis pengelompokkan jenis jajanan pasar di nampan kantin sehat",
      "Menentukan jumlah piring saji maksimal yang dibutuhkan untuk membagi kue sama rata (FPB)",
      "Menyajikan visualisasi pembagian merata makanan"
    ],
    "targetCompetency": "numeracy",
    "cognitiveLevel": "C6",
    "strictCurriculumMode": true,
    "features": {
      "adaptiveDifficulty": true,
      "scaffolding": true,
      "reasoning": true,
      "evidence": true,
      "reflection": true,
      "presentation": true,
      "peerQuestion": true
    },
    "description": "Kunjungi kantin sekolah dan potret jajanan pasar atau kue yang diletakkan berjajar secara rapi di nampan. Amati bagaimana kue tersebut dikelompokkan secara merata untuk mempelajari FPB.",
    "isActive": false,
    "createdAt": "2026-09-13",
    "suggestedObjects": [
      "Kue donat di piring saji",
      "Lemper di nampan mika",
      "Pastel goreng di baki kantin"
    ]
  },
  {
    "id": "mission-ipas-ekosistem",
    "idMapel": "ipas",
    "title": "Misi 1: Menemukan Produsen Hijau",
    "grade": "Kelas V",
    "phase": "Fase C",
    "subject": "IPAS",
    "material": "Ekosistem dan Keseimbangan Alam di Sekitar Kita",
    "cp": "Peserta didik menyelidiki bagaimana hubungan saling ketergantungan antara komponen biotik dan abiotik membentuk keseimbangan ekosistem.",
    "tp": "Menganalisis peran objek di lingkungan sekolah dalam mendukung kehidupan makhluk hidup dan mengajukan argumen berbasis bukti visual.",
    "indicators": [
      "Mengidentifikasi komponen produsen biotik pada tanaman hijau yang difoto",
      "Menjelaskan peran klorofil dan fotosintesis dalam rantai makanan sekolah",
      "Menyusun deskripsi ketergantungan makhluk hidup lain kepada tanaman"
    ],
    "targetCompetency": "both",
    "cognitiveLevel": "C4",
    "strictCurriculumMode": true,
    "features": {
      "adaptiveDifficulty": true,
      "scaffolding": true,
      "reasoning": true,
      "evidence": true,
      "reflection": true,
      "presentation": true,
      "peerQuestion": true
    },
    "description": "Potret tanaman hijau atau pohon di sekitar halaman sekolah yang berperan sebagai produsen dalam rantai makanan, penghasil oksigen pendukung kehidupan ekosistem.",
    "isActive": false,
    "createdAt": "2026-09-08",
    "suggestedObjects": [
      "Pohon peneduh di lapangan upacara",
      "Tanaman lidah mertua di koridor",
      "Rumput hijau subur di taman"
    ]
  },
  {
    "id": "mission-ipas-ekosistem-2",
    "idMapel": "ipas",
    "title": "Misi 2: Menyelidiki Komponen Abiotik",
    "grade": "Kelas V",
    "phase": "Fase C",
    "subject": "IPAS",
    "material": "Ekosistem dan Keseimbangan Alam di Sekitar Kita",
    "cp": "Peserta didik menyelidiki bagaimana hubungan saling ketergantungan antara komponen biotik dan abiotik membentuk keseimbangan ekosistem.",
    "tp": "Menganalisis peran objek di lingkungan sekolah dalam mendukung kehidupan makhluk hidup dan mengajukan argumen berbasis bukti visual.",
    "indicators": [
      "Mengidentifikasi komponen non-hidup (abiotik) pendukung kesuburan tanaman",
      "Menjelaskan pengaruh kelembapan tanah atau batuan terhadap ekosistem mikro",
      "Menganalisis interaksi tanah-air-udara dengan tanaman pot"
    ],
    "targetCompetency": "both",
    "cognitiveLevel": "C4",
    "strictCurriculumMode": true,
    "features": {
      "adaptiveDifficulty": true,
      "scaffolding": true,
      "reasoning": true,
      "evidence": true,
      "reflection": true,
      "presentation": true,
      "peerQuestion": true
    },
    "description": "Temukan dan potret komponen tidak hidup (abiotik) seperti tanah, batu, atau genangan air yang membantu pertumbuhan tanaman dan menyokong kehidupan mikroorganisme sekitar.",
    "isActive": false,
    "createdAt": "2026-09-09",
    "suggestedObjects": [
      "Tanah hitam subur di dalam pot",
      "Bebatuan kerikil di kolam",
      "Genangan air/air kran penyiram"
    ]
  },
  {
    "id": "mission-ipas-ekosistem-3",
    "idMapel": "ipas",
    "title": "Misi 3: Interaksi Makhluk Hidup",
    "grade": "Kelas V",
    "phase": "Fase C",
    "subject": "IPAS",
    "material": "Ekosistem dan Keseimbangan Alam di Sekitar Kita",
    "cp": "Peserta didik menyelidiki bagaimana hubungan saling ketergantungan antara komponen biotik dan abiotik membentuk keseimbangan ekosistem.",
    "tp": "Menganalisis peran objek di lingkungan sekolah dalam mendukung kehidupan makhluk hidup dan mengajukan argumen berbasis bukti visual.",
    "indicators": [
      "Menemukan contoh simbiosis atau interaksi nyata antar makhluk hidup berbeda di sekolah",
      "Mendeskripsikan pergerakan atau perilaku serangga pendukung penyerbukan",
      "Menilai kestabilan interaksi biotik mikro"
    ],
    "targetCompetency": "both",
    "cognitiveLevel": "C5",
    "strictCurriculumMode": true,
    "features": {
      "adaptiveDifficulty": true,
      "scaffolding": true,
      "reasoning": true,
      "evidence": true,
      "reflection": true,
      "presentation": true,
      "peerQuestion": true
    },
    "description": "Amati dan potret interaksi atau hubungan nyata antara makhluk hidup berbeda, misalnya serangga kecil di daun, semut beriringan mencari makan, atau kupu-kupu yang hinggap di bunga.",
    "isActive": false,
    "createdAt": "2026-09-10",
    "suggestedObjects": [
      "Semut hitam berbaris di batang pohon",
      "Lebah atau kupu-kupu di mahkota bunga",
      "Burung pipit bertengger di kabel listrik"
    ]
  },
  {
    "id": "mission-ipas-ekosistem-4",
    "idMapel": "ipas",
    "title": "Misi 4: Menjaga Keseimbangan dengan Tempat Sampah",
    "grade": "Kelas V",
    "phase": "Fase C",
    "subject": "IPAS",
    "material": "Ekosistem dan Keseimbangan Alam di Sekitar Kita",
    "cp": "Peserta didik menyelidiki bagaimana hubungan saling ketergantungan antara komponen biotik dan abiotik membentuk keseimbangan ekosistem.",
    "tp": "Menganalisis peran objek di lingkungan sekolah dalam mendukung kehidupan makhluk hidup dan mengajukan argumen berbasis bukti visual.",
    "indicators": [
      "Menganalisis dampak pemilahan sampah organik dan anorganik bagi kesuburan tanah",
      "Menghubungkan kebersihan drainase dengan kesehatan ekosistem sekolah",
      "Mengusulkan aksi pelestarian lingkungan berbasis bukti visual"
    ],
    "targetCompetency": "both",
    "cognitiveLevel": "C6",
    "strictCurriculumMode": true,
    "features": {
      "adaptiveDifficulty": true,
      "scaffolding": true,
      "reasoning": true,
      "evidence": true,
      "reflection": true,
      "presentation": true,
      "peerQuestion": true
    },
    "description": "Potret sarana penjaga keseimbangan alam buatan di sekolah, seperti tempat sampah pilah atau saluran drainase air untuk menganalisis kebersihan dan pencegahan kerusakan ekosistem.",
    "isActive": false,
    "createdAt": "2026-09-11",
    "suggestedObjects": [
      "Tempat sampah terpilah tiga warna",
      "Saluran air bersih terawat",
      "Komposter sampah organik daun"
    ]
  },
  {
    "id": "mission-b-indo-deskripsi",
    "idMapel": "bahasa_indonesia",
    "title": "Misi 1: Keindahan Mading Sekolah",
    "grade": "Kelas V",
    "phase": "Fase C",
    "subject": "Bahasa Indonesia",
    "material": "Teks Deskripsi Berbasis Panca Indra & Observasi Nyata",
    "cp": "Peserta didik mampu menulis teks deskripsi terperinci dengan memperhatikan ciri fisik, fungsi, dan kesan yang dirasakan.",
    "tp": "Menyusun deskripsi mendalam tentang suatu objek nyata di sekolah dengan kosakata baku, rincian pancaindra, dan bukti observasi.",
    "indicators": [
      "Mengidentifikasi detail visual warna, bentuk, dan susunan mading sekolah",
      "Menggunakan kata sifat penginderaan visual yang kaya dan relevan",
      "Menyusun kerangka paragraf pembuka teks deskripsi objek mading"
    ],
    "targetCompetency": "literacy",
    "cognitiveLevel": "C4",
    "strictCurriculumMode": true,
    "features": {
      "adaptiveDifficulty": true,
      "scaffolding": true,
      "reasoning": true,
      "evidence": true,
      "reflection": true,
      "presentation": true,
      "peerQuestion": true
    },
    "description": "Cari dan potret Majalah Dinding (mading) sekolah yang penuh warna. Amati tata letak kertas, tulisan tangan, serta gambar dekoratif untuk bahan teks deskripsi visual pancaindra.",
    "isActive": false,
    "createdAt": "2026-09-05",
    "suggestedObjects": [
      "Papan mading lobi sekolah",
      "Kliping puisi bertulisan rapi",
      "Gambar hiasan origami kertas warna-warni"
    ]
  },
  {
    "id": "mission-b-indo-deskripsi-2",
    "idMapel": "bahasa_indonesia",
    "title": "Misi 2: Kerapian Rak Perpustakaan",
    "grade": "Kelas V",
    "phase": "Fase C",
    "subject": "Bahasa Indonesia",
    "material": "Teks Deskripsi Berbasis Panca Indra & Observasi Nyata",
    "cp": "Peserta didik mampu menulis teks deskripsi terperinci dengan memperhatikan ciri fisik, fungsi, dan kesan yang dirasakan.",
    "tp": "Menyusun deskripsi mendalam tentang suatu objek nyata di sekolah dengan kosakata baku, rincian pancaindra, dan bukti observasi.",
    "indicators": [
      "Menemukan ciri fisik bahan, ukuran, dan tekstur rak buku perpustakaan",
      "Mendeskripsikan keheningan atmosfer perpustakaan menggunakan panca indera pendengaran dan perasaan",
      "Mengembangkan tulisan koheren tanpa menyisipkan asumsi fiktif"
    ],
    "targetCompetency": "literacy",
    "cognitiveLevel": "C4",
    "strictCurriculumMode": true,
    "features": {
      "adaptiveDifficulty": true,
      "scaffolding": true,
      "reasoning": true,
      "evidence": true,
      "reflection": true,
      "presentation": true,
      "peerQuestion": true
    },
    "description": "Kunjungi perpustakaan sekolah and potret deretan buku yang tersusun rapi di rak kayu. Rasakan kesan ketenangan dan kerapian susunan buku untuk memperkaya teks deskripsi fisik objek.",
    "isActive": false,
    "createdAt": "2026-09-06",
    "suggestedObjects": [
      "Deretan novel cerita nusantara",
      "Tumpukan kamus besar berdebu tipis",
      "Papan penunjuk kategori buku kayu"
    ]
  },
  {
    "id": "mission-b-indo-deskripsi-3",
    "idMapel": "bahasa_indonesia",
    "title": "Misi 3: Aromatik Kantin Sehat",
    "grade": "Kelas V",
    "phase": "Fase C",
    "subject": "Bahasa Indonesia",
    "material": "Teks Deskripsi Berbasis Panca Indra & Observasi Nyata",
    "cp": "Peserta didik mampu menulis teks deskripsi terperinci dengan memperhatikan ciri fisik, fungsi, dan kesan yang dirasakan.",
    "tp": "Menyusun deskripsi mendalam tentang suatu objek nyata di sekolah dengan kosakata baku, rincian pancaindra, dan bukti observasi.",
    "indicators": [
      "Menggali deskripsi sensorik aroma, rasa, dan kehangatan etalase kantin",
      "Menuliskan detail fisik kemasan, kebersihan, dan susunan nampan saji",
      "Menyatukan pengamatan panca indra ke dalam kesimpulan utuh teks deskripsi"
    ],
    "targetCompetency": "literacy",
    "cognitiveLevel": "C5",
    "strictCurriculumMode": true,
    "features": {
      "adaptiveDifficulty": true,
      "scaffolding": true,
      "reasoning": true,
      "evidence": true,
      "reflection": true,
      "presentation": true,
      "peerQuestion": true
    },
    "description": "Potret suasana atau etalase makanan bersih di kantin sekolah. Amati bentuk wadah saji, warna makanan hangat, serta aroma lezat yang tercium untuk melatih menulis deskripsi pancaindra penciuman.",
    "isActive": false,
    "createdAt": "2026-09-07",
    "suggestedObjects": [
      "Etalase kaca penutup makanan",
      "Nampan saji berisi kue tradisional",
      "Daftar menu makanan bersih tertempel dinding"
    ]
  },
  {
    "id": "mission-b-indo-deskripsi-4",
    "idMapel": "bahasa_indonesia",
    "title": "Misi 4: Gerbang Sekolah yang Gagah",
    "grade": "Kelas V",
    "phase": "Fase C",
    "subject": "Bahasa Indonesia",
    "material": "Teks Deskripsi Berbasis Panca Indra & Observasi Nyata",
    "cp": "Peserta didik mampu menulis teks deskripsi terperinci dengan memperhatikan ciri fisik, fungsi, dan kesan yang dirasakan.",
    "tp": "Menyusun deskripsi mendalam tentang suatu objek nyata di sekolah dengan kosakata baku, rincian pancaindra, dan bukti observasi.",
    "indicators": [
      "Mendeskripsikan material, ketebalan, dan ukuran kokoh dari tiang/gerbang sekolah",
      "Menggambarkan kesan kemegahan atau keindahan gerbang depan sekolah",
      "Menyusun karya teks deskripsi akhir dengan bahasa baku yang objektif dan rapi"
    ],
    "targetCompetency": "literacy",
    "cognitiveLevel": "C6",
    "strictCurriculumMode": true,
    "features": {
      "adaptiveDifficulty": true,
      "scaffolding": true,
      "reasoning": true,
      "evidence": true,
      "reflection": true,
      "presentation": true,
      "peerQuestion": true
    },
    "description": "Pergilah ke area depan sekolah, potret pilar gerbang utama sekolah atau papan nama sekolah. Amati bahan pembuatannya (seperti besi atau semen kokoh) untuk mendeskripsikan ciri fisik kekokohan dan fungsinya.",
    "isActive": false,
    "createdAt": "2026-09-08",
    "suggestedObjects": [
      "Pilar beton gerbang berlapis batu alam",
      "Papan nama sekolah dari logam mengkilap",
      "Tanaman hias menjalar di tembok pagar depan"
    ]
  }
];

export const INITIAL_COMPLETED_SESSION: StudentActivitySession = {
  "id": "session-adit-interval-kpk",
  "missionId": "mission-kpk-fpb",
  "missionTitle": "Misi 1: Eksplorasi Pola Interval & Keteraturan Berulang",
  "subject": "Matematika",
  "studentId": "user-student-1",
  "studentName": "Adit Pratama",
  "image": "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&auto=format&fit=crop&q=80",
  "imageLabel": "Pola Susunan Undakan Tangga & Ubin Sekolah",
  "learningBridge": {
    "detectedObject": "Pola susunan undakan tangga dan ubin teratur",
    "compatibility": "Strong",
    "compatibilityReason": "Susunan undakan tangga dan penanda garis berulang adalah representasi interval waktu dan jarak yang sangat konkret untuk konsep KPK dan kelipatan.",
    "observation": "Saya melihat susunan anak tangga sekolah dengan penanda reflektor garis setiap kelipatan tertentu dan ubin berjarak sama. Pola ini berulang secara teratur di setiap undakan.",
    "context": "Pola keteraturan undakan dan interval langkah",
    "learningBridge": "Susunan undakan bertingkat menunjukkan pola yang berulang secara berkala. Jika ada dua penanda dengan selang jarak atau kegiatan tertentu (misalnya bel piket setiap 4 menit dan alarm stasiun baca setiap 6 menit), waktu mereka berbunyi bersama dapat dihitung menggunakan Kelipatan Persekutuan Terkecil (KPK).",
    "simpleMaterialSummary": "📌 **Pengertian & Konsep Inti:**\nKPK (Kelipatan Persekutuan Terkecil) adalah bilangan kelipatan terkecil yang sama dari dua bilangan atau lebih.\n\n🏷️ **Ciri-Ciri & Contoh Nyata:**\n- Ciri: Menanyakan waktu pertemuan bersama kembali.\n- Contoh: Interval bunyi bel sekolah, jadwal piket kelas, dan detak jarum jam.",
    "soloTaxonomyLevel": "Relational",
    "soloDescription": "Siswa berhasil menghubungkan pengamatan pola susunan undakan dengan konsep interval waktu berulang dan prinsip kelipatan persekutuan terkecil (KPK).",
    "guidingQuestions": [
      "Bagaimana susunan berulang yang teratur bisa membantu kita memperkirakan titik temu dua jadwal berbeda?",
      "Pernahkah kamu memperhatikan bunyi bel sekolah yang berdering bersamaan? Kapan itu terjadi?"
    ],
    "subject": "Matematika",
    "material": "Kelipatan Persekutuan Terkecil (KPK) & Faktor Persekutuan Terbesar (FPB)",
    "learningTarget": "Menerapkan konsep KPK untuk mencari titik waktu pertemuan dua interval berulang",
    "cognitiveLevel": "C4-C6",
    "questions": [
      {
        "id": "q-kpk-1",
        "stage": "challenge",
        "title": "Tantangan Pemecahan Masalah",
        "question": "Bel pengingat piket berbunyi setiap 4 menit, sedangkan alarm stasiun baca berbunyi setiap 6 menit. Jika berbunyi bersamaan pukul 08.00, kapan keduanya berbunyi bersamaan lagi?",
        "inputType": "text",
        "conceptTag": "Penentuan KPK",
        "scaffolding": {
          "level1": "Perhatikan petunjuk pada pertanyaan dengan cermat.",
          "level2": "Hubungkan pengamatanmu dengan materi yang telah dipelajari.",
          "level3": "Pecah masalah menjadi langkah-langkah yang lebih sederhana.",
          "level4": "Bayangkan analogi atau contoh nyata serupa di sekitarmu."
        }
      },
      {
        "id": "q-kpk-2",
        "stage": "reasoning",
        "title": "Alasan dan Cara Berpikir",
        "question": "Mengapa kamu memilih menggunakan konsep KPK dan bukan FPB?",
        "inputType": "text",
        "conceptTag": "Penalaran Matematis",
        "scaffolding": {
          "level1": "Perhatikan petunjuk pada pertanyaan dengan cermat.",
          "level2": "Hubungkan pengamatanmu dengan materi yang telah dipelajari.",
          "level3": "Pecah masalah menjadi langkah-langkah yang lebih sederhana.",
          "level4": "Bayangkan analogi atau contoh nyata serupa di sekitarmu."
        }
      },
      {
        "id": "q-kpk-3",
        "stage": "evidence",
        "title": "Bukti & Langkah Perhitungan",
        "question": "Tuliskan langkah perhitunganmu dengan jelas! Tunjukkan deret kelipatan.",
        "inputType": "text",
        "conceptTag": "Pembuktian Konkret",
        "scaffolding": {
          "level1": "Perhatikan petunjuk pada pertanyaan dengan cermat.",
          "level2": "Hubungkan pengamatanmu dengan materi yang telah dipelajari.",
          "level3": "Pecah masalah menjadi langkah-langkah yang lebih sederhana.",
          "level4": "Bayangkan analogi atau contoh nyata serupa di sekitarmu."
        }
      }
    ]
  },
  "answers": {
    "challengeAnswer": "Kedua bel akan berbunyi bersamaan lagi setelah 12 menit, yaitu pada pukul 08.12 WIB.",
    "reason": "Saya memilih konsep KPK karena kedua kegiatan berlangsung berulang secara berkala. Kita mencari waktu ke depan saat kedua kelipatan bertemu di titik yang sama paling cepat, bukan membagi benda.",
    "evidence": "Kelipatan 4: 4, 8, 12, 16... Kelipatan 6: 6, 12, 18... Angka persekutuan terkecil yang sama adalah 12. Jadi waktu pertemuannya adalah 12 menit.",
    "strategy": "Menuliskan tabel kelipatan di buku lalu mencari angka kembar pertama.",
    "conclusion": "Dua peristiwa berulang dengan selang waktu 4 dan 6 menit pasti bertemu setiap 12 menit sekali."
  },
  "scaffoldingHistory": [
    {
      "questionId": "q-kpk-1",
      "level": 1,
      "hintText": "Coba tuliskan menit kelipatan 4 dan kelipatan 6.",
      "requestedAt": "2026-09-22 08:30"
    }
  ],
  "reflection": {
    "q1Found": "Saya menemukan bahwa tangga sekolah punya pola pengulangan yang persis seperti kelipatan angka.",
    "q2Learned": "Saya belajar bahwa masalah jadwal berulang dipecahkan memakai KPK.",
    "q3Hardest": "Menjelaskan alasan logis mengapa bukan memakai FPB.",
    "q4Solved": "Membayangkan dua orang melompat dengan langkah 4 dan 6.",
    "q5Improvement": "Ingin mencoba menggunakan pohon faktor prima lebih cepat."
  },
  "presentation": [
    {
      "id": "slide-1",
      "slideNumber": 1,
      "title": "Hasil Eksplorasi Saya: Pola Interval & KPK",
      "subtitle": "Misi Matematika Kontekstual — Kelas V-A SDN 01 Nusantara",
      "content": "Halo teman-teman! Saya Adit Pratama. Hari ini saya menemukan matematika di pola keteraturan tangga sekolah.",
      "image": "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&auto=format&fit=crop&q=80",
      "speakingNotes": "Beri salam pembuka dengan percaya diri.",
      "layout": "title"
    },
    {
      "id": "slide-2",
      "slideNumber": 2,
      "title": "Apa yang Saya Temukan?",
      "subtitle": "Observasi Visual Objek Nyata",
      "content": "Dari foto susunan undakan tangga dan ubin, saya melihat pola berulang dengan interval yang konsisten di setiap langkah.",
      "bullets": [
        "Susunan undakan bertingkat berjarak sama",
        "Penanda langkah berjarak kelipatan teratur",
        "Pola pengulangan jarak dan waktu yang konstan"
      ],
      "image": "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&auto=format&fit=crop&q=80",
      "speakingNotes": "Jelaskan foto yang kamu ambil.",
      "layout": "split-photo"
    },
    {
      "id": "slide-3",
      "slideNumber": 3,
      "title": "Hubungannya dengan Pelajaran",
      "subtitle": "AI Learning Bridge: Pola Interval ke KPK",
      "content": "Pola berulang adalah contoh nyata dari interval. Titik temu dua peristiwa berkala dihitung dengan Kelipatan Persekutuan Terkecil (KPK).",
      "bullets": [
        "Interval = waktu atau jarak yang berulang berkala",
        "KPK = titik temu pertama dari dua interval berbeda",
        "Pola nyata di sekitar sekolah"
      ],
      "speakingNotes": "Kaitkan pengamatan dengan materi KPK.",
      "layout": "observation"
    },
    {
      "id": "slide-4",
      "slideNumber": 4,
      "title": "Solusi Akhir & Pembuktian",
      "subtitle": "Jawaban Tantangan Nyata",
      "content": "Bel piket (4 menit) dan bel baca (6 menit) akan berbunyi bersamaan pada menit ke-12, yaitu pukul 08.12 WIB.",
      "bullets": [
        "Kelipatan 4: 4, 8, 12, 16, 20...",
        "Kelipatan 6: 6, 12, 18, 24...",
        "KPK (4, 6) = 12"
      ],
      "speakingNotes": "Sampaikan jawaban akhir dan perhitungannya.",
      "layout": "solution"
    },
    {
      "id": "slide-5",
      "slideNumber": 5,
      "title": "Kesimpulan & Refleksi",
      "subtitle": "Hikmah Belajar Hari Ini",
      "content": "Matematika ada di mana-mana di sekitar kita. Observasi nyata membuat rumus lebih mudah dimengerti.",
      "bullets": [
        "KPK sangat berguna menyinkronkan jadwal",
        "Penalaran lebih penting daripada sekadar menghafal"
      ],
      "speakingNotes": "Tutup dengan salam dan ucapan terima kasih.",
      "layout": "conclusion"
    }
  ],
  "peerQuestions": [
    {
      "id": "pq-1",
      "askerName": "Siti Rahma",
      "question": "Bagaimana jika belnya setiap 4 menit dan 5 menit?",
      "presenterAnswer": "Karena 4 dan 5 tidak punya faktor sekutu selain 1, KPK-nya 4 × 5 = 20 menit!",
      "timestamp": "2026-09-22 09:00",
      avatar: studentBoy1
    }
  ],
  "completedAt": "2026-09-22",
  "status": "completed",
  "metrics": {
    "literacyScore": 88,
    "numeracyScore": 94,
    "reasoningScore": 92,
    "scaffoldingUsedCount": 1
  }
};

export const DEFAULT_SESSIONS: StudentActivitySession[] = [
  {
    "id": "session-adit-interval-kpk",
    "missionId": "mission-kpk-fpb",
    "missionTitle": "Misi 1: Eksplorasi Pola Interval & Keteraturan Berulang",
    "subject": "Matematika",
    "studentId": "user-student-1",
    "studentName": "Adit Pratama",
    "image": "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&auto=format&fit=crop&q=80",
    "imageLabel": "Pola Susunan Undakan Tangga & Ubin Sekolah",
    "learningBridge": {
      "detectedObject": "Pola susunan undakan tangga dan ubin teratur",
      "compatibility": "Strong",
      "compatibilityReason": "Susunan undakan tangga dan penanda garis berulang adalah representasi interval waktu dan jarak yang sangat konkret untuk konsep KPK dan kelipatan.",
      "observation": "Saya melihat susunan anak tangga sekolah dengan penanda reflektor garis setiap kelipatan tertentu dan ubin berjarak sama. Pola ini berulang secara teratur di setiap undakan.",
      "context": "Pola keteraturan undakan dan interval langkah",
      "learningBridge": "Susunan undakan bertingkat menunjukkan pola yang berulang secara berkala. Jika ada dua penanda dengan selang jarak atau kegiatan tertentu (misalnya bel piket setiap 4 menit dan alarm stasiun baca setiap 6 menit), waktu mereka berbunyi bersama dapat dihitung menggunakan Kelipatan Persekutuan Terkecil (KPK).",
      "simpleMaterialSummary": "📌 **Pengertian & Konsep Inti:**\nKPK (Kelipatan Persekutuan Terkecil) adalah bilangan kelipatan terkecil yang sama dari dua bilangan atau lebih.\n\n🏷️ **Ciri-Ciri & Contoh Nyata:**\n- Ciri: Menanyakan waktu pertemuan bersama kembali.\n- Contoh: Interval bunyi bel sekolah, jadwal piket kelas, dan detak jarum jam.",
      "soloTaxonomyLevel": "Relational",
      "soloDescription": "Siswa berhasil menghubungkan pengamatan pola susunan undakan dengan konsep interval waktu berulang dan prinsip kelipatan persekutuan terkecil (KPK).",
      "guidingQuestions": [
        "Bagaimana susunan berulang yang teratur bisa membantu kita memperkirakan titik temu dua jadwal berbeda?",
        "Pernahkah kamu memperhatikan bunyi bel sekolah yang berdering bersamaan? Kapan itu terjadi?"
      ],
      "subject": "Matematika",
      "material": "Kelipatan Persekutuan Terkecil (KPK) & Faktor Persekutuan Terbesar (FPB)",
      "learningTarget": "Menerapkan konsep KPK untuk mencari titik waktu pertemuan dua interval berulang",
      "cognitiveLevel": "C4-C6",
      "questions": [
        {
          "id": "q-kpk-1",
          "stage": "challenge",
          "title": "Tantangan Pemecahan Masalah",
          "question": "Bel pengingat piket berbunyi setiap 4 menit, sedangkan alarm stasiun baca berbunyi setiap 6 menit. Jika berbunyi bersamaan pukul 08.00, kapan keduanya berbunyi bersamaan lagi?",
          "inputType": "text",
          "conceptTag": "Penentuan KPK",
          "scaffolding": {
            "level1": "Perhatikan petunjuk pada pertanyaan dengan cermat.",
            "level2": "Hubungkan pengamatanmu dengan materi yang telah dipelajari.",
            "level3": "Pecah masalah menjadi langkah-langkah yang lebih sederhana.",
            "level4": "Bayangkan analogi atau contoh nyata serupa di sekitarmu."
          }
        },
        {
          "id": "q-kpk-2",
          "stage": "reasoning",
          "title": "Alasan dan Cara Berpikir",
          "question": "Mengapa kamu memilih menggunakan konsep KPK dan bukan FPB?",
          "inputType": "text",
          "conceptTag": "Penalaran Matematis",
          "scaffolding": {
            "level1": "Perhatikan petunjuk pada pertanyaan dengan cermat.",
            "level2": "Hubungkan pengamatanmu dengan materi yang telah dipelajari.",
            "level3": "Pecah masalah menjadi langkah-langkah yang lebih sederhana.",
            "level4": "Bayangkan analogi atau contoh nyata serupa di sekitarmu."
          }
        },
        {
          "id": "q-kpk-3",
          "stage": "evidence",
          "title": "Bukti & Langkah Perhitungan",
          "question": "Tuliskan langkah perhitunganmu dengan jelas! Tunjukkan deret kelipatan.",
          "inputType": "text",
          "conceptTag": "Pembuktian Konkret",
          "scaffolding": {
            "level1": "Perhatikan petunjuk pada pertanyaan dengan cermat.",
            "level2": "Hubungkan pengamatanmu dengan materi yang telah dipelajari.",
            "level3": "Pecah masalah menjadi langkah-langkah yang lebih sederhana.",
            "level4": "Bayangkan analogi atau contoh nyata serupa di sekitarmu."
          }
        }
      ]
    },
    "answers": {
      "challengeAnswer": "Kedua bel akan berbunyi bersamaan lagi setelah 12 menit, yaitu pada pukul 08.12 WIB.",
      "reason": "Saya memilih konsep KPK karena kedua kegiatan berlangsung berulang secara berkala. Kita mencari waktu ke depan saat kedua kelipatan bertemu di titik yang sama paling cepat, bukan membagi benda.",
      "evidence": "Kelipatan 4: 4, 8, 12, 16... Kelipatan 6: 6, 12, 18... Angka persekutuan terkecil yang sama adalah 12. Jadi waktu pertemuannya adalah 12 menit.",
      "strategy": "Menuliskan tabel kelipatan di buku lalu mencari angka kembar pertama.",
      "conclusion": "Dua peristiwa berulang dengan selang waktu 4 dan 6 menit pasti bertemu setiap 12 menit sekali."
    },
    "scaffoldingHistory": [
      {
        "questionId": "q-kpk-1",
        "level": 1,
        "hintText": "Coba tuliskan menit kelipatan 4 dan kelipatan 6.",
        "requestedAt": "2026-09-22 08:30"
      }
    ],
    "reflection": {
      "q1Found": "Saya menemukan bahwa tangga sekolah punya pola pengulangan yang persis seperti kelipatan angka.",
      "q2Learned": "Saya belajar bahwa masalah jadwal berulang dipecahkan memakai KPK.",
      "q3Hardest": "Menjelaskan alasan logis mengapa bukan memakai FPB.",
      "q4Solved": "Membayangkan dua orang melompat dengan langkah 4 dan 6.",
      "q5Improvement": "Ingin mencoba menggunakan pohon faktor prima lebih cepat."
    },
    "presentation": [
      {
        "id": "slide-1",
        "slideNumber": 1,
        "title": "Hasil Eksplorasi Saya: Pola Interval & KPK",
        "subtitle": "Misi Matematika Kontekstual — Kelas V-A SDN 01 Nusantara",
        "content": "Halo teman-teman! Saya Adit Pratama. Hari ini saya menemukan matematika di pola keteraturan tangga sekolah.",
        "image": "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&auto=format&fit=crop&q=80",
        "speakingNotes": "Beri salam pembuka dengan percaya diri.",
        "layout": "title"
      },
      {
        "id": "slide-2",
        "slideNumber": 2,
        "title": "Apa yang Saya Temukan?",
        "subtitle": "Observasi Visual Objek Nyata",
        "content": "Dari foto susunan undakan tangga dan ubin, saya melihat pola berulang dengan interval yang konsisten di setiap langkah.",
        "bullets": [
          "Susunan undakan bertingkat berjarak sama",
          "Penanda langkah berjarak kelipatan teratur",
          "Pola pengulangan jarak dan waktu yang konstan"
        ],
        "image": "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&auto=format&fit=crop&q=80",
        "speakingNotes": "Jelaskan foto yang kamu ambil.",
        "layout": "split-photo"
      },
      {
        "id": "slide-3",
        "slideNumber": 3,
        "title": "Hubungannya dengan Pelajaran",
        "subtitle": "AI Learning Bridge: Pola Interval ke KPK",
        "content": "Pola berulang adalah contoh nyata dari interval. Titik temu dua peristiwa berkala dihitung dengan Kelipatan Persekutuan Terkecil (KPK).",
        "bullets": [
          "Interval = waktu atau jarak yang berulang berkala",
          "KPK = titik temu pertama dari dua interval berbeda",
          "Pola nyata di sekitar sekolah"
        ],
        "speakingNotes": "Kaitkan pengamatan dengan materi KPK.",
        "layout": "observation"
      },
      {
        "id": "slide-4",
        "slideNumber": 4,
        "title": "Solusi Akhir & Pembuktian",
        "subtitle": "Jawaban Tantangan Nyata",
        "content": "Bel piket (4 menit) dan bel baca (6 menit) akan berbunyi bersamaan pada menit ke-12, yaitu pukul 08.12 WIB.",
        "bullets": [
          "Kelipatan 4: 4, 8, 12, 16, 20...",
          "Kelipatan 6: 6, 12, 18, 24...",
          "KPK (4, 6) = 12"
        ],
        "speakingNotes": "Sampaikan jawaban akhir dan perhitungannya.",
        "layout": "solution"
      },
      {
        "id": "slide-5",
        "slideNumber": 5,
        "title": "Kesimpulan & Refleksi",
        "subtitle": "Hikmah Belajar Hari Ini",
        "content": "Matematika ada di mana-mana di sekitar kita. Observasi nyata membuat rumus lebih mudah dimengerti.",
        "bullets": [
          "KPK sangat berguna menyinkronkan jadwal",
          "Penalaran lebih penting daripada sekadar menghafal"
        ],
        "speakingNotes": "Tutup dengan salam dan ucapan terima kasih.",
        "layout": "conclusion"
      }
    ],
    "peerQuestions": [
      {
        "id": "pq-1",
        "askerName": "Siti Rahma",
        "question": "Bagaimana jika belnya setiap 4 menit dan 5 menit?",
        "presenterAnswer": "Karena 4 dan 5 tidak punya faktor sekutu selain 1, KPK-nya 4 × 5 = 20 menit!",
        "timestamp": "2026-09-22 09:00",
        avatar: studentBoy1
      }
    ],
    "completedAt": "2026-09-22",
    "status": "completed",
    "metrics": {
      "literacyScore": 88,
      "numeracyScore": 94,
      "reasoningScore": 92,
      "scaffoldingUsedCount": 1
    }
  },
  {
    "id": "session-siti-klorofil-daun",
    "missionId": "mission-ipas-ekosistem-2",
    "missionTitle": "Misi: Penyelidikan Klorofil & Daun Hijau",
    "subject": "IPAS",
    "studentId": "user-student-2",
    "studentName": "Siti Rahma",
    "image": "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&auto=format&fit=crop&q=80",
    "imageLabel": "Struktur Tulang Daun Mangga & Butiran Embun di Taman",
    "learningBridge": {
      "detectedObject": "Daun mangga hijau segar dengan tulang daun menyirip dan butiran embun",
      "compatibility": "Strong",
      "compatibilityReason": "Daun hijau dengan pembuluh vena menyirip adalah bukti fisik proses fotosintesis, keberadaan stomata, dan klorofil.",
      "observation": "Saya memotret daun mangga di taman sekolah. Permukaan atasnya berwarna hijau tua mengilap dan terasa licin, sedangkan bagian bawahnya berwarna hijau lebih muda dengan urat-urat tulang daun yang menonjol jelas.",
      "context": "Adaptasi tumbuhan dan proses fotosintesis",
      "learningBridge": "Warna hijau pekat pada daun berasal dari zat klorofil yang bertugas menangkap sinar matahari untuk memasak makanan melalui fotosintesis. Tulang daun berfungsi seperti pipa pembuluh yang mengalirkan air dan hasil makanan.",
      "simpleMaterialSummary": "📌 **Konsep Inti:**\nFotosintesis adalah proses tumbuhan mengolah air dan karbon dioksida menjadi glukosa dan oksigen dengan bantuan cahaya matahari dan klorofil.\n\n🏷️ **Bagian Penting:**\n1. Klorofil: zat hijau daun penangkap cahaya.\n2. Stomata: mulut daun untuk pertukaran gas.\n3. Tulang daun (xilem & floem): jaringan pengangkut air dan nutrisi.",
      "soloTaxonomyLevel": "Relational",
      "soloDescription": "Siswa mampu menghubungkan struktur warna dan bentuk tulang daun dengan mekanisme fotosintesis dan transportasi air.",
      "guidingQuestions": [
        "Mengapa bagian atas daun warnanya lebih hijau tua dibandingkan bagian bawahnya?",
        "Apa yang terjadi jika tanaman disimpan di tempat yang sama sekali tidak terkena cahaya matahari?"
      ],
      "subject": "IPAS",
      "material": "Fotosintesis & Struktur Jaringan Tumbuhan",
      "learningTarget": "Mengidentifikasi fungsi klorofil dan struktur daun dalam mendukung fotosintesis",
      "cognitiveLevel": "C4-C6",
      "questions": [
        {
          "id": "q-foto-1",
          "stage": "challenge",
          "title": "Tantangan Penyelidikan Klorofil",
          "question": "Mengapa bagian atas daun mangga ini berwarna hijau lebih pekat dibandingkan bagian bawahnya? Jelaskan hubungannya dengan proses fotosintesis!",
          "inputType": "text",
          "conceptTag": "Fungsi Klorofil & Jaringan Palisade",
          "scaffolding": {
            "level1": "Perhatikan petunjuk pada pertanyaan dengan cermat.",
            "level2": "Hubungkan pengamatanmu dengan materi yang telah dipelajari.",
            "level3": "Pecah masalah menjadi langkah-langkah yang lebih sederhana.",
            "level4": "Bayangkan analogi atau contoh nyata serupa di sekitarmu."
          }
        },
        {
          "id": "q-foto-2",
          "stage": "reasoning",
          "title": "Penalaran Ilmiah",
          "question": "Bagaimana tulang daun yang menyirip pada foto membuktikan adanya sistem pengangkutan zat pada tumbuhan?",
          "inputType": "text",
          "conceptTag": "Jaringan Pengangkut Xilem & Floem",
          "scaffolding": {
            "level1": "Perhatikan petunjuk pada pertanyaan dengan cermat.",
            "level2": "Hubungkan pengamatanmu dengan materi yang telah dipelajari.",
            "level3": "Pecah masalah menjadi langkah-langkah yang lebih sederhana.",
            "level4": "Bayangkan analogi atau contoh nyata serupa di sekitarmu."
          }
        }
      ]
    },
    "answers": {
      "challengeAnswer": "Bagian atas daun berwarna hijau lebih pekat karena memiliki lapisan jaringan tiang (palisade) yang mengandung lebih banyak klorofil untuk menangkap cahaya matahari secara maksimal.",
      "reason": "Cahaya matahari datang dari arah atas, sehingga tumbuhan beradaptasi menempatkan klorofil terbanyak di bagian permukaan atas agar fotosintesis berlangsung optimal.",
      "evidence": "Ketika diamati di bawah sinar matahari pagi, bagian atas daun memantulkan cahaya dan warnanya hijau zamrud gelap, sedangkan bagian bawah lebih pucat dan memiliki pori-pori stomata.",
      "strategy": "Membandingkan kedua sisi daun secara langsung dan mencatat perbedaan warna serta teksturnya.",
      "conclusion": "Perbedaan warna daun membuktikan adaptasi struktur daun untuk mengoptimalkan penyerapan energi matahari saat fotosintesis."
    },
    "scaffoldingHistory": [],
    "reflection": {
      "q1Found": "Saya menemukan bahwa permukaan atas daun licin dan hijau pekat karena ada lapisan lilin dan banyak klorofil.",
      "q2Learned": "Saya belajar bahwa fotosintesis menghasilkan oksigen yang dihirup manusia dan hewan.",
      "q3Hardest": "Membedakan fungsi xilem dan floem pada tulang daun.",
      "q4Solved": "Saya mengingat analogi: xilem mengangkut air dari bawah ke atas, floem mengedarkan hasil masakan ke seluruh tubuh.",
      "q5Improvement": "Saya ingin meneliti tanaman yang daunnya berwarna merah atau ungu apakah juga punya klorofil."
    },
    "presentation": [
      {
        "id": "slide-1",
        "slideNumber": 1,
        "title": "Rahasia Hijau Daun: Investigasi Klorofil",
        "subtitle": "Eksplorasi IPAS Fase C — Siti Rahma (Kelas V-A)",
        "content": "Hai semua! Saya Siti Rahma. Saya mengamati daun mangga di taman sekolah untuk membongkar misteri fotosintesis.",
        "image": "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&auto=format&fit=crop&q=80",
        "speakingNotes": "Beri salam dan perkenalkan objek penelitianmu.",
        "layout": "title"
      },
      {
        "id": "slide-2",
        "slideNumber": 2,
        "title": "Pengamatan Visual Daun Mangga",
        "subtitle": "Bukti Nyata dari Alam Sekolah",
        "content": "Daun memiliki dua sisi yang berbeda: sisi atas sangat hijau pekat dan sisi bawah berurat jelas.",
        "bullets": [
          "Warna hijau pekat di sisi atas (kaya klorofil)",
          "Pola urat daun menyirip teratur",
          "Butiran embun pagi menunjukkan adanya transpirasi"
        ],
        "image": "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&auto=format&fit=crop&q=80",
        "speakingNotes": "Tunjukkan foto daun dan perbedaannya.",
        "layout": "split-photo"
      },
      {
        "id": "slide-3",
        "slideNumber": 3,
        "title": "Bagaimana Fotosintesis Terjadi?",
        "subtitle": "Pabrik Oksigen Alami",
        "content": "Klorofil menangkap foton cahaya, menyerap air lewat akar, dan karbon dioksida lewat stomata, lalu menghasilkan glukosa dan oksigen.",
        "bullets": [
          "Bahan baku: Air (H2O) + Karbon Dioksida (CO2)",
          "Katalis: Cahaya Matahari + Klorofil",
          "Hasil: Karbohidrat + Oksigen segar (O2)"
        ],
        "speakingNotes": "Jelaskan rumus fotosintesis dengan bahasa sederhana.",
        "layout": "observation"
      },
      {
        "id": "slide-4",
        "slideNumber": 4,
        "title": "Kesimpulan & Ajakan Menjaga Lingkungan",
        "subtitle": "Pesan Konservasi Taman Sekolah",
        "content": "Satu helai daun hijau adalah pabrik kehidupan yang memberi kita oksigen gratis setiap hari. Jagalah pepohonan sekolah kita!",
        "bullets": [
          "Rawat tanaman sekolah dengan menyiramnya teratur",
          "Jangan merusak daun dan ranting pohon muda"
        ],
        "speakingNotes": "Tutup dengan pesan peduli lingkungan hidup.",
        "layout": "conclusion"
      }
    ],
    "peerQuestions": [
      {
        "id": "pq-siti-1",
        "askerName": "Adit Pratama",
        "question": "Siti, apakah daun yang sudah kuning masih bisa fotosintesis?",
        "presenterAnswer": "Daun yang menguning klorofilnya sudah rusak atau hilang, jadi fotosintesisnya sudah berhenti atau sangat lemah.",
        "timestamp": "2026-09-23 10:15",
        avatar: studentBoy1
      }
    ],
    "completedAt": "2026-09-23",
    "status": "completed",
    "metrics": {
      "literacyScore": 95,
      "numeracyScore": 86,
      "reasoningScore": 94,
      "scaffoldingUsedCount": 0
    }
  },
  {
    "id": "session-budi-kipas-rotasi",
    "missionId": "mission-kpk-fpb-2",
    "missionTitle": "Misi 2: Pola Putaran Kipas Angin",
    "subject": "Matematika",
    "studentId": "user-student-3",
    "studentName": "Budi Santoso",
    "image": "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=80",
    "imageLabel": "Baling-baling Kipas Angin Plafon Ruang Kelas",
    "learningBridge": {
      "detectedObject": "Baling-baling kipas angin plafon dengan 3 bilah simetris",
      "compatibility": "Strong",
      "compatibilityReason": "Putaran kipas angin berkecepatan teratur dengan 3 bilah adalah objek nyata untuk konsep sudut putar, derajat lingkaran, dan kelipatan putaran.",
      "observation": "Saya mengamati kipas angin di langit-langit kelas V-A. Kipas memiliki 3 bilah dengan jarak sudut yang sama besar, yaitu 120 derajat antar bilah.",
      "context": "Pengukuran sudut dan kelipatan rotasi",
      "learningBridge": "Satu putaran penuh adalah 360 derajat. Jika dibagi rata 3 bilah baling-baling, maka masing-masing membentuk sudut 120 derajat. Jika kipas berputar 5 kali per detik, kita bisa menghitung total derajat putarannya menggunakan kelipatan bilangan.",
      "simpleMaterialSummary": "📌 **Konsep Inti:**\nLingkaran memiliki sudut satu putaran penuh 360°. Pembagian sudut simetris = 360° / jumlah bilah.\nKelipatan putaran = kecepatan putaran × waktu.",
      "soloTaxonomyLevel": "Relational",
      "soloDescription": "Siswa mampu menghitung pembagian sudut 360 derajat pada bilah baling-baling dan menghubungkannya dengan kelipatan rotasi.",
      "guidingQuestions": [
        "Berapa derajat sudut antara dua bilah kipas yang memiliki 3 baling-baling?",
        "Jika kipas berputar 4 putaran penuh, berapa total derajat yang telah dilalui satu ujung bilah?"
      ],
      "subject": "Matematika",
      "material": "Pengukuran Sudut & Kelipatan Derajat",
      "learningTarget": "Menghitung sudut rotasi simetris dan kelipatan putaran benda berputar",
      "cognitiveLevel": "C4",
      "questions": [
        {
          "id": "q-budi-1",
          "stage": "challenge",
          "title": "Tantangan Sudut Kipas",
          "question": "Kipas angin kelas memiliki 3 bilah yang simetris sempurna. Hitung besar sudut di antara dua bilah yang berdekatan!",
          "inputType": "text",
          "conceptTag": "Sudut Putaran Lingkaran",
          "scaffolding": {
            "level1": "Perhatikan petunjuk pada pertanyaan dengan cermat.",
            "level2": "Hubungkan pengamatanmu dengan materi yang telah dipelajari.",
            "level3": "Pecah masalah menjadi langkah-langkah yang lebih sederhana.",
            "level4": "Bayangkan analogi atau contoh nyata serupa di sekitarmu."
          }
        }
      ]
    },
    "answers": {
      "challengeAnswer": "Besar sudut antara dua bilah kipas yang berdekatan adalah 120 derajat.",
      "reason": "Satu putaran penuh lingkaran bernilai 360 derajat. Karena kipas memiliki 3 bilah dengan jarak yang sama persis, maka 360 dibagi 3 adalah 120 derajat.",
      "evidence": "360° : 3 = 120°. Pembuktian: 120° + 120° + 120° = 360° (kembali ke titik awal).",
      "strategy": "Mengukur sudut lingkaran penuh lalu membaginya rata dengan jumlah baling-baling.",
      "conclusion": "Simetri putar pada kipas angin menggunakan prinsip pembagian sudut 360 derajat secara merata agar putarannya stabil dan tidak bergoyang."
    },
    "scaffoldingHistory": [],
    "reflection": {
      "q1Found": "Saya baru sadar bahwa jumlah bilah kipas angin dirancang dengan matematika agar seimbang.",
      "q2Learned": "Satu lingkaran penuh selalu 360 derajat.",
      "q3Hardest": "Membayangkan posisi sudut saat kipas sedang berputar kencang.",
      "q4Solved": "Mengamati kipas saat dimatikan terlebih dahulu.",
      "q5Improvement": "Ingin menghitung sudut pada kipas yang punya 4 atau 5 bilah."
    },
    "presentation": [
      {
        "id": "slide-1",
        "slideNumber": 1,
        "title": "Matematika di Balik Putaran Kipas Angin",
        "subtitle": "Eksplorasi Sudut & Simetri — Budi Santoso (Kelas V-A)",
        "content": "Halo kawan-kawan! Saya Budi Santoso. Pernahkah kalian mengamati kipas angin di langit-langit kelas kita?",
        "image": "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=80",
        "speakingNotes": "Buka presentasi dengan pertanyaan pemantik.",
        "layout": "title"
      },
      {
        "id": "slide-2",
        "slideNumber": 2,
        "title": "Hasil Perhitungan Sudut Simetri",
        "subtitle": "360 Derajat Dibagi 3 Bilah",
        "content": "Kipas angin berputar seimbang karena masing-masing bilah membentuk sudut tumpul 120 derajat.",
        "bullets": [
          "Satu putaran lingkaran = 360°",
          "Jumlah bilah = 3 buah",
          "Sudut antarbilah = 360° ÷ 3 = 120°"
        ],
        "image": "https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=80",
        "speakingNotes": "Tunjukkan hitungan 120 derajat pada diagram.",
        "layout": "split-photo"
      },
      {
        "id": "slide-3",
        "slideNumber": 3,
        "title": "Kesimpulan Rekayasa Kipas",
        "subtitle": "Keseimbangan Fisika & Matematika",
        "content": "Tanpa sudut yang presisi, kipas angin akan bergetar dan mudah rusak. Matematika memastikan kipas berputar seimbang dan menghasilkan angin sejuk!",
        "speakingNotes": "Tutup dengan kesimpulan tentang pentingnya ketelitian matematika.",
        "layout": "conclusion"
      }
    ],
    "peerQuestions": [
      {
        "id": "pq-budi-1",
        "askerName": "Zahra Aulia",
        "question": "Budi, kalau kipasnya punya 4 bilah, sudutnya jadi berapa?",
        "presenterAnswer": "Tinggal dihitung 360° ÷ 4 = 90°! Sudutnya jadi siku-siku persis.",
        "timestamp": "2026-09-24 11:20",
        avatar: studentBoy1
      }
    ],
    "completedAt": "2026-09-24",
    "status": "completed",
    "metrics": {
      "literacyScore": 85,
      "numeracyScore": 96,
      "reasoningScore": 91,
      "scaffoldingUsedCount": 0
    }
  },
  {
    "id": "session-zahra-teks-deskripsi",
    "missionId": "mission-b-indo-deskripsi",
    "missionTitle": "Misi: Detektif Kata & Struktur Teks Deskripsi Objek",
    "subject": "Bahasa Indonesia",
    "studentId": "user-student-4",
    "studentName": "Zahra Aulia",
    "image": "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80",
    "imageLabel": "Pojok Baca & Rak Ensiklopedia Bergambar",
    "learningBridge": {
      "detectedObject": "Susunan buku ensiklopedia berjejer rapi di rak kayu pojok baca",
      "compatibility": "Strong",
      "compatibilityReason": "Koleksi buku di rak pojok baca adalah objek ideal untuk menyusun teks deskripsi berbasis panca indra (penglihatan, rabaan) dan struktur klasifikasi.",
      "observation": "Saya memotret pojok baca kelas V-A. Ada rak kayu cokelat dengan deretan buku ensiklopedia bersampul tebal warna-warni yang disusun rapi berdasarkan ketebalan dan topik.",
      "context": "Penyusunan teks deskripsi faktual berbasis pengamatan indrawi",
      "learningBridge": "Teks deskripsi menggambarkan objek sehingga pembaca seolah melihat, mendengar, atau merasakan sendiri. Observasi warna sampul, aroma kertas buku, dan kerapian rak membantu menyusun kalimat perincian yang hidup.",
      "simpleMaterialSummary": "📌 **Struktur Teks Deskripsi:**\n1. Identifikasi/Judul objek.\n2. Deskripsi bagian (perincian warna, bentuk, tekstur, susunan).\n3. Kesimpulan/Kesan umum penulis.",
      "soloTaxonomyLevel": "Relational",
      "soloDescription": "Siswa mampu menyusun deskripsi objektif dan terstruktur dari pengamatan visual pojok baca.",
      "guidingQuestions": [
        "Kata sifat apa saja yang paling tepat menggambarkan suasana pojok baca kelas?",
        "Bagaimana urutan kalimat agar pembaca bisa membayangkan bentuk rak buku dari atas ke bawah?"
      ],
      "subject": "Bahasa Indonesia",
      "material": "Teks Deskripsi & Kalimat Perincian",
      "learningTarget": "Menulis teks deskripsi yang memuat kata sifat dan kalimat perincian panca indra",
      "cognitiveLevel": "C4-C6",
      "questions": [
        {
          "id": "q-zahra-1",
          "stage": "challenge",
          "title": "Tantangan Menulis Deskripsi",
          "question": "Tuliskan 1 paragraf deskripsi bagian mengenai rak buku pojok baca kelas berdasarkan foto yang kamu ambil!",
          "inputType": "text",
          "conceptTag": "Penyusunan Paragraf Deskripsi",
          "scaffolding": {
            "level1": "Perhatikan petunjuk pada pertanyaan dengan cermat.",
            "level2": "Hubungkan pengamatanmu dengan materi yang telah dipelajari.",
            "level3": "Pecah masalah menjadi langkah-langkah yang lebih sederhana.",
            "level4": "Bayangkan analogi atau contoh nyata serupa di sekitarmu."
          }
        }
      ]
    },
    "answers": {
      "challengeAnswer": "Rak buku pojok baca kelas V-A terbuat dari kayu jati berwarna cokelat madu yang kokoh. Di rak bagian atas, berjejer rapi lima jilid ensiklopedia sains bersampul tebal dengan gambar satwa dan tata surya yang berwarna cerah. Udara di sekitarnya harum khas kertas baru, mengundang siapa saja untuk segera duduk di karpet biru dan membaca.",
      "reason": "Saya memilih kata sifat seperti 'berwarna cokelat madu', 'bersampul tebal', dan 'berwarna cerah' agar pembaca bisa membayangkan bentuk fisiknya dengan jelas tanpa harus melihat fotonya langsung.",
      "evidence": "Paragraf saya memuat deskripsi penglihatan (warna cokelat, gambar satwa) dan penciuman (aroma kertas baru) yang sesuai dengan struktur teks deskripsi Kurikulum Merdeka.",
      "strategy": "Mengamati foto dari kiri ke kanan lalu mencatat kata sifat yang tepat.",
      "conclusion": "Teks deskripsi yang baik adalah teks yang berhasil memindahkan pengamatan nyata ke dalam imajinasi pembaca secara jelas dan menarik."
    },
    "scaffoldingHistory": [],
    "reflection": {
      "q1Found": "Saya menemukan bahwa detail kecil seperti wangi buku dan warna sampul membuat tulisan jadi jauh lebih menarik.",
      "q2Learned": "Struktur teks deskripsi harus runtut dari perkenalan sampai perincian bagian.",
      "q3Hardest": "Memilih padanan kata sifat yang bervariasi agar tidak mengulang kata 'bagus' atau 'indah'.",
      "q4Solved": "Membuka kamus sinonim kata bahasa Indonesia.",
      "q5Improvement": "Ingin mencoba mendeskripsikan suasana pasar tradisional."
    },
    "presentation": [
      {
        "id": "slide-1",
        "slideNumber": 1,
        "title": "Menghidupkan Kata Lewat Pengamatan Nyata",
        "subtitle": "Karya Bahasa Indonesia — Zahra Aulia (Kelas V-A)",
        "content": "Halo teman-teman! Saya Zahra Aulia. Hari ini saya membedah pojok baca kelas menjadi tulisan deskripsi yang memikat.",
        "image": "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80",
        "speakingNotes": "Beri salam dan perkenalkan judul karyamu.",
        "layout": "title"
      },
      {
        "id": "slide-2",
        "slideNumber": 2,
        "title": "Unsur Panca Indra dalam Teks Deskripsi",
        "subtitle": "Menulis dengan Penglihatan & Rasa",
        "content": "Teks deskripsi yang kuat menggunakan kata-kata indrawi yang tajam dan nyata.",
        "bullets": [
          "Indra Penglihatan: 'Cokelat madu', 'sampul tebal', 'karpet biru'",
          "Indra Peraba: 'Permukaan kayu halus', 'kertas licin'",
          "Indra Penciuman: 'Aroma segar kertas buku baru'"
        ],
        "image": "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80",
        "speakingNotes": "Jelaskan bagaimana panca indra membantu menulis.",
        "layout": "split-photo"
      },
      {
        "id": "slide-3",
        "slideNumber": 3,
        "title": "Ayo Gemar Membaca!",
        "subtitle": "Pojok Baca Sahabat Belajar Kita",
        "content": "Membaca adalah jendela dunia. Melalui pojok baca yang nyaman, kosakata kita bertambah dan imajinasi kita terbang tinggi.",
        "speakingNotes": "Ajak teman sekelas untuk makin rajin membaca buku.",
        "layout": "conclusion"
      }
    ],
    "peerQuestions": [
      {
        "id": "pq-zahra-1",
        "askerName": "Dewi Lestari",
        "question": "Zahra, apa bedanya teks deskripsi dengan teks cerita narasi?",
        "presenterAnswer": "Kalau narasi ada alur waktu dan tokoh yang beraksi (kemarin, lalu, tiba-tiba). Kalau deskripsi fokus menggambarkan ciri-ciri fisik suatu benda atau tempat secara detail!",
        "timestamp": "2026-09-25 09:30",
        avatar: studentBoy1
      }
    ],
    "completedAt": "2026-09-25",
    "status": "completed",
    "metrics": {
      "literacyScore": 98,
      "numeracyScore": 82,
      "reasoningScore": 93,
      "scaffoldingUsedCount": 0
    }
  },
  {
    "id": "session-dewi-siklus-air",
    "missionId": "mission-ipas-ekosistem-4",
    "missionTitle": "Misi: Siklus Air & Penguapan Embun",
    "subject": "IPAS",
    "studentId": "user-student-5",
    "studentName": "Dewi Lestari",
    "image": "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80",
    "imageLabel": "Genangan Air Bersih & Butir Embun Halaman Sekolah",
    "learningBridge": {
      "detectedObject": "Genangan air jernih di dekat rumput halaman sekolah setelah hujan pagi",
      "compatibility": "Strong",
      "compatibilityReason": "Genangan air yang berangsur mengering saat terkena terik matahari adalah fenomena nyata proses evaporasi dalam siklus hidrologi.",
      "observation": "Pukul 07.00 pagi ada genangan air hujan sedalam 2 cm di paving halaman sekolah. Pada pukul 11.00 siang saat matahari terik, genangan air tersebut telah surut dan mengering sepenuhnya.",
      "context": "Siklus air, perubahan wujud benda, dan evaporasi",
      "learningBridge": "Air yang mengering tidak hilang, melainkan berubah wujud dari cair menjadi gas (uap air) melalui proses evaporasi akibat kalor matahari. Uap air ini naik ke atmosfer, berkondensasi menjadi awan, lalu turun kembali sebagai hujan (presipitasi).",
      "simpleMaterialSummary": "📌 **Tahapan Siklus Air:**\n1. Evaporasi: penguapan air permukaan akibat panas matahari.\n2. Kondensasi: uap air dingin mengembun membentuk awan.\n3. Presipitasi: titik air awan jatuh ke bumi sebagai hujan.\n4. Infiltrasi: penyerapan air ke dalam tanah.",
      "soloTaxonomyLevel": "Relational",
      "soloDescription": "Siswa mampu menghubungkan hilangnya genangan air dengan tahapan evaporasi pada siklus hidrologi global.",
      "guidingQuestions": [
        "Ke mana perginya air pada genangan halaman sekolah saat siang hari?",
        "Mengapa jemuran baju basah bisa kering lebih cepat saat hari cerah dan berangin?"
      ],
      "subject": "IPAS",
      "material": "Siklus Hidrologi & Perubahan Wujud Zat",
      "learningTarget": "Menjelaskan tahapan evaporasi dan perubahan wujud cair ke gas dalam siklus air",
      "cognitiveLevel": "C4-C6",
      "questions": [
        {
          "id": "q-dewi-1",
          "stage": "challenge",
          "title": "Tantangan Detektif Evaporasi",
          "question": "Jelaskan proses fisika apa yang menyebabkan genangan air hujan di paving sekolah mengering saat siang hari!",
          "inputType": "text",
          "conceptTag": "Evaporasi & Pengaruh Kalor",
          "scaffolding": {
            "level1": "Perhatikan petunjuk pada pertanyaan dengan cermat.",
            "level2": "Hubungkan pengamatanmu dengan materi yang telah dipelajari.",
            "level3": "Pecah masalah menjadi langkah-langkah yang lebih sederhana.",
            "level4": "Bayangkan analogi atau contoh nyata serupa di sekitarmu."
          }
        }
      ]
    },
    "answers": {
      "challengeAnswer": "Genangan air mengering karena mengalami proses evaporasi (penguapan). Panas radiasi matahari memberikan energi kalor pada molekul air sehingga air berubah wujud dari zat cair menjadi gas berupa uap air yang naik ke udara.",
      "reason": "Zat cair membutuhkan kalor untuk menguap. Suhu udara siang yang panas dan hembusan angin mempercepat laju penguapan partikel air ke udara.",
      "evidence": "Pada pagi hari permukaan paving terasa dingin dan basah (suhu 24°C). Pada siang hari permukaan paving kering dan terasa hangat saat disentuh (suhu 33°C).",
      "strategy": "Mengukur waktu pengeringan genangan dari pagi hingga istirahat siang.",
      "conclusion": "Air di bumi tidak pernah berkurang atau bertambah jumlahnya, melainkan terus bersirkulasi dalam siklus air tertutup melalui evaporasi, kondensasi, dan hujan."
    },
    "scaffoldingHistory": [],
    "reflection": {
      "q1Found": "Saya membuktikan bahwa air yang lenyap sebenarnya hanya pindah wujud menjadi uap tak kasat mata.",
      "q2Learned": "Siklus air menjaga ketersediaan air tawar di bumi secara alami.",
      "q3Hardest": "Membedakan evaporasi (penguapan air permukaan) dan transpirasi (penguapan dari daun tumbuhan).",
      "q4Solved": "Membuat tabel perbandingan kedua istilah tersebut.",
      "q5Improvement": "Ingin membuat miniatur siklus air dalam toples kaca di kelas."
    },
    "presentation": [
      {
        "id": "slide-1",
        "slideNumber": 1,
        "title": "Ke Mana Perginya Air Hujan?",
        "subtitle": "Penyelidikan Siklus Air — Dewi Lestari (Kelas V-A)",
        "content": "Halo semuanya! Saya Dewi Lestari. Mengapa genangan air hujan di sekolah bisa lenyap saat siang? Mari kita selidiki!",
        "image": "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80",
        "speakingNotes": "Buka presentasi dengan misteri ilmiah yang seru.",
        "layout": "title"
      },
      {
        "id": "slide-2",
        "slideNumber": 2,
        "title": "Perjalanan Molekul Air",
        "subtitle": "Dari Halaman Sekolah Menuju Awan",
        "content": "Air di halaman menguap menjadi uap air, berkumpul di langit menjadi awan, lalu siap menjadi hujan berikutnya.",
        "bullets": [
          "Pukul 07.00: Genangan air 2 cm (Cair)",
          "Pukul 11.00: Paving kering sempurna (Gas/Uap Air)",
          "Proses: Evaporasi didorong panas matahari"
        ],
        "image": "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80",
        "speakingNotes": "Jelaskan data waktu pengeringan genangan.",
        "layout": "split-photo"
      },
      {
        "id": "slide-3",
        "slideNumber": 3,
        "title": "Kesimpulan: Air Tidak Pernah Hilang",
        "subtitle": "Keajaiban Daur Hidrologi",
        "content": "Air yang kita minum hari ini mungkin adalah air hujan yang sama yang pernah ada ribuan tahun lalu! Hematlah air bersih demi masa depan.",
        "speakingNotes": "Tutup dengan pesan bijak menjaga kelestarian air.",
        "layout": "conclusion"
      }
    ],
    "peerQuestions": [
      {
        "id": "pq-dewi-1",
        "askerName": "Siti Rahma",
        "question": "Dewi, apakah saat mendung air tetap bisa menguap?",
        "presenterAnswer": "Tetap menguap tapi lajunya lebih lambat karena suhu udara lebih rendah dan kelembapan udara lebih tinggi.",
        "timestamp": "2026-09-25 10:45",
        avatar: studentBoy1
      }
    ],
    "completedAt": "2026-09-25",
    "status": "completed",
    "metrics": {
      "literacyScore": 92,
      "numeracyScore": 88,
      "reasoningScore": 95,
      "scaffoldingUsedCount": 0
    }
  }
];

export const DEFAULT_ASSESSMENTS: AssessmentRecord[] = [
  {
    "id": "ass-1",
    "studentId": "user-student-1",
    "studentName": "Adit Pratama",
    "type": "pre",
    "literacyScore": 68,
    "numeracyScore": 70,
    "reasoningScore": 64,
    "date": "2026-08-25",
    "notes": "Pemahaman dasar cukup baik, namun sering kesulitan merangkai alasan tertulis."
  },
  {
    "id": "ass-2",
    "studentId": "user-student-1",
    "studentName": "Adit Pratama",
    "type": "post",
    "literacyScore": 82,
    "numeracyScore": 88,
    "reasoningScore": 84,
    "date": "2026-09-17",
    "notes": "Peningkatan signifikan pada artikulasi alasan dan pemilihan konsep KPK/FPB kontekstual."
  },
  {
    "id": "ass-3",
    "studentId": "user-student-2",
    "studentName": "Siti Rahma",
    "type": "pre",
    "literacyScore": 75,
    "numeracyScore": 68,
    "reasoningScore": 69,
    "date": "2026-08-25",
    "notes": "Literasi awal tinggi, numerasi perlu peningkatan dalam permodelan soal cerita."
  },
  {
    "id": "ass-4",
    "studentId": "user-student-2",
    "studentName": "Siti Rahma",
    "type": "post",
    "literacyScore": 89,
    "numeracyScore": 81,
    "reasoningScore": 82,
    "date": "2026-09-17",
    "notes": "Sangat baik dalam menghubungkan teks deskripsi dengan data kuantitatif."
  }
];

export const DEFAULT_INSIGHTS: TeacherInsight[] = [
  {
    "id": "ti-1",
    "title": "Kekuatan: Murid Mahir Menemukan Bukti Sensorik Visual",
    "type": "strength",
    "content": "Sebagian besar murid (84%) sudah mampu mengidentifikasi objek dan menuliskan informasi kuantitatif dari foto secara rinci.",
    "evidenceData": "Rata-rata skor tahap Observasi & Identify mencapai 89/100 pada misi pola interval dan kantin.",
    "targetMissions": [
      "mission-kpk-fpb",
      "mission-ipas-ekosistem"
    ],
    "actionRecommendation": "Pertahankan aktivitas observasi langsung. Mulai tingkatkan ke tahap evaluasi kritis (C5)."
  },
  {
    "id": "ti-2",
    "title": "Perhatian: Murid Membutuhkan Bantuan dalam Menjelaskan Bukti (Evidence)",
    "type": "need_scaffold",
    "content": "Beberapa murid (32%) langsung menuliskan jawaban akhir tanpa menguraikan deret kelipatan atau pohon faktor sebagai bukti verifikasi.",
    "evidenceData": "Level scaffolding yang paling sering diminta adalah Level 1 & 2 pada pertanyaan bukti matematis.",
    "targetMissions": [
      "mission-kpk-fpb"
    ],
    "actionRecommendation": "Aktifkan scaffolding otomatis bertingkat dan gunakan template kalimat bukti penuntun."
  },
  {
    "id": "ti-3",
    "title": "Tips Pedagogis: Optimalkan Sesi Tanya Teman di Proyektor Kelas",
    "type": "pedagogical_tip",
    "content": "Saat presentasi kelas ditayangkan, interaksi tanya-jawab antar murid terbukti meningkatkan pemahaman nalar sebesar 18%.",
    "evidenceData": "Sesi peer question Adit & Siti menghasilkan retensi konsep KPK yang stabil pada kuis berikutnya.",
    "targetMissions": [
      "mission-kpk-fpb",
      "mission-b-indo-deskripsi"
    ],
    "actionRecommendation": "Jadwalkan 10 menit di akhir jam pelajaran untuk fitur Presentasi Kelas."
  }
];
