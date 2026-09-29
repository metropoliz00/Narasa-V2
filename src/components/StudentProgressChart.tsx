import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  TrendingUp,
  Award,
  BookOpen,
  Calculator,
  Brain,
  Filter,
  BarChart3,
  LineChart as LineChartIcon,
  Calendar,
  Sparkles,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { StudentActivitySession, QuizSubmission } from '../types';

interface StudentProgressChartProps {
  studentSessions: StudentActivitySession[];
  quizSubmissions: QuizSubmission[];
  studentName?: string;
}

export interface UnifiedChartPoint {
  id: string;
  type: 'misi' | 'quiz';
  title: string;
  subject: string;
  dateStr: string;
  timestamp: number;
  literacyScore: number;
  numeracyScore: number;
  reasoningScore: number;
  overallScore: number;
}

// Sample fallback data for preview mode if student has no sessions yet
const SAMPLE_DEMO_TIMELINE: UnifiedChartPoint[] = [
  {
    id: 'demo-1',
    type: 'misi',
    title: 'Pengamatan Pola Bunga & Ekosistem Halaman',
    subject: 'IPAS (Sains)',
    dateStr: '10 Sep',
    timestamp: new Date('2026-09-10').getTime(),
    literacyScore: 68,
    numeracyScore: 60,
    reasoningScore: 65,
    overallScore: 64
  },
  {
    id: 'demo-2',
    type: 'quiz',
    title: 'Kuis Konsep FPB, KPK & Pecahan',
    subject: 'Matematika',
    dateStr: '14 Sep',
    timestamp: new Date('2026-09-14').getTime(),
    literacyScore: 72,
    numeracyScore: 78,
    reasoningScore: 74,
    overallScore: 75
  },
  {
    id: 'demo-3',
    type: 'misi',
    title: 'Eksplorasi Bentuk Geometri Lapangan',
    subject: 'Matematika',
    dateStr: '18 Sep',
    timestamp: new Date('2026-09-18').getTime(),
    literacyScore: 76,
    numeracyScore: 85,
    reasoningScore: 82,
    overallScore: 81
  },
  {
    id: 'demo-4',
    type: 'quiz',
    title: 'Uji Membaca Teks Informasi & Prosedur',
    subject: 'Bahasa Indonesia',
    dateStr: '22 Sep',
    timestamp: new Date('2026-09-22').getTime(),
    literacyScore: 88,
    numeracyScore: 80,
    reasoningScore: 85,
    overallScore: 84
  },
  {
    id: 'demo-5',
    type: 'misi',
    title: 'Observasi Daur Air & Rantai Makanan',
    subject: 'IPAS (Sains)',
    dateStr: '26 Sep',
    timestamp: new Date('2026-09-26').getTime(),
    literacyScore: 92,
    numeracyScore: 88,
    reasoningScore: 90,
    overallScore: 90
  }
];

export const StudentProgressChart: React.FC<StudentProgressChartProps> = ({
  studentSessions,
  quizSubmissions,
  studentName = 'Murid'
}) => {
  const [dataFilter, setDataFilter] = useState<'all' | 'misi' | 'quiz'>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [chartType, setChartType] = useState<'area' | 'line' | 'bar'>('area');
  const [showDemoIfEmpty, setShowDemoIfEmpty] = useState<boolean>(false);

  // Helper to format date to short format "12 Sep"
  const formatShortDate = (isoString?: string) => {
    if (!isoString) return 'Terbaru';
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return 'Terbaru';
      return new Intl.DateTimeFormat('id-ID', { month: 'short', day: 'numeric' }).format(d);
    } catch (e) {
      return 'Terbaru';
    }
  };

  // Process and combine timeline data chronologically
  const rawTimelineData = useMemo<UnifiedChartPoint[]>(() => {
    const list: UnifiedChartPoint[] = [];

    // 1. Process Completed Learning Sessions (Misi Eksplorasi)
    studentSessions
      .filter((s) => s.status === 'completed' && s.metrics)
      .forEach((s) => {
        const time = s.completedAt ? new Date(s.completedAt).getTime() : Date.now();
        list.push({
          id: s.id,
          type: 'misi',
          title: s.missionTitle || 'Misi Eksplorasi Foto',
          subject: s.subject || 'Eksplorasi Kontekstual',
          dateStr: formatShortDate(s.completedAt),
          timestamp: time,
          literacyScore: s.metrics?.literacyScore || 0,
          numeracyScore: s.metrics?.numeracyScore || 0,
          reasoningScore: s.metrics?.reasoningScore || 0,
          overallScore: Math.round(
            ((s.metrics?.literacyScore || 0) +
              (s.metrics?.numeracyScore || 0) +
              (s.metrics?.reasoningScore || 0)) / 3
          )
        });
      });

    // 2. Process Quiz Submissions
    quizSubmissions.forEach((qs) => {
      const time = qs.completedAt ? new Date(qs.completedAt).getTime() : Date.now();
      list.push({
        id: qs.id,
        type: 'quiz',
        title: qs.quizTitle || 'Uji Pemahaman Konsep',
        subject: qs.subject || 'Kuis Harian',
        dateStr: formatShortDate(qs.completedAt),
        timestamp: time,
        literacyScore: qs.literacyScore || 0,
        numeracyScore: qs.numeracyScore || 0,
        reasoningScore: qs.reasoningScore || 0,
        overallScore: qs.score || Math.round(((qs.literacyScore || 0) + (qs.numeracyScore || 0) + (qs.reasoningScore || 0)) / 3)
      });
    });

    // Sort chronologically ascending for line/area chart (left-to-right timeline)
    return list.sort((a, b) => a.timestamp - b.timestamp);
  }, [studentSessions, quizSubmissions]);

  const hasRealData = rawTimelineData.length > 0;
  const activeTimeline = hasRealData ? rawTimelineData : showDemoIfEmpty ? SAMPLE_DEMO_TIMELINE : [];

  // Filtered timeline data based on selected controls
  const filteredTimeline = useMemo(() => {
    return activeTimeline.filter((item) => {
      if (dataFilter !== 'all' && item.type !== dataFilter) return false;
      if (subjectFilter !== 'all' && !item.subject.toLowerCase().includes(subjectFilter.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [activeTimeline, dataFilter, subjectFilter]);

  // Overall statistics from filtered data
  const stats = useMemo(() => {
    if (filteredTimeline.length === 0) {
      return { avgLit: 0, avgNum: 0, avgReason: 0, trendLit: 0, trendNum: 0 };
    }
    const totalLit = filteredTimeline.reduce((acc, curr) => acc + curr.literacyScore, 0);
    const totalNum = filteredTimeline.reduce((acc, curr) => acc + curr.numeracyScore, 0);
    const totalReason = filteredTimeline.reduce((acc, curr) => acc + curr.reasoningScore, 0);

    const firstPoint = filteredTimeline[0];
    const lastPoint = filteredTimeline[filteredTimeline.length - 1];

    const trendLit = filteredTimeline.length > 1 ? lastPoint.literacyScore - firstPoint.literacyScore : 0;
    const trendNum = filteredTimeline.length > 1 ? lastPoint.numeracyScore - firstPoint.numeracyScore : 0;

    return {
      avgLit: Math.round(totalLit / filteredTimeline.length),
      avgNum: Math.round(totalNum / filteredTimeline.length),
      avgReason: Math.round(totalReason / filteredTimeline.length),
      trendLit,
      trendNum
    };
  }, [filteredTimeline]);

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data: UnifiedChartPoint = payload[0].payload;
      return (
        <div className="bg-slate-900/95 text-white p-3.5 rounded-2xl shadow-xl border border-slate-700 backdrop-blur-md text-xs space-y-2 max-w-xs animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-1.5 gap-2">
            <span className="font-extrabold text-slate-200 truncate">{data.title}</span>
            <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30 shrink-0">
              {data.dateStr}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 flex items-center justify-between">
            <span>Mata Pelajaran:</span>
            <span className="font-bold text-slate-200">{data.subject}</span>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between gap-3 text-emerald-300 font-medium">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Literasi Sains:
              </span>
              <span className="font-extrabold text-emerald-400">{data.literacyScore} / 100</span>
            </div>

            <div className="flex items-center justify-between gap-3 text-sky-300 font-medium">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                Numerasi Kontekstual:
              </span>
              <span className="font-extrabold text-sky-400">{data.numeracyScore} / 100</span>
            </div>

            <div className="flex items-center justify-between gap-3 text-purple-300 font-medium">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                Penalaran Kritis:
              </span>
              <span className="font-extrabold text-purple-400">{data.reasoningScore} / 100</span>
            </div>
          </div>

          <div className="pt-1.5 border-t border-slate-700/80 flex items-center justify-between text-[11px] font-extrabold">
            <span className="text-slate-300">Rata-rata Sesi:</span>
            <span className="text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/30">
              {data.overallScore}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-md space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xs">
              <TrendingUp className="w-5 h-5" />
            </span>
            <h3 className="text-base sm:text-xl font-extrabold text-[#1E293B] font-display">
              Grafik Perkembangan Kemampuan Literasi & Numerasi
            </h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
            Visualisasi tren kenaikan skor literasi sains, numerasi kontekstual, dan penalaran kritis berdasarkan riwayat sesi eksplorasi foto serta uji pemahaman konsep.
          </p>
        </div>

        {/* Controls Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Chart Type Toggle */}
          <div className="flex items-center bg-slate-100/80 p-1 rounded-2xl border border-slate-200 text-xs">
            <button
              onClick={() => setChartType('area')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-all ${
                chartType === 'area'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Grafik Area Kerapatan"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Area</span>
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-all ${
                chartType === 'line'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Grafik Garis Tren"
            >
              <LineChartIcon className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Garis</span>
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-all ${
                chartType === 'bar'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Grafik Batang Perbandingan"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Batang</span>
            </button>
          </div>

          {/* Filter Source Tabs */}
          <div className="flex items-center bg-slate-100/80 p-1 rounded-2xl border border-slate-200 text-xs">
            <button
              onClick={() => setDataFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                dataFilter === 'all'
                  ? 'bg-white text-slate-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({activeTimeline.length})
            </button>
            <button
              onClick={() => setDataFilter('misi')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                dataFilter === 'misi'
                  ? 'bg-white text-emerald-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Misi Foto
            </button>
            <button
              onClick={() => setDataFilter('quiz')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                dataFilter === 'quiz'
                  ? 'bg-white text-amber-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Uji Konsep
            </button>
          </div>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold text-emerald-800 block">Rata-rata Literasi</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-black text-emerald-950 font-display">{stats.avgLit}</span>
              <span className="text-[10px] text-emerald-700 font-bold">/ 100</span>
            </div>
          </div>
          <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700 font-bold text-xs">
            📖
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold text-sky-800 block">Rata-rata Numerasi</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-black text-sky-950 font-display">{stats.avgNum}</span>
              <span className="text-[10px] text-sky-700 font-bold">/ 100</span>
            </div>
          </div>
          <span className="p-2 rounded-xl bg-sky-100 text-sky-700 font-bold text-xs">
            📐
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold text-purple-800 block">Rata-rata Penalaran</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-black text-purple-950 font-display">{stats.avgReason}</span>
              <span className="text-[10px] text-purple-700 font-bold">/ 100</span>
            </div>
          </div>
          <span className="p-2 rounded-xl bg-purple-100 text-purple-700 font-bold text-xs">
            🧠
          </span>
        </div>
      </div>

      {/* Chart Canvas or Empty State */}
      {!hasRealData && !showDemoIfEmpty ? (
        <div className="bg-slate-50/80 rounded-3xl p-8 sm:p-12 border-2 border-dashed border-slate-200 text-center space-y-4 shadow-2xs">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center border border-blue-200 shadow-2xs">
            <Sparkles className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h4 className="text-base font-bold text-[#1E293B] font-display">
              Belum Ada Riwayat Sesi Selesai
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Selesaikan misi eksplorasi foto atau ikuti uji pemahaman konsep untuk mulai merekam grafik perkembangan kemampuan literasi & numerasimu dari waktu ke waktu.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => setShowDemoIfEmpty(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs inline-flex items-center gap-2 transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Tampilkan Contoh Grafik Simulasi</span>
            </button>
          </div>
        </div>
      ) : filteredTimeline.length === 0 ? (
        <div className="bg-slate-50 rounded-2xl p-8 text-center text-xs text-slate-500 space-y-2">
          <HelpCircle className="w-6 h-6 mx-auto text-slate-400" />
          <p>Tidak ada data riwayat yang cocok dengan filter yang dipilih.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {!hasRealData && showDemoIfEmpty && (
            <div className="bg-amber-50 border border-amber-200/90 rounded-2xl px-3.5 py-2 text-xs text-amber-900 flex items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Mode Simulasi/Contoh:</strong> Menampilkan contoh tren grafik perkembangan murid.
                </span>
              </div>
              <button
                onClick={() => setShowDemoIfEmpty(false)}
                className="text-[11px] font-bold text-amber-700 underline hover:text-amber-900 shrink-0 cursor-pointer"
              >
                Tutup Contoh
              </button>
            </div>
          )}

          {/* Recharts Chart Area */}
          <div className="w-full h-72 sm:h-80 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'area' ? (
                <AreaChart data={filteredTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorLit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorNum" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorReason" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="dateStr"
                    tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    ticks={[0, 25, 50, 75, 100]}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingBottom: '12px' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="literacyScore"
                    name="Literasi Sains"
                    stroke="#10b981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorLit)"
                    activeDot={{ r: 6, strokeWidth: 2, stroke: '#ffffff' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="numeracyScore"
                    name="Numerasi Kontekstual"
                    stroke="#0284c7"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorNum)"
                    activeDot={{ r: 6, strokeWidth: 2, stroke: '#ffffff' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="reasoningScore"
                    name="Penalaran Kritis"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    fillOpacity={1}
                    fill="url(#colorReason)"
                  />
                </AreaChart>
              ) : chartType === 'line' ? (
                <LineChart data={filteredTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="dateStr"
                    tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    ticks={[0, 25, 50, 75, 100]}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingBottom: '12px' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="literacyScore"
                    name="Literasi Sains"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#10b981' }}
                    activeDot={{ r: 7 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="numeracyScore"
                    name="Numerasi Kontekstual"
                    stroke="#0284c7"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#0284c7' }}
                    activeDot={{ r: 7 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="reasoningScore"
                    name="Penalaran Kritis"
                    stroke="#8b5cf6"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#8b5cf6' }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              ) : (
                <BarChart data={filteredTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="dateStr"
                    tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    ticks={[0, 25, 50, 75, 100]}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingBottom: '12px' }}
                  />
                  <Bar dataKey="literacyScore" name="Literasi Sains" fill="#10b981" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="numeracyScore" name="Numerasi Kontekstual" fill="#0284c7" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="reasoningScore" name="Penalaran Kritis" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
