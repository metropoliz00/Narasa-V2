import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProfile, LearningMission, StudentActivitySession, StudentExplorationDraft, TeacherInsight, AssessmentRecord, SchoolProfile, StudentGroup, ConceptQuiz, QuizSubmission, TeacherMissionFeedback } from '../types';
import { getDefaultAvatar, UserGender } from '../data/avatarData';
import { INITIAL_SYSTEM_USERS, DEFAULT_MISSIONS } from '../data/mock_data';
import { INITIAL_CONCEPT_QUIZZES } from '../data/quizAndGroupData';

// Universal Environment Variable Resolver for Supabase
export function getSupabaseConfig(): { url: string; anonKey: string } {
  let customUrl = '';
  let customKey = '';
  if (typeof window !== 'undefined') {
    try {
      customUrl = localStorage.getItem('narasa_custom_supabase_url') || '';
      customKey = localStorage.getItem('narasa_custom_supabase_anon_key') || '';
    } catch {
      // Ignore localStorage errors
    }
  }

  const envUrl = import.meta.env.VITE_SUPABASE_URL || (typeof process !== 'undefined' ? process.env?.VITE_SUPABASE_URL || process.env?.SUPABASE_URL || process.env?.NEXT_PUBLIC_SUPABASE_URL : '') || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || (typeof process !== 'undefined' ? process.env?.VITE_SUPABASE_ANON_KEY || process.env?.SUPABASE_ANON_KEY || process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY : '') || '';

  const url = customUrl || envUrl;
  const anonKey = customKey || envKey;

  return { url: (url || '').trim(), anonKey: (anonKey || '').trim() };
}

let supabaseInstance: SupabaseClient | null = null;
let lastConfiguredUrl = '';
let lastConfiguredKey = '';

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey } = getSupabaseConfig();
  if (
    url &&
    anonKey &&
    url !== 'MY_SUPABASE_URL' &&
    anonKey !== 'MY_SUPABASE_ANON_KEY' &&
    url.startsWith('http') &&
    anonKey.length > 15
  ) {
    if (supabaseInstance && lastConfiguredUrl === url && lastConfiguredKey === anonKey) {
      return supabaseInstance;
    }
    try {
      supabaseInstance = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
      lastConfiguredUrl = url;
      lastConfiguredKey = anonKey;
      return supabaseInstance;
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      return null;
    }
  }
  return null;
}

export const isSupabaseConfigured = (): boolean => {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(
    url &&
    anonKey &&
    url !== 'MY_SUPABASE_URL' &&
    anonKey !== 'MY_SUPABASE_ANON_KEY' &&
    url.startsWith('http') &&
    anonKey.length > 15
  );
};

export async function testSupabaseConnection(): Promise<{ success: boolean; message: string; dataCount?: number }> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      message: 'Kredensial Supabase (VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY) belum dikonfigurasi di file environment.'
    };
  }

  try {
    const { data, error } = await client.from('users').select('id, name, role').limit(5);
    if (error) {
      return {
        success: false,
        message: `Koneksi Supabase gagal: ${error.message} (Pastikan SQL schema telah dijalankan di SQL Editor Supabase)`
      };
    }
    return {
      success: true,
      message: `Koneksi berhasil terhubung ke Supabase! Ditemukan ${data?.length || 0} user di database.`,
      dataCount: data?.length || 0
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Error koneksi: ${err.message || 'Gagal menghubungi server Supabase'}`
    };
  }
}

// ==========================================
// USER REPOSITORY (REAL DATABASE)
// ==========================================
export async function dbFetchUsers(): Promise<UserProfile[]> {
  // 1. Primary: Load from Supabase Cloud if configured
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch users notice:', error.message);
      } else if (Array.isArray(data)) {
        const supabaseList: UserProfile[] = data.map((row: any) => {
          const gender: UserGender = row.gender || 'male';
          const isCustomBase64 = row.avatar && row.avatar.startsWith('data:image');
          const avatar = isCustomBase64 ? row.avatar : getDefaultAvatar(row.role, gender);
          return {
            id: row.id,
            name: row.name,
            role: row.role,
            gender,
            avatar,
            schoolName: row.school_name || 'SDN 01 Nusantara',
            schoolId: row.school_id || 'SDN01',
            className: (row.class_name || (row.role === 'student' ? 'Kelas V-A' : `Guru Kelas ${row.class_id || 'V-A'}`)).replace(/^(kelas\s*)+guru\s*kelas/gi, 'Guru Kelas').replace(/^(guru\s*kelas\s*)+/gi, 'Guru Kelas ').trim(),
            classId: row.class_id || 'V-A',
            email: row.email || `${(row.name || 'user').toLowerCase().replace(/[^a-z0-9]/g, '')}@narasa.id`,
            status: row.status || 'active',
            nisnNip: row.nisn_nip || '',
            username: row.username || undefined,
            password: row.password || undefined,
            phone: row.phone || '',
            joinedDate: row.joined_date || 'Hari ini',
            isGroup: Boolean(row.is_group),
            groupMembers: Array.isArray(row.group_members) ? row.group_members : []
          };
        });

        // Store pure Supabase data in local cache
        try {
          localStorage.setItem('narasa_users_data', JSON.stringify(supabaseList));
        } catch (e) {}

        return supabaseList;
      }
    } catch (err) {
      console.warn('Notice in Supabase dbFetchUsers, falling back to server API:', err);
    }
  }

  // 2. Secondary: Load from Server-side Database API (/api/users)
  try {
    const res = await fetch('/api/users');
    if (res.ok) {
      const serverUsers = await res.json();
      if (Array.isArray(serverUsers) && serverUsers.length > 0) {
        const normalizedList: UserProfile[] = serverUsers.map((u: any) => {
          const gender: UserGender = u.gender || 'male';
          const isCustomBase64 = u.avatar && typeof u.avatar === 'string' && u.avatar.startsWith('data:image');
          const avatar = isCustomBase64 ? u.avatar : getDefaultAvatar(u.role, gender);
          return {
            id: u.id,
            name: u.name,
            role: u.role,
            gender,
            avatar,
            schoolName: u.schoolName || u.school_name || 'SDN 01 Nusantara',
            schoolId: u.schoolId || u.school_id || 'SDN01',
            className: (u.className || u.class_name || (u.role === 'student' ? 'Kelas V-A' : `Guru Kelas ${u.classId || u.class_id || 'V-A'}`)).replace(/^(kelas\s*)+guru\s*kelas/gi, 'Guru Kelas').replace(/^(guru\s*kelas\s*)+/gi, 'Guru Kelas ').trim(),
            classId: u.classId || u.class_id || 'V-A',
            email: u.email || `${(u.name || 'user').toLowerCase().replace(/[^a-z0-9]/g, '')}@narasa.id`,
            status: u.status || 'active',
            nisnNip: u.nisnNip || u.nisn_nip || '',
            username: u.username || undefined,
            password: u.password || undefined,
            phone: u.phone || '',
            joinedDate: u.joinedDate || u.joined_date || 'Hari ini',
            isGroup: Boolean(u.isGroup || u.is_group),
            groupMembers: Array.isArray(u.groupMembers) ? u.groupMembers : Array.isArray(u.group_members) ? u.group_members : []
          };
        });

        try {
          localStorage.setItem('narasa_users_data', JSON.stringify(normalizedList));
        } catch (e) {}

        return normalizedList;
      }
    }
  } catch (err) {
    console.warn('Gagal memuat /api/users, beralih ke Cache:', err);
  }

  // 3. Fallback to cache only if offline/network failed
  try {
    const saved = localStorage.getItem('narasa_users_data');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}

  return [];
}

// Helper to ensure users exist before inserting/updating groups (avoids foreign key constraint violation)
export async function ensureUsersExist(client: SupabaseClient, users: { id: string; name: string; email: string; schoolId: string; schoolName: string; className: string; classId: string; role: 'student' | 'teacher' | 'school_admin' | 'central_admin' | 'admin' }[]): Promise<void> {
  if (!users || users.length === 0) return;
  const uniqueUsers = Array.from(new Map(users.map(u => [u.id, u])).values()).filter(u => Boolean(u.id));
  if (uniqueUsers.length === 0) return;

  try {
    const payload = uniqueUsers.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      school_id: u.schoolId,
      school_name: u.schoolName,
      class_id: u.classId,
      class_name: u.className,
      role: u.role,
      status: 'active'
    }));
    await client.from('users').upsert(payload, { onConflict: 'id' });
  } catch (err) {
    console.warn('Supabase ensureUsersExist warning:', err);
  }
}

export async function dbUpdateAcademicYearForClasses(schoolId: string, academicYear: string): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;

  try {
    await client
      .from('classes')
      .update({ academic_year: academicYear })
      .eq('school_id', schoolId);
  } catch (err) {
    console.error('Error updating classes academic year:', err);
  }
}

// Helper to ensure classes exist before inserting/updating groups (avoids foreign key constraint violation)
export async function ensureClassesExist(client: SupabaseClient, classes: { id: string; schoolId: string; name: string }[]): Promise<void> {
  if (!classes || classes.length === 0) return;
  const uniqueClasses = Array.from(new Map(classes.map(c => [c.id, c])).values()).filter(c => Boolean(c.id));
  if (uniqueClasses.length === 0) return;

  try {
    const payload = uniqueClasses.map(c => ({
      id: c.id,
      school_id: c.schoolId,
      name: c.name,
      grade: 'V' // Default grade, can be adjusted if needed
    }));
    await client.from('classes').upsert(payload, { onConflict: 'id' });
  } catch (err) {
    console.warn('Supabase ensureClassesExist warning:', err);
  }
}

// Helper to ensure schools exist before inserting/updating users (avoids foreign key constraint violation)
export async function ensureSchoolsExist(client: SupabaseClient, schools: { id: string; name?: string }[]): Promise<void> {
  if (!schools || schools.length === 0) return;
  const uniqueSchools = Array.from(new Map(schools.map(s => [s.id, s])).values()).filter(s => Boolean(s.id));
  if (uniqueSchools.length === 0) return;

  try {
    const payload = uniqueSchools.map(s => ({
      id: s.id,
      name: s.name || s.id,
      status: 'Negeri',
      curriculum: 'Kurikulum Merdeka (Fase A, B, C)'
    }));
    await client.from('schools').upsert(payload, { onConflict: 'id' });
  } catch (err) {
    console.warn('Supabase ensureSchoolsExist warning:', err);
  }
}

export async function dbUpsertUser(user: UserProfile): Promise<boolean> {
  // 1. Update local storage cache
  try {
    const saved = localStorage.getItem('narasa_users_data');
    let currentUsers: UserProfile[] = saved ? JSON.parse(saved) : [];
    const exists = currentUsers.some(u => u.id === user.id);
    if (exists) {
      currentUsers = currentUsers.map(u => u.id === user.id ? user : u);
    } else {
      currentUsers = [user, ...currentUsers];
    }
    localStorage.setItem('narasa_users_data', JSON.stringify(currentUsers));
  } catch (e) {}

  // 2. Persist to server database (/api/users)
  try {
    await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
  } catch (e) {
    console.warn('Gagal menyimpan user ke /api/users:', e);
  }

  // 3. Persist to Supabase if connected
  const client = getSupabaseClient();
  if (!client) return true;

  try {
    const targetSchoolId = user.schoolId || 'SDN01';
    await ensureSchoolsExist(client, [{ id: targetSchoolId, name: user.schoolName || 'SDN 01 Nusantara' }]);

    const safeId = (user.id || 'user').toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanEmail = user.email && user.email.trim() && user.email.includes('@')
      ? user.email.trim().toLowerCase()
      : `${safeId}@narasa.sch.id`;

    const payload = {
      id: user.id,
      name: user.name,
      role: user.role,
      gender: user.gender || 'male',
      avatar: user.avatar,
      school_name: user.schoolName || 'SDN 01 Nusantara',
      school_id: targetSchoolId,
      class_name: user.className || (user.role === 'student' ? 'Kelas V-A' : `Guru Kelas ${user.classId || 'V-A'}`),
      class_id: user.classId || 'V-A',
      email: cleanEmail,
      status: user.status || 'active',
      nisn_nip: user.nisnNip || null,
      username: user.username || null,
      password: user.password || null,
      phone: user.phone || null,
      joined_date: user.joinedDate || 'Hari ini',
      is_group: Boolean(user.isGroup),
      group_members: Array.isArray(user.groupMembers) ? user.groupMembers : []
    };

    const { error } = await client.from('users').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn('Supabase upsert user error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error upserting user to Supabase:', err);
    return false;
  }
}

export async function dbBulkUpsertUsers(users: UserProfile[]): Promise<{
  success: boolean;
  count: number;
  supabaseSynced: boolean;
  error?: string;
}> {
  // 1. Cache to local storage
  try {
    localStorage.setItem('narasa_users_data', JSON.stringify(users));
  } catch (e) {}

  // 2. Persist to server backend API
  try {
    await fetch('/api/users?replace=true', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ users, replace: true })
    });
  } catch (err) {
    console.warn('Server sync error in dbBulkUpsertUsers:', err);
  }

  // 3. Persist to Supabase
  const client = getSupabaseClient();
  if (!client) {
    return {
      success: true,
      count: users.length,
      supabaseSynced: false,
      error: 'Supabase belum dikonfigurasi (disimpan di server lokal).'
    };
  }

  try {
    // Ensure all schools exist in the schools table first to satisfy foreign key constraint
    const schoolsMap = new Map<string, string>();
    schoolsMap.set('SDN01', 'SDN 01 Nusantara');
    schoolsMap.set('SDN02', 'SDN 02 Merdeka');
    users.forEach((u) => {
      if (u.schoolId) {
        schoolsMap.set(u.schoolId, u.schoolName || u.schoolId);
      }
    });
    const schoolsToEnsure = Array.from(schoolsMap.entries()).map(([id, name]) => ({ id, name }));
    await ensureSchoolsExist(client, schoolsToEnsure);

    // Deduplicate users by ID to prevent PostgreSQL ON CONFLICT DO UPDATE batch errors
    const uniqueUsersMap = new Map<string, UserProfile>();
    users.forEach((u) => {
      if (u && u.id) uniqueUsersMap.set(u.id, u);
    });
    const uniqueUsers = Array.from(uniqueUsersMap.values());

    const seenEmails = new Set<string>();
    const payloads = uniqueUsers.map((user, idx) => {
      const safeId = (user.id || `user-${idx}`).toLowerCase().replace(/[^a-z0-9]/g, '');
      let email = `${safeId}@narasa.sch.id`;
      if (user.email && user.email.trim() && user.email.includes('@') && !seenEmails.has(user.email.trim().toLowerCase())) {
        email = user.email.trim().toLowerCase();
      }
      seenEmails.add(email);

      return {
        id: user.id,
        name: user.name,
        role: user.role,
        gender: user.gender || 'male',
        avatar: user.avatar || null,
        school_name: user.schoolName || 'SDN 01 Nusantara',
        school_id: user.schoolId || 'SDN01',
        class_name: user.className || (user.role === 'student' ? 'Kelas V-A' : `Guru Kelas ${user.classId || 'V-A'}`),
        class_id: user.classId || 'V-A',
        email,
        status: user.status || 'active',
        nisn_nip: user.nisnNip || null,
        username: user.username || null,
        password: user.password || null,
        phone: user.phone || null,
        joined_date: user.joinedDate || 'Hari ini',
        is_group: Boolean(user.isGroup),
        group_members: Array.isArray(user.groupMembers) ? user.groupMembers : []
      };
    });

    // Batch upsert in chunks of 50 to avoid request payload limits
    const chunkSize = 50;
    for (let i = 0; i < payloads.length; i += chunkSize) {
      const chunk = payloads.slice(i, i + chunkSize);
      const { error } = await client.from('users').upsert(chunk, { onConflict: 'id' });
      if (error) {
        throw new Error(error.message);
      }
    }

    return {
      success: true,
      count: users.length,
      supabaseSynced: true
    };
  } catch (err: any) {
    console.error('Supabase bulk upsert error:', err);
    return {
      success: false,
      count: users.length,
      supabaseSynced: false,
      error: err?.message || 'Gagal menyimpan ke Supabase'
    };
  }
}

export async function dbDeleteUser(userId: string): Promise<boolean> {
  // 1. Remove from local storage cache
  try {
    const saved = localStorage.getItem('narasa_users_data');
    if (saved) {
      const currentUsers: UserProfile[] = JSON.parse(saved);
      const filtered = currentUsers.filter(u => u.id !== userId);
      localStorage.setItem('narasa_users_data', JSON.stringify(filtered));
    }
  } catch (e) {}

  // 2. Delete from server database (/api/users/:id)
  try {
    await fetch(`/api/users/${userId}`, {
      method: 'DELETE'
    });
  } catch (e) {
    console.warn('Gagal menghapus user dari /api/users:', e);
  }

  // 3. Delete from Supabase if connected
  const client = getSupabaseClient();
  if (!client) return true;

  try {
    const { error } = await client.from('users').delete().eq('id', userId);
    return !error;
  } catch (err) {
    console.error('Error deleting user from Supabase:', err);
    return false;
  }
}

// ==========================================
// SCHOOLS & SETTINGS REPOSITORY
// ==========================================
export async function dbFetchSchools(): Promise<SchoolProfile[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('schools')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('Supabase fetch schools error:', error.message);
      } else if (Array.isArray(data)) {
        const mappedList = data.map((row: any) => ({
          id: row.id,
          name: row.name,
          npsn: row.npsn || '',
          level: row.level || 'SD / MI',
          status: row.status || 'Negeri',
          accreditation: row.accreditation || 'A (Unggul)',
          curriculum: row.curriculum || 'Kurikulum Merdeka (Fase A, B, C)',
          headmaster: row.headmaster || '',
          headmasterNip: row.headmaster_nip || '',
          supervisorName: row.supervisor_name || '',
          supervisorNip: row.supervisor_nip || '',
          phone: row.phone || '',
          email: row.email || '',
          website: row.website || '',
          address: row.address || '',
          rtRw: row.rt_rw || '',
          village: row.village || '',
          district: row.district || '',
          city: row.city || '',
          province: row.province || '',
          postalCode: row.postal_code || '',
          motto: row.motto || '',
          logoUrl: row.logo_url || '',
          academicYear: row.academic_year || '2024/2025',
          activeSemester: row.active_semester || 'Ganjil',
          category: row.category || '',
          updatedAt: row.updated_at || new Date().toISOString()
        }));

        try {
          localStorage.setItem('narasa_schools_profile_data', JSON.stringify(mappedList));
        } catch (e) {}

        return mappedList;
      }
    } catch (err) {
      console.warn('Error in Supabase dbFetchSchools:', err);
    }
  }

  try {
    const saved = localStorage.getItem('narasa_schools_profile_data');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}

  return [];
}

export async function dbUpsertSchool(school: SchoolProfile): Promise<boolean> {
  // 1. Always persist to local storage
  try {
    const saved = localStorage.getItem('narasa_schools_profile_data');
    let currentSchools: SchoolProfile[] = saved ? JSON.parse(saved) : [];
    const exists = currentSchools.some((s) => s.id === school.id);
    if (exists) {
      currentSchools = currentSchools.map((s) => (s.id === school.id ? school : s));
    } else {
      currentSchools = [...currentSchools, school];
    }
    localStorage.setItem('narasa_schools_profile_data', JSON.stringify(currentSchools));
  } catch (e) {}

  // 2. Persist to server database (/api/schools)
  try {
    await fetch('/api/schools', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(school)
    });
  } catch (e) {
    console.warn('Gagal menyimpan sekolah ke /api/schools:', e);
  }

  // 3. Persist to Supabase if configured
  const client = getSupabaseClient();
  if (client) {
    try {
      const payload = {
        id: school.id,
        name: school.name,
        npsn: school.npsn,
        level: school.level,
        status: school.status,
        accreditation: school.accreditation,
        curriculum: school.curriculum,
        headmaster: school.headmaster,
        headmaster_nip: school.headmasterNip,
        supervisor_name: school.supervisorName || null,
        supervisor_nip: school.supervisorNip || null,
        phone: school.phone,
        email: school.email,
        website: school.website || null,
        address: school.address,
        rt_rw: school.rtRw || null,
        village: school.village || null,
        district: school.district || null,
        city: school.city,
        province: school.province,
        postal_code: school.postalCode,
        motto: school.motto || null,
        logo_url: school.logoUrl || null,
        academic_year: school.academicYear,
        active_semester: school.activeSemester,
        category: school.category || null,
        updated_at: new Date().toISOString()
      };

      const { error } = await client.from('schools').upsert(payload, { onConflict: 'id' });
      if (error) {
        console.warn('Supabase upsert school error:', error.message);
      }
    } catch (err) {
      console.error('Error upserting school to Supabase:', err);
    }
  }

  return true;
}

export async function dbDeleteSchool(schoolId: string): Promise<boolean> {
  // 1. Remove from local storage
  try {
    const saved = localStorage.getItem('narasa_schools_profile_data');
    if (saved) {
      const currentSchools: SchoolProfile[] = JSON.parse(saved);
      const filtered = currentSchools.filter((s) => s.id !== schoolId);
      localStorage.setItem('narasa_schools_profile_data', JSON.stringify(filtered));
    }
  } catch (e) {}

  // 2. Remove from server database (/api/schools/:id)
  try {
    await fetch(`/api/schools/${schoolId}`, {
      method: 'DELETE'
    });
  } catch (e) {
    console.warn('Gagal menghapus sekolah dari /api/schools:', e);
  }

  // 3. Remove from Supabase if connected
  const client = getSupabaseClient();
  if (client) {
    try {
      const { error } = await client.from('schools').delete().eq('id', schoolId);
      if (error) {
        console.warn('Supabase delete school error:', error.message);
      }
    } catch (err) {
      console.error('Error deleting school from Supabase:', err);
    }
  }

  return true;
}

// ==========================================
// LEARNING MISSIONS REPOSITORY (REAL DATABASE)
// ==========================================
export async function dbFetchMissions(): Promise<LearningMission[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client.from('learning_missions').select('*').order('created_at', { ascending: false });
      if (error) {
        console.error('Supabase fetch missions error:', error.message);
      } else if (Array.isArray(data) && data.length > 0) {
        const mappedList: LearningMission[] = data.map((row: any) => {
          const subject = row.subject || 'Matematika';
          const mapelIdMap: Record<string, string> = {
            'Matematika': 'matematika',
            'IPAS': 'ipas',
            'Bahasa Indonesia': 'bahasa_indonesia',
            'Pendidikan Pancasila': 'pancasila',
            'Seni Budaya': 'seni_budaya'
          };
          const idMapel = row.id_mapel || mapelIdMap[subject] || subject.toLowerCase().replace(/\s+/g, '_');

          return {
            id: row.id,
            idMapel,
            title: row.title,
            grade: row.grade,
            phase: row.phase,
            subject,
            material: row.material,
            cp: row.cp,
            tp: row.tp,
            indicators: Array.isArray(row.indicators) ? row.indicators : [],
            targetCompetency: row.target_competency,
            cognitiveLevel: row.cognitive_level,
            strictCurriculumMode: row.strict_curriculum_mode,
            features: row.features || {
              adaptiveDifficulty: true,
              scaffolding: true,
              reasoning: true,
              evidence: true,
              reflection: true,
              presentation: true,
              peerQuestion: true
            },
            description: row.description,
            isActive: Boolean(row.is_active),
            createdAt: row.created_at,
            suggestedObjects: Array.isArray(row.suggested_objects) ? row.suggested_objects : []
          };
        });

        try {
          localStorage.setItem('narasa_missions_data_v3', JSON.stringify(mappedList));
        } catch (e) {}

        return mappedList;
      }
    } catch (e) {
      console.warn('Supabase fetch missions error:', e);
    }
  }

  // 2. Fetch from server-side database (/api/missions)
  try {
    const res = await fetch('/api/missions');
    if (res.ok) {
      const serverMissions = await res.json();
      if (Array.isArray(serverMissions) && serverMissions.length > 0) {
        try {
          localStorage.setItem('narasa_missions_data_v3', JSON.stringify(serverMissions));
        } catch (e) {}
        return serverMissions;
      }
    }
  } catch (err) {
    console.warn('Gagal memuat /api/missions:', err);
  }

  // 3. Fallback to localStorage cache
  try {
    const saved = localStorage.getItem('narasa_missions_data_v3');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}

  return [];
}

export async function dbUpsertMission(mission: LearningMission): Promise<boolean> {
  // 1. Update localStorage cache
  try {
    const saved = localStorage.getItem('narasa_missions_data_v3');
    let current: LearningMission[] = saved ? JSON.parse(saved) : [];
    const idx = current.findIndex(m => m.id === mission.id);
    if (idx >= 0) {
      current[idx] = mission;
    } else {
      current.unshift(mission);
    }
    localStorage.setItem('narasa_missions_data_v3', JSON.stringify(current));
  } catch (e) {}

  // 2. Persist to server database (/api/missions)
  let serverSuccess = false;
  try {
    const res = await fetch('/api/missions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mission)
    });
    if (res.ok) {
      serverSuccess = true;
    }
  } catch (e) {
    console.warn('Gagal menyimpan misi ke /api/missions:', e);
  }

  // 3. Persist to Supabase if configured
  const client = getSupabaseClient();
  if (!client) return serverSuccess;

  try {
    const payload = {
      id: mission.id,
      id_mapel: mission.idMapel || mission.subject.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
      title: mission.title,
      grade: mission.grade || 'Kelas V',
      phase: mission.phase || 'Fase C',
      subject: mission.subject,
      material: mission.material,
      cp: mission.cp,
      tp: mission.tp,
      indicators: mission.indicators || [],
      target_competency: mission.targetCompetency || 'both',
      cognitive_level: mission.cognitiveLevel || 'C4-C6',
      strict_curriculum_mode: mission.strictCurriculumMode ?? true,
      features: mission.features,
      description: mission.description || '',
      is_active: Boolean(mission.isActive),
      suggested_objects: mission.suggestedObjects || []
    };

    const { error } = await client.from('learning_missions').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn('Supabase upsert mission error:', error.message);
      return serverSuccess;
    }
    return true;
  } catch (e) {
    console.error('Error upserting mission to Supabase:', e);
    return serverSuccess;
  }
}

export async function dbDeleteMission(missionId: string): Promise<boolean> {
  // 1. Update local storage
  try {
    const saved = localStorage.getItem('narasa_missions_data_v3');
    if (saved) {
      const current: LearningMission[] = JSON.parse(saved);
      const filtered = current.filter(m => m.id !== missionId);
      localStorage.setItem('narasa_missions_data_v3', JSON.stringify(filtered));
    }
  } catch (e) {}

  // 2. Delete from server database (/api/missions/:id)
  try {
    await fetch(`/api/missions/${missionId}`, {
      method: 'DELETE'
    });
  } catch (e) {
    console.warn('Gagal menghapus misi dari /api/missions:', e);
  }

  // 3. Delete from Supabase if configured
  const client = getSupabaseClient();
  if (!client) return true;

  try {
    const { error } = await client.from('learning_missions').delete().eq('id', missionId);
    return !error;
  } catch (e) {
    return false;
  }
}

// ==========================================
// STUDENT ACTIVITY SESSIONS REPOSITORY (REAL DATABASE)
// ==========================================
export function getActiveDatabaseSource(): { source: 'supabase' | 'server'; label: string; isCloud: boolean } {
  if (isSupabaseConfigured()) {
    return { source: 'supabase', label: 'Supabase PostgreSQL Cloud', isCloud: true };
  }
  return { source: 'server', label: 'Database Server Terpusat (/api/sessions)', isCloud: false };
}

export async function dbFetchSessions(): Promise<StudentActivitySession[]> {
  const sessionMap = new Map<string, StudentActivitySession>();

  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client.from('student_sessions').select('*').order('created_at', { ascending: false });
      if (error) {
        console.error('Supabase fetch sessions error:', error.message);
      } else if (Array.isArray(data)) {
        data.forEach((row: any) => {
          const mapped: StudentActivitySession = {
            id: row.id,
            missionId: row.mission_id,
            missionTitle: row.mission_title,
            subject: row.subject,
            studentId: row.student_id,
            studentName: row.student_name,
            image: row.image,
            imageLabel: row.image_label,
            learningBridge: row.learning_bridge,
            answers: row.answers,
            scaffoldingHistory: row.scaffolding_history || [],
            reflection: row.reflection,
            presentation: row.presentation || [],
            peerQuestions: row.peer_questions || [],
            completedAt: row.completed_at,
            status: row.status || 'completed',
            metrics: row.metrics || {
              literacyScore: 88,
              numeracyScore: 92,
              reasoningScore: 90,
              scaffoldingUsedCount: 0
            },
            teacherFeedback: row.teacher_feedback || undefined
          };
          sessionMap.set(mapped.id, mapped);
        });

        const list = Array.from(sessionMap.values()).sort((a, b) => {
          const timeA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
          const timeB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
          return timeB - timeA;
        });

        try {
          localStorage.setItem('narasa_sessions_data', JSON.stringify(list));
        } catch (e) {}

        return list;
      }
    } catch (e) {
      console.warn('Supabase fetch sessions error:', e);
    }
  }

  // Fallback / sync from server API (/api/sessions)
  try {
    const res = await fetch('/api/sessions');
    if (res.ok) {
      const serverSessions = await res.json();
      if (Array.isArray(serverSessions) && serverSessions.length > 0) {
        serverSessions.forEach((s: any) => {
          if (s && s.id && !sessionMap.has(s.id)) {
            sessionMap.set(s.id, s);
          }
        });
      }
    }
  } catch (e) {}

  try {
    const saved = localStorage.getItem('narasa_sessions_data');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        parsed.forEach((s: any) => {
          if (s && s.id && !sessionMap.has(s.id)) {
            sessionMap.set(s.id, s);
          }
        });
      }
    }
  } catch (e) {}

  const finalSessions = Array.from(sessionMap.values()).sort((a, b) => {
    const timeA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
    const timeB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
    return timeB - timeA;
  });

  return finalSessions;
}

export async function dbUpsertSession(session: StudentActivitySession): Promise<boolean> {
  // 1. Immediately store in localStorage cache
  try {
    const saved = localStorage.getItem('narasa_sessions_data');
    let list: StudentActivitySession[] = saved ? JSON.parse(saved) : [];
    const idx = list.findIndex((s) => s.id === session.id);
    if (idx >= 0) {
      list[idx] = session;
    } else {
      list.unshift(session);
    }
    localStorage.setItem('narasa_sessions_data', JSON.stringify(list));
  } catch (e) {
    console.warn('Gagal menyimpan session ke localStorage:', e);
  }

  // 2. Immediately persist to server-side database (/api/sessions)
  try {
    await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session)
    });
  } catch (e) {
    console.warn('POST /api/sessions error:', e);
  }

  // 3. Persist to Supabase if connected
  const client = getSupabaseClient();
  if (client) {
    try {
      // 3.A Ensure parent users record exists
      if (session.studentId) {
        try {
          const sanitizedId = String(session.studentId).replace(/[^a-zA-Z0-9_-]/g, '');
          await client.from('users').upsert({
            id: session.studentId,
            name: session.studentName || 'Murid Narasa',
            role: 'student',
            gender: 'male',
            email: `${sanitizedId || 'murid'}@narasa.sch.id`,
            school_name: 'SDN 01 Nusantara',
            school_id: 'SDN01',
            class_name: 'Kelas V-A',
            class_id: 'class-5a',
            status: 'active',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
          }, { onConflict: 'id' });
        } catch (errUser) {
          console.warn('Ensure parent user for session notice:', errUser);
        }
      }

      // 3.B Ensure parent learning mission exists to satisfy foreign key (student_sessions_mission_id_fkey)
      if (session.missionId) {
        try {
          await client.from('learning_missions').upsert({
            id: session.missionId,
            title: session.missionTitle || 'Misi Pembelajaran Kontekstual',
            grade: 'Kelas V',
            phase: 'Fase C',
            subject: session.subject || 'Tematik',
            material: session.missionTitle || 'Materi Eksplorasi',
            cp: 'Memahami konsep pembelajaran kontekstual berbasis lingkungan nyata.',
            tp: 'Menganalisis objek dan fenomena di sekitar lingkungan siswa.',
            target_competency: 'both',
            cognitive_level: 'C4-C6',
            strict_curriculum_mode: true,
            is_active: true
          }, { onConflict: 'id' });
        } catch (errMission) {
          console.warn('Ensure parent mission for session notice:', errMission);
        }
      }

      const completedAtFormatted = session.completedAt
        ? session.completedAt.split('T')[0]
        : new Date().toISOString().split('T')[0];

      const payload = {
        id: session.id,
        mission_id: session.missionId,
        mission_title: session.missionTitle,
        subject: session.subject,
        student_id: session.studentId,
        student_name: session.studentName,
        image: session.image,
        image_label: session.imageLabel,
        learning_bridge: session.learningBridge || {},
        answers: session.answers || {},
        scaffolding_history: session.scaffoldingHistory || [],
        reflection: session.reflection || {},
        presentation: session.presentation || [],
        peer_questions: session.peerQuestions || [],
        completed_at: completedAtFormatted,
        status: session.status || 'completed',
        metrics: session.metrics || {},
        teacher_feedback: session.teacherFeedback || null
      };

      const { error } = await client.from('student_sessions').upsert(payload, { onConflict: 'id' });
      if (error) {
        console.warn('Supabase upsert student_sessions error:', error.message);
      } else {
        console.log('✅ Student mission session successfully saved to Supabase:', session.id);
      }
    } catch (e: any) {
      console.warn('Supabase upsert session error:', e?.message || e);
    }
  }

  return true;
}

// ==========================================
// ACTIVE STUDENT EXPLORATION DRAFTS REPOSITORY (CROSS-DEVICE CONTINUITY)
// ==========================================

export async function dbSaveStudentDraft(draft: StudentExplorationDraft): Promise<boolean> {
  if (!draft || !draft.studentId) return false;

  const payload: StudentExplorationDraft = {
    ...draft,
    id: draft.id || `draft_${draft.studentId}`,
    updatedAt: draft.updatedAt || new Date().toISOString()
  };

  // 1. Save to local storage for immediate offline / quick access
  try {
    localStorage.setItem(`narasa_active_exploration_${draft.studentId}`, JSON.stringify(payload));
  } catch (e) {}

  // 2. Persist to server-side central database (/api/student-drafts)
  try {
    await fetch('/api/student-drafts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    console.warn('Gagal menyimpan draf eksplorasi ke /api/student-drafts:', e);
  }

  // 3. Persist to Supabase student_sessions table as status='draft' (Multi-device cloud storage)
  const client = getSupabaseClient();
  if (client && payload.activeLearningBridge && payload.currentCapturedImage) {
    try {
      // Ensure user exists first
      try {
        const sanitizedId = String(draft.studentId).replace(/[^a-zA-Z0-9_-]/g, '');
        await client.from('users').upsert({
          id: draft.studentId,
          name: draft.studentName || 'Murid Narasa',
          role: 'student',
          gender: 'male',
          email: `${sanitizedId || 'murid'}@narasa.sch.id`,
          school_name: 'SDN 01 Nusantara',
          school_id: 'SDN01',
          class_name: 'Kelas V-A',
          class_id: 'class-5a',
          status: 'active'
        }, { onConflict: 'id' });
      } catch (errUser) {}

      // Ensure mission exists
      if (draft.missionId) {
        try {
          await client.from('learning_missions').upsert({
            id: draft.missionId,
            title: draft.missionTitle || 'Misi Pembelajaran Kontekstual',
            grade: 'Kelas V',
            phase: 'Fase C',
            subject: draft.subject || 'Tematik',
            material: draft.missionTitle || 'Materi Eksplorasi',
            cp: 'Memahami konsep pembelajaran kontekstual berbasis lingkungan nyata.',
            tp: 'Menganalisis objek dan fenomena di sekitar lingkungan siswa.',
            target_competency: 'both',
            cognitive_level: 'C4-C6',
            strict_curriculum_mode: true,
            is_active: true
          }, { onConflict: 'id' });
        } catch (errMission) {}
      }

      const answersPayload = {
        studentThinking: draft.studentThinking || '',
        problemSolving: draft.problemSolving || '',
        activeStep: draft.activeStep || 4,
        unlockedScaffoldLevels: draft.unlockedScaffoldLevels || [1],
        isChallengeActive: Boolean(draft.isChallengeActive),
        updatedAt: payload.updatedAt
      };

      const supabaseDraftRow = {
        id: `draft_${draft.studentId}`,
        mission_id: draft.missionId || 'm-eksplorasi-mandiri',
        mission_title: draft.missionTitle || 'Eksplorasi Kontekstual',
        subject: draft.subject || 'Tematik',
        student_id: draft.studentId,
        student_name: draft.studentName || 'Murid Narasa',
        image: draft.currentCapturedImage,
        image_label: draft.currentImageLabel || 'Foto Pengamatan',
        learning_bridge: draft.activeLearningBridge || {},
        answers: answersPayload,
        scaffolding_history: draft.scaffoldingHistory || [],
        reflection: {},
        presentation: [],
        peer_questions: [],
        completed_at: new Date().toISOString().split('T')[0],
        status: 'draft',
        metrics: {
          literacyScore: 0,
          numeracyScore: 0,
          reasoningScore: 0,
          scaffoldingUsedCount: (draft.scaffoldingHistory || []).length
        }
      };

      await client.from('student_sessions').upsert(supabaseDraftRow, { onConflict: 'id' });
    } catch (errCloud) {
      console.warn('Supabase save student draft notice:', errCloud);
    }
  }

  return true;
}

export async function dbFetchStudentDraft(studentId: string): Promise<StudentExplorationDraft | null> {
  if (!studentId) return null;

  // 1. Primary: Try fetching from Supabase Cloud (for multi-device sync)
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('student_sessions')
        .select('*')
        .eq('student_id', studentId)
        .eq('status', 'draft')
        .order('updated_at', { ascending: false })
        .limit(1);

      if (!error && Array.isArray(data) && data.length > 0) {
        const row = data[0];
        const answersObj = row.answers || {};
        const draftFromCloud: StudentExplorationDraft = {
          id: row.id,
          studentId: row.student_id,
          studentName: row.student_name,
          missionId: row.mission_id,
          missionTitle: row.mission_title,
          subject: row.subject,
          activeStep: typeof answersObj.activeStep === 'number' ? answersObj.activeStep : 4,
          currentCapturedImage: row.image,
          currentImageLabel: row.image_label,
          activeLearningBridge: row.learning_bridge,
          studentThinking: answersObj.studentThinking || '',
          problemSolving: answersObj.problemSolving || '',
          unlockedScaffoldLevels: Array.isArray(answersObj.unlockedScaffoldLevels) ? answersObj.unlockedScaffoldLevels : [1],
          scaffoldingHistory: row.scaffolding_history || [],
          isChallengeActive: Boolean(answersObj.isChallengeActive),
          updatedAt: row.updated_at || new Date().toISOString()
        };

        try {
          localStorage.setItem(`narasa_active_exploration_${studentId}`, JSON.stringify(draftFromCloud));
        } catch (e) {}

        return draftFromCloud;
      }
    } catch (e) {
      console.warn('Supabase fetch draft notice:', e);
    }
  }

  // 2. Secondary: Try fetching from centralized server database API (/api/student-drafts/:studentId)
  try {
    const res = await fetch(`/api/student-drafts/${studentId}`);
    if (res.ok) {
      const draftFromServer = await res.json();
      if (draftFromServer && draftFromServer.activeLearningBridge && draftFromServer.currentCapturedImage) {
        try {
          localStorage.setItem(`narasa_active_exploration_${studentId}`, JSON.stringify(draftFromServer));
        } catch (e) {}
        return draftFromServer;
      }
    }
  } catch (e) {}

  // 3. Fallback: LocalStorage
  try {
    const saved = localStorage.getItem(`narasa_active_exploration_${studentId}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.activeLearningBridge && parsed.currentCapturedImage) {
        return parsed;
      }
    }
  } catch (e) {}

  return null;
}

export async function dbDeleteStudentDraft(studentId: string): Promise<boolean> {
  if (!studentId) return true;

  // 1. Remove from local storage
  try {
    localStorage.removeItem(`narasa_active_exploration_${studentId}`);
    localStorage.removeItem(`narasa_workflow_draft_${studentId}_exploration`);
  } catch (e) {}

  // 2. Remove from centralized server database
  try {
    await fetch(`/api/student-drafts/${studentId}`, { method: 'DELETE' });
  } catch (e) {}

  // 3. Remove from Supabase
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('student_sessions').delete().eq('id', `draft_${studentId}`);
      await client.from('student_sessions').delete().eq('student_id', studentId).eq('status', 'draft');
    } catch (e) {}
  }

  return true;
}

/**
 * Menyimpan Feedback & Penguatan Langkah Pembelajaran Guru
 * Terdistribusi ke Supabase + Server API (/api/mission-feedbacks) + LocalStorage
 */
export async function dbSaveTeacherMissionFeedback(
  sessionId: string,
  feedback: TeacherMissionFeedback
): Promise<{ success: boolean; session?: StudentActivitySession }> {
  // 1. Ambil session target
  const sessions = await dbFetchSessions();
  const targetSession = sessions.find((s) => s.id === sessionId);
  if (!targetSession) {
    console.warn(`Sesi belajar dengan ID ${sessionId} tidak ditemukan`);
    return { success: false };
  }

  // 2. Pasang teacherFeedback ke session
  const updatedSession: StudentActivitySession = {
    ...targetSession,
    teacherFeedback: feedback
  };

  // 3. Simpan session terupdate
  await dbUpsertSession(updatedSession);

  // 4. Simpan ke endpoint spesifik server /api/mission-feedbacks
  try {
    await fetch('/api/mission-feedbacks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        feedback
      })
    });
  } catch (e) {
    console.warn('POST /api/mission-feedbacks error:', e);
  }

  // 5. Simpan ke tabel mission_step_feedbacks di Supabase jika ada
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('mission_step_feedbacks').upsert({
        id: feedback.id || `feedback-${sessionId}`,
        session_id: sessionId,
        student_id: feedback.studentId || targetSession.studentId,
        student_name: feedback.studentName || targetSession.studentName,
        mission_id: feedback.missionId || targetSession.missionId,
        overall_score: feedback.overallScore,
        predicate: feedback.predicate,
        overall_feedback: feedback.overallFeedback,
        overall_reinforcement: feedback.overallReinforcement,
        step_feedbacks: feedback.stepFeedbacks,
        badge_reward: feedback.badgeReward,
        teacher_id: feedback.teacherId,
        teacher_name: feedback.teacherName,
        teacher_avatar: feedback.teacherAvatar,
        status: feedback.status || 'reviewed'
      }, { onConflict: 'id' });
    } catch (e) {
      console.warn('Supabase upsert mission_step_feedbacks notice:', e);
    }
  }

  return { success: true, session: updatedSession };
}

export async function dbDeleteSession(sessionId: string): Promise<boolean> {
  // 1. Remove from local storage
  try {
    const saved = localStorage.getItem('narasa_sessions_data');
    if (saved) {
      const current: StudentActivitySession[] = JSON.parse(saved);
      const filtered = current.filter(s => s.id !== sessionId);
      localStorage.setItem('narasa_sessions_data', JSON.stringify(filtered));
    }
  } catch (e) {}

  // 2. Delete from server database (/api/sessions/:id)
  try {
    await fetch(`/api/sessions/${sessionId}`, {
      method: 'DELETE'
    });
  } catch (e) {
    console.warn('Gagal menghapus sesi dari /api/sessions:', e);
  }

  // 3. Delete from Supabase if connected
  const client = getSupabaseClient();
  if (!client) return true;

  try {
    const { error } = await client.from('student_sessions').delete().eq('id', sessionId);
    return !error;
  } catch (e) {
    return false;
  }
}

// ==========================================
// STUDENT GROUPS REPOSITORY (REAL DATABASE)
// ==========================================
export async function dbFetchGroups(): Promise<StudentGroup[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('student_groups')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        const mappedList: StudentGroup[] = data.map((row: any) => ({
          id: row.id,
          name: row.name,
          schoolId: row.school_id || 'SDN01',
          schoolName: row.school_name,
          classId: row.class_id || 'V-A',
          className: row.class_name,
          leaderId: row.leader_id || undefined,
          leaderName: row.leader_name || undefined,
          memberIds: Array.isArray(row.member_ids) ? row.member_ids : [],
          memberNames: Array.isArray(row.member_names) ? row.member_names : [],
          avatar: row.avatar || '',
          email: row.email || '',
          motto: row.motto || undefined,
          color: row.color || '#3B82F6',
          createdAt: row.created_at || new Date().toISOString(),
          accountUserId: row.account_user_id || ''
        }));

        try {
          localStorage.setItem('narasa_groups_data', JSON.stringify(mappedList));
        } catch (e) {}

        return mappedList;
      }
    } catch (e) {
      console.warn('Supabase fetch groups error:', e);
    }
  }

  // Fallback to Express server database API
  try {
    const res = await fetch('/api/groups');
    if (res.ok) {
      const serverGroups = await res.json();
      if (Array.isArray(serverGroups) && serverGroups.length > 0) {
        try {
          localStorage.setItem('narasa_groups_data', JSON.stringify(serverGroups));
        } catch (e) {}
        return serverGroups;
      }
    }
  } catch (e) {
    console.warn('Server fetch groups error:', e);
  }

  try {
    const saved = localStorage.getItem('narasa_groups_data');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}

  return [];
}

export async function dbUpsertGroup(group: StudentGroup): Promise<boolean> {
  // 1. Save to local storage
  try {
    const saved = localStorage.getItem('narasa_groups_data');
    let list: StudentGroup[] = saved ? JSON.parse(saved) : [];
    const idx = list.findIndex(g => g.id === group.id);
    if (idx >= 0) {
      list[idx] = group;
    } else {
      list.push(group);
    }
    localStorage.setItem('narasa_groups_data', JSON.stringify(list));
  } catch (e) {}

  // 2. Save to server database
  try {
    await fetch('/api/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(group)
    });
  } catch (e) {
    console.warn('Gagal menyimpan group ke /api/groups:', e);
  }

  // 3. Save to Supabase if configured
  const client = getSupabaseClient();
  if (client) {
    try {
      if (group.accountUserId) {
        await ensureUsersExist(client, [{
          id: group.accountUserId,
          name: group.name,
          email: group.email || `${group.id}@narasa.sch.id`,
          schoolId: group.schoolId || 'SDN01',
          schoolName: group.schoolName || 'SDN 01 Nusantara',
          className: group.className || 'Kelas V-A',
          classId: group.classId || 'V-A',
          role: 'student'
        }]);
      }
      await ensureClassesExist(client, [{ 
        id: group.classId || 'V-A', 
        schoolId: group.schoolId || 'SDN01', 
        name: group.className || 'Kelas V-A' 
      }]);
      const payload = {
        id: group.id,
        name: group.name,
        school_id: group.schoolId || 'SDN01',
        school_name: group.schoolName,
        class_id: group.classId || 'V-A',
        class_name: group.className,
        leader_id: group.leaderId || null,
        leader_name: group.leaderName || null,
        member_ids: group.memberIds || [],
        member_names: group.memberNames || [],
        avatar: group.avatar || null,
        email: group.email || null,
        motto: group.motto || null,
        color: group.color || '#3B82F6',
        account_user_id: group.accountUserId || null
      };
      console.log('Upserting to Supabase student_groups:', payload);
      const { data, error } = await client.from('student_groups').upsert(payload, { onConflict: 'id' });
      if (error) {
        console.error('Supabase upsert group error detail:', error);
      } else {
        console.log('Supabase upsert group success:', data);
      }
    } catch (e) {
      console.error('Supabase upsert group catch block error:', e);
    }
  } else {
    console.log('Supabase client not configured, skipping student_groups upsert');
  }

  return true;
}

export async function dbBulkUpsertGroups(groups: StudentGroup[]): Promise<boolean> {
  if (!groups || groups.length === 0) return true;

  // 1. Save to local storage
  try {
    const saved = localStorage.getItem('narasa_groups_data');
    let list: StudentGroup[] = saved ? JSON.parse(saved) : [];
    groups.forEach((group) => {
      const idx = list.findIndex(g => g.id === group.id);
      if (idx >= 0) {
        list[idx] = group;
      } else {
        list.push(group);
      }
    });
    localStorage.setItem('narasa_groups_data', JSON.stringify(list));
  } catch (e) {}

  // 2. Save array to server API
  try {
    await fetch('/api/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(groups)
    });
  } catch (e) {
    console.warn('Server bulk upsert groups error:', e);
  }

  // 3. Save to Supabase if configured
  const client = getSupabaseClient();
  if (client) {
    try {
      // Deduplicate groups by ID to prevent PostgreSQL ON CONFLICT DO UPDATE batch errors
      const uniqueGroupsMap = new Map<string, StudentGroup>();
      groups.forEach((g) => {
        if (g && g.id) uniqueGroupsMap.set(g.id, g);
      });
      const uniqueGroups = Array.from(uniqueGroupsMap.values());

      await ensureClassesExist(client, uniqueGroups.map(g => ({
        id: g.classId || 'V-A',
        schoolId: g.schoolId || 'SDN01',
        name: g.className || 'Kelas V-A'
      })));

      const payloads = uniqueGroups.map((group) => ({
        id: group.id,
        name: group.name,
        school_id: group.schoolId || 'SDN01',
        school_name: group.schoolName,
        class_id: group.classId || 'V-A',
        class_name: group.className,
        leader_id: group.leaderId || null,
        leader_name: group.leaderName || null,
        member_ids: group.memberIds || [],
        member_names: group.memberNames || [],
        avatar: group.avatar || null,
        email: group.email || null,
        motto: group.motto || null,
        color: group.color || '#3B82F6',
        account_user_id: group.accountUserId || null
      }));
      console.log('Bulk upserting to Supabase student_groups:', payloads);
      const { data, error } = await client.from('student_groups').upsert(payloads, { onConflict: 'id' });
      if (error) {
        console.error('Supabase bulk upsert group error detail:', error);
      } else {
        console.log('Supabase bulk upsert group success:', data);
      }
    } catch (e) {
      console.error('Supabase bulk upsert group catch block error:', e);
    }
  } else {
    console.log('Supabase client not configured, skipping student_groups bulk upsert');
  }

  return true;
}

export async function dbDeleteGroup(groupId: string): Promise<boolean> {
  try {
    const saved = localStorage.getItem('narasa_groups_data');
    if (saved) {
      const list: StudentGroup[] = JSON.parse(saved);
      const filtered = list.filter(g => g.id !== groupId);
      localStorage.setItem('narasa_groups_data', JSON.stringify(filtered));
    }
  } catch (e) {}

  try {
    await fetch(`/api/groups/${groupId}`, {
      method: 'DELETE'
    });
  } catch (e) {}

  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('student_groups').delete().eq('id', groupId);
    } catch (e) {
      console.warn('Supabase delete group error:', e);
    }
  }

  return true;
}

// ==========================================
// ASSESSMENT & TEACHER INSIGHTS (REAL DATABASE)
// ==========================================
export async function dbFetchAssessmentData(): Promise<AssessmentRecord[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('student_assessments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase fetch assessments error:', error.message);
      } else if (Array.isArray(data)) {
        const mappedList: AssessmentRecord[] = data.map((row: any) => ({
          id: row.id,
          studentId: row.student_id,
          studentName: row.student_name,
          type: row.type || 'pre',
          literacyScore: Number(row.literacy_score) || 0,
          numeracyScore: Number(row.numeracy_score) || 0,
          reasoningScore: Number(row.reasoning_score) || 0,
          date: row.date || new Date().toISOString().split('T')[0],
          notes: row.notes || ''
        }));

        try {
          localStorage.setItem('narasa_assessment_data', JSON.stringify(mappedList));
        } catch (e) {}

        return mappedList;
      }
    } catch (e) {
      console.warn('Supabase fetch assessments error:', e);
    }
  }

  try {
    const saved = localStorage.getItem('narasa_assessment_data');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}

  return [];
}

export async function dbUpsertAssessment(record: AssessmentRecord): Promise<boolean> {
  try {
    const saved = localStorage.getItem('narasa_assessment_data');
    let list: AssessmentRecord[] = saved ? JSON.parse(saved) : [];
    const idx = list.findIndex(r => r.id === record.id);
    if (idx >= 0) {
      list[idx] = record;
    } else {
      list.unshift(record);
    }
    localStorage.setItem('narasa_assessment_data', JSON.stringify(list));
  } catch (e) {}

  try {
    await fetch('/api/assessments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    });
  } catch (e) {}

  return true;
}

export async function dbFetchTeacherInsights(): Promise<TeacherInsight[]> {
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('teacher_insights')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase fetch teacher_insights error:', error.message);
      } else if (Array.isArray(data)) {
        const mappedList: TeacherInsight[] = data.map((row: any) => ({
          id: row.id,
          title: row.title,
          type: row.type || 'pedagogical_tip',
          content: row.content,
          evidenceData: row.evidence_data || undefined,
          targetMissions: Array.isArray(row.target_missions) ? row.target_missions : [],
          actionRecommendation: row.action_recommendation || undefined,
          createdAt: row.created_at || new Date().toISOString()
        }));

        try {
          localStorage.setItem('narasa_teacher_insights_data', JSON.stringify(mappedList));
        } catch (e) {}

        return mappedList;
      }
    } catch (e) {
      console.warn('Supabase fetch teacher_insights error:', e);
    }
  }

  try {
    const saved = localStorage.getItem('narasa_teacher_insights_data');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}

  return [];
}

export async function dbSaveTeacherInsight(insight: Partial<TeacherInsight>): Promise<boolean> {
  try {
    await fetch('/api/teacher-insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(insight)
    });
  } catch (e) {}

  return true;
}

// Bulk Sync All Local Data to Supabase
export async function syncAllToSupabase(
  users: UserProfile[],
  missions: LearningMission[],
  sessions: StudentActivitySession[],
  schools?: SchoolProfile[],
  groups?: StudentGroup[],
  quizzes?: ConceptQuiz[],
  quizSubmissions?: QuizSubmission[]
): Promise<{ success: boolean; message: string; details: any }> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      message: 'Kredensial Supabase belum terpasang di environment variable.',
      details: null
    };
  }

  try {
    let syncedSchools = 0;
    let syncedUsers = 0;
    let syncedMissions = 0;
    let syncedSessions = 0;
    let syncedGroups = 0;
    let syncedQuizzes = 0;
    let syncedSubmissions = 0;

    // 0. Sync Schools
    const schoolsToSync = schools || (await dbFetchSchools());
    for (const sch of schoolsToSync) {
      const ok = await dbUpsertSchool(sch);
      if (ok) syncedSchools++;
    }

    // 1. Sync Users
    for (const u of users) {
      const ok = await dbUpsertUser(u);
      if (ok) syncedUsers++;
    }

    // 2. Sync Missions
    for (const m of missions) {
      const ok = await dbUpsertMission(m);
      if (ok) syncedMissions++;
    }

    // 3. Sync Sessions
    for (const s of sessions) {
      const ok = await dbUpsertSession(s);
      if (ok) syncedSessions++;
    }

    // 4. Sync Groups if provided
    if (groups && groups.length > 0) {
      for (const g of groups) {
        await dbUpsertGroup(g);
        syncedGroups++;
      }
    }

    // 5. Sync Quizzes if provided
    if (quizzes && quizzes.length > 0) {
      for (const q of quizzes) {
        await dbUpsertQuiz(q);
        syncedQuizzes++;
      }
    }

    // 6. Sync Quiz Submissions if provided
    if (quizSubmissions && quizSubmissions.length > 0) {
      for (const sub of quizSubmissions) {
        await dbUpsertQuizSubmission(sub);
        syncedSubmissions++;
      }
    }

    return {
      success: true,
      message: `Sinkronisasi Supabase Sukses: ${syncedSchools} Data Sekolah, ${syncedUsers} User, ${syncedMissions} Misi, ${syncedSessions} Karya, ${syncedGroups} Kelompok, ${syncedQuizzes} Kuis berhasil disimpan ke database.`,
      details: { syncedSchools, syncedUsers, syncedMissions, syncedSessions, syncedGroups, syncedQuizzes, syncedSubmissions }
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Gagal melakukan sinkronisasi: ${err.message}`,
      details: err
    };
  }
}

// ==========================================
// SYSTEM SETTINGS & GEMINI API KEY REPOSITORY
// ==========================================
export interface SystemSettingsData {
  geminiApiKey?: string;
  defaultModel?: string;
  visionSensitivity?: string;
  maxDailyAnalysisPerStudent?: number;
  enableCriticalQuizGen?: boolean;
  enableVisionObjectAnalysis?: boolean;
  updatedAt?: string;
}

export async function dbFetchSystemSettings(): Promise<SystemSettingsData> {
  let settings: SystemSettingsData = {
    geminiApiKey: '',
    defaultModel: 'gemini-3.1-flash-lite',
    visionSensitivity: 'balanced'
  };

  // 1. Fetch from server-side database
  try {
    const res = await fetch('/api/system-settings');
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (data && typeof data === 'object') {
        settings = { ...settings, ...data };
      }
    }
  } catch (e) {
    console.warn('Failed to fetch system settings from /api/system-settings:', e);
  }

  // 2. Fetch from Supabase if configured
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('system_settings')
        .select('*')
        .eq('key', 'school_gemini_config')
        .maybeSingle();

      if (!error && data && data.value) {
        const parsed = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
        settings = { ...settings, ...parsed };
      }
    } catch (e) {
      // Supabase table may not exist yet, fallback to server data
    }
  }

  // 3. Fallback to localStorage if still empty
  if (!settings.geminiApiKey && typeof window !== 'undefined') {
    try {
      const localKey = localStorage.getItem('narasa_school_gemini_key') || localStorage.getItem('school_gemini_api_key');
      if (localKey) settings.geminiApiKey = localKey;
    } catch (e) {}
  }

  return settings;
}

export async function dbSaveSystemSettings(newSettings: SystemSettingsData): Promise<boolean> {
  let serverSuccess = false;

  // 1. Save to server database /api/system-settings
  try {
    const res = await fetch('/api/system-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings)
    });
    if (res.ok) {
      serverSuccess = true;
    }
  } catch (e) {
    console.warn('Failed to save system settings to /api/system-settings:', e);
  }

  // 2. Save to Supabase if configured
  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('system_settings').upsert({
        key: 'school_gemini_config',
        value: newSettings,
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });
    } catch (e) {
      console.warn('Supabase system_settings save error:', e);
    }
  }

  // 3. Sync to localStorage
  if (typeof window !== 'undefined' && newSettings.geminiApiKey !== undefined) {
    try {
      if (newSettings.geminiApiKey) {
        localStorage.setItem('narasa_school_gemini_key', newSettings.geminiApiKey.trim());
      } else {
        localStorage.removeItem('narasa_school_gemini_key');
      }
    } catch (e) {}
  }

  return serverSuccess;
}

// ==========================================
// CONCEPT QUIZZES & SUBMISSIONS REPOSITORY (REAL DATABASE)
// ==========================================
export async function dbFetchQuizzes(): Promise<ConceptQuiz[]> {
  const quizMap = new Map<string, ConceptQuiz>();

  // 1. Primary: Load from Supabase Cloud if configured
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('concept_quizzes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch concept_quizzes notice:', error.message);
      } else if (Array.isArray(data) && data.length > 0) {
        data.forEach((row: any) => {
          quizMap.set(row.id, {
            id: row.id,
            title: row.title,
            subject: row.subject,
            grade: row.grade,
            phase: row.phase || 'Fase C',
            topic: row.topic || row.subject,
            description: row.description || '',
            durationMinutes: row.time_limit_minutes || row.durationMinutes || 15,
            targetCompetency: row.target_competency || 'literacy_and_numeracy',
            passingScore: Number(row.passing_score) || 75,
            totalQuestions: Array.isArray(row.questions) ? row.questions.length : 0,
            questions: Array.isArray(row.questions) ? row.questions : [],
            isPublished: row.is_active !== false && row.isPublished !== false,
            isAiGenerated: row.is_ai_generated || false,
            contextImage: row.context_image || row.contextImage || '',
            showContextImage: row.show_context_image !== false,
            createdAt: row.created_at || new Date().toISOString()
          });
        });
      }
    } catch (err) {
      console.warn('Supabase fetch concept_quizzes error:', err);
    }
  }

  // 2. Secondary: Load and merge from Server-side Database API (/api/concept-quizzes)
  try {
    const res = await fetch('/api/concept-quizzes');
    if (res.ok) {
      const serverQuizzes = await res.json();
      if (Array.isArray(serverQuizzes)) {
        serverQuizzes.forEach((q: ConceptQuiz) => {
          if (q && q.id && !quizMap.has(q.id)) {
            quizMap.set(q.id, q);
          }
        });
      }
    }
  } catch (e) {
    console.warn('Failed to fetch from /api/concept-quizzes:', e);
  }

  // 3. Fallback: Merge from localStorage cache
  try {
    const saved = localStorage.getItem('narasa_concept_quizzes_data');
    if (saved) {
      const localQuizzes = JSON.parse(saved);
      if (Array.isArray(localQuizzes)) {
        localQuizzes.forEach((q: ConceptQuiz) => {
          if (q && q.id && !quizMap.has(q.id)) {
            quizMap.set(q.id, q);
          }
        });
      }
    }
  } catch (e) {}

  // 4. Default Seed: If completely empty, seed with INITIAL_CONCEPT_QUIZZES
  if (quizMap.size === 0) {
    INITIAL_CONCEPT_QUIZZES.forEach((q) => quizMap.set(q.id, q));
  }

  const list = Array.from(quizMap.values());
  try {
    localStorage.setItem('narasa_concept_quizzes_data', JSON.stringify(list));
  } catch (e) {}

  return list;
}

export async function dbUpsertQuiz(quiz: ConceptQuiz): Promise<boolean> {
  // 1. Update localStorage cache
  try {
    const saved = localStorage.getItem('narasa_concept_quizzes_data');
    let current: ConceptQuiz[] = saved ? JSON.parse(saved) : [];
    const idx = current.findIndex((q) => q.id === quiz.id);
    if (idx >= 0) {
      current[idx] = quiz;
    } else {
      current.unshift(quiz);
    }
    localStorage.setItem('narasa_concept_quizzes_data', JSON.stringify(current));
  } catch (e) {}

  // 2. Persist to server database (/api/concept-quizzes)
  try {
    await fetch('/api/concept-quizzes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quiz)
    });
  } catch (e) {
    console.warn('POST /api/concept-quizzes error:', e);
  }

  // 3. Persist to Supabase if configured
  const client = getSupabaseClient();
  if (client) {
    try {
      const payload = {
        id: quiz.id,
        title: quiz.title,
        subject: quiz.subject,
        grade: quiz.grade,
        phase: quiz.phase || 'Fase C',
        topic: quiz.topic || quiz.subject,
        description: quiz.description || '',
        time_limit_minutes: quiz.durationMinutes || 15,
        passing_score: quiz.passingScore || 75,
        target_competency: quiz.targetCompetency || 'literacy_and_numeracy',
        is_active: quiz.isPublished !== false,
        questions: quiz.questions || []
      };
      const { error } = await client.from('concept_quizzes').upsert(payload, { onConflict: 'id' });
      if (error) {
        console.warn('Supabase upsert concept_quizzes warning:', error.message);
      }
    } catch (err) {
      console.warn('Supabase upsert concept_quizzes error:', err);
    }
  }

  return true;
}

export async function dbDeleteQuiz(quizId: string): Promise<boolean> {
  try {
    const saved = localStorage.getItem('narasa_concept_quizzes_data');
    if (saved) {
      const current: ConceptQuiz[] = JSON.parse(saved);
      const filtered = current.filter((q) => q.id !== quizId);
      localStorage.setItem('narasa_concept_quizzes_data', JSON.stringify(filtered));
    }
  } catch (e) {}

  try {
    await fetch(`/api/concept-quizzes/${quizId}`, {
      method: 'DELETE'
    });
  } catch (e) {}

  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('concept_quizzes').delete().eq('id', quizId);
    } catch (e) {}
  }

  return true;
}

export async function dbFetchQuizSubmissions(): Promise<QuizSubmission[]> {
  const submissionsMap = new Map<string, QuizSubmission>();

  // 1. Primary: Load from Supabase Cloud if configured
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data, error } = await client
        .from('quiz_submissions')
        .select('*')
        .order('completed_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch quiz_submissions notice:', error.message);
      } else if (Array.isArray(data)) {
        data.forEach((row: any) => {
          submissionsMap.set(row.id, {
            id: row.id,
            quizId: row.quiz_id,
            quizTitle: row.quiz_title,
            subject: row.subject,
            userId: row.user_id,
            userName: row.user_name,
            userAvatar: row.user_avatar,
            isGroup: Boolean(row.is_group),
            groupMembers: Array.isArray(row.group_members) ? row.group_members : [],
            className: row.class_name,
            classId: row.class_id,
            schoolName: row.school_name,
            schoolId: row.school_id,
            score: Number(row.score) || 0,
            objectiveScore: Number(row.objective_score ?? row.score) || 0,
            essayScore: Number(row.essay_score) || 0,
            correctCount: row.correct_count || 0,
            totalQuestions: row.total_questions || 0,
            literacyScore: Number(row.literacy_score) || 0,
            numeracyScore: Number(row.numeracy_score) || 0,
            reasoningScore: Number(row.reasoning_score) || 0,
            predicate: row.predicate || 'Cukup',
            feedback: row.feedback || '',
            selectedAnswers: row.selected_answers || {},
            hasEssay: Boolean(row.has_essay),
            needsManualGrading: Boolean(row.needs_manual_grading),
            isGradedByTeacher: Boolean(row.is_graded_by_teacher),
            completedAt: row.completed_at,
            timeSpentSeconds: row.time_spent_seconds || 0
          });
        });
      }
    } catch (err) {
      console.warn('Supabase fetch quiz_submissions error:', err);
    }
  }

  // 2. Secondary: Load and merge from Server-side Database API (/api/quiz-submissions)
  try {
    const res = await fetch('/api/quiz-submissions');
    if (res.ok) {
      const serverData = await res.json();
      if (Array.isArray(serverData)) {
        serverData.forEach((s: QuizSubmission) => {
          if (s && s.id && !submissionsMap.has(s.id)) {
            submissionsMap.set(s.id, s);
          }
        });
      }
    }
  } catch (e) {
    console.warn('Failed to fetch from /api/quiz-submissions:', e);
  }

  // 3. Fallback: Merge from localStorage cache
  try {
    const saved = localStorage.getItem('narasa_quiz_submissions_data');
    if (saved) {
      const localData = JSON.parse(saved);
      if (Array.isArray(localData)) {
        localData.forEach((s: QuizSubmission) => {
          if (s && s.id && !submissionsMap.has(s.id)) {
            submissionsMap.set(s.id, s);
          }
        });
      }
    }
  } catch (e) {}

  const merged = Array.from(submissionsMap.values()).sort((a, b) => {
    const timeA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
    const timeB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
    return timeB - timeA;
  });

  try {
    localStorage.setItem('narasa_quiz_submissions_data', JSON.stringify(merged));
  } catch (e) {}

  return merged;
}

export async function dbUpsertQuizSubmission(sub: QuizSubmission): Promise<boolean> {
  // 1. Immediately store in localStorage cache
  try {
    const saved = localStorage.getItem('narasa_quiz_submissions_data');
    let current: QuizSubmission[] = saved ? JSON.parse(saved) : [];
    const idx = current.findIndex((s) => s.id === sub.id);
    if (idx >= 0) {
      current[idx] = sub;
    } else {
      current.unshift(sub);
    }
    localStorage.setItem('narasa_quiz_submissions_data', JSON.stringify(current));
  } catch (e) {}

  // 2. Immediately persist to server-side database (/api/quiz-submissions)
  try {
    await fetch('/api/quiz-submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sub)
    });
  } catch (e) {
    console.warn('POST /api/quiz-submissions error:', e);
  }

  // 3. Persist to Supabase if connected
  const client = getSupabaseClient();
  if (client) {
    try {
      // 3.A Ensure parent user exists to satisfy foreign key (quiz_submissions_user_id_fkey)
      if (sub.userId) {
        try {
          const sanitizedId = String(sub.userId).replace(/[^a-zA-Z0-9_-]/g, '');
          await client.from('users').upsert({
            id: sub.userId,
            name: sub.userName || 'Murid NARASA',
            email: `${sanitizedId || 'murid'}@narasa.sch.id`,
            role: 'student',
            gender: 'male',
            school_name: sub.schoolName || 'SDN 01 Nusantara',
            school_id: sub.schoolId || 'SDN01',
            class_name: sub.className || 'Kelas V-A',
            class_id: sub.classId || 'class-5a',
            status: 'active',
            avatar: sub.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
            joined_date: 'Hari ini',
            is_group: Boolean(sub.isGroup),
            group_members: Array.isArray(sub.groupMembers) ? sub.groupMembers : []
          }, { onConflict: 'id' });
        } catch (errUser) {
          console.warn('Ensure parent user for quiz submission notice:', errUser);
        }
      }

      // 3.B Ensure parent quiz exists to satisfy foreign key (quiz_submissions_quiz_id_fkey)
      if (sub.quizId) {
        try {
          await client.from('concept_quizzes').upsert({
            id: sub.quizId,
            title: sub.quizTitle || 'Uji Pemahaman Konsep',
            subject: sub.subject || 'Tematik',
            grade: 'Kelas V',
            phase: 'Fase C',
            topic: sub.quizTitle || 'Materi Pembelajaran Kontekstual',
            description: 'Paket soal evaluasi pemahaman konsep literasi dan numerasi.',
            time_limit_minutes: 15,
            passing_score: 75,
            is_active: true,
            questions: []
          }, { onConflict: 'id' });
        } catch (errQuiz) {
          console.warn('Ensure parent quiz for submission notice:', errQuiz);
        }
      }

      // 3.C Normalize timestamp to valid ISO 8601 string for PostgreSQL TIMESTAMPTZ column
      let completedAtIso = new Date().toISOString();
      if (sub.completedAt) {
        const parsed = Date.parse(sub.completedAt);
        if (!isNaN(parsed)) {
          completedAtIso = new Date(parsed).toISOString();
        }
      }

      // Attempt 1: Full payload including essay & teacher grading columns
      const fullPayload: any = {
        id: sub.id,
        quiz_id: sub.quizId,
        quiz_title: sub.quizTitle,
        subject: sub.subject,
        user_id: sub.userId,
        user_name: sub.userName,
        user_avatar: sub.userAvatar || null,
        is_group: Boolean(sub.isGroup),
        group_members: Array.isArray(sub.groupMembers) ? sub.groupMembers : [],
        class_name: sub.className || 'Kelas V-A',
        class_id: sub.classId || 'class-5a',
        school_name: sub.schoolName || 'SDN 01 Nusantara',
        school_id: sub.schoolId || 'SDN01',
        score: Number(sub.score) || 0,
        objective_score: Number(sub.objectiveScore ?? sub.score) || 0,
        essay_score: Number(sub.essayScore) || 0,
        correct_count: Number(sub.correctCount) || 0,
        total_questions: Number(sub.totalQuestions) || 0,
        literacy_score: Number(sub.literacyScore) || 0,
        numeracy_score: Number(sub.numeracyScore) || 0,
        reasoning_score: Number(sub.reasoningScore) || 0,
        predicate: sub.predicate || 'Cukup',
        feedback: sub.feedback || '',
        selected_answers: sub.selectedAnswers || {},
        has_essay: Boolean(sub.hasEssay),
        needs_manual_grading: Boolean(sub.needsManualGrading),
        is_graded_by_teacher: Boolean(sub.isGradedByTeacher),
        teacher_feedback: sub.teacherFeedback || null,
        essay_answers: sub.essayAnswers || null,
        completed_at: completedAtIso,
        time_spent_seconds: Number(sub.timeSpentSeconds) || 0
      };

      const { error: upsertErr } = await client.from('quiz_submissions').upsert(fullPayload, { onConflict: 'id' });
      if (upsertErr) {
        console.warn('Supabase full upsert quiz_submissions notice, attempting core payload fallback:', upsertErr.message);
        
        // Attempt 2: Base columns payload for standard schema
        const basePayload = {
          id: sub.id,
          quiz_id: sub.quizId,
          quiz_title: sub.quizTitle,
          subject: sub.subject,
          user_id: sub.userId,
          user_name: sub.userName,
          user_avatar: sub.userAvatar || null,
          is_group: Boolean(sub.isGroup),
          group_members: Array.isArray(sub.groupMembers) ? sub.groupMembers : [],
          class_name: sub.className || 'Kelas V-A',
          class_id: sub.classId || 'class-5a',
          school_name: sub.schoolName || 'SDN 01 Nusantara',
          school_id: sub.schoolId || 'SDN01',
          score: Number(sub.score) || 0,
          correct_count: Number(sub.correctCount) || 0,
          total_questions: Number(sub.totalQuestions) || 0,
          literacy_score: Number(sub.literacyScore) || 0,
          numeracy_score: Number(sub.numeracyScore) || 0,
          reasoning_score: Number(sub.reasoningScore) || 0,
          predicate: sub.predicate || 'Cukup',
          feedback: sub.feedback || '',
          selected_answers: sub.selectedAnswers || {},
          completed_at: completedAtIso,
          time_spent_seconds: Number(sub.timeSpentSeconds) || 0
        };

        const { error: fallbackErr } = await client.from('quiz_submissions').upsert(basePayload, { onConflict: 'id' });
        if (fallbackErr) {
          console.error('Supabase fallback upsert quiz_submissions error:', fallbackErr.message);
        } else {
          console.log('✅ Quiz submission successfully saved to Supabase (base schema):', sub.id);
        }
      } else {
        console.log('✅ Quiz submission successfully saved to Supabase (full schema):', sub.id);
      }
    } catch (e: any) {
      console.warn('Supabase upsert submission error:', e?.message || e);
    }
  }

  return true;
}

export async function dbDeleteQuizSubmission(subId: string): Promise<boolean> {
  try {
    const saved = localStorage.getItem('narasa_quiz_submissions_data');
    if (saved) {
      const current: QuizSubmission[] = JSON.parse(saved);
      const filtered = current.filter((s) => s.id !== subId);
      localStorage.setItem('narasa_quiz_submissions_data', JSON.stringify(filtered));
    }
  } catch (e) {}

  try {
    await fetch(`/api/quiz-submissions/${subId}`, {
      method: 'DELETE'
    });
  } catch (e) {}

  const client = getSupabaseClient();
  if (client) {
    try {
      await client.from('quiz_submissions').delete().eq('id', subId);
    } catch (e) {}
  }

  return true;
}

