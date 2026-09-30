import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, UserRole } from '../types';
import { toast } from './Toast';
import {
  getDefaultAvatar,
  UserGender
} from '../data/avatarData';
import {
  X,
  User,
  GraduationCap,
  ShieldCheck,
  Building,
  Phone,
  Hash,
  Sparkles,
  CheckCircle2,
  Camera,
  Upload,
  Trash2,
  AlertCircle,
  RefreshCw,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  Save,
  Users,
  Award,
  BookOpen
} from 'lucide-react';

interface UserAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: Omit<UserProfile, 'id'> & { id?: string }) => void;
  editingUser?: UserProfile | null;
  defaultRole?: UserRole;
  defaultIsGroup?: boolean;
  currentUser?: UserProfile;
}

export const UserAccountModal: React.FC<UserAccountModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingUser,
  defaultRole = 'student',
  defaultIsGroup = false,
  currentUser
}) => {
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [isGroup, setIsGroup] = useState<boolean>(defaultIsGroup);
  const [gender, setGender] = useState<UserGender>('male');
  const [name, setName] = useState('');
  const [schoolName, setSchoolName] = useState(currentUser?.schoolName || 'UPT SD Negeri Remen 2');
  const [schoolId, setSchoolId] = useState(currentUser?.schoolId || 'SDN01');
  const [className, setClassName] = useState('Kelas V');
  const [classId, setClassId] = useState('V');
  const [nisnNip, setNisnNip] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [avatar, setAvatar] = useState(getDefaultAvatar(defaultRole, 'male'));

  // Group specific fields
  const [groupMembersText, setGroupMembersText] = useState('');
  const [groupLeader, setGroupLeader] = useState('');
  const [groupMotto, setGroupMotto] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [photoInfo, setPhotoInfo] = useState<{ name: string; sizeKb: string } | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const isSchoolAdminLoggedIn = currentUser?.role === 'school_admin';
  const isSelf = !!(editingUser && currentUser && editingUser.id === currentUser.id);

  const MAX_FILE_SIZE = 500 * 1024; // 500 KB

  useEffect(() => {
    setFileError(null);
    setPhotoInfo(null);
    if (editingUser) {
      const userGender: UserGender = editingUser.gender || 'male';
      const userIsGroup = Boolean(editingUser.isGroup || (editingUser.groupMembers && editingUser.groupMembers.length > 0));
      setRole(editingUser.role);
      setIsGroup(userIsGroup);
      setGender(userGender);
      setName(editingUser.name);
      setSchoolName(editingUser.schoolName || 'UPT SD Negeri Remen 2');
      setSchoolId(editingUser.schoolId || 'SDN01');
      setClassName(editingUser.className || 'Kelas V');
      setClassId(editingUser.classId || 'V');
      setNisnNip(editingUser.nisnNip || '');
      setPhone(editingUser.phone || '');
      setStatus(editingUser.status || 'active');
      const isCustomBase64 = editingUser.avatar && editingUser.avatar.startsWith('data:image');
      const defaultAv = getDefaultAvatar(editingUser.role, userGender);
      setAvatar(isCustomBase64 ? editingUser.avatar : defaultAv);
      setUsername(editingUser.username || '');
      setPassword(editingUser.password || '123456');
      setGroupMembersText((editingUser.groupMembers || []).join(', '));
      setGroupLeader(editingUser.groupLeader || '');
      setGroupMotto(editingUser.groupMotto || '');
    } else {
      const initialRole = defaultRole;
      const initialIsGroup = Boolean(defaultIsGroup);
      const initialGender: UserGender = 'male';
      setRole(initialRole);
      setIsGroup(initialIsGroup);
      setGender(initialGender);
      setName('');
      if (isSchoolAdminLoggedIn && currentUser) {
        setSchoolName(currentUser.schoolName);
        setSchoolId(currentUser.schoolId);
      } else {
        setSchoolName(currentUser?.schoolName || 'UPT SD Negeri Remen 2');
        setSchoolId(currentUser?.schoolId || 'SDN01');
      }
      setClassName(initialRole === 'student' ? 'Kelas V' : initialRole === 'teacher' ? 'Wali Kelas V' : 'Admin Sekolah');
      setClassId(initialRole === 'student' ? 'V' : initialRole === 'teacher' ? 'V' : 'ALL');
      setNisnNip(initialIsGroup ? 'KEL-V-01' : '');
      setPhone('');
      setStatus('active');
      setAvatar(getDefaultAvatar(initialRole, initialGender));
      setUsername('');
      setPassword('123456');
      setGroupMembersText('');
      setGroupLeader('');
      setGroupMotto('');
    }
  }, [editingUser, defaultRole, defaultIsGroup, isOpen, currentUser, isSchoolAdminLoggedIn]);

  const handleGenderChange = (newGender: UserGender) => {
    setGender(newGender);
    setAvatar(getDefaultAvatar(role, newGender));
    setPhotoInfo(null);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole !== 'student') {
      setIsGroup(false);
    }
    setAvatar(getDefaultAvatar(newRole, gender));
    setPhotoInfo(null);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (!editingUser) {
      if (newRole === 'student') {
        setClassName('Kelas V');
        setClassId('V');
      } else if (newRole === 'teacher') {
        const cId = classId || 'V';
        const clean = cId.replace(/^(guru\s*kelas|kelas|guru|wali)\s*/gi, '').trim();
        setClassName(clean ? `Guru Kelas ${clean}` : 'Guru Kelas');
        setClassId(cId);
      } else if (newRole === 'school_admin') {
        setClassName('Admin Sekolah');
        setClassId('ALL');
      } else {
        setClassName('Admin Pusat');
        setClassId('ALL');
        setSchoolName('Pusat Data Pendidikan');
        setSchoolId('CENTRAL');
      }
    }
  };

  const handleFileProcess = (file: File) => {
    setFileError(null);

    // Validate mime type
    if (!file.type.startsWith('image/')) {
      const msg = 'Format file tidak didukung. Harap pilih gambar dengan format JPG, PNG, atau WEBP.';
      setFileError(msg);
      toast.warning('Format Tidak Sesuai', msg);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validate size (max 500 KB)
    if (file.size > MAX_FILE_SIZE) {
      const actualKb = (file.size / 1024).toFixed(1);
      const msg = `Ukuran foto (${actualKb} KB) melebihi batas maksimal 500 KB. Silakan pilih foto dengan ukuran lebih kecil atau lakukan kompresi terlebih dahulu.`;
      setFileError(msg);
      toast.error('Ukuran Melebihi Batas (Maks 500 KB)', `File Anda: ${actualKb} KB. Batas maksimal yang diizinkan adalah 500 KB.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Read file into Data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setAvatar(dataUrl);
      setPhotoInfo({
        name: file.name,
        sizeKb: (file.size / 1024).toFixed(1)
      });
      setFileError(null);
      toast.success(
        'Foto Profil Siap!',
        `Foto "${file.name}" (${(file.size / 1024).toFixed(1)} KB) berhasil diunggah. Klik Simpan untuk memperbarui profil.`
      );
    };
    reader.onerror = () => {
      const msg = 'Gagal membaca file foto. Silakan coba lagi.';
      setFileError(msg);
      toast.error('Gagal Membaca File', msg);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleResetAvatar = () => {
    const defaultAv = getDefaultAvatar(role, gender);
    setAvatar(defaultAv);
    setPhotoInfo(null);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    toast.info('Foto Direset', 'Foto profil kembali ke avatar karakter bawaan.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalAvatar = avatar || getDefaultAvatar(role, gender);

    let finalClassName = className.trim();
    const finalClassId = classId.trim();

    if (role === 'teacher' && finalClassId && finalClassId !== 'ALL') {
      const cleanClassId = finalClassId.replace(/^kelas\s*/gi, '').trim();
      if (!finalClassName.toLowerCase().startsWith('guru kelas')) {
        finalClassName = `Guru Kelas ${cleanClassId}`;
      }
    }

    const parsedGroupMembers = isGroup && groupMembersText
      ? groupMembersText
          .split(/[,;\n]/)
          .map((m) => m.trim())
          .filter(Boolean)
      : undefined;

    const finalNisnNip = nisnNip.trim() || (isGroup ? `KEL-${finalClassId}-${Date.now().toString().slice(-4)}` : undefined);

    onSave({
      id: editingUser?.id,
      name: name.trim(),
      role,
      gender,
      avatar: finalAvatar,
      schoolName: schoolName.trim(),
      schoolId: schoolId.trim(),
      className: finalClassName,
      classId: finalClassId,
      email: editingUser?.email || `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@narasa.id`,
      status,
      nisnNip: finalNisnNip,
      phone: phone.trim(),
      username: username.trim() || undefined,
      password: password.trim() || undefined,
      isGroup: isGroup,
      groupId: editingUser?.groupId || (isGroup ? `group-${Date.now()}` : undefined),
      groupMembers: parsedGroupMembers,
      groupLeader: isGroup ? groupLeader.trim() || (parsedGroupMembers && parsedGroupMembers[0]) || undefined : undefined,
      groupMotto: isGroup ? groupMotto.trim() || undefined : undefined,
      joinedDate: editingUser?.joinedDate || 'September 2026'
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl text-white ${
              role === 'student'
                ? isGroup
                  ? 'bg-amber-500'
                  : 'bg-[#4F8EF7]'
                : role === 'teacher'
                ? 'bg-[#7C5CFC]'
                : 'bg-emerald-600'
            }`}>
              {role === 'student' ? (
                isGroup ? <Users className="w-5 h-5" /> : <User className="w-5 h-5" />
              ) : role === 'teacher' ? (
                <GraduationCap className="w-5 h-5" />
              ) : (
                <ShieldCheck className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-[#25324B] font-display">
                {isSelf
                  ? 'Atur Profil Saya'
                  : editingUser
                  ? isGroup
                    ? 'Edit Akun Kelompok Belajar'
                    : 'Edit Data Akun'
                  : isGroup
                  ? 'Tambah Akun Kelompok Belajar'
                  : role === 'student'
                  ? 'Tambah Akun Murid (Individu)'
                  : 'Tambah Akun Baru'}
              </h3>
              <p className="text-xs text-slate-500">
                {isSelf
                  ? 'Perbarui foto profil, nama, username, dan kata sandi Anda'
                  : isGroup
                  ? 'Kelola data kelompok, daftar anggota, ketua, dan kredensial login tim'
                  : 'Kelola kredensial & hak akses sesuai ID Sekolah & ID Kelas'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-left text-xs sm:text-sm">
          {/* Menu Ubah Foto Profil (Maks. 500 KB) */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-[#25324B] uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-blue-600" />
                <span>{isGroup ? 'Avatar / Logo Kelompok' : 'Foto Profil Akun'}</span>
              </label>
              <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                Maksimal 500 KB
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3.5">
              {/* Avatar Preview */}
              <div className="relative shrink-0 group">
                <img
                  src={avatar}
                  alt="Preview Foto Profil"
                  className="w-20 h-20 rounded-2xl object-cover ring-2 ring-blue-500/20 shadow-sm bg-white"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-slate-900/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold gap-1 cursor-pointer"
                  title="Klik untuk mengganti foto profil"
                >
                  <Upload className="w-4 h-4" />
                  <span>Ubah</span>
                </button>
              </div>

              {/* Upload Drop Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex-1 w-full p-3 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50/80 scale-[0.99]'
                    : 'border-slate-300 hover:border-blue-400 bg-white'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileProcess(e.target.files[0]);
                    }
                  }}
                />

                <div className="flex items-center gap-2 mb-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Pilih / Upload Foto</span>
                  </button>

                  {photoInfo && (
                    <button
                      type="button"
                      onClick={handleResetAvatar}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Hapus foto custom & gunakan avatar bawaan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-slate-500">
                  atau seret & letakkan foto ke area ini
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Format: JPG, PNG, WEBP • Batas ukuran: <strong>500 KB</strong>
                </p>

                {photoInfo && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate max-w-[170px]">{photoInfo.name}</span>
                    <span className="text-[10px] font-mono opacity-80 font-bold">({photoInfo.sizeKb} KB)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Error Message if file size exceeds 500kb */}
            {fileError && (
              <div className="flex items-start gap-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                <span className="leading-tight font-medium">{fileError}</span>
              </div>
            )}
          </div>

          {/* Role & Account Type Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {!isSelf ? (
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#25324B] uppercase block">
                  Peran Pengguna <span className="text-rose-500">*</span>
                </label>
                <select
                  value={role}
                  disabled={isSchoolAdminLoggedIn && editingUser?.role === 'school_admin'}
                  onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-xs text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-[#4F8EF7] outline-none"
                >
                  <option value="student">🎓 Murid & Kelompok</option>
                  <option value="teacher">🧑‍🏫 Guru Pengampu</option>
                  <option value="school_admin">🏫 Admin Sekolah</option>
                  {!isSchoolAdminLoggedIn && <option value="central_admin">⚙️ Admin Pusat</option>}
                </select>
              </div>
            ) : null}

            {/* Student Account Type Switcher: Individu vs Kelompok */}
            {role === 'student' && !isSelf && (
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#25324B] uppercase block">
                  Tipe Akun Siswa <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsGroup(false);
                      if (!editingUser) {
                        setAvatar(getDefaultAvatar('student', gender));
                        setNisnNip('');
                      }
                    }}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      !isGroup
                        ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-2xs font-extrabold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>👤 Murid (Individu)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsGroup(true);
                      if (!editingUser) {
                        setNisnNip(`KEL-${classId}-01`);
                      }
                    }}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isGroup
                        ? 'bg-amber-50 border-amber-500 text-amber-800 shadow-2xs font-extrabold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>👥 Kelompok Belajar</span>
                  </button>
                </div>
              </div>
            )}

            {/* Gender selector for individual students / teachers */}
            {(!isGroup || role !== 'student') && (
              <div className={`space-y-1 ${isSelf ? 'sm:col-span-2' : ''}`}>
                <label className="text-[11px] font-bold text-[#25324B] uppercase block">
                  Jenis Kelamin <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleGenderChange('male')}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      gender === 'male'
                        ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-2xs font-extrabold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>👦 Laki-laki (L)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleGenderChange('female')}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      gender === 'female'
                        ? 'bg-rose-50 border-rose-400 text-rose-700 shadow-2xs font-extrabold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>👧 Perempuan (P)</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Name / Group Name */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#25324B] uppercase block">
              {isGroup
                ? 'Nama Kelompok Belajar'
                : role === 'teacher'
                ? 'Nama Lengkap Guru (Sertakan Gelar)'
                : 'Nama Lengkap Murid'} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                const val = e.target.value;
                setName(val);
                if (!isGroup && !editingUser && !photoInfo) {
                  const femaleKeywords = ['siti', 'nabila', 'ratna', 'rahma', 'zahra', 'putri', 'nurul', 'dewi', 'ibu', 'ani', 'rina', 'lia', 'ayu', 'fatimah', 'aisyah', 'anisa', 'fitri', 'wulan'];
                  const maleKeywords = ['adit', 'budi', 'rizki', 'ahmad', 'fajar', 'pak', 'hendra', 'dedy', 'irfan', 'dani', 'agus', 'bayu', 'dimas', 'taufik', 'arif'];
                  const words = val.toLowerCase().split(/\s+/);
                  if (words.some((w) => femaleKeywords.some((kw) => w.includes(kw)))) {
                    setGender('female');
                    setAvatar(getDefaultAvatar(role, 'female'));
                  } else if (words.some((w) => maleKeywords.some((kw) => w.includes(kw)))) {
                    setGender('male');
                    setAvatar(getDefaultAvatar(role, 'male'));
                  }
                }
              }}
              placeholder={
                isGroup
                  ? 'Contoh: Kelompok 1 - Garuda Muda'
                  : role === 'teacher'
                  ? 'Contoh: Ibu Rina Suryani, S.Pd.'
                  : 'Contoh: Adit Pratama'
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-[#4F8EF7] outline-none"
            />
          </div>

          {/* Group Specific Fields */}
          {isGroup && (
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
              <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs">
                <Users className="w-4 h-4 text-amber-600" />
                <span>Detail Anggota & Struktur Kelompok</span>
              </div>

              {/* Members List */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 block">
                  Daftar Nama Anggota Kelompok (Pisahkan dengan koma atau baris baru) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={groupMembersText}
                  onChange={(e) => setGroupMembersText(e.target.value)}
                  placeholder="Contoh: Adit Pratama, Budi Santoso, Citra Dewi, Dimas Arya"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 outline-none"
                />
              </div>

              {/* Leader and Motto */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">
                    Ketua Kelompok
                  </label>
                  <input
                    type="text"
                    value={groupLeader}
                    onChange={(e) => setGroupLeader(e.target.value)}
                    placeholder="Nama Ketua Kelompok"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">
                    Motto / Semboyan Kelompok
                  </label>
                  <input
                    type="text"
                    value={groupMotto}
                    onChange={(e) => setGroupMotto(e.target.value)}
                    placeholder="Contoh: Teliti, Tangkas, Cermat"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* NISN / NIP / ID Kelompok & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#25324B] uppercase block">
                {isGroup ? 'Kode / ID Kelompok' : role === 'student' ? 'NISN Murid' : 'NIP / NUPTK'}
              </label>
              <input
                type="text"
                disabled={isSelf}
                value={nisnNip}
                onChange={(e) => setNisnNip(e.target.value)}
                placeholder={isGroup ? 'Contoh: KEL-V-01' : role === 'student' ? 'Masukkan NISN Murid' : 'Masukkan NIP / NUPTK'}
                className={`w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium text-slate-800 outline-none ${
                  isSelf ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-[#4F8EF7]'
                }`}
              />
            </div>

            {!isSelf ? (
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#25324B] uppercase block">
                  Status Akun
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-[#4F8EF7] outline-none"
                >
                  <option value="active">🟢 Aktif</option>
                  <option value="inactive">🔴 Nonaktif</option>
                </select>
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#25324B] uppercase block">
                  Status Akun Saya
                </label>
                <div className="px-3.5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-150 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span>Aktif & Terverifikasi</span>
                </div>
              </div>
            )}
          </div>

          {/* Username & Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#25324B] uppercase block">
                {isGroup ? 'Username Kelompok' : role === 'student' ? 'Username Login (NISN)' : 'Username Akun'} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={isGroup ? 'Contoh: kelompok1' : role === 'student' ? 'Masukkan NISN / username' : 'Masukkan username'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-[#4F8EF7] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#25324B] uppercase block flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>Kata Sandi (Password)</span> <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan Kata Sandi"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-[#4F8EF7] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
                  title={showPassword ? "Sembunyikan Sandi" : "Tampilkan Sandi"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* School Details Block */}
          {!isSelf ? (
            <>
              {/* School ID & Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#25324B] uppercase block">
                    ID Sekolah <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isSchoolAdminLoggedIn}
                    value={schoolId}
                    onChange={(e) => setSchoolId(e.target.value)}
                    placeholder="Masukkan ID Sekolah"
                    className={`w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium text-slate-800 outline-none ${
                      isSchoolAdminLoggedIn ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-[#4F8EF7]'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#25324B] uppercase block">
                    Nama Sekolah <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isSchoolAdminLoggedIn}
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="Masukkan Nama Sekolah"
                    className={`w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium text-slate-800 outline-none ${
                      isSchoolAdminLoggedIn ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-[#4F8EF7]'
                    }`}
                  />
                </div>
              </div>

              {/* Class ID & Class Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#25324B] uppercase block">
                    ID Kelas <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={classId}
                    onChange={(e) => {
                      const val = e.target.value;
                      setClassId(val);
                      if (role === 'teacher') {
                        const clean = val.replace(/^(guru\s*kelas|kelas|guru|wali)\s*/gi, '').trim();
                        setClassName(clean ? `Guru Kelas ${clean}` : 'Guru Kelas');
                      } else if (role === 'student') {
                        const clean = val.replace(/^(guru\s*kelas|kelas|guru|wali)\s*/gi, '').trim();
                        setClassName(clean ? `Kelas ${clean}` : 'Kelas');
                      }
                    }}
                    placeholder="Masukkan ID Kelas"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-[#4F8EF7] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#25324B] uppercase block">
                    Nama Kelas / Rombel <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder="Masukkan Nama Kelas / Rombel"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-[#4F8EF7] outline-none"
                  />
                </div>
              </div>
            </>
          ) : (
            /* Editable Card for School/Class Affiliation */
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Afiliasi Sekolah & Kelas Anda
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">
                    Sekolah / Instansi
                  </label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="Contoh: UPT SD Negeri Remen 2"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-800 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-[#4F8EF7] outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">
                    Kelas / Rombel / Jabatan
                  </label>
                  <input
                    type="text"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder="Contoh: Kelas V / Admin Sekolah"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-800 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-[#4F8EF7] outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#25324B] uppercase block">
              Nomor Telepon / WhatsApp
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Masukkan Nomor Telepon / WhatsApp"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-[#4F8EF7] outline-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{editingUser ? 'Simpan Perubahan Akun' : 'Simpan Akun Baru'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
