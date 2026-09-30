import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { SchoolClassBadge } from './SchoolClassBadge';
import { toast } from './Toast';
import {
  X,
  User,
  Users,
  GraduationCap,
  ShieldCheck,
  Search,
  UserPlus,
  CheckCircle2,
  ArrowRight,
  Edit2,
  Save,
  RefreshCw
} from 'lucide-react';

interface AccountSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  users: UserProfile[];
  onSelectUser: (user: UserProfile) => void;
  onOpenCreateModal: (role?: UserRole, isGroup?: boolean) => void;
  onOpenEditModal: (user: UserProfile) => void;
  onRefreshUsers?: () => void;
}

export const AccountSwitcherModal: React.FC<AccountSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  users,
  onSelectUser,
  onOpenCreateModal,
  onOpenEditModal,
  onRefreshUsers
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'student' | 'group' | 'teacher' | 'admin'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const individualStudents = users.filter((u) => u.role === 'student' && !u.isGroup && (!u.groupMembers || u.groupMembers.length === 0));
  const groupAccounts = users.filter((u) => u.isGroup || (u.groupMembers && u.groupMembers.length > 0));
  const teachers = users.filter((u) => u.role === 'teacher');
  const admins = users.filter((u) => u.role === 'school_admin' || u.role === 'central_admin' || u.role === 'admin');

  const handleSaveAllAccounts = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('narasa_users_data', JSON.stringify(users));
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(users)
      });
      if (!res.ok) {
        throw new Error(`Status: ${res.status}`);
      }
      setIsSaved(true);
      toast.success(
        'Data Akun Disimpan!',
        `Semua ${users.length} data akun berhasil disinkronkan ke server database.`
      );
      onRefreshUsers?.();
      setTimeout(() => setIsSaved(false), 2500);
    } catch (err: any) {
      console.warn('Gagal menyimpan akun:', err);
      toast.error('Gagal Menyimpan', err?.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const filteredUsers = users.filter((u) => {
    const isGroupUser = Boolean(u.isGroup || (u.groupMembers && u.groupMembers.length > 0));
    let matchesTab = true;
    if (activeTab === 'student') {
      matchesTab = u.role === 'student' && !isGroupUser;
    } else if (activeTab === 'group') {
      matchesTab = isGroupUser;
    } else if (activeTab === 'teacher') {
      matchesTab = u.role === 'teacher';
    } else if (activeTab === 'admin') {
      matchesTab = u.role === 'school_admin' || u.role === 'central_admin' || u.role === 'admin';
    }

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.className.toLowerCase().includes(q) ||
      (u.groupLeader && u.groupLeader.toLowerCase().includes(q)) ||
      (u.groupMembers && u.groupMembers.some(m => m.toLowerCase().includes(q))) ||
      (u.nisnNip && u.nisnNip.toLowerCase().includes(q));

    return matchesTab && matchesSearch;
  });

  const getRoleBadge = (user: UserProfile) => {
    if (user.isGroup || (user.groupMembers && user.groupMembers.length > 0)) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
          <Users className="w-3 h-3 text-amber-700" /> Kelompok ({user.groupMembers?.length || 0} Murid)
        </span>
      );
    }
    switch (user.role) {
      case 'student':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <User className="w-3 h-3" /> Murid Individu
          </span>
        );
      case 'teacher':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <GraduationCap className="w-3 h-3" /> Guru
          </span>
        );
      case 'school_admin':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <ShieldCheck className="w-3 h-3" /> Admin Sekolah
          </span>
        );
      case 'central_admin':
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <ShieldCheck className="w-3 h-3" /> Admin Pusat
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-[#25324B] font-display">
              Manajemen & Penggantian Akun
            </h3>
            <p className="text-xs text-slate-500">
              Beralih profil pengguna atau kelola akun murid, akun kelompok, guru, dan admin
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current User Active Card */}
        <div className="p-4 mx-6 mt-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50/50 to-purple-50 border border-blue-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              onError={(e) => {
                const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=4F8EF7&color=fff&bold=true`;
                if ((e.target as HTMLImageElement).src !== fallbackUrl) {
                  (e.target as HTMLImageElement).src = fallbackUrl;
                }
              }}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-500/20 shadow-xs"
            />
            <div className="text-left space-y-0.5">
              <span className="text-sm font-bold text-[#25324B] block">
                {currentUser.name.replace(/\s*(\[|\()(student|guru|teacher|admin|kelompok|central_admin|school_admin)[^\]\)]*(\]|\))/gi, '').trim()}
              </span>
              <div>{getRoleBadge(currentUser)}</div>
            </div>
          </div>
          <button
            onClick={() => onOpenEditModal(currentUser)}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-300 transition-colors cursor-pointer"
            title="Edit Profil Saya"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-6 pb-3 space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-2 justify-between">
            {/* Role Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semua ({users.length})
              </button>
              <button
                onClick={() => setActiveTab('student')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'student'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                👤 Murid ({individualStudents.length})
              </button>
              <button
                onClick={() => setActiveTab('group')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'group'
                    ? 'bg-white text-amber-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                👥 Kelompok ({groupAccounts.length})
              </button>
              <button
                onClick={() => setActiveTab('teacher')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'teacher'
                    ? 'bg-white text-purple-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🧑‍🏫 Guru ({teachers.length})
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🛡️ Admin ({admins.length})
              </button>
            </div>

            {/* Action Buttons: Save & Add User */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <button
                onClick={handleSaveAllAccounts}
                disabled={isSaving}
                className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
                title="Simpan seluruh data akun ke database"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Menyimpan...</span>
                  </>
                ) : isSaved ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    <span>Tersimpan!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Simpan</span>
                  </>
                )}
              </button>

              {activeTab === 'group' ? (
                <button
                  onClick={() => onOpenCreateModal('student', true)}
                  className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors shrink-0 cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>+ Kelompok</span>
                </button>
              ) : (
                <button
                  onClick={() => onOpenCreateModal(activeTab === 'teacher' ? 'teacher' : activeTab === 'admin' ? 'school_admin' : 'student', false)}
                  className="flex-1 sm:flex-none px-3 py-1.5 rounded-xl bg-[#4F8EF7] text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-blue-600 shadow-xs transition-colors shrink-0 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Akun</span>
                </button>
              )}
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan nama, anggota, NISN/NIP, atau kelas..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* User Accounts List */}
        <div className="px-6 pb-6 overflow-y-auto space-y-2 flex-1 text-left">
          {filteredUsers.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              Tidak ada akun yang sesuai dengan pencarian.
            </div>
          ) : (
            filteredUsers.map((u) => {
              const isCurrent = u.id === currentUser.id;
              const isGroupUser = Boolean(u.isGroup || (u.groupMembers && u.groupMembers.length > 0));
              return (
                <div
                  key={u.id}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isCurrent
                      ? 'border-[#4F8EF7] bg-blue-50/40 shadow-xs'
                      : isGroupUser
                      ? 'border-amber-100 bg-amber-50/20 hover:border-amber-300 hover:bg-amber-50/40'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      onError={(e) => {
                        const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=4F8EF7&color=fff&bold=true`;
                        if ((e.target as HTMLImageElement).src !== fallbackUrl) {
                          (e.target as HTMLImageElement).src = fallbackUrl;
                        }
                      }}
                      className="w-10 h-10 rounded-xl object-cover shrink-0 ring-1 ring-slate-200"
                    />
                    <div className="min-w-0 space-y-0.5">
                      <span className="text-xs sm:text-sm font-extrabold text-[#25324B] break-words block leading-snug">
                        {u.name.replace(/\s*(\[|\()(student|guru|teacher|admin|kelompok|central_admin|school_admin)[^\]\)]*(\]|\))/gi, '').trim()}
                      </span>
                      <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
                        {getRoleBadge(u)}
                        {u.status === 'inactive' && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-50 text-rose-600">
                            Nonaktif
                          </span>
                        )}
                      </div>
                      {isGroupUser && u.groupMembers && u.groupMembers.length > 0 && (
                        <p className="text-[10px] text-slate-500 font-medium truncate max-w-xs">
                          Anggota: {u.groupMembers.join(', ')}
                        </p>
                      )}
                      {u.nisnNip && !isGroupUser && (
                        <p className="text-[10px] text-slate-400 font-mono">
                          {u.role === 'student' ? 'NISN. ' : 'NIP. '}
                          {u.nisnNip}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => onOpenEditModal(u)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                      title="Edit Akun"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {isCurrent ? (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Aktif
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          onSelectUser(u);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-[11px] font-bold flex items-center gap-1 transition-colors shadow-xs cursor-pointer"
                      >
                        <span>Masuk</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
