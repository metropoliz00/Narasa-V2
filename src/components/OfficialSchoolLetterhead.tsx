import React from 'react';
import { SchoolProfile } from '../types';

interface OfficialSchoolLetterheadProps {
  schoolProfile: SchoolProfile;
  className?: string;
  showLogo?: boolean;
}

export const OfficialSchoolLetterhead: React.FC<OfficialSchoolLetterheadProps> = ({
  schoolProfile,
  className = '',
  showLogo = true
}) => {
  // 1. Format Pemerintah Daerah (Kabupaten / Kota / Provinsi)
  const getGovernmentHeader = (): string => {
    const city = (schoolProfile.city || '').trim();
    if (city.toLowerCase().startsWith('kabupaten')) {
      return `PEMERINTAH ${city.toUpperCase()}`;
    }
    if (city.toLowerCase().startsWith('kota')) {
      return `PEMERINTAH ${city.toUpperCase()}`;
    }
    if (city) {
      return `PEMERINTAH KABUPATEN ${city.toUpperCase()}`;
    }
    const province = (schoolProfile.province || 'JAWA TIMUR').trim();
    return `PEMERINTAH PROVINSI ${province.toUpperCase()}`;
  };

  // 2. Format Nama Sekolah (e.g. UPT SD NEGERI KARANGASEM)
  const getSchoolNameHeader = (): string => {
    const rawName = (schoolProfile.name || 'UPT SD NEGERI KARANGASEM').trim().toUpperCase();
    return rawName;
  };

  // 3. Format Kecamatan (e.g. KECAMATAN JENU)
  const getDistrictHeader = (): string => {
    const district = (schoolProfile.district || 'Jenu').trim().toUpperCase();
    if (district.startsWith('KECAMATAN')) {
      return district;
    }
    return `KECAMATAN ${district}`;
  };

  // 4. Format Alamat Lengkap Baris 1
  const getFullAddressLine = (): string => {
    const parts: string[] = [];
    if (schoolProfile.address) parts.push(schoolProfile.address);
    if (schoolProfile.village) {
      const v = schoolProfile.village.trim();
      parts.push(v.toLowerCase().startsWith('desa') || v.toLowerCase().startsWith('kel') ? v : `Desa ${v}`);
    }
    if (schoolProfile.district) {
      const d = schoolProfile.district.trim();
      parts.push(d.toLowerCase().startsWith('kec') ? d : `Kec. ${d}`);
    }
    if (schoolProfile.city) {
      const c = schoolProfile.city.trim();
      parts.push(c.toLowerCase().startsWith('kab') || c.toLowerCase().startsWith('kota') ? c : `Kab. ${c}`);
    }
    return parts.join(' ');
  };

  // 5. Format Kode Pos & Kontak Baris 2
  const postalCodeText = schoolProfile.postalCode ? `Kode Pos ${schoolProfile.postalCode}` : '';
  const emailText = schoolProfile.email ? schoolProfile.email : '';
  const phoneText = schoolProfile.phone ? `Telp: ${schoolProfile.phone}` : '';

  return (
    <div className={`w-full text-black select-none ${className}`}>
      {/* Header Container with Logo on Left, Perfectly Centered Text, and Balancer Spacer */}
      <div className="flex items-center justify-between pb-2 gap-2 sm:gap-4">
        {/* Logo Lambang Daerah / Sekolah di Sisi Kiri */}
        {showLogo ? (
          <div className="w-16 h-20 sm:w-20 sm:h-24 shrink-0 flex items-center justify-center">
            {schoolProfile.logoUrl ? (
              <img
                src={schoolProfile.logoUrl}
                alt={`Logo ${schoolProfile.name}`}
                className="w-16 h-20 sm:w-20 sm:h-24 object-contain print:w-20 print:h-24"
              />
            ) : (
              /* High-fidelity Vector Official Regional Emblem (Shield Logo with Star, Ribbon & Tower) */
              <div className="w-16 h-20 sm:w-20 sm:h-24 flex items-center justify-center">
                <svg
                  viewBox="0 0 100 120"
                  className="w-full h-full drop-shadow-xs"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Shield Outer Outline */}
                  <path
                    d="M50 4 C76 4, 94 12, 94 40 C94 82, 50 114, 50 114 C50 114, 6 82, 6 40 C6 12, 24 4, 50 4 Z"
                    fill="#FFFFFF"
                    stroke="#1E293B"
                    strokeWidth="3.5"
                  />
                  {/* Shield Inner Background Divisions */}
                  <path
                    d="M50 7 C73 7, 90 14, 90 40 C90 80, 50 110, 50 110 C50 110, 10 80, 10 40 C10 14, 27 7, 50 7 Z"
                    fill="#DC2626"
                  />
                  {/* Blue Sky & Sea Section */}
                  <path
                    d="M10 40 C10 80, 50 110, 50 110 C50 110, 90 80, 90 40 L90 20 L10 20 Z"
                    fill="#0284C7"
                  />
                  {/* Green Hill/Field */}
                  <path
                    d="M10 65 C25 60, 40 70, 50 65 C60 60, 75 70, 90 65 C85 85, 50 110, 50 110 C50 110, 15 85, 10 65 Z"
                    fill="#15803D"
                  />
                  {/* Fortress / Gateway Icon (White) */}
                  <path
                    d="M38 48 L42 48 L42 75 L38 75 Z M58 48 L62 48 L62 75 L58 75 Z M42 52 L58 52 L58 58 L42 58 Z"
                    fill="#FFFFFF"
                  />
                  <rect x="44" y="44" width="12" height="10" rx="1" fill="#FFFFFF" />
                  {/* Golden Yellow Star */}
                  <polygon
                    points="50,22 53,30 61,30 55,35 57,43 50,38 43,43 45,35 39,30 47,30"
                    fill="#FACC15"
                    stroke="#CA8A04"
                    strokeWidth="0.8"
                  />
                  {/* Sea Waves */}
                  <path
                    d="M26 82 Q34 78 42 82 Q50 86 58 82 Q66 78 74 82"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    fill="none"
                  />
                  {/* Official Ribbon at Bottom */}
                  <path
                    d="M20 96 Q50 106 80 96 L82 104 Q50 114 18 104 Z"
                    fill="#1E3A8A"
                    stroke="#FACC15"
                    strokeWidth="1.2"
                  />
                  <text
                    x="50"
                    y="103"
                    textAnchor="middle"
                    fill="#FACC15"
                    fontSize="6.5"
                    fontWeight="bold"
                    letterSpacing="0.8"
                  >
                    TUBAN
                  </text>
                </svg>
              </div>
            )}
          </div>
        ) : null}

        {/* Kop Text Alignment - Centered strictly according to standard government rules */}
        <div className="flex-1 text-center space-y-0.5 min-w-0">
          {/* Baris 1: PEMERINTAH KABUPATEN TUBAN */}
          <h1 className="text-xs sm:text-sm md:text-[15px] font-bold tracking-wider text-slate-900 uppercase font-sans leading-snug">
            {getGovernmentHeader()}
          </h1>

          {/* Baris 2: DINAS PENDIDIKAN */}
          <h2 className="text-sm sm:text-base md:text-[17px] font-bold tracking-wide text-slate-900 uppercase font-sans leading-snug">
            DINAS PENDIDIKAN
          </h2>

          {/* Baris 3: UPT SD NEGERI KARANGASEM (Paling Besar & Tebal) */}
          <h3 className="text-base sm:text-xl md:text-[22px] font-black tracking-tight text-slate-950 uppercase font-sans py-0.5 leading-tight">
            {getSchoolNameHeader()}
          </h3>

          {/* Baris 4: KECAMATAN JENU */}
          <h4 className="text-xs sm:text-sm md:text-[15px] font-bold tracking-wider text-slate-900 uppercase font-sans leading-snug">
            {getDistrictHeader()}
          </h4>

          {/* Baris 5: Alamat Lengkap Jalan, Desa, Kecamatan, Kabupaten */}
          <p className="text-[10px] sm:text-[11.5px] text-slate-800 font-normal leading-tight pt-0.5">
            {getFullAddressLine()}
          </p>

          {/* Baris 6: Kode Pos & Email dengan Link Biru */}
          <p className="text-[10px] sm:text-[11.5px] text-slate-800 font-normal leading-tight">
            {postalCodeText && <span>{postalCodeText} </span>}
            {emailText && (
              <span>
                Email : <span className="text-blue-600 underline font-medium">{emailText}</span>
              </span>
            )}
            {phoneText && <span className="ml-2">• {phoneText}</span>}
          </p>
        </div>

        {/* Balancer Spacer on the Right (ensures text is mathematically centered) */}
        {showLogo && (
          <div className="w-16 sm:w-20 shrink-0 hidden sm:block pointer-events-none" aria-hidden="true" />
        )}
      </div>

      {/* Double Horizontal Border Separator (Garis Ganda Khas KOP Surat Resmi) */}
      <div className="relative pt-1">
        {/* Garis Tebal Atas (2.5px) */}
        <div className="h-[2.5px] bg-slate-950 w-full mb-[2px]"></div>
        {/* Garis Tipis Bawah (1px) */}
        <div className="h-[1px] bg-slate-950 w-full"></div>
      </div>
    </div>
  );
};
