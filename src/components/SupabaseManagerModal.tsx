import React, { useState, useMemo } from 'react';
import {
  Database,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  Terminal,
  X,
  Send,
  Download,
  Play,
  Layers,
  School,
  Users,
  FolderKanban,
  FileText,
  HelpCircle,
  ClipboardList,
  CheckSquare,
  ShieldCheck,
  Zap
} from 'lucide-react';
import {
  isSupabaseConfigured,
  testSupabaseConnection,
  syncAllToSupabase
} from '../lib/supabase';
import {
  UserProfile,
  LearningMission,
  StudentActivitySession,
  StudentGroup,
  SchoolProfile,
  ConceptQuiz,
  QuizSubmission,
  GroupObservationRecord
} from '../types';
import { generateDatabaseSchemaSQL } from '../lib/sqlSchemaGenerator';

interface SupabaseManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserProfile[];
  missions: LearningMission[];
  sessions: StudentActivitySession[];
  groups?: StudentGroup[];
  schools?: SchoolProfile[];
  quizzes?: ConceptQuiz[];
  quizSubmissions?: QuizSubmission[];
  groupObservations?: GroupObservationRecord[];
  onRefreshData?: () => void;
}

export const SupabaseManagerModal: React.FC<SupabaseManagerModalProps> = ({
  isOpen,
  onClose,
  users,
  missions,
  sessions,
  groups = [],
  schools = [],
  quizzes = [],
  quizSubmissions = [],
  groupObservations = [],
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<'sync' | 'sql' | 'tables' | 'guide'>('sync');
  const [copied, setCopied] = useState(false);
  const [includeUserData, setIncludeUserData] = useState(true);
  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; dataCount?: number } | null>(null);
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string } | null>(null);

  const isConfigured = isSupabaseConfigured();

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    const res = await testSupabaseConnection();
    setTestResult(res);
    setIsTesting(false);
  };

  const handleRunSync = async () => {
    setIsSyncing(true);
    setSyncResult(null);
    const res = await syncAllToSupabase(
      users,
      missions,
      sessions,
      schools,
      groups,
      quizzes,
      quizSubmissions
    );
    setSyncResult(res);
    setIsSyncing(false);
    if (res.success && onRefreshData) {
      onRefreshData();
    }
  };

  const schemaSQL = useMemo(() => {
    return generateDatabaseSchemaSQL({
      users,
      missions,
      groups,
      includeData: includeUserData
    });
  }, [users, missions, groups, includeUserData]);

  const handleCopySQL = () => {
    navigator.clipboard.writeText(schemaSQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSQL = () => {
    const element = document.createElement('a');
    const file = new Blob([schemaSQL], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = includeUserData ? 'narasa_schema_dan_data_saya.sql' : 'narasa_schema_ddl_murni.sql';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!isOpen) return null;

  const tableList = [
    { name: 'public.schools', label: 'Data Satuan Pendidikan / Profil Sekolah', count: schools.length || 1, icon: School, color: 'text-blue-600 bg-blue-50' },
    { name: 'public.users', label: 'Data Akun Multi-Role (Murid, Guru, Admin)', count: users.length, icon: Users, color: 'text-indigo-600 bg-indigo-50' },
    { name: 'public.student_groups', label: 'Data Kelompok Belajar & Akun Tim', count: groups.length, icon: Users, color: 'text-amber-600 bg-amber-50' },
    { name: 'public.learning_missions', label: 'Misi Pembelajaran IPAS & Matematika', count: missions.length, icon: FolderKanban, color: 'text-emerald-600 bg-emerald-50' },
    { name: 'public.student_sessions', label: 'Karya Eksplorasi, Bukti Foto & Slide', count: sessions.length, icon: FileText, color: 'text-purple-600 bg-purple-50' },
    { name: 'public.concept_quizzes', label: 'Bank Soal Uji Pemahaman Konsep', count: quizzes.length || 6, icon: HelpCircle, color: 'text-cyan-600 bg-cyan-50' },
    { name: 'public.quiz_submissions', label: 'Hasil Asesmen & Skor Uji Pemahaman', count: quizSubmissions.length, icon: CheckSquare, color: 'text-rose-600 bg-rose-50' },
    { name: 'public.group_observations', label: 'Rubrik Penilaian & Observasi Kelompok', count: groupObservations.length, icon: ClipboardList, color: 'text-teal-600 bg-teal-50' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 via-slate-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-[#25324B] font-display">
                  Menu Simpan & Jalankan Database
                </h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isConfigured
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  {isConfigured ? '🟢 Cloud PostgreSQL Terhubung' : '🟡 Mode Penyimpanan Lokal & Server'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Penyimpanan terpusat Supabase PostgreSQL untuk data sekolah, akun guru/murid, kelompok belajar, dan asesmen
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-1 sm:gap-2 px-6 pt-3 border-b border-slate-100 bg-slate-50/50 overflow-x-auto">
          <button
            onClick={() => setActiveTab('sync')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'sync'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>⚡ Simpan & Jalankan Sinkronisasi</span>
          </button>
          <button
            onClick={() => setActiveTab('tables')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'tables'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Daftar Tabel ({tableList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'sql'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Skrip SQL Schema & DDL</span>
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'guide'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Petunjuk Setup</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-left text-xs sm:text-sm">
          {activeTab === 'sync' && (
            <div className="space-y-5">
              {/* Primary Action Hero Card */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      Eksekusi Penyimpanan Database
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-white font-display">
                      Simpan & Jalankan Sinkronisasi Menyeluruh
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                      Menyimpan seluruh data profil sekolah, pengguna ({users.length} akun), kelompok belajar ({groups.length} tim), misi ({missions.length}), dan karya murid ({sessions.length}) langsung ke tabel Supabase PostgreSQL.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleTestConnection}
                      disabled={isTesting}
                      className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${isTesting ? 'animate-spin text-emerald-400' : ''}`} />
                      <span>{isTesting ? 'Memeriksa...' : 'Uji Koneksi'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleRunSync}
                      disabled={isSyncing}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isSyncing ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Play className="w-4 h-4 fill-white" />
                      )}
                      <span>{isSyncing ? 'Menjalankan...' : 'Simpan & Jalankan Sekarang'}</span>
                    </button>
                  </div>
                </div>

                {testResult && (
                  <div
                    className={`p-3.5 rounded-2xl text-xs flex items-start gap-2 border ${
                      testResult.success
                        ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800'
                        : 'bg-amber-950/70 text-amber-300 border-amber-800'
                    }`}
                  >
                    {testResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    )}
                    <span>{testResult.message}</span>
                  </div>
                )}

                {syncResult && (
                  <div
                    className={`p-3.5 rounded-2xl text-xs flex items-start gap-2 border ${
                      syncResult.success
                        ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800'
                        : 'bg-rose-950/70 text-rose-300 border-rose-800'
                    }`}
                  >
                    {syncResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <span>{syncResult.message}</span>
                  </div>
                )}
              </div>

              {/* Data Table Grid Snapshot */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Rincian Data yang Disimpan & Dijalankan
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 block">Akun & Pengguna</span>
                    <p className="text-xl font-bold text-indigo-600">{users.length} Akun</p>
                    <p className="text-[10px] text-slate-400">Murid, Guru & Admin</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 block">Kelompok Belajar</span>
                    <p className="text-xl font-bold text-amber-600">{groups.length} Tim</p>
                    <p className="text-[10px] text-slate-400">Akun Login Kelompok</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 block">Misi Pembelajaran</span>
                    <p className="text-xl font-bold text-emerald-600">{missions.length} Misi</p>
                    <p className="text-[10px] text-slate-400">IPAS & Matematika</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 block">Karya & Portofolio</span>
                    <p className="text-xl font-bold text-purple-600">{sessions.length} Sesi</p>
                    <p className="text-[10px] text-slate-400">Foto, Skor & Slide</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tables' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Struktur Tabel Database Supabase PostgreSQL
                  </h4>
                  <p className="text-xs text-slate-500">
                    Tabel-tabel di bawah ini telah disiapkan untuk menampung seluruh alur data aplikasi
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRunSync}
                  disabled={isSyncing}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Simpan & Jalankan Semua</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tableList.map((t, idx) => {
                  const Icon = t.icon;
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between gap-3 hover:border-slate-300 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`p-2 rounded-xl ${t.color} shrink-0`}>
                          <Icon className="w-4 h-4" />
                        </span>
                        <div>
                          <p className="text-xs font-mono font-bold text-slate-900">{t.name}</p>
                          <p className="text-[11px] text-slate-500">{t.label}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                        {t.count} baris
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>Skrip SQL Schema & Migration</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      Siap Eksekusi di Supabase
                    </span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Skrip lengkap yang berisi DDL `CREATE TABLE`, RLS Policies, dan data `INSERT` aktif ({users.length} akun, {groups.length} kelompok, {missions.length} misi).
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadSQL}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs shrink-0 cursor-pointer"
                    title="Unduh file .sql"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh .sql</span>
                  </button>
                  <button
                    onClick={handleCopySQL}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs shrink-0 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Tersalin!' : 'Salin Semua SQL'}</span>
                  </button>
                </div>
              </div>

              {/* Mode Toggle */}
              <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl w-fit">
                <button
                  type="button"
                  onClick={() => setIncludeUserData(true)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    includeUserData
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Skema DDL + Data Asli ({users.length} Akun)
                </button>
                <button
                  type="button"
                  onClick={() => setIncludeUserData(false)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    !includeUserData
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Hanya Struktur Tabel (DDL Murni)
                </button>
              </div>

              <div className="relative">
                <pre className="p-4 rounded-2xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto max-h-96 leading-relaxed border border-slate-800">
                  {schemaSQL}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900">
                Cara Menjalankan Skrip SQL di Supabase SQL Editor (3 Langkah)
              </h4>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-emerald-700 text-xs">Langkah 1: Buka Supabase Dashboard</span>
                  <p className="text-xs text-slate-600">
                    Buka <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-blue-600 underline font-medium">supabase.com</a> dan masuk ke proyek Anda.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-emerald-700 text-xs">Langkah 2: Masuk ke Menu SQL Editor</span>
                  <p className="text-xs text-slate-600">
                    Klik ikon <strong>SQL Editor</strong> pada bilah menu samping kiri Supabase, buat New Query.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-emerald-700 text-xs">Langkah 3: Tempel & Klik RUN</span>
                  <p className="text-xs text-slate-600">
                    Tempelkan script SQL yang telah Anda salin dari tab <strong>"Skrip SQL Schema & DDL"</strong>, lalu klik tombol hijau <strong>RUN</strong>. Seluruh tabel dan data akan otomatis terbuat!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <span className="text-[11px] text-slate-500 font-medium">
            PostgreSQL Database Engine • RLS Enabled • Real-Time Sync
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition-colors shadow-2xs cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
