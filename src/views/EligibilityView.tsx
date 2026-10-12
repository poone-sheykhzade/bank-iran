import React, { useState } from 'react';
import { CreditGauge } from '../components/CreditGauge';
import { toPersianDigits, formatToman, formatNumber } from '../utils/persian';
import { LoanProduct, ActiveNavTab } from '../types';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';

interface EligibilityViewProps {
  onApplyForLoan: (loanId?: string) => void;
  onNavigate: (tab: ActiveNavTab) => void;
  loans: LoanProduct[];
}

export const EligibilityView: React.FC<EligibilityViewProps> = ({
  onApplyForLoan,
  onNavigate,
  loans,
}) => {
  const [jobType, setJobType] = useState('employee');
  const [monthlyIncome, setMonthlyIncome] = useState<number>(35_000_000);
  const [currentDebt, setCurrentDebt] = useState<number>(5_000_000);
  const [hasBouncedCheck, setHasBouncedCheck] = useState<boolean>(false);
  const [isCalculated, setIsCalculated] = useState<boolean>(true);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  // Compute dynamic credit evaluation
  const disposableIncome = Math.max(0, monthlyIncome - currentDebt);
  const dtiRatio = monthlyIncome > 0 ? (currentDebt / monthlyIncome) * 100 : 0;

  // Credit score heuristic
  let score = 845;
  if (hasBouncedCheck) {
    score -= 320;
  }
  if (dtiRatio > 50) {
    score -= 90;
  } else if (dtiRatio > 30) {
    score -= 40;
  }
  if (jobType === 'business' || jobType === 'freelance') {
    score -= 20;
  }
  score = Math.max(340, Math.min(880, score));

  let grade = 'A+';
  let maxBorrowCapacity = Math.round(disposableIncome * 0.45 * 24); // Based on 40-50% disposable capacity

  if (score < 550) {
    grade = 'D';
    maxBorrowCapacity = 0;
  } else if (score < 680) {
    grade = 'C';
    maxBorrowCapacity = Math.min(50_000_000, maxBorrowCapacity);
  } else if (score < 750) {
    grade = 'B';
    maxBorrowCapacity = Math.min(150_000_000, maxBorrowCapacity);
  } else {
    grade = 'A+';
    maxBorrowCapacity = Math.min(800_000_000, maxBorrowCapacity);
  }

  const handleReEvaluate = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      setIsEvaluating(false);
      setIsCalculated(true);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* 1. Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#0C1E30]">
          ارزیابی شرایط اعتباری و سنجش توان دریافت وام
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          بدون نیاز به ثبت پرونده، سقف وام قابل دریافت و رتبه اعتباری خود را در کمتر از ۱ دقیقه ارزیابی کنید
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Inputs (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-7 space-y-5">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
            اطلاعات مالی و شغلی
          </h2>

          {/* Job Type */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              نوع فعالیت و منبع درآمد
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'employee', label: 'کارمند رسمی / بخش دولتی' },
                { id: 'private', label: 'کارمند بخش خصوصی' },
                { id: 'business', label: 'صاحب کسب‌وکار و پروانه کسب' },
                { id: 'freelance', label: 'مشاغل آزاد / قراردادی' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setJobType(item.id)}
                  className={`p-2.5 rounded-xl border text-right transition-all font-medium ${
                    jobType === item.id
                      ? 'border-[#0C1E30] bg-[#0C1E30] text-white'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Monthly Income */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-700">میانگین درآمد خالص ماهانه</label>
              <span className="font-financial font-bold text-[#0E7490]">
                {formatToman(monthlyIncome)}
              </span>
            </div>
            <input
              type="range"
              min={10_000_000}
              max={150_000_000}
              step={5_000_000}
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0C1E30]"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-financial">
              <span>۱۰ میلیون</span>
              <span>۷۵ میلیون</span>
              <span>۱۵۰+ میلیون تومان</span>
            </div>
          </div>

          {/* Current Debt/Installments */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-700">
                مجموع اقساط فعال فعلی در بانک‌ها
              </label>
              <span className="font-financial font-bold text-slate-600">
                {currentDebt === 0 ? 'بدون قسط' : formatToman(currentDebt)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={50_000_000}
              step={2_500_000}
              value={currentDebt}
              onChange={(e) => setCurrentDebt(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0C1E30]"
            />
          </div>

          {/* Bounced Check Switch */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 block">
              وضعیت چک برگشتی یا بدهی غیرجاری
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setHasBouncedCheck(false)}
                className={`py-2 px-3 rounded-xl border text-center font-medium transition-all ${
                  !hasBouncedCheck
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                فاقد هرگونه چک برگشتی
              </button>
              <button
                type="button"
                onClick={() => setHasBouncedCheck(true)}
                className={`py-2 px-3 rounded-xl border text-center font-medium transition-all ${
                  hasBouncedCheck
                    ? 'border-rose-600 bg-rose-50 text-rose-800 font-bold'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                دارای سابقه چک یا بدهی معوق
              </button>
            </div>
          </div>

          <button
            onClick={handleReEvaluate}
            disabled={isEvaluating}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isEvaluating ? 'animate-spin' : ''}`} />
            <span>به‌روزرسانی و استعلام مجدد</span>
          </button>
        </div>

        {/* Results Card (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#CBD5E1] p-5 sm:p-6 shadow-sm space-y-6">
          <div className="text-center">
            <span className="text-[11px] font-bold text-slate-400 block mb-2">
              سنجش اعتبار و رتبه سمات
            </span>
            <CreditGauge score={score} grade={grade} showDetails={true} />
          </div>

          {/* Results summary breakdown */}
          <div className="space-y-3 py-4 border-y border-slate-100 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">سقف برآورد تسهیلات:</span>
              <span className="font-bold text-[#0C1E30] font-financial text-base">
                {maxBorrowCapacity > 0 ? formatToman(maxBorrowCapacity) : 'عدم احراز شرایط'}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500">نسبت اقساط به درآمد (DTI):</span>
              <span className={`font-bold font-financial ${dtiRatio > 50 ? 'text-rose-600' : 'text-emerald-700'}`}>
                {toPersianDigits(dtiRatio.toFixed(0))}٪ (وضعیت {dtiRatio <= 40 ? 'عالی' : 'متوسط'})
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500">نیاز به ضامن کسر از حقوق:</span>
              <span className="font-bold text-slate-800">
                {score >= 750 ? 'بدون ضامن (اعتبار دیجیتال)' : 'یک نفر ضامن یا چک'}
              </span>
            </div>
          </div>

          {/* Action button based on score */}
          {hasBouncedCheck ? (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">نیاز به رفع سوء اثر چک</p>
                <p className="text-[11px] mt-0.5">پس از رفع سوء اثر در سامانه صیاد، امکان ثبت فوری فراهم خواهد بود.</p>
              </div>
            </div>
          ) : (
            <button
              onClick={() => onApplyForLoan()}
              className="w-full py-3 bg-[#0C1E30] hover:bg-[#162F4A] text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <span>ورود به مرحله ثبت درخواست تسهیلات</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <p className="text-[11px] text-slate-400 text-center">
            * نتایج این ارزیابی برخط، مبنای اولیه سقف تسهیلات بوده و استعلام نهایی در زمان ثبت نام بدون افت رتبه اخذ می‌گردد.
          </p>
        </div>
      </div>
    </div>
  );
};
