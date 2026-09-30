import React, { useState } from 'react';
import literacyNumeracyHeroBg from '../assets/images/literasi_numerasi_bg_1790603989599.jpg';
import * as XLSX from 'xlsx';
import { StudentGroup, UserProfile, QuizSubmission, StudentActivitySession, GroupObservationRecord, LearningMission } from '../types';
import { studentBoy1 } from '../data/avatarData';
import { dbBulkUpsertGroups, dbFetchUsers } from '../lib/supabase';
import { GroupManagerModal, formatGroupUsername, formatClassName } from './GroupManagerModal';
import { GroupObservationModal } from './GroupObservationModal';
import { GroupLoginCardsModal } from './GroupLoginCardsModal';
import { toast } from './Toast';
import {
  Users,
  Plus,
  Crown,
  Sparkles,
  Shuffle,
  Mail,
  UserCheck,
  CheckCircle2,
  Play,
  Edit2,
  Trash2,
  ArrowRight,
  GraduationCap,
  Award,
  Search,
  BookOpen,
  FileSpreadsheet,
  Download,
  KeyRound,
  Copy,
  Check,
  Eye,
  EyeOff,
  ClipboardList,
  Printer,
  RefreshCw,
  Save,
  Database
} from 'lucide-react';

interface TeacherGroupManagementProps {
  groups: StudentGroup[];
  users: UserProfile[];
  currentUser: UserProfile;
  quizSubmissions: QuizSubmission[];
  sessions: StudentActivitySession[];
  groupObservations?: GroupObservationRecord[];
  missions?: LearningMission[];
  onSaveObservation?: (record: GroupObservationRecord) => void;
  onSaveGroup: (group: StudentGroup, associatedUser: UserProfile) => void;
  onDeleteGroup: (groupId: string) => void;
  onSyncGroupsToDatabase?: (groupsToSync?: StudentGroup[]) => Promise<boolean>;
  onSwitchUser: (user: UserProfile) => void;
  onOpenQuizForGroup?: (groupId: string) => void;
}

export const TeacherGroupManagement: React.FC<TeacherGroupManagementProps> = ({
  groups,
  users,
  currentUser,
  quizSubmissions,
  sessions,
  groupObservations = [],
  missions = [],
  onSaveObservation,
  onSaveGroup,
  onDeleteGroup,
  onSyncGroupsToDatabase,
  onSwitchUser,
  onOpenQuizForGroup
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState<'all' | string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<StudentGroup | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});
  const [isObservationModalOpen, setIsObservationModalOpen] = useState(false);
  const [selectedGroupForObservation, setSelectedGroupForObservation] = useState<StudentGroup | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printTargetGroupId, setPrintTargetGroupId] = useState<string | null>(null);
  const [isSavingDb, setIsSavingDb] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  // Manual save all groups to database
  const handleSaveAllToDatabase = async () => {
    if (groups.length === 0) {
      toast.info('Belum Ada Kelompok', 'Silakan bentuk kelompok belajar terlebih dahulu sebelum menyimpan ke database.');
      return;
    }
    setIsSavingDb(true);
    try {
      let success = false;
      if (onSyncGroupsToDatabase) {
        success = await onSyncGroupsToDatabase(groups);
      } else {
        success = await dbBulkUpsertGroups(groups);
      }

      if (success) {
        const nowStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastSavedTime(nowStr);
        toast.success(
          'Pengaturan Kelompok Tersimpan di Database!',
          `Seluruh data ${groups.length} kelompok belajar dan akun murid berhasil disimpan & disinkronkan ke Database Cloud.`
        );
      } else {
        toast.warning('Penyimpanan Parsial', 'Data kelompok berhasil disimpan di penyimpanan lokal browser.');
      }
    } catch (err) {
      console.error('Save to database error:', err);
      toast.error('Gagal Menyimpan ke Database', 'Terjadi kesalahan saat menyimpan pengaturan kelompok ke database.');
    } finally {
      setIsSavingDb(false);
    }
  };

  // Open print cards modal
  const handleOpenPrintModal = (groupId?: string) => {
    setPrintTargetGroupId(groupId || null);
    setIsPrintModalOpen(true);
  };

  // Filter students by teacher scope
  const studentsInClass = users.filter(
    (u) =>
      u.role === 'student' &&
      !u.isGroup &&
      (!currentUser.schoolId || u.schoolId === currentUser.schoolId) &&
      (!currentUser.classId || currentUser.classId === 'ALL' || u.classId === currentUser.classId)
  );

  // Extract ONLY class IDs that actually exist in users, groups, or currentUser
  const existingClasses = React.useMemo(() => {
    const map = new Map<string, string>();

    // 1. From users
    users.forEach((u) => {
      if (u.classId && u.classId !== 'ALL' && !map.has(u.classId)) {
        map.set(u.classId, formatClassName(u.classId, u.className));
      }
    });

    // 2. From groups
    groups.forEach((g) => {
      if (g.classId && g.classId !== 'ALL' && !map.has(g.classId)) {
        map.set(g.classId, formatClassName(g.classId, g.className));
      }
    });

    // 3. From currentUser
    if (currentUser.classId && currentUser.classId !== 'ALL' && !map.has(currentUser.classId)) {
      map.set(currentUser.classId, formatClassName(currentUser.classId, currentUser.className));
    }

    const list = Array.from(map.entries()).map(([id, name]) => ({
      id,
      name
    }));

    list.sort((a, b) => a.id.localeCompare(b.id));

    if (list.length === 0) {
      const fallbackId = currentUser.classId && currentUser.classId !== 'ALL' ? currentUser.classId : 'V-A';
      list.push({
        id: fallbackId,
        name: formatClassName(fallbackId, currentUser.className)
      });
    }

    return list;
  }, [users, groups, currentUser]);

  const isClassMatching = (a?: string, b?: string) => {
    if (!a || !b || a === 'all' || b === 'all' || a === 'ALL' || b === 'ALL') return true;
    if (a === b) return true;
    const normA = a.trim().toLowerCase().replace(/kelas\s*/gi, '');
    const normB = b.trim().toLowerCase().replace(/kelas\s*/gi, '');
    if (normA === normB) return true;
    if (normA.startsWith(normB) || normB.startsWith(normA)) return true;
    return false;
  };

  const filteredGroups = groups.filter((g) => {
    const matchesClass = isClassMatching(g.classId, selectedClassFilter);
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      g.name.toLowerCase().includes(q) ||
      (g.username && g.username.toLowerCase().includes(q)) ||
      g.className.toLowerCase().includes(q) ||
      g.memberNames.some((m) => m.toLowerCase().includes(q)) ||
      (g.leaderName && g.leaderName.toLowerCase().includes(q));
    return matchesClass && matchesQuery;
  });

  const handleOpenAddModal = () => {
    setEditingGroup(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (group: StudentGroup) => {
    setEditingGroup(group);
    setIsModalOpen(true);
  };

  const handleCopyCredentials = (group: StudentGroup, pass: string) => {
    const username = group.username || formatGroupUsername(group.name);
    const text = `Akun Kelompok: ${group.name}\nUsername: @${username}\nPassword: ${pass}\nKelas: ${group.className}`;
    navigator.clipboard.writeText(text);
    setCopiedId(group.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleRevealPassword = (groupId: string) => {
    setRevealedPasswords((prev) => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  // Auto generate 4-5 groups from active unassigned database students
  const handleAutoDistributeGroups = async () => {
    // 1. Tentukan classId & className aktif berdasarkan filter kelas atau user aktif
    const activeClassId = selectedClassFilter !== 'all'
      ? selectedClassFilter
      : (currentUser.classId && currentUser.classId !== 'ALL' ? currentUser.classId : (existingClasses[0]?.id || 'V-A'));

    const activeClassName = formatClassName(
      activeClassId,
      existingClasses.find((c) => c.id === activeClassId)?.name
    );

    // 2. Ambil data murid asli dari database
    let allUsersFromDb: UserProfile[] = users;
    try {
      const fetchedUsers = await dbFetchUsers();
      if (fetchedUsers && fetchedUsers.length > 0) {
        allUsersFromDb = fetchedUsers;
      }
    } catch (err) {
      console.warn('Gagal memuat murid terbaru dari database, menggunakan cache pengguna:', err);
    }

    // Filter murid di database yang HANYA memiliki role 'student', bukan akun kelompok, dan classId cocok
    const classStudentsFromDb = allUsersFromDb.filter((u) => {
      if (u.role !== 'student' || u.isGroup) return false;
      if (!u.classId || u.classId === 'ALL') return true;
      const uNorm = u.classId.trim().toLowerCase().replace(/kelas\s*/gi, '');
      const aNorm = activeClassId.trim().toLowerCase().replace(/kelas\s*/gi, '');
      return uNorm === aNorm;
    });

    if (classStudentsFromDb.length === 0) {
      toast.error(
        'Tidak Ada Murid di Database',
        `Tidak ditemukan data murid asli di database untuk ${activeClassName} (classId: ${activeClassId}).`
      );
      return;
    }

    // 3. Filter murid yang belum masuk kelompok manapun di kelas ini
    const assignedMemberNamesSet = new Set(
      groups
        .filter((g) => isClassMatching(g.classId, activeClassId))
        .flatMap((g) => (g.memberNames || []).map((m) => m.trim().toLowerCase()))
    );

    const unassignedStudents = classStudentsFromDb.filter(
      (s) => !assignedMemberNamesSet.has((s.name || '').trim().toLowerCase())
    );

    const targetStudents = unassignedStudents.length >= 3 ? unassignedStudents : classStudentsFromDb;

    if (targetStudents.length < 2) {
      toast.warning(
        'Tidak Cukup Murid',
        `Hanya ada ${targetStudents.length} murid di database untuk ${activeClassName}. Minimal 2 murid diperlukan untuk membentuk kelompok.`
      );
      return;
    }

    const isDistributingRemaining = targetStudents === unassignedStudents && unassignedStudents.length < classStudentsFromDb.length;

    const confirmed = await toast.confirm({
      title: isDistributingRemaining ? `Bagi Murid ${activeClassName} yang Belum Berkelompok?` : `Bagi Otomatis Kelompok ${activeClassName}?`,
      message: isDistributingRemaining
        ? `Bagi ${targetStudents.length} murid yang belum memiliki kelompok di ${activeClassName} secara merata?`
        : `Bagi ${targetStudents.length} murid di ${activeClassName} secara merata menjadi kelompok heterogen?`,
      confirmText: 'Bagi Kelompok',
      cancelText: 'Batal'
    });

    if (!confirmed) {
      return;
    }

    const shuffled = [...targetStudents].sort(() => Math.random() - 0.5);
    const total = shuffled.length;
    let groupSize = 4;
    if (total <= 3) {
      groupSize = total;
    } else if (total <= 7) {
      groupSize = Math.ceil(total / 2); // 2 kelompok
    } else if (total <= 11) {
      groupSize = Math.ceil(total / 3); // 3 kelompok
    } else {
      groupSize = 4; // 4 murid per kelompok
    }

    const numGroups = Math.ceil(total / groupSize);
    const animalThemes = ['Garuda', 'Rajawali', 'Cendrawasih', 'Komodo', 'Merpati', 'Elang', 'Harimau', 'Badak', 'Banteng', 'Kancil'];
    const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'];
    const currentGroupCount = groups.filter((g) => isClassMatching(g.classId, activeClassId)).length;

    const newlyCreatedGroups: StudentGroup[] = [];

    for (let i = 0; i < numGroups; i++) {
      const slice = shuffled.slice(i * groupSize, (i + 1) * groupSize);
      if (slice.length === 0) continue;
      const groupNum = currentGroupCount + i + 1;
      const theme = animalThemes[(groupNum - 1) % animalThemes.length];
      const name = `Kelompok ${groupNum} - ${theme}`;
      const groupId = `group-auto-${Date.now()}-${i}`;
      const accountUserId = `user-group-auto-${Date.now()}-${i}`;
      const memberNames = slice.map((s) => s.name);
      const memberIds = slice.map((s) => s.id);
      const leader = slice[0];
      const groupUsername = formatGroupUsername(name);
      const groupPassword = '123456';

      const newGroup: StudentGroup = {
        id: groupId,
        name,
        schoolId: currentUser.schoolId || 'SDN01',
        schoolName: currentUser.schoolName || 'UPT SD Negeri Remen 2',
        classId: activeClassId,
        className: activeClassName,
        leaderId: leader.id,
        leaderName: leader.name,
        memberIds,
        memberNames,
        avatar: studentBoy1,
        email: `kelompok${groupNum}.${theme.toLowerCase()}.${activeClassId.toLowerCase().replace(/[^a-z0-9]/g, '')}@siswa.sdn01.sch.id`,
        username: groupUsername,
        password: groupPassword,
        motto: 'Kolaborasi Nyata, Bernalar Kritis, Berprestasi Bersama!',
        color: colors[(groupNum - 1) % colors.length],
        createdAt: new Date().toISOString().split('T')[0],
        accountUserId
      };

      const groupUser: UserProfile = {
        id: accountUserId,
        name,
        role: 'student',
        avatar: newGroup.avatar,
        schoolName: newGroup.schoolName,
        schoolId: newGroup.schoolId,
        className: `${activeClassName} (Akun Kelompok)`,
        classId: activeClassId,
        email: newGroup.email,
        username: groupUsername,
        password: groupPassword,
        status: 'active',
        nisnNip: `KEL-${activeClassId}-${groupNum}`,
        joinedDate: 'September 2026',
        isGroup: true,
        groupId,
        groupMembers: memberNames,
        groupLeader: leader.name,
        groupMotto: newGroup.motto
      };

      newlyCreatedGroups.push(newGroup);
      onSaveGroup(newGroup, groupUser);
    }

    // Bulk sync generated groups to database
    if (onSyncGroupsToDatabase && newlyCreatedGroups.length > 0) {
      await onSyncGroupsToDatabase(newlyCreatedGroups);
    } else if (newlyCreatedGroups.length > 0) {
      await dbBulkUpsertGroups(newlyCreatedGroups);
    }

    const nowStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLastSavedTime(nowStr);

    toast.success(
      'Kelompok Berhasil Dibentuk!',
      `Berhasil membagi ${targetStudents.length} murid di ${activeClassName} ke dalam ${numGroups} kelompok heterogen.`
    );
  };

  const handleExportGroupsCSV = () => {
    try {
      const exportData = groups.map((g, idx) => {
        const uName = g.username || formatGroupUsername(g.name);
        const pass = g.password || '123456';
        return {
          'No': idx + 1,
          'Nama Kelompok': g.name,
          'Username': `@${uName}`,
          'Password (Setting Guru)': pass,
          'Kelas / Rombel': g.className,
          'Ketua Kelompok': g.leaderName || '-',
          'Jumlah Anggota': g.memberNames.length,
          'Daftar Anggota Kelompok': g.memberNames.join('; '),
          'Motto / Semboyan': g.motto || '-'
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      worksheet['!cols'] = [
        { wch: 6 },  // No
        { wch: 32 }, // Nama Kelompok
        { wch: 22 }, // Username
        { wch: 24 }, // Password
        { wch: 18 }, // Kelas / Rombel
        { wch: 22 }, // Ketua Kelompok
        { wch: 16 }, // Jumlah Anggota
        { wch: 45 }, // Daftar Anggota Kelompok
        { wch: 30 }  // Motto / Semboyan
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Daftar_Kelompok_Belajar');
      const filename = `Daftar_Kelompok_Belajar_${currentUser.classId || 'Semua'}.xlsx`;
      XLSX.writeFile(workbook, filename);

      toast.success(
        'Ekspor Excel Berhasil!',
        `Berhasil mengekspor ${exportData.length} data kelompok ke file ${filename}.`
      );
    } catch (err) {
      console.error('Export group excel error:', err);
      toast.error('Gagal Ekspor Excel', 'Terjadi kendala saat mengekspor data kelompok.');
    }
  };

  const handleOpenObservationModal = (group: StudentGroup) => {
    setSelectedGroupForObservation(group);
    setIsObservationModalOpen(true);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner with White Theme & Literacy-Numeracy Background */}
      <div className="bg-white rounded-3xl p-6 text-slate-900 relative overflow-hidden shadow-sm border border-slate-200/90 group">
        {/* Background Image: Literacy & Numeracy */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img
            src={literacyNumeracyHeroBg}
            alt="Literasi dan Numerasi Pendidikan Dasar"
            className="w-full h-full object-cover object-right opacity-35 group-hover:scale-102 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          {/* Soft White Gradient Overlays for High Contrast & Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/75 md:w-3/4 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-white/40 pointer-events-none" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/80">
                Kolaborasi Pembelajaran Mendalam
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {groups.length} Kelompok Aktif di Kelas
              </span>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
                <Database className="w-3 h-3 text-emerald-600" />
                <span>{lastSavedTime ? `Tersimpan di Cloud (${lastSavedTime})` : 'Tersimpan'}</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-[#1E293B]">
              Manajemen Kelompok Belajar & Akun Tim
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => handleOpenPrintModal()}
              className="px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200/80 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
              title="Buka pratinjau & cetak kartu login untuk kelompok belajar"
            >
              <Printer className="w-4 h-4 text-blue-600" />
              <span>Cetak Kartu Login</span>
            </button>
            <button
              onClick={handleAutoDistributeGroups}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200/90 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <Shuffle className="w-4 h-4 text-blue-600" />
              <span>Bagi Kelompok Otomatis</span>
            </button>
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Bentuk Kelompok Baru</span>
            </button>
            <button
              onClick={handleExportGroupsCSV}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200/90 transition-all cursor-pointer"
              title="Export Daftar Kelompok ke CSV"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-slate-200/80 text-slate-700">
          <div className="p-3 rounded-2xl bg-white/80 border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] text-slate-500 block font-medium">Total Kelompok</span>
            <span className="text-xl font-bold text-slate-900 font-display">{groups.length} Tim</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/80 border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] text-slate-500 block font-medium">Murid Terkelompok</span>
            <span className="text-xl font-bold text-emerald-600 font-display">
              {new Set(groups.flatMap((g) => g.memberNames)).size} Murid
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-white/80 border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] text-slate-500 block font-medium">Rubrik Observasi</span>
            <span className="text-xl font-bold text-indigo-600 font-display">
              {groupObservations.length} / {groups.length} Dinilai
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-white/80 border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] text-slate-500 block font-medium">Uji Pemahaman Tim</span>
            <span className="text-xl font-bold text-amber-600 font-display">
              {quizSubmissions.filter((q) => q.isGroup).length} Skor Masuk
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-white/80 border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] text-slate-500 block font-medium">Akun Otomatis</span>
            <span className="text-xl font-bold text-cyan-700 font-display">100% Aktif</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kelompok, ketua, anggota..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <select
            value={selectedClassFilter}
            onChange={(e) => setSelectedClassFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="all">Semua Rombel</option>
            {existingClasses.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Group Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGroups.map((group) => {
          // Find associated user
          const groupUser = users.find((u) => u.id === group.accountUserId || u.email === group.email);
          const groupQuizSubmissions = quizSubmissions.filter((s) => s.userId === group.accountUserId || s.userName === group.name);
          const latestSubmission = groupQuizSubmissions[0];
          const groupUsername = group.username || groupUser?.username || formatGroupUsername(group.name);
          const groupPassword = group.password || groupUser?.password || '123456';
          const isPassRevealed = Boolean(revealedPasswords[group.id]);

          return (
            <div
              key={group.id}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative overflow-hidden group"
            >
              {/* Color Accent Bar on Top */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: group.color || '#3B82F6' }}
              />

              <div className="space-y-3.5">
                {/* Header: Avatar, Name, Class */}
                <div className="flex items-start justify-between gap-3 pt-1">
                  <div className="flex items-center gap-3">
                    <img
                      src={group.avatar}
                      alt={group.name}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-100 shadow-2xs shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h3 className="text-base font-bold text-[#25324B] leading-snug font-display">
                        {group.name}
                      </h3>
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 mt-0.5">
                        {formatClassName(group.classId, group.className)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(group)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                      title="Edit Kelompok"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={async () => {
                        const confirmed = await toast.confirm({
                          title: 'Hapus Kelompok?',
                          message: `Apakah Anda yakin ingin menghapus "${group.name}" beserta akun loginnya? Tindakan ini tidak dapat dibatalkan.`,
                          confirmText: 'Ya, Hapus',
                          cancelText: 'Batal',
                          danger: true
                        });
                        if (confirmed) {
                          onDeleteGroup(group.id);
                          toast.success('Kelompok Dihapus', `Kelompok "${group.name}" berhasil dihapus.`);
                        }
                      }}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Hapus Kelompok"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Motto */}
                {group.motto && (
                  <p className="text-xs text-slate-500 italic bg-slate-50/70 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                    "{group.motto}"
                  </p>
                )}

                {/* Leader */}
                <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs">
                  <Crown className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-slate-600">Ketua Kelompok:</span>
                  <span className="font-bold text-amber-900">{group.leaderName || group.memberNames[0] || '-'}</span>
                </div>

                {/* Members List */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500 flex items-center justify-between">
                    <span>Anggota ({group.memberNames.length} Murid):</span>
                    <span className="text-slate-400 font-normal text-[10px]">Tergabung</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {group.memberNames.map((m, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/80"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Login Credentials Box (Username based on group name & Password based on teacher setting) */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white space-y-2.5 text-xs shadow-inner">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-blue-300 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-blue-400" />
                      <span>Kredensial Akun Kelompok</span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenPrintModal(group.id)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-600/70 hover:bg-blue-600 text-white text-[10px] font-semibold transition-colors cursor-pointer"
                        title="Pratinjau & cetak kartu login kelompok ini"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Cetak Kartu</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopyCredentials(group, groupPassword)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-slate-200 text-[10px] font-semibold transition-colors cursor-pointer"
                        title="Salin info login untuk murid"
                      >
                        {copiedId === group.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-300">Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Salin Login</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Username */}
                    <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700">
                      <span className="text-[10px] text-slate-400 block">Username Kelompok:</span>
                      <span className="font-mono text-[11px] font-bold text-emerald-400 truncate block">
                        @{groupUsername}
                      </span>
                    </div>

                    {/* Password */}
                    <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Password (Guru):</span>
                        <span className="font-mono text-[11px] font-bold text-amber-300">
                          {isPassRevealed ? groupPassword : '••••••'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => toggleRevealPassword(group.id)}
                          className="text-slate-400 hover:text-slate-200 p-0.5 cursor-pointer"
                          title={isPassRevealed ? 'Sembunyikan' : 'Tampilkan'}
                        >
                          {isPassRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const newPass = Math.floor(100000 + Math.random() * 900000).toString();
                            const updatedGroup: StudentGroup = {
                              ...group,
                              password: newPass
                            };
                            const updatedUser: UserProfile = {
                              ...(groupUser || {
                                id: group.accountUserId || `user-${group.id}`,
                                name: group.name,
                                role: 'student',
                                avatar: group.avatar,
                                schoolName: group.schoolName,
                                schoolId: group.schoolId,
                                className: group.className,
                                classId: group.classId,
                                email: group.email,
                                isGroup: true,
                                groupId: group.id,
                                username: groupUsername,
                                password: newPass
                              }),
                              password: newPass
                            };
                            onSaveGroup(updatedGroup, updatedUser);
                            toast.success('Password Diacak', `Password baru untuk kelompok "${group.name}" berhasil diganti menjadi ${newPass}`);
                          }}
                          className="text-slate-400 hover:text-amber-400 p-0.5 cursor-pointer transition-colors"
                          title="Acak Password Kelompok"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Anggota & Quiz Status */}
                  <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1 border-t border-slate-700/80">
                    <span className="text-slate-400 truncate max-w-[140px] text-[10px]">
                      {group.memberNames.length} Anggota • {group.className}
                    </span>
                    {latestSubmission ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Skor: {latestSubmission.score} ({latestSubmission.predicate})
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-400">Belum Uji Pemahaman</span>
                    )}
                  </div>
                </div>

                {/* Rubrik Observasi Aktivitas Kelompok */}
                {(() => {
                  const groupObs = groupObservations.find((o) => o.groupId === group.id);
                  return (
                    <div className="p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-200/80 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-indigo-900 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Rubrik Observasi Aktivitas</span>
                        </span>
                        {groupObs ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Skor Tim: {groupObs.averageGroupScore} ({groupObs.averageGroupScore >= 90 ? 'Sangat Baik' : 'Baik'})
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                            Belum Diobservasi
                          </span>
                        )}
                      </div>

                      {groupObs ? (
                        <div className="space-y-2">
                          <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed bg-white/70 p-2 rounded-xl border border-indigo-100">
                            "{groupObs.groupNotes}"
                          </p>

                          {/* Member Individual Score Pills */}
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-indigo-800 block">
                              Skor Masing-Masing Anggota:
                            </span>
                            <div className="grid grid-cols-2 gap-1.5">
                              {groupObs.memberScores.map((m, mIdx) => (
                                <div
                                  key={mIdx}
                                  className={`px-2 py-1 rounded-xl text-[11px] flex items-center justify-between border ${
                                    m.totalScore >= 90
                                      ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                                      : m.totalScore >= 75
                                      ? 'bg-blue-50 text-blue-900 border-blue-200'
                                      : 'bg-amber-50 text-amber-900 border-amber-200'
                                  }`}
                                >
                                  <span className="truncate max-w-[90px] font-medium" title={m.studentName}>
                                    {m.studentName}
                                  </span>
                                  <span className="font-bold shrink-0">{m.totalScore}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleOpenObservationModal(group)}
                            className="w-full mt-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                          >
                            <Award className="w-3.5 h-3.5 text-amber-300" />
                            <span>Buka / Edit Rubrik Observasi</span>
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-[11px] text-slate-500 leading-snug">
                            Amati aktivitas kolaboratif tim dan berikan skor observasi untuk masing-masing anggota kelompok.
                          </p>
                          <button
                            type="button"
                            onClick={() => handleOpenObservationModal(group)}
                            className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                          >
                            <Award className="w-3.5 h-3.5 text-amber-300" />
                            <span>Nilai Aktivitas Anggota</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                {groupUser && (
                  <button
                    onClick={() => onSwitchUser(groupUser)}
                    className="flex-1 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Masuk Akun Tim</span>
                  </button>
                )}
                {onOpenQuizForGroup && (
                  <button
                    onClick={() => onOpenQuizForGroup(group.id)}
                    className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    title="Buka Uji Pemahaman Kelompok"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Uji Pemahaman</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredGroups.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="text-base font-bold text-slate-700">Belum Ada Kelompok Belajar</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Bentuk kelompok belajar agar murid dapat melakukan penyelidikan citra nyata dan mengerjakan uji pemahaman secara berkelompok.
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={handleAutoDistributeGroups}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
            >
              Bagi Otomatis
            </button>
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all"
            >
              Buat Kelompok Manual
            </button>
          </div>
        </div>
      )}

      {/* Modal Creator / Editor */}
      <GroupManagerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaveGroup={onSaveGroup}
        existingGroup={editingGroup}
        existingGroups={groups}
        studentsInClass={studentsInClass}
        currentSchoolId={currentUser.schoolId || 'SDN01'}
        currentSchoolName={currentUser.schoolName || 'UPT SD Negeri Remen 2'}
        currentClassId={
          selectedClassFilter !== 'all'
            ? selectedClassFilter
            : (currentUser.classId && currentUser.classId !== 'ALL' ? currentUser.classId : (existingClasses[0]?.id || 'V-A'))
        }
        currentClassName={
          selectedClassFilter !== 'all'
            ? (existingClasses.find((c) => c.id === selectedClassFilter)?.name || `Kelas ${selectedClassFilter}`)
            : (currentUser.className || existingClasses[0]?.name || 'Kelas V-A')
        }
      />

      {/* Modal Rubrik Observasi Aktivitas Kelompok */}
      {selectedGroupForObservation && (
        <GroupObservationModal
          isOpen={isObservationModalOpen}
          onClose={() => {
            setIsObservationModalOpen(false);
            setSelectedGroupForObservation(null);
          }}
          group={selectedGroupForObservation}
          missions={missions}
          currentUser={currentUser}
          existingRecord={groupObservations.find((o) => o.groupId === selectedGroupForObservation.id)}
          onSaveObservation={(record) => {
            if (onSaveObservation) {
              onSaveObservation(record);
            }
          }}
        />
      )}

      {/* Modal Cetak Kartu Login Kelompok */}
      <GroupLoginCardsModal
        isOpen={isPrintModalOpen}
        onClose={() => {
          setIsPrintModalOpen(false);
          setPrintTargetGroupId(null);
        }}
        groups={groups}
        users={users}
        currentUser={currentUser}
        initialSelectedGroupId={printTargetGroupId}
      />
    </div>
  );
};
