-- ==============================================================================
-- 🌟 NARASA - UNIFIED ALL-IN-ONE SUPABASE POSTGRESQL SCHEMA & SEED DATA 🌟
-- Platform Penalaran Kontekstual Berbasis Citra, Literasi, Numerasi & Presentasi
-- Tinggal copy dan paste seluruh script ini ke SQL Editor di Dashboard Supabase!
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. ENUMS & TYPES
-- ==============================================================================
DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM ('student', 'teacher', 'school_admin', 'central_admin', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE account_status_enum AS ENUM ('active', 'inactive');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE competency_enum AS ENUM ('literacy', 'numeracy', 'both');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE assessment_type_enum AS ENUM ('pre', 'post');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- 3. TABLES DEFINITION (DDL)
-- ==============================================================================

-- 3.1 SEKOLAH (Schools & Profile Settings)
CREATE TABLE IF NOT EXISTS public.schools (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    npsn VARCHAR(20) UNIQUE,
    level VARCHAR(50) DEFAULT 'SD / MI',
    status VARCHAR(50) DEFAULT 'Negeri',
    accreditation VARCHAR(50) DEFAULT 'A (Unggul)',
    curriculum VARCHAR(150) DEFAULT 'Kurikulum Merdeka (Fase A, B, C)',
    headmaster VARCHAR(255),
    headmaster_nip VARCHAR(50),
    supervisor_name VARCHAR(255),
    supervisor_nip VARCHAR(50),
    phone VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    address TEXT,
    rt_rw VARCHAR(50),
    village VARCHAR(100),
    district VARCHAR(100),
    city VARCHAR(100),
    province VARCHAR(100),
    postal_code VARCHAR(20),
    motto TEXT,
    logo_url TEXT,
    academic_year VARCHAR(50) DEFAULT '2024/2025',
    active_semester VARCHAR(20) DEFAULT 'Ganjil',
    category VARCHAR(150),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Migrasi kolom schools jika tabel sudah ada sebelumnya
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS level VARCHAR(50) DEFAULT 'SD / MI';
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Negeri';
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS accreditation VARCHAR(50) DEFAULT 'A (Unggul)';
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS curriculum VARCHAR(150) DEFAULT 'Kurikulum Merdeka (Fase A, B, C)';
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS headmaster VARCHAR(255);
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS headmaster_nip VARCHAR(50);
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS supervisor_name VARCHAR(255);
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS supervisor_nip VARCHAR(50);
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS website VARCHAR(255);
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS rt_rw VARCHAR(50);
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS village VARCHAR(100);
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS district VARCHAR(100);
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS postal_code VARCHAR(20);
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS motto TEXT;
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS academic_year VARCHAR(50) DEFAULT '2024/2025';
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS active_semester VARCHAR(20) DEFAULT 'Ganjil';
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS category VARCHAR(150);

-- 3.2 KELAS / ROMBEL (Classes)
CREATE TABLE IF NOT EXISTS public.classes (
    id VARCHAR(50) PRIMARY KEY,
    school_id VARCHAR(50) REFERENCES public.schools(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    grade VARCHAR(20) NOT NULL,
    phase VARCHAR(20) DEFAULT 'Fase C',
    academic_year VARCHAR(20) DEFAULT '2024/2025',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3.3 PENGGUNA & PROFIL (Users: Siswa, Guru, Admin Sekolah, Admin Pusat, Akun Kelompok)
CREATE TABLE IF NOT EXISTS public.users (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role user_role_enum NOT NULL DEFAULT 'student',
    gender VARCHAR(20) DEFAULT 'male',
    email VARCHAR(255) UNIQUE NOT NULL,
    avatar TEXT,
    school_id VARCHAR(50) REFERENCES public.schools(id) ON DELETE SET NULL,
    school_name VARCHAR(255) NOT NULL,
    class_id VARCHAR(50),
    class_name VARCHAR(255) NOT NULL,
    nisn_nip VARCHAR(50),
    username VARCHAR(100),
    password VARCHAR(100),
    phone VARCHAR(30),
    status account_status_enum NOT NULL DEFAULT 'active',
    is_group BOOLEAN DEFAULT FALSE,
    group_id VARCHAR(100),
    group_members JSONB DEFAULT '[]'::jsonb,
    group_leader VARCHAR(255),
    group_motto TEXT,
    joined_date VARCHAR(50) DEFAULT 'Juli 2024',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Migrasi kolom users jika tabel sudah ada sebelumnya
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS gender VARCHAR(20) DEFAULT 'male';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS group_id VARCHAR(100);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS group_leader VARCHAR(255);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS group_motto TEXT;

-- 3.4 KELOMPOK BELAJAR SISWA (Student Groups)
CREATE TABLE IF NOT EXISTS public.student_groups (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    school_id VARCHAR(50) REFERENCES public.schools(id) ON DELETE SET NULL,
    school_name VARCHAR(255) NOT NULL,
    class_id VARCHAR(50) REFERENCES public.classes(id) ON DELETE SET NULL,
    class_name VARCHAR(255) NOT NULL,
    leader_id VARCHAR(100) REFERENCES public.users(id) ON DELETE SET NULL,
    leader_name VARCHAR(255),
    member_ids JSONB DEFAULT '[]'::jsonb,
    member_names JSONB DEFAULT '[]'::jsonb,
    avatar TEXT,
    email VARCHAR(255),
    motto TEXT,
    color VARCHAR(30) DEFAULT '#3B82F6',
    account_user_id VARCHAR(100) REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3.5 MISI PEMBELAJARAN (Learning Missions)
CREATE TABLE IF NOT EXISTS public.learning_missions (
    id VARCHAR(100) PRIMARY KEY,
    id_mapel VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    grade VARCHAR(20) NOT NULL,
    phase VARCHAR(20) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    material VARCHAR(255) NOT NULL,
    cp TEXT NOT NULL, -- Capaian Pembelajaran
    tp TEXT NOT NULL, -- Tujuan Pembelajaran
    indicators JSONB DEFAULT '[]'::jsonb,
    target_competency competency_enum NOT NULL DEFAULT 'both',
    cognitive_level VARCHAR(20) DEFAULT 'C4-C6',
    strict_curriculum_mode BOOLEAN DEFAULT TRUE,
    features JSONB DEFAULT '{
        "adaptiveDifficulty": true,
        "scaffolding": true,
        "reasoning": true,
        "evidence": true,
        "reflection": true,
        "presentation": true,
        "peerQuestion": true
    }'::jsonb,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    suggested_objects JSONB DEFAULT '[]'::jsonb,
    created_by VARCHAR(100) REFERENCES public.users(id) ON DELETE SET NULL,
    school_id VARCHAR(50) REFERENCES public.schools(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Migrasi kolom learning_missions jika tabel sudah ada sebelumnya
ALTER TABLE public.learning_missions ADD COLUMN IF NOT EXISTS id_mapel VARCHAR(50);

-- 3.6 SESI AKTIVITAS EKSPLORASI SISWA (Student Activity Sessions & Portfolio)
CREATE TABLE IF NOT EXISTS public.student_sessions (
    id VARCHAR(100) PRIMARY KEY,
    mission_id VARCHAR(100) REFERENCES public.learning_missions(id) ON DELETE CASCADE,
    mission_title VARCHAR(255) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    student_id VARCHAR(100) REFERENCES public.users(id) ON DELETE CASCADE,
    student_name VARCHAR(255) NOT NULL,
    image TEXT NOT NULL,
    image_label VARCHAR(255) NOT NULL,
    learning_bridge JSONB NOT NULL DEFAULT '{}'::jsonb,
    answers JSONB NOT NULL DEFAULT '{}'::jsonb,
    scaffolding_history JSONB NOT NULL DEFAULT '[]'::jsonb,
    reflection JSONB NOT NULL DEFAULT '{}'::jsonb,
    presentation JSONB NOT NULL DEFAULT '[]'::jsonb,
    peer_questions JSONB NOT NULL DEFAULT '[]'::jsonb,
    completed_at DATE DEFAULT CURRENT_DATE,
    status VARCHAR(30) DEFAULT 'completed',
    metrics JSONB NOT NULL DEFAULT '{
        "literacyScore": 85,
        "numeracyScore": 85,
        "reasoningScore": 85,
        "scaffoldingUsedCount": 0
    }'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3.7 BANK SOAL UJI PEMAHAMAN KONSEP (Concept Quizzes)
CREATE TABLE IF NOT EXISTS public.concept_quizzes (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    grade VARCHAR(20) NOT NULL,
    phase VARCHAR(20) NOT NULL DEFAULT 'Fase C',
    topic VARCHAR(255),
    description TEXT,
    time_limit_minutes INTEGER DEFAULT 15,
    passing_score NUMERIC(5,2) DEFAULT 75,
    target_competency VARCHAR(50) DEFAULT 'both',
    badge_reward VARCHAR(100),
    created_by VARCHAR(100) REFERENCES public.users(id) ON DELETE SET NULL,
    school_id VARCHAR(50) REFERENCES public.schools(id) ON DELETE SET NULL,
    class_id VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    questions JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Migrasi kolom concept_quizzes jika tabel sudah ada sebelumnya
ALTER TABLE public.concept_quizzes ADD COLUMN IF NOT EXISTS topic VARCHAR(255);
ALTER TABLE public.concept_quizzes ADD COLUMN IF NOT EXISTS target_competency VARCHAR(50) DEFAULT 'both';
ALTER TABLE public.concept_quizzes ADD COLUMN IF NOT EXISTS class_id VARCHAR(50);

-- 3.8 HASIL SUBMISI KUIS SISWA & KELOMPOK (Quiz Submissions)
CREATE TABLE IF NOT EXISTS public.quiz_submissions (
    id VARCHAR(100) PRIMARY KEY,
    quiz_id VARCHAR(100) REFERENCES public.concept_quizzes(id) ON DELETE CASCADE,
    quiz_title VARCHAR(255) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    user_id VARCHAR(100) REFERENCES public.users(id) ON DELETE CASCADE,
    user_name VARCHAR(255) NOT NULL,
    user_avatar TEXT,
    is_group BOOLEAN DEFAULT FALSE,
    group_members JSONB DEFAULT '[]'::jsonb,
    class_name VARCHAR(255) NOT NULL,
    class_id VARCHAR(50),
    school_name VARCHAR(255) NOT NULL,
    school_id VARCHAR(50),
    score NUMERIC(5,2) NOT NULL DEFAULT 0,
    correct_count INTEGER NOT NULL DEFAULT 0,
    total_questions INTEGER NOT NULL DEFAULT 0,
    literacy_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    numeracy_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    reasoning_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    predicate VARCHAR(50),
    feedback TEXT,
    selected_answers JSONB DEFAULT '{}'::jsonb,
    completed_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    time_spent_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3.9 ASESMEN DIAGNOSTIK & PRE/POST TEST (Student Diagnostic Assessments)
CREATE TABLE IF NOT EXISTS public.student_assessments (
    id VARCHAR(100) PRIMARY KEY,
    student_id VARCHAR(100) REFERENCES public.users(id) ON DELETE CASCADE,
    student_name VARCHAR(255) NOT NULL,
    type assessment_type_enum NOT NULL DEFAULT 'pre',
    literacy_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    numeracy_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    reasoning_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    date DATE DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3.10 INSIGHT PEDAGOGIS GURU (Teacher Pedagogical Insights)
CREATE TABLE IF NOT EXISTS public.teacher_insights (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'strength' | 'need_scaffold' | 'pedagogical_tip'
    content TEXT NOT NULL,
    evidence_data TEXT,
    target_missions JSONB DEFAULT '[]'::jsonb,
    action_recommendation TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3.11 PENGATURAN PRESENTASI & SISTEM (App Settings)
CREATE TABLE IF NOT EXISTS public.app_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3.12 CONFIGURASI GEMINI & SISTEM PENYIMPANAN CLOUD (System Settings - Real Database API Keys)
CREATE TABLE IF NOT EXISTS public.system_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 4. INDEKS PERFORMA QUERY (Performance Indexes)
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_school_id ON public.users(school_id);
CREATE INDEX IF NOT EXISTS idx_users_class_id ON public.users(class_id);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);
CREATE INDEX IF NOT EXISTS idx_users_nisn_nip ON public.users(nisn_nip);
CREATE INDEX IF NOT EXISTS idx_users_is_group ON public.users(is_group);

CREATE INDEX IF NOT EXISTS idx_groups_school_id ON public.student_groups(school_id);
CREATE INDEX IF NOT EXISTS idx_groups_class_id ON public.student_groups(class_id);
CREATE INDEX IF NOT EXISTS idx_groups_account_user ON public.student_groups(account_user_id);

CREATE INDEX IF NOT EXISTS idx_missions_subject ON public.learning_missions(subject);
CREATE INDEX IF NOT EXISTS idx_missions_grade ON public.learning_missions(grade);
CREATE INDEX IF NOT EXISTS idx_missions_is_active ON public.learning_missions(is_active);

CREATE INDEX IF NOT EXISTS idx_sessions_student_id ON public.student_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_sessions_mission_id ON public.student_sessions(mission_id);
CREATE INDEX IF NOT EXISTS idx_sessions_completed_at ON public.student_sessions(completed_at);

CREATE INDEX IF NOT EXISTS idx_quizzes_subject ON public.concept_quizzes(subject);
CREATE INDEX IF NOT EXISTS idx_quizzes_grade ON public.concept_quizzes(grade);
CREATE INDEX IF NOT EXISTS idx_quizzes_is_active ON public.concept_quizzes(is_active);

CREATE INDEX IF NOT EXISTS idx_quiz_subs_quiz_id ON public.quiz_submissions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_subs_user_id ON public.quiz_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_subs_class_id ON public.quiz_submissions(class_id);
CREATE INDEX IF NOT EXISTS idx_quiz_subs_completed_at ON public.quiz_submissions(completed_at);

CREATE INDEX IF NOT EXISTS idx_assessments_student ON public.student_assessments(student_id);

-- ==============================================================================
-- 5. TRIGGER OTOMATIS UPDATED_AT (Auto Timestamp Triggers)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_users_timestamp ON public.users;
CREATE TRIGGER set_users_timestamp
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS set_groups_timestamp ON public.student_groups;
CREATE TRIGGER set_groups_timestamp
    BEFORE UPDATE ON public.student_groups
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS set_missions_timestamp ON public.learning_missions;
CREATE TRIGGER set_missions_timestamp
    BEFORE UPDATE ON public.learning_missions
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS set_sessions_timestamp ON public.student_sessions;
CREATE TRIGGER set_sessions_timestamp
    BEFORE UPDATE ON public.student_sessions
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS set_quizzes_timestamp ON public.concept_quizzes;
CREATE TRIGGER set_quizzes_timestamp
    BEFORE UPDATE ON public.concept_quizzes
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS set_system_settings_timestamp ON public.system_settings;
CREATE TRIGGER set_system_settings_timestamp
    BEFORE UPDATE ON public.system_settings
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

-- ==============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concept_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public All Access for Schools" ON public.schools;
DROP POLICY IF EXISTS "Public All Access for Classes" ON public.classes;
DROP POLICY IF EXISTS "Public All Access for Users" ON public.users;
DROP POLICY IF EXISTS "Public All Access for Groups" ON public.student_groups;
DROP POLICY IF EXISTS "Public All Access for Missions" ON public.learning_missions;
DROP POLICY IF EXISTS "Public All Access for Student Sessions" ON public.student_sessions;
DROP POLICY IF EXISTS "Public All Access for Quizzes" ON public.concept_quizzes;
DROP POLICY IF EXISTS "Public All Access for Quiz Submissions" ON public.quiz_submissions;
DROP POLICY IF EXISTS "Public All Access for Assessments" ON public.student_assessments;
DROP POLICY IF EXISTS "Public All Access for Insights" ON public.teacher_insights;
DROP POLICY IF EXISTS "Public All Access for App Settings" ON public.app_settings;
DROP POLICY IF EXISTS "Public All Access for System Settings" ON public.system_settings;

-- Create permissive RLS policies for web application access
CREATE POLICY "Public All Access for Schools" ON public.schools FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public All Access for Classes" ON public.classes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public All Access for Users" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public All Access for Groups" ON public.student_groups FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public All Access for Missions" ON public.learning_missions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public All Access for Student Sessions" ON public.student_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public All Access for Quizzes" ON public.concept_quizzes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public All Access for Quiz Submissions" ON public.quiz_submissions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public All Access for Assessments" ON public.student_assessments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public All Access for Insights" ON public.teacher_insights FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public All Access for App Settings" ON public.app_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public All Access for System Settings" ON public.system_settings FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- 7. SEED DATA AWAL (Initial Demo Seed Data - Idempotent ON CONFLICT)
-- ==============================================================================

-- 7.1 SEED SEKOLAH
INSERT INTO public.schools (
    id, name, npsn, level, status, accreditation, curriculum,
    headmaster, headmaster_nip, supervisor_name, supervisor_nip,
    phone, email, website, address, rt_rw, village, district,
    city, province, postal_code, motto, academic_year, active_semester, category
) VALUES 
    (
        'SDN01',
        'SDN 01 Nusantara',
        '20104050',
        'SD / MI',
        'Negeri',
        'A (Unggul)',
        'Kurikulum Merdeka (Fase A, B, C)',
        'Dra. Hj. Siti Nurjanah, M.Pd.',
        '197203151998032004',
        'Dr. H. Bambang Soetopo, M.M.',
        '196805121992031003',
        '(021) 7890123',
        'sdn01nusantara@kemdikbud.go.id',
        'https://sdn01nusantara.sch.id',
        'Jl. Pendidikan Merdeka No. 45',
        '005/002',
        'Menteng',
        'Menteng',
        'Kota Jakarta Pusat',
        'DKI Jakarta',
        '10310',
        'Cerdas, Berkarakter, dan Berdaya Nalar Kritis',
        '2024/2025',
        'Ganjil',
        'Sekolah Penggerak'
    ),
    (
        'SDN02',
        'SDN 02 Kenanga',
        '20105080',
        'SD / MI',
        'Negeri',
        'A (Unggul)',
        'Kurikulum Merdeka',
        'Drs. Ahmad Fauzi, M.Pd.',
        '197508201999031002',
        'Dr. H. Bambang Soetopo, M.M.',
        '196805121992031003',
        '(021) 7890555',
        'sdn02kenanga@kemdikbud.go.id',
        'https://sdn02kenanga.sch.id',
        'Jl. Kenanga Indah No. 12',
        '003/004',
        'Gambir',
        'Gambir',
        'Kota Jakarta Pusat',
        'DKI Jakarta',
        '10110',
        'Berprestasi dalam Iptek, Kokoh dalam Imtaq',
        '2024/2025',
        'Ganjil',
        'Sekolah Rujukan Mutu'
    ),
    (
        'CENTRAL',
        'Pusat Data',
        '99999999',
        'SD / MI',
        'Negeri',
        'A (Unggul)',
        'Standar Nasional Pendidikan',
        'Drs. H. Mulyadi, M.Si.',
        '196502101990031004',
        'Prof. Dr. Suparman, M.Sc.',
        '196001011985031001',
        '(021) 5001234',
        'pusat@narasa.id',
        'https://disdik.jakarta.go.id',
        'Gedung Dinas Pendidikan Lt. 8, Jl. Gatot Subroto Kav. 40',
        '001/001',
        'Kuningan Barat',
        'Mampang Prapatan',
        'Kota Jakarta Selatan',
        'DKI Jakarta',
        '12710',
        'Pusat Integrasi & Akselerasi Mutu Pendidikan Indonesia',
        '2024/2025',
        'Ganjil',
        'Pusat Pengendali Mutu Pendidikan'
    )
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    npsn = EXCLUDED.npsn,
    level = EXCLUDED.level,
    status = EXCLUDED.status,
    accreditation = EXCLUDED.accreditation,
    curriculum = EXCLUDED.curriculum,
    headmaster = EXCLUDED.headmaster,
    headmaster_nip = EXCLUDED.headmaster_nip,
    supervisor_name = EXCLUDED.supervisor_name,
    supervisor_nip = EXCLUDED.supervisor_nip,
    phone = EXCLUDED.phone,
    email = EXCLUDED.email,
    website = EXCLUDED.website,
    address = EXCLUDED.address,
    rt_rw = EXCLUDED.rt_rw,
    village = EXCLUDED.village,
    district = EXCLUDED.district,
    city = EXCLUDED.city,
    province = EXCLUDED.province,
    postal_code = EXCLUDED.postal_code,
    motto = EXCLUDED.motto,
    academic_year = EXCLUDED.academic_year,
    active_semester = EXCLUDED.active_semester,
    category = EXCLUDED.category,
    updated_at = timezone('utc'::text, now());

-- 7.2 SEED KELAS
INSERT INTO public.classes (id, school_id, name, grade, phase, academic_year)
VALUES 
    ('V-A', 'SDN01', 'Kelas V-A (Sains & Penalaran)', 'Kelas V', 'Fase C', '2024/2025'),
    ('V-B', 'SDN01', 'Kelas V-B (Literasi & Numerasi)', 'Kelas V', 'Fase C', '2024/2025'),
    ('IV-A', 'SDN01', 'Kelas IV-A (Tematik)', 'Kelas IV', 'Fase B', '2024/2025')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 7.3 SEED PENGGUNA (Users: Guru, Murid, Admin, Kelompok)
INSERT INTO public.users (
    id, name, role, gender, email, avatar, school_id, school_name, class_id, class_name, nisn_nip, username, password, phone, status, is_group, group_members, joined_date
) VALUES
    -- Guru Wali Kelas V-A
    ('user-teacher-1', 'Pak Dedy, S.Pd.', 'teacher', 'male', 'dedy.guru@sdn01nusantara.sch.id', 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80', 'SDN01', 'SDN 01 Nusantara', 'V-A', 'Wali Kelas V-A • Guru IPA & Matematika', '198504122010011005', 'dedy123', '123456', '0812-3456-7890', 'active', FALSE, '[]'::jsonb, 'Januari 2020'),
    
    -- Guru Kelas IV
    ('user-teacher-3', 'Pak Hendra Wijaya, S.Pd.', 'teacher', 'male', 'hendra.wijaya@sdn01nusantara.sch.id', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'SDN01', 'SDN 01 Nusantara', 'IV-A', 'Guru Kelas IV • Tematik & PJOK', '199103152015031002', 'hendra123', '123456', '0815-5678-1234', 'active', FALSE, '[]'::jsonb, 'Agustus 2022'),
    
    -- Admin Sekolah
    ('user-school-admin-1', 'Ibu Ratna, S.Kom.', 'school_admin', 'female', 'admin.sdn01@narasa.id', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', 'SDN01', 'SDN 01 Nusantara', 'ALL', 'Admin Sekolah • SDN 01 Nusantara', '198009182006042008', 'admin_sdn01', 'admin123', '0811-2233-4455', 'active', FALSE, '[]'::jsonb, 'Januari 2019'),
    
    -- Admin Pusat
    ('user-central-admin-1', 'Pak Irfan Maulana, M.T.', 'central_admin', 'male', 'superadmin@narasa.id', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', 'CENTRAL', 'Pusat Data', 'ALL', 'Admin Pusat • Superadmin Nasional', '197905202003121001', 'superadmin', 'superadmin123', '0812-9988-7766', 'active', FALSE, '[]'::jsonb, 'Mei 2018'),
    
    -- Murid 1 (Budi)
    ('user-student-1', 'Budi Santoso', 'student', 'male', 'budi.santoso@siswa.sdn01nusantara.sch.id', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', 'SDN01', 'SDN 01 Nusantara', 'V-A', 'Kelas V-A (Sains & Penalaran)', '0098451234', 'budi123', '123456', '0813-1122-3344', 'active', FALSE, '[]'::jsonb, 'Juli 2024'),
    
    -- Murid 2 (Siti)
    ('user-student-2', 'Siti Rahmawati', 'student', 'female', 'siti.rawamati@siswa.sdn01nusantara.sch.id', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', 'SDN01', 'SDN 01 Nusantara', 'V-A', 'Kelas V-A (Sains & Penalaran)', '0098451235', 'siti123', '123456', '0813-2233-4455', 'active', FALSE, '[]'::jsonb, 'Juli 2024'),
    
    -- Murid 3 (Edo)
    ('user-student-3', 'Edo Pratama', 'student', 'male', 'edo.pratama@siswa.sdn01nusantara.sch.id', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', 'SDN01', 'SDN 01 Nusantara', 'V-A', 'Kelas V-A (Sains & Penalaran)', '0098451236', 'edo123', '123456', '0813-3344-5566', 'active', FALSE, '[]'::jsonb, 'Juli 2024'),
    
    -- Murid 4 (Ayu)
    ('user-student-4', 'Ayu Lestari', 'student', 'female', 'ayu.lestari@siswa.sdn01nusantara.sch.id', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80', 'SDN01', 'SDN 01 Nusantara', 'V-A', 'Kelas V-A (Sains & Penalaran)', '0098451237', 'ayu123', '123456', '0813-4455-6677', 'active', FALSE, '[]'::jsonb, 'Juli 2024'),
    
    -- Murid 5 (Rizky)
    ('user-student-5', 'Rizky Ramadhan', 'student', 'male', 'rizky.ramadhan@siswa.sdn01nusantara.sch.id', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', 'SDN01', 'SDN 01 Nusantara', 'V-A', 'Kelas V-A (Sains & Penalaran)', '0098451238', 'rizky123', '123456', '0813-5566-7788', 'active', FALSE, '[]'::jsonb, 'Juli 2024'),
    
    -- Akun Kelompok Garuda
    ('group-acc-1', 'Kelompok Garuda (Tim Investigasi Sains)', 'student', 'male', 'kelompok.garuda@sdn01nusantara.sch.id', 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=150&auto=format&fit=crop&q=80', 'SDN01', 'SDN 01 Nusantara', 'V-A', 'Kelas V-A • Kelompok Belajar', 'KEL-001', 'garuda', '123456', '0812-7788-9900', 'active', TRUE, '["Budi Santoso", "Siti Rahmawati", "Edo Pratama"]'::jsonb, 'Juli 2024'),
    
    -- Akun Kelompok Rajawali
    ('group-acc-2', 'Kelompok Rajawali (Eksplorasi Lingkungan)', 'student', 'male', 'kelompok.rajawali@sdn01nusantara.sch.id', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=150&auto=format&fit=crop&q=80', 'SDN01', 'SDN 01 Nusantara', 'V-A', 'Kelas V-A • Kelompok Belajar', 'KEL-002', 'rajawali', '123456', '0812-9900-1122', 'active', TRUE, '["Ayu Lestari", "Rizky Ramadhan", "Dewi Sartika"]'::jsonb, 'Juli 2024')
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    gender = EXCLUDED.gender,
    avatar = EXCLUDED.avatar,
    email = EXCLUDED.email,
    school_name = EXCLUDED.school_name,
    class_name = EXCLUDED.class_name,
    password = EXCLUDED.password,
    is_group = EXCLUDED.is_group,
    group_members = EXCLUDED.group_members;

-- 7.4 SEED KELOMPOK BELAJAR (Student Groups)
INSERT INTO public.student_groups (
    id, name, school_id, school_name, class_id, class_name, leader_id, leader_name, member_ids, member_names, avatar, email, motto, color, account_user_id
) VALUES
    ('group-1', 'Kelompok Garuda (Tim Investigasi Sains)', 'SDN01', 'SDN 01 Nusantara', 'V-A', 'Kelas V-A', 'user-student-1', 'Budi Santoso', '["user-student-1", "user-student-2", "user-student-3"]'::jsonb, '["Budi Santoso", "Siti Rahmawati", "Edo Pratama"]'::jsonb, 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=150&auto=format&fit=crop&q=80', 'kelompok.garuda@sdn01nusantara.sch.id', 'Terbang Tinggi Menggapai Pemahaman Sains & Matematika.', '#2563EB', 'group-acc-1'),
    ('group-2', 'Kelompok Rajawali (Eksplorasi Lingkungan)', 'SDN01', 'SDN 01 Nusantara', 'V-A', 'Kelas V-A', 'user-student-4', 'Ayu Lestari', '["user-student-4", "user-student-5", "user-student-6"]'::jsonb, '["Ayu Lestari", "Rizky Ramadhan", "Dewi Sartika"]'::jsonb, 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=150&auto=format&fit=crop&q=80', 'kelompok.rajawali@sdn01nusantara.sch.id', 'Tajam Mengamati, Cepat Memahami.', '#059669', 'group-acc-2')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    leader_name = EXCLUDED.leader_name,
    member_names = EXCLUDED.member_names,
    motto = EXCLUDED.motto;

-- 7.5 SEED MISI PEMBELAJARAN (Learning Missions)
INSERT INTO public.learning_missions (
    id, id_mapel, title, grade, phase, subject, material, cp, tp, indicators, target_competency, cognitive_level, strict_curriculum_mode, features, description, is_active, suggested_objects, created_by, school_id
) VALUES
    (
        'mission-1',
        'ipas',
        'Investigasi Klorofil & Struktur Daun Hijau',
        'Kelas V',
        'Fase C',
        'IPAS',
        'Fotosintesis & Pigmen Tumbuhan Hijau',
        'Peserta didik menganalisis hubungan antara struktur jaringan tumbuhan dan proses fotosintesis dalam menghasilkan energi.',
        'Mengidentifikasi peran klorofil pada daun hijau dan menghitung perkiraan luas permukaan daun untuk laju fotosintesis optimal.',
        '["Menjelaskan fungsi klorofil", "Mengukur estimasi luas daun", "Menyusun argumen ilmiah fotosintesis"]'::jsonb,
        'both',
        'C4-C6',
        TRUE,
        '{"adaptiveDifficulty": true, "scaffolding": true, "reasoning": true, "evidence": true, "reflection": true, "presentation": true, "peerQuestion": true}'::jsonb,
        'Misi sains kontekstual di halaman sekolah untuk menemukan bukti adaptasi daun dan pigmen klorofil.',
        TRUE,
        '["Daun mangga", "Daun pepaya", "Tanaman hias", "Kloroplas"]'::jsonb,
        'user-teacher-1',
        'SDN01'
    ),
    (
        'mission-2',
        'matematika',
        'Eksplorasi Sudut & Kelipatan Persekutuan Terkecil (KPK) pada Jam Analog',
        'Kelas V',
        'Fase C',
        'Matematika',
        'Pengukuran Sudut & Kelipatan Waktu',
        'Peserta didik mampu menghitung besar sudut putar dan memecahkan masalah kelipatan persekutuan terkecil (KPK) dalam kehidupan sehari-hari.',
        'Menentukan sudut yang dibentuk jarum jam dan menghitung interval waktu pertemuan jarum dengan konsep KPK.',
        '["Menghitung sudut elevasi jarum jam", "Menentukan kelipatan waktu", "Menyajikan solusi penalaran numerasi"]'::jsonb,
        'numeracy',
        'C4-C6',
        TRUE,
        '{"adaptiveDifficulty": true, "scaffolding": true, "reasoning": true, "evidence": true, "reflection": true, "presentation": true, "peerQuestion": true}'::jsonb,
        'Misi numerasi kontekstual mengamati jarum jam dinding di kelas atau rumah untuk membuktikan konsep matematika realistik.',
        TRUE,
        '["Jam dinding analog", "Stopwatch", "Jarum jam", "Busur derajat"]'::jsonb,
        'user-teacher-1',
        'SDN01'
    ),
    (
        'mission-3',
        'ipas',
        'Detektif Siklus Air & Evaporasi di Lingkungan Sekolah',
        'Kelas V',
        'Fase C',
        'IPAS',
        'Siklus Hidrologi & Perubahan Wujud Benda',
        'Peserta didik menyelidiki tahapan siklus air (evaporasi, kondensasi, presipitasi) serta dampaknya terhadap ketersediaan air bersih.',
        'Menjelaskan fenomena penguapan air di genangan atau tanaman dan menghitung estimasi volume air dalam siklus pendek.',
        '["Mengidentifikasi bukti evaporasi", "Menganalisis faktor suhu dan angin", "Merumuskan konservasi air"]'::jsonb,
        'both',
        'C4-C6',
        TRUE,
        '{"adaptiveDifficulty": true, "scaffolding": true, "reasoning": true, "evidence": true, "reflection": true, "presentation": true, "peerQuestion": true}'::jsonb,
        'Misi detektif lingkungan sekolah untuk mengamati jejak siklus air di sekitar kita.',
        TRUE,
        '["Genangan air", "Embun pagi", "Wadah air terbuka", "Awan"]'::jsonb,
        'user-teacher-1',
        'SDN01'
    )
ON CONFLICT (id) DO UPDATE SET 
    title = EXCLUDED.title,
    material = EXCLUDED.material,
    id_mapel = EXCLUDED.id_mapel,
    tp = EXCLUDED.tp,
    cp = EXCLUDED.cp;

-- 7.6 SEED BANK SOAL UJI PEMAHAMAN KONSEP (Quizzes)
INSERT INTO public.concept_quizzes (
    id, title, subject, grade, phase, topic, description, time_limit_minutes, passing_score, target_competency, is_active, questions, created_by, school_id
) VALUES
    (
        'quiz-ipas-1',
        'Asesmen Pemahaman: Fotosintesis & Klorofil Tumbuhan',
        'IPAS',
        'Kelas V',
        'Fase C',
        'Fotosintesis & Klorofil Tumbuhan',
        'Uji pemahaman komprehensif konsep fotosintesis, pigmen klorofil, dan translokasi zat makanan pada daun hijau.',
        15,
        75.00,
        'both',
        TRUE,
        '[
            {
                "id": "q1",
                "question": "Mengapa daun bagian atas umumnya berwarna hijau lebih pekat dibandingkan daun bagian bawah?",
                "options": [
                    {"id": "o1", "text": "Karena memiliki lapisan lilin yang tebal dan jaringan palisade kaya klorofil"},
                    {"id": "o2", "text": "Karena terkena air hujan lebih banyak"},
                    {"id": "o3", "text": "Karena bagian bawah daun tidak membutuhkan zat hara"},
                    {"id": "o4", "text": "Karena daun bagian bawah hanya berfungsi sebagai penahan angin"}
                ],
                "correctOptionId": "o1",
                "explanation": "Bagian atas daun memiliki jaringan palisade yang padat dengan klorofil untuk memaksimalkan penyerapan cahaya matahari.",
                "conceptTag": "Penalaran Biologi Tumbuhan",
                "questionType": "single_choice",
                "competencyType": "reasoning",
                "cognitiveLevel": "C4"
            },
            {
                "id": "q2",
                "question": "Gas apa yang diserap tumbuhan saat fotosintesis dan gas apa yang dilepaskan ke udara?",
                "options": [
                    {"id": "o1", "text": "Menyerap Karbondioksida (CO2), Melepaskan Oksigen (O2)"},
                    {"id": "o2", "text": "Menyerap Oksigen (O2), Melepaskan Nitrogen (N2)"},
                    {"id": "o3", "text": "Menyerap Hidrogen (H2), Melepaskan Karbondioksida (CO2)"},
                    {"id": "o4", "text": "Menyerap Oksigen (O2), Melepaskan Karbondioksida (CO2)"}
                ],
                "correctOptionId": "o1",
                "explanation": "Fotosintesis menggunakan CO2 dan air dengan bantuan cahaya matahari untuk menghasilkan glukosa dan melepaskan O2.",
                "conceptTag": "Reaksi Biokimia Fotosintesis",
                "questionType": "single_choice",
                "competencyType": "literacy",
                "cognitiveLevel": "C3"
            }
        ]'::jsonb,
        'user-teacher-1',
        'SDN01'
    ),
    (
        'quiz-mat-1',
        'Asesmen Numerasi: Sudut & Kelipatan Waktu Jam Dinding',
        'Matematika',
        'Kelas V',
        'Fase C',
        'Sudut & Kelipatan Waktu Jam Dinding',
        'Uji penalaran matematis dalam menghitung sudut jarum jam dan memecahkan masalah KPK interval waktu.',
        15,
        75.00,
        'numeracy',
        TRUE,
        '[
            {
                "id": "qm1",
                "question": "Berapa besar sudut terkecil yang dibentuk oleh jarum jam panjang dan pendek tepat pada pukul 03.00?",
                "options": [
                    {"id": "o1", "text": "90° (Sudut Siku-siku)"},
                    {"id": "o2", "text": "45° (Sudut Lancip)"},
                    {"id": "o3", "text": "120° (Sudut Tumpul)"},
                    {"id": "o4", "text": "180° (Sudut Lurus)"}
                ],
                "correctOptionId": "o1",
                "explanation": "Setiap pergeseran 1 angka pada jam analog mewakili 30°. Dari angka 12 ke angka 3 adalah 3 × 30° = 90°.",
                "conceptTag": "Pengukuran Sudut Jam",
                "questionType": "single_choice",
                "competencyType": "numeracy",
                "cognitiveLevel": "C3"
            },
            {
                "id": "qm2",
                "question": "Lampu A menyala setiap 4 menit, lampu B menyala setiap 6 menit. Pada menit ke berapa kedua lampu menyala bersamaan pertama kali?",
                "options": [
                    {"id": "o1", "text": "Menit ke-12"},
                    {"id": "o2", "text": "Menit ke-24"},
                    {"id": "o3", "text": "Menit ke-10"},
                    {"id": "o4", "text": "Menit ke-18"}
                ],
                "correctOptionId": "o1",
                "explanation": "KPK dari 4 dan 6 adalah 12. Jadi kedua lampu menyala bersamaan pada menit ke-12.",
                "conceptTag": "Kelipatan Persekutuan Terkecil (KPK)",
                "questionType": "single_choice",
                "competencyType": "reasoning",
                "cognitiveLevel": "C4"
            }
        ]'::jsonb,
        'user-teacher-1',
        'SDN01'
    ),
    (
        'quiz-ind-1',
        'Asesmen Literasi: Analisis Teks Eksplanasi Sains',
        'Bahasa Indonesia',
        'Kelas V',
        'Fase C',
        'Analisis Teks Eksplanasi Sains',
        'Mengidentifikasi gagasan pokok, sebab-akibat, dan inferensi bukti ilmiah dalam teks eksplanasi.',
        15,
        75.00,
        'literacy',
        TRUE,
        '[
            {
                "id": "qi1",
                "question": "Teks eksplanasi ilmiah bertujuan untuk...",
                "options": [
                    {"id": "o1", "text": "Menjelaskan proses terjadinya suatu fenomena alam atau sosial secara logis berdasarkan fakta"},
                    {"id": "o2", "text": "Menceritakan kisah khayalan tokoh hewan"},
                    {"id": "o3", "text": "Membujuk pembaca membeli barang"},
                    {"id": "o4", "text": "Menggambarkan keindahan pemandangan secara subjektif"}
                ],
                "correctOptionId": "o1",
                "explanation": "Teks eksplanasi memaparkan hubungan sebab-akibat dan kronologi ilmiah dari suatu peristiwa atau fenomena.",
                "conceptTag": "Struktur Teks Eksplanasi",
                "questionType": "single_choice",
                "competencyType": "literacy",
                "cognitiveLevel": "C3"
            }
        ]'::jsonb,
        'user-teacher-1',
        'SDN01'
    )
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    topic = EXCLUDED.topic,
    target_competency = EXCLUDED.target_competency,
    questions = EXCLUDED.questions;

-- 7.7 SEED SESI AKTIVITAS & PORTOFOLIO SISWA (student_sessions)
INSERT INTO public.student_sessions (
    id, mission_id, mission_title, subject, student_id, student_name, image, image_label,
    learning_bridge, answers, scaffolding_history, reflection, presentation, peer_questions, completed_at, status, metrics
) VALUES
    (
        'session-adit-interval-kpk',
        'mission-2',
        'Eksplorasi Sudut & Kelipatan Persekutuan Terkecil (KPK) pada Jam Analog',
        'Matematika',
        'user-student-1',
        'Budi Santoso',
        'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&auto=format&fit=crop&q=80',
        'Pola Susunan Undakan Tangga & Ubin Sekolah',
        '{"detectedObject": "Pola susunan undakan tangga dan ubin teratur", "observation": "Saya melihat susunan anak tangga sekolah dengan penanda reflektor garis setiap kelipatan tertentu dan ubin berjarak sama.", "learningBridge": "Susunan undakan bertingkat menunjukkan pola yang berulang secara berkala. Dihitung dengan KPK.", "subject": "Matematika", "material": "Kelipatan Persekutuan Terkecil (KPK) & Faktor Persekutuan Terbesar (FPB)"}'::jsonb,
        '{"challengeAnswer": "Kedua bel akan berbunyi bersamaan lagi setelah 12 menit, yaitu pada pukul 08.12 WIB.", "reason": "Saya memilih konsep KPK karena kedua kegiatan berlangsung berulang berkala.", "evidence": "Kelipatan 4: 4, 8, 12, 16... Kelipatan 6: 6, 12, 18... KPK = 12."}'::jsonb,
        '[{"questionId": "q-kpk-1", "level": 1, "hintText": "Coba tuliskan kelipatan 4 dan 6", "requestedAt": "2026-09-22T08:05:00Z"}]'::jsonb,
        '{"q1Found": "Tangga punya pola kelipatan", "q2Learned": "Jadwal berulang dihitung dengan KPK", "q3Hardest": "Alasan bukan FPB", "q4Solved": "Membayangkan lompatan berjarak sama", "q5Improvement": "Menggunakan pohon faktor"}'::jsonb,
        '[{"id": "s1", "slideNumber": 1, "title": "Pola Interval & KPK", "subtitle": "Budi Santoso", "content": "Hasil eksplorasi matematika di tangga sekolah.", "layout": "title"}]'::jsonb,
        '[]'::jsonb,
        '2026-09-22',
        'completed',
        '{"literacyScore": 88, "numeracyScore": 94, "reasoningScore": 92, "scaffoldingUsedCount": 1}'::jsonb
    ),
    (
        'session-siti-klorofil-daun',
        'mission-1',
        'Investigasi Klorofil & Struktur Daun Hijau',
        'IPAS',
        'user-student-2',
        'Siti Rahmawati',
        'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&auto=format&fit=crop&q=80',
        'Struktur Tulang Daun Mangga & Butiran Embun di Taman',
        '{"detectedObject": "Daun mangga hijau segar dengan tulang daun menyirip", "observation": "Saya memotret daun mangga di taman sekolah. Permukaan atasnya berwarna hijau tua mengilap.", "learningBridge": "Warna hijau pekat berasal dari klorofil penangkap cahaya matahari untuk fotosintesis.", "subject": "IPAS", "material": "Fotosintesis & Struktur Jaringan Tumbuhan"}'::jsonb,
        '{"challengeAnswer": "Bagian atas daun berwarna hijau lebih pekat karena jaringan tiang palisade kaya klorofil untuk menyerap sinar matahari optimal.", "reason": "Matahari datang dari arah atas sehingga klorofil terkonsentrasi di permukaan atas.", "evidence": "Sisi atas hijau zamrud pekat, sisi bawah pucat dan memiliki stomata."}'::jsonb,
        '[]'::jsonb,
        '{"q1Found": "Permukaan atas licin dan hijau pekat", "q2Learned": "Fotosintesis menghasilkan oksigen", "q3Hardest": "Membedakan xilem dan floem", "q4Solved": "Membuat jembatan keledai", "q5Improvement": "Meneliti daun warna merah"}'::jsonb,
        '[{"id": "s1", "slideNumber": 1, "title": "Rahasia Hijau Daun", "subtitle": "Siti Rahmawati", "content": "Eksplorasi fotosintesis di taman sekolah.", "layout": "title"}]'::jsonb,
        '[]'::jsonb,
        '2026-09-23',
        'completed',
        '{"literacyScore": 95, "numeracyScore": 86, "reasoningScore": 94, "scaffoldingUsedCount": 0}'::jsonb
    ),
    (
        'session-budi-kipas-rotasi',
        'mission-2',
        'Eksplorasi Sudut & Kelipatan Persekutuan Terkecil (KPK) pada Jam Analog',
        'Matematika',
        'user-student-3',
        'Edo Pratama',
        'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&auto=format&fit=crop&q=80',
        'Baling-baling Kipas Angin Plafon Ruang Kelas',
        '{"detectedObject": "Baling-baling kipas angin plafon 3 bilah simetris", "observation": "Kipas angin di langit-langit kelas V-A memiliki 3 bilah berjarak sama.", "learningBridge": "Satu putaran penuh 360 derajat dibagi 3 bilah membentuk sudut 120 derajat.", "subject": "Matematika", "material": "Pengukuran Sudut & Kelipatan Derajat"}'::jsonb,
        '{"challengeAnswer": "Besar sudut antara dua bilah kipas berdekatan adalah 120 derajat.", "reason": "360 derajat dibagi rata 3 bilah adalah 120 derajat.", "evidence": "360 : 3 = 120. 120 + 120 + 120 = 360 derajat."}'::jsonb,
        '[]'::jsonb,
        '{"q1Found": "Jumlah bilah kipas dibuat seimbang", "q2Learned": "Lingkaran penuh 360 derajat", "q3Hardest": "Membayangkan saat berputar", "q4Solved": "Mengamati saat kipas mati", "q5Improvement": "Mengukur kipas 4 bilah"}'::jsonb,
        '[{"id": "s1", "slideNumber": 1, "title": "Sudut Putaran Kipas", "subtitle": "Edo Pratama", "content": "Eksplorasi sudut dan rotasi kipas kelas.", "layout": "title"}]'::jsonb,
        '[]'::jsonb,
        '2026-09-24',
        'completed',
        '{"literacyScore": 85, "numeracyScore": 96, "reasoningScore": 91, "scaffoldingUsedCount": 0}'::jsonb
    )
ON CONFLICT (id) DO UPDATE SET
    mission_title = EXCLUDED.mission_title,
    answers = EXCLUDED.answers,
    completed_at = EXCLUDED.completed_at;

-- 7.8 SEED PENGATURAN DEFAULT SISTEM
INSERT INTO public.app_settings (key, value)
VALUES 
    ('presentation_settings', '{"mode": "both"}'::jsonb),
    ('app_metadata', '{"version": "2.4.0", "appName": "NARASA", "curriculum": "Kurikulum Merdeka Fase C"}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- ==============================================================================
-- 🎉 SELESAI! SELURUH SKEMA DATABASE DAN SEED DATA BERHASIL DIKONFIGURASI.
-- Semua tabel, relasi, indeks, trigger, RLS, dan akun demo siap digunakan!
-- ==============================================================================
