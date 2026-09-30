import React, { useState } from 'react';
import {
  StudentActivitySession,
  UserProfile,
  StudentGroup,
  GroupObservationRecord
} from '../types';
import { StudentPortfolioReportModal } from './StudentPortfolioReportModal';
import { isSupabaseConfigured, dbDeleteSession } from '../lib/supabase';
import { toast } from './Toast';
import {
  FolderKanban,
  Search,
  Calendar,
  BookOpen,
  Eye,
  CheckCircle2,
  Play,
  FileText,
  Brain,
  Lightbulb,
  ExternalLink,
  Filter,
  ChevronDown,
  Printer,
  RefreshCw,
  Trash2,
  User,
  Compass,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface PortfolioGalleryProps {
  sessions: StudentActivitySession[];
  onOpenSessionPresentation: (session: StudentActivitySession) => void;
  users?: UserProfile[];
  currentUser?: UserProfile;
  groups?: StudentGroup[];
  groupObservations?: GroupObservationRecord[];
  onRefreshDatabase?: () => Promise<void>;
  onNavigateToExplore?: () => void;
}

export const PortfolioGallery: React.FC<PortfolioGalleryProps> = ({
  sessions,
  onOpenSessionPresentation,
  users = [],
  currentUser = {
    id: 'user-student-1',
    name: 'Siswa Narasa',
    email: 'siswa@narasa.sch.id',
    role: 'student',
    schoolName: 'UPT SD Negeri Remen 2',
    schoolId: 'SDN01',
    className: 'Kelas V',
    classId: 'V',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
  },
  groups = [],
  groupObservations = [],
  onRefreshDatabase,
  onNavigateToExplore
}) => {
  const isStudent = currentUser.role === 'student';
  const mySessionsCount = sessions.filter((s) => s.studentId === currentUser.id).length;

  // Active Scope: 'my' (Karya Saya) vs 'class' (Semua Karya Kelas)
  // Default to 'my' for students if they have works, or 'class' if they have none yet or are teachers/admins
  const [activeScope, setActiveScope] = useState<'my' | 'class'>(
    isStudent && mySessionsCount > 0 ? 'my' : 'class'
  );

  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedStudentFilter, setSelectedStudentFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDetailSession, setActiveDetailSession] = useState<StudentActivitySession | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<StudentActivitySession | null>(null);

  // Print Report Modal state
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printTargetSessionId, setPrintTargetSessionId] = useState<string | null>(null);

  const subjects = ['all', ...Array.from(new Set(sessions.map((s) => s.subject)))];

  // Base scope filter
  const scopedSessions = sessions.filter((s) => {
    if (isStudent && activeScope === 'my') {
      return s.studentId === currentUser.id;
    }
    if (!isStudent && selectedStudentFilter !== 'all') {
      return s.studentId === selectedStudentFilter;
    }
    return true;
  });

  const filtered = scopedSessions.filter((s) => {
    const matchSubj = selectedSubject === 'all' || s.subject === selectedSubject;
    const matchSearch =
      s.missionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.imageLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.studentName && s.studentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.learningBridge?.detectedObject &&
        s.learningBridge.detectedObject.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchSubj && matchSearch;
  });

  const handleManualRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      if (onRefreshDatabase) {
        await onRefreshDatabase();
      }
      toast.success(
        'Data Berhasil Disinkronkan! ✨',
        `Memuat ${sessions.length} karya portofolio terbaru.`
      );
    } catch (e: any) {
      toast.error('Gagal Sinkronisasi Database', e?.message || 'Periksa koneksi jaringan.');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleOpenPrintModal = (sessionId?: string) => {
    setPrintTargetSessionId(sessionId || null);
    setIsPrintModalOpen(true);
  };

  const confirmDeleteSession = async () => {
    if (!sessionToDelete) return;
    const target = sessionToDelete;
    setSessionToDelete(null);

    try {
      const ok = await dbDeleteSession(target.id);
      if (ok) {
        toast.success(
          'Karya Berhasil Dihapus dari Database',
          `Portofolio "${target.imageLabel}" telah dihapus.`
        );
        if (onRefreshDatabase) {
          await onRefreshDatabase();
        }
      } else {
        toast.error('Gagal Menghapus Karya', 'Terjadi kendala saat menghapus data.');
      }
    } catch (err) {
      toast.error('Gagal Menghapus Karya', 'Periksa koneksi database.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 text-left">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-blue-100 text-[#4F8EF7]">
                <FolderKanban className="w-5 h-5" />
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-[#25324B] font-display">
                Portofolio Digital Murid
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Galeri rekam jejak eksplorasi citra, penalaran kritis AI, bukti nyata, dan presentasi mandiri
            </p>
          </div>

          {/* Header Action: Print Portfolio Button */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={() => handleOpenPrintModal('all')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95"
              title="Cetak Laporan Lengkap Portofolio (PDF)"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Rekap PDF</span>
            </button>
          </div>
        </div>

        {/* Scope Toggle (Karya Saya vs Semua Karya Kelas) for Students */}
        {isStudent && (
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setActiveScope('my')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeScope === 'my'
                    ? 'bg-white text-blue-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>Karya Saya ({mySessionsCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveScope('class')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeScope === 'class'
                    ? 'bg-white text-purple-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Semua Karya Kelas ({sessions.length})</span>
              </button>
            </div>

            <span className="text-[11px] text-slate-500 font-medium">
              {activeScope === 'my'
                ? `Menampilkan ${filtered.length} karya atas nama kamu (${currentUser.name})`
                : `Menampilkan seluruh karya teman sekelas dari database`}
            </span>
          </div>
        )}

        {/* Filter Bar: Subject Dropdown, Student Filter (for Teacher), Search Box */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            {/* Subject Selector */}
            <div className="relative w-full sm:w-40">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full appearance-none pl-3 pr-8 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 cursor-pointer shadow-2xs transition-all"
              >
                {subjects.map((subj) => (
                  <option key={subj} value={subj}>
                    {subj === 'all' ? 'Semua Mapel' : subj}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Student Filter for Teachers/Admins */}
            {!isStudent && users.length > 0 && (
              <div className="relative w-full sm:w-48">
                <select
                  value={selectedStudentFilter}
                  onChange={(e) => setSelectedStudentFilter(e.target.value)}
                  className="w-full appearance-none pl-3 pr-8 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 cursor-pointer shadow-2xs transition-all"
                >
                  <option value="all">Semua Murid ({users.filter((u) => u.role === 'student').length})</option>
                  {users
                    .filter((u) => u.role === 'student')
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({sessions.filter((ses) => ses.studentId === s.id).length} karya)
                      </option>
                    ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            )}
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama murid, objek, materi..."
              className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* Grid of Portfolio Cards or Empty State */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((session) => {
            const isNumeracy = session.subject.toLowerCase().includes('matematika');
            const isMyWork = session.studentId === currentUser.id;
            const canDelete = !isStudent || isMyWork;

            return (
              <div
                key={session.id}
                className={`rounded-3xl border-2 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col group relative ${
                  isMyWork
                    ? 'ring-2 ring-blue-400/50 bg-gradient-to-b from-blue-50/40 via-white to-white border-blue-200'
                    : isNumeracy
                    ? 'bg-gradient-to-b from-sky-50/40 via-white to-white border-sky-200/80 hover:border-sky-300'
                    : 'bg-gradient-to-b from-emerald-50/40 via-white to-white border-emerald-200/80 hover:border-emerald-300'
                }`}
              >
                {/* Photo with Overlay Badges */}
                <div className="relative aspect-16/10 overflow-hidden bg-slate-900">
                  <img
                    src={session.image}
                    alt={session.imageLabel}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-black/70 backdrop-blur-xs text-white border border-white/20">
                      {session.subject}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/90 text-white backdrop-blur-xs shadow-2xs">
                      {isNumeracy ? '📐 Numerasi' : '🌱 Literasi'}
                    </span>
                    {isMyWork && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-600 text-white shadow-2xs">
                        🌟 Karya Saya
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-2 right-2 px-2.5 py-0.5 rounded-lg bg-black/70 text-white text-[10px] font-bold flex items-center gap-1 backdrop-blur-xs">
                    <Calendar className="w-3 h-3 text-blue-300" />
                    {session.completedAt}
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base font-bold text-[#25324B] group-hover:text-[#4F8EF7] transition-colors line-clamp-1">
                        {session.imageLabel}
                      </h3>
                      <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md shrink-0">
                        👤 {session.studentName}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 font-medium">
                      {session.missionTitle}
                    </p>

                    <div className="bg-slate-50/90 p-3 rounded-2xl border border-slate-200/80 text-[11px] text-slate-600 space-y-1 mt-2 shadow-2xs">
                      <div className="flex items-center gap-1.5 text-[#25324B] font-bold">
                        <Brain className="w-3.5 h-3.5 text-[#7C5CFC]" />
                        <span>Penalaran Kritis Murid:</span>
                      </div>
                      <p className="line-clamp-2 italic text-slate-700">
                        “{session.answers.reason || session.answers.challengeAnswer}”
                      </p>
                    </div>

                    {session.teacherFeedback && (
                      <div className="bg-amber-50/90 border border-amber-200 p-2.5 rounded-xl text-[11px] text-amber-950 font-medium space-y-0.5">
                        <div className="flex items-center justify-between text-[10px] font-bold text-amber-800">
                          <span>💬 Penguatan Guru:</span>
                          <span>{session.teacherFeedback.badgeReward || '🌟'} {session.teacherFeedback.overallScore}/100</span>
                        </div>
                        <p className="line-clamp-1 italic text-amber-900">
                          “{session.teacherFeedback.overallReinforcement}”
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5">
                    <button
                      onClick={() => setActiveDetailSession(session)}
                      className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                      title="Lihat Detail Proses Penalaran"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span className="hidden sm:inline">Proses</span>
                    </button>
                    <button
                      onClick={() => handleOpenPrintModal(session.id)}
                      className="p-2 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1 transition-colors shadow-2xs"
                      title="Cetak Lembar Portofolio PDF"
                    >
                      <Printer className="w-3.5 h-3.5 text-emerald-600" />
                      <span>PDF</span>
                    </button>
                    <button
                      onClick={() => onOpenSessionPresentation(session)}
                      className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-[#4F8EF7] to-[#7C5CFC] hover:shadow-md text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Putar Slide</span>
                    </button>

                    {canDelete && (
                      <button
                        onClick={() => setSessionToDelete(session)}
                        className="p-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs transition-colors"
                        title="Hapus Karya dari Database"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 text-center space-y-4 shadow-sm max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner border border-blue-100">
            <FolderKanban className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display">
              {isStudent && activeScope === 'my'
                ? `Belum Ada Karya Atas Nama ${currentUser.name}`
                : 'Tidak Ada Karya Portofolio yang Sesuai'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              {isStudent && activeScope === 'my'
                ? `Karya eksplorasi foto dan penalaranmu yang tersimpan di database akan otomatis muncul di sini. Ayo selesaikan misi belajarmu!`
                : `Tidak ditemukan karya eksplorasi yang cocok dengan filter atau kata kunci pencarian.`}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {isStudent && activeScope === 'my' && (
              <>
                {onNavigateToExplore && (
                  <button
                    onClick={onNavigateToExplore}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
                  >
                    <Compass className="w-4 h-4" />
                    <span>Mulai Misi Eksplorasi Sekarang</span>
                  </button>
                )}
                <button
                  onClick={() => setActiveScope('class')}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Lihat Karya Teman Sekelas ({sessions.length})</span>
                </button>
              </>
            )}

            <button
              onClick={handleManualRefresh}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Muat Ulang Database</span>
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {sessionToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4 text-left animate-in fade-in">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Hapus Karya dari Database?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Anda akan menghapus karya <strong>"{sessionToDelete.imageLabel}"</strong> milik{' '}
                <strong>{sessionToDelete.studentName}</strong> dari database. Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSessionToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={confirmDeleteSession}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                Ya, Hapus Karya
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal for Full Thinking Journey */}
      {activeDetailSession && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                  {activeDetailSession.subject} • {activeDetailSession.missionTitle}
                </span>
                <h3 className="text-xl font-bold text-[#25324B] font-display">
                  {activeDetailSession.imageLabel}
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  Murid: <strong>{activeDetailSession.studentName}</strong> • Tanggal: {activeDetailSession.completedAt}
                </span>
              </div>
              <button
                onClick={() => setActiveDetailSession(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700">
              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-100">
                <strong className="block text-blue-900 mb-1">👁️ Hasil Observasi:</strong>
                <p>{activeDetailSession.learningBridge.observation}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-100">
                <strong className="block text-purple-900 mb-1">🔗 Hubungan Pelajaran:</strong>
                <p>{activeDetailSession.learningBridge.learningBridge}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100">
                <strong className="block text-emerald-900 mb-1">💡 Solusi:</strong>
                <p>{activeDetailSession.answers.challengeAnswer || activeDetailSession.answers.problemSolving || activeDetailSession.answers.strategy}</p>
              </div>

              {activeDetailSession.teacherFeedback && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50/40 to-amber-100/50 border-2 border-amber-300 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>Umpan Balik & Penguatan Guru ({activeDetailSession.teacherFeedback.teacherName}):</span>
                    </span>
                    <span className="text-xs font-black bg-amber-200 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300">
                      {activeDetailSession.teacherFeedback.badgeReward || '🌟'} Nilai: {activeDetailSession.teacherFeedback.overallScore} ({activeDetailSession.teacherFeedback.predicate})
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-amber-950 bg-white/90 p-3 rounded-xl border border-amber-200 leading-relaxed italic">
                    “{activeDetailSession.teacherFeedback.overallReinforcement}”
                  </p>
                  {activeDetailSession.teacherFeedback.overallFeedback && (
                    <p className="text-xs text-slate-700 bg-white/70 p-2.5 rounded-xl border border-slate-200">
                      <strong>Catatan Evaluasi Guru:</strong> {activeDetailSession.teacherFeedback.overallFeedback}
                    </p>
                  )}
                </div>
              )}

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-100">
                <strong className="block text-amber-900 mb-1">🧠 Alasan & Cara Berpikir:</strong>
                <p>{activeDetailSession.answers.reason}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-100">
                <strong className="block text-indigo-900 mb-1">🔍 Bukti & Perhitungan:</strong>
                <p>{activeDetailSession.answers.evidence}</p>
              </div>

              {activeDetailSession.reflection && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-100">
                  <strong className="block text-rose-900 mb-1">🤔 Refleksi Murid:</strong>
                  {activeDetailSession.reflection.q2Learned && (
                    <p>
                      <strong>Hal yang dipelajari:</strong> {activeDetailSession.reflection.q2Learned}
                    </p>
                  )}
                  {activeDetailSession.reflection.q3Hardest && (
                    <p className="mt-1">
                      <strong>Bagian tersulit:</strong> {activeDetailSession.reflection.q3Hardest}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 border-t border-slate-100">
              <button
                onClick={() => {
                  const s = activeDetailSession;
                  setActiveDetailSession(null);
                  handleOpenPrintModal(s.id);
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Dokumen (PDF)</span>
              </button>

              <button
                onClick={() => {
                  const s = activeDetailSession;
                  setActiveDetailSession(null);
                  onOpenSessionPresentation(s);
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4F8EF7] to-[#7C5CFC] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Buka Mode Presentasi</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRINT PORTFOLIO REPORT MODAL */}
      <StudentPortfolioReportModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        sessions={sessions}
        users={users}
        currentUser={currentUser}
        groups={groups}
        groupObservations={groupObservations}
        initialSelectedSessionId={printTargetSessionId}
      />
    </div>
  );
};
