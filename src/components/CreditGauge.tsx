import React from 'react';
import { toPersianDigits } from '../utils/persian';

interface CreditGaugeProps {
  score: number; // 300 to 900
  grade?: string;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export const CreditGauge: React.FC<CreditGaugeProps> = ({
  score,
  grade = 'A+',
  size = 'md',
  showDetails = true,
}) => {
  // Normalize score between 300 and 900 -> 0 to 100%
  const minScore = 300;
  const maxScore = 900;
  const clampedScore = Math.min(Math.max(score, minScore), maxScore);
  const percentage = ((clampedScore - minScore) / (maxScore - minScore)) * 100;

  // Determine color and status
  let strokeColor = '#059669'; // Emerald
  let badgeBg = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  let statusText = 'بسیار کم‌ریسک (ممتاز)';

  if (score < 550) {
    strokeColor = '#DC2626'; // Red
    badgeBg = 'bg-rose-50 text-rose-800 border-rose-200';
    statusText = 'پرخطر (نیازمند بهبود سابقه)';
  } else if (score < 680) {
    strokeColor = '#D97706'; // Amber
    badgeBg = 'bg-amber-50 text-amber-800 border-amber-200';
    statusText = 'ریسک متوسط (مشروط)';
  } else if (score < 780) {
    strokeColor = '#0E7490'; // Teal
    badgeBg = 'bg-cyan-50 text-cyan-800 border-cyan-200';
    statusText = 'کم‌ریسک (بسیار مطلوب)';
  }

  // Semi-circle gauge dimensions
  const radius = 70;
  const circumference = Math.PI * radius; // Half circle
  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative w-44 h-28 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 160 90" className="w-full h-full transform">
          {/* Background Arc */}
          <path
            d="M 15 80 A 65 65 0 0 1 145 80"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Active Segment Arc */}
          <path
            d="M 15 80 A 65 65 0 0 1 145 80"
            fill="none"
            stroke={strokeColor}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Numbers */}
        <div className="absolute bottom-1 flex flex-col items-center">
          <span className="text-2xl font-black text-[#0C1E30] font-financial tracking-tight">
            {toPersianDigits(score)}
          </span>
          <span className="text-[11px] font-medium text-slate-500">
            از ۹۰۰ امتیاز
          </span>
        </div>
      </div>

      {showDetails && (
        <div className="mt-2 flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${badgeBg}`}>
              رتبه {grade}
            </span>
            <span className="text-xs font-semibold text-slate-700">
              {statusText}
            </span>
          </div>
          <span className="text-[11px] text-slate-600">
            بر اساس استعلام برخط سامانه اعتبارسنجی ایرانیان (سمات)
          </span>
        </div>
      )}
    </div>
  );
};
