import React, { useState } from 'react';
import { LoanProduct } from '../types';
import { toPersianDigits, formatToman, calculateInstallment } from '../utils/persian';
import {
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  Home,
  Briefcase,
  ShoppingBag,
  Zap,
  Sliders,
  Check,
} from 'lucide-react';

interface SmartAdvisorViewProps {
  loans: LoanProduct[];
  onSelectLoan: (loan: LoanProduct) => void;
  onApplyLoan: (loan: LoanProduct) => void;
}

export const SmartAdvisorView: React.FC<SmartAdvisorViewProps> = ({
  loans,
  onSelectLoan,
  onApplyLoan,
}) => {
  const [purpose, setPurpose] = useState<string>('urgent');
  const [targetAmount, setTargetAmount] = useState<number>(80_000_000);
  const [maxMonthlyAfford, setMaxMonthlyAfford] = useState<number>(5_000_000);
  const [priority, setPriority] = useState<'no_guarantor' | 'low_rate' | 'speed'>('no_guarantor');

  // Match scoring algorithm
  const scoredLoans = loans.map((loan) => {
    let score = 70;

    // Purpose match
    if (purpose === 'housing' && loan.category === 'housing') score += 25;
    if (purpose === 'business' && loan.category === 'business') score += 25;
    if (purpose === 'urgent' && loan.category === 'urgent') score += 25;
    if (purpose === 'goods' && loan.category === 'personal') score += 25;

    // Amount match
    if (targetAmount <= loan.maxAmount && targetAmount >= loan.minAmount) {
      score += 15;
    } else {
      score -= 20;
    }

    // Priority match
    if (priority === 'no_guarantor' && loan.id === 'loan-urgent-omid') score += 20;
    if (priority === 'low_rate' && loan.interestRate <= 18) score += 20;
    if (priority === 'speed' && loan.turnaroundDays <= 2) score += 15;

    // Monthly installment match
    const { monthlyPayment } = calculateInstallment(
      Math.min(targetAmount, loan.maxAmount),
      loan.interestRate,
      loan.maxTermMonths
    );
    if (monthlyPayment <= maxMonthlyAfford) {
      score += 15;
    } else {
      score -= 10;
    }

    const matchPercent = Math.min(99, Math.max(50, score));
    return {
      loan,
      matchPercent,
      monthlyPayment,
    };
  });

  scoredLoans.sort((a, b) => b.matchPercent - a.matchPercent);
  const bestMatch = scoredLoans[0];
  const secondaryMatches = scoredLoans.slice(1, 3);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* 1. Header */}
      <div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h1 className="text-xl sm:text-2xl font-black text-[#0C1E30]">
            پیشنهاد هوشمند تسهیلات بانکی
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          با پاسخ به ۳ پرسش ساده، مناسب‌ترین و کم‌هزینه‌ترین طرح متناسب با شرایط خود را پیدا کنید
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Question Panel (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 space-y-5">
          <h2 className="text-xs font-bold text-slate-400 pb-2 border-b border-slate-100">
            اهداف و شرایط مورد نظر
          </h2>

          {/* Question 1: Purpose */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              ۱. هدف شما از دریافت وام چیست؟
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'urgent', label: 'نیاز فوری و ضروری', icon: <Zap className="w-3.5 h-3.5" /> },
                { id: 'goods', label: 'خرید کالا و لوازم', icon: <ShoppingBag className="w-3.5 h-3.5" /> },
                { id: 'housing', label: 'مسکن و نوسازی', icon: <Home className="w-3.5 h-3.5" /> },
                { id: 'business', label: 'کسب‌وکار و اشتغال', icon: <Briefcase className="w-3.5 h-3.5" /> },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPurpose(item.id)}
                  className={`p-2.5 rounded-xl border text-right transition-all flex items-center gap-2 ${
                    purpose === item.id
                      ? 'border-[#0C1E30] bg-[#0C1E30] text-white font-bold'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {item.icon}
                  <span className="text-[11px]">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Question 2: Target Amount */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-700">۲. مبلغ مورد نیاز</label>
              <span className="font-bold text-[#0E7490] font-financial">
                {formatToman(targetAmount)}
              </span>
            </div>
            <input
              type="range"
              min={20_000_000}
              max={300_000_000}
              step={10_000_000}
              value={targetAmount}
              onChange={(e) => setTargetAmount(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0C1E30]"
            />
          </div>

          {/* Question 3: Priority */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              ۳. مهم‌ترین اولویت شما
            </label>
            <div className="space-y-1.5 text-xs">
              {[
                { id: 'no_guarantor', label: 'عدم نیاز به ضامن کسر از حقوق' },
                { id: 'speed', label: 'سریع‌ترین زمان واریز (زیر ۲ ساعت)' },
                { id: 'low_rate', label: 'کمترین نرخ سود و کارمزد' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPriority(item.id as any)}
                  className={`w-full p-2.5 rounded-xl border text-right transition-all flex items-center justify-between ${
                    priority === item.id
                      ? 'border-teal-600 bg-teal-50 text-[#0E7490] font-bold'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xs">{item.label}</span>
                  {priority === item.id && <Check className="w-4 h-4 text-[#0E7490]" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended Result (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Top Best Match Card */}
          {bestMatch && (
            <div className="bg-white rounded-2xl border-2 border-[#0E7490] p-6 shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  بهترین پیشنهاد: {toPersianDigits(bestMatch.matchPercent)}٪ تطابق
                </span>
                <span className="text-xs text-slate-400 font-financial">
                  کارمزد: {toPersianDigits(bestMatch.loan.interestRate)}٪
                </span>
              </div>

              <h3 className="text-lg font-black text-[#0C1E30]">
                {bestMatch.loan.name}
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                {bestMatch.loan.description}
              </p>

              {/* Data strip */}
              <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">مبلغ متناسب:</span>
                  <span className="font-bold text-[#0C1E30] font-financial text-sm">
                    {formatToman(targetAmount)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">قسط ماهانه تخمینی:</span>
                  <span className="font-bold text-[#0E7490] font-financial text-sm">
                    {formatToman(bestMatch.monthlyPayment)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">زمان تایید و واریز:</span>
                  <span className="font-bold text-slate-700 font-financial">
                    {toPersianDigits(bestMatch.loan.turnaroundDays)} روز کاری
                  </span>
                </div>
              </div>

              {/* Why this match was selected */}
              <div className="mt-4 space-y-2 text-xs text-slate-700">
                <p className="font-bold text-slate-900">چرا این طرح برای شما بهینه است؟</p>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{bestMatch.loan.mainCondition}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>سازگار با اولویت انتخابی شما در بازپرداخت</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => onSelectLoan(bestMatch.loan)}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  مشاهده شرایط و مدارک
                </button>
                <button
                  onClick={() => onApplyLoan(bestMatch.loan)}
                  className="px-5 py-2.5 bg-[#0C1E30] hover:bg-[#162F4A] text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-sm transition-colors"
                >
                  <span>ثبت درخواست این طرح</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Secondary alternatives */}
          {secondaryMatches.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-600 px-1">سایر گزینه‌های متناسب:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {secondaryMatches.map((item) => (
                  <div
                    key={item.loan.id}
                    className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-slate-300 text-right flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-center text-[11px] text-slate-400 mb-1">
                        <span>{item.loan.badge}</span>
                        <span className="text-teal-700 font-bold font-financial">{toPersianDigits(item.matchPercent)}٪ تطابق</span>
                      </div>
                      <h4 className="text-xs font-bold text-[#0C1E30]">{item.loan.name}</h4>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-[11px] text-slate-500 font-financial">
                        تا {formatToman(item.loan.maxAmount)}
                      </span>
                      <button
                        onClick={() => onSelectLoan(item.loan)}
                        className="text-xs font-bold text-[#0E7490] hover:underline"
                      >
                        بررسی
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
