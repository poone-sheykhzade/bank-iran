import React from 'react';
import { ActiveNavTab, LoanApplication, LoanProduct } from '../types';
import { toPersianDigits, formatToman } from '../utils/persian';
import {
  ArrowLeft,
  Layers,
  Calculator,
  ShieldCheck,
  Search,
  Clock,
  AlertCircle,
  FileCheck2,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (tab: ActiveNavTab, loanId?: string) => void;
  activeApplication: LoanApplication;
  recommendedLoan: LoanProduct;
  onOpenLoanDetail: (loan: LoanProduct) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  activeApplication,
  recommendedLoan,
  onOpenLoanDetail,
}) => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* 1. Header greeting: Crisp, minimal, welcoming */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0C1E30]">
            پیشخوان خدمات اعتباری
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            وضعیت پرونده‌های فعال و دسترسی سریع به ابزارهای مالی ایران بانک
          </p>
        </div>

        {/* Quiet Credit Status Badge */}
        <div className="flex items-center gap-2 self-start sm:self-center px-3 py-1.5 bg-slate-100 rounded-lg text-xs text-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>رتبه اعتباری شما:</span>
          <strong className="text-[#0C1E30]">ممتاز (A+)</strong>
        </div>
      </div>

      {/* 2. Priority Hero: User's Current Active Loan Application (Rule 8: Prioritize most important current task) */}
      <div className="bg-white rounded-2xl border border-[#CBD5E1] p-5 sm:p-7 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.06)] relative overflow-hidden">
        {/* Subtle accent border on right */}
        <div className="absolute top-0 right-0 bottom-0 w-1.5 bg-[#0E7490]"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-teal-50 text-[#0E7490] border border-teal-200">
                <Clock className="w-3.5 h-3.5" />
                وضعیت درخواست فعال شما
              </span>
              <span className="text-xs text-slate-400 font-financial">
                کد رهگیری: {activeApplication.trackingCode}
              </span>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#0C1E30]">
                {activeApplication.loanName}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                مبلغ: <span className="font-bold text-[#0C1E30]">{formatToman(activeApplication.amount)}</span>
                {' · '}
                مدت بازپرداخت: <span className="font-bold text-[#0C1E30]">{toPersianDigits(activeApplication.termMonths)} ماهه</span>
              </p>
            </div>

            {/* Current Step Progress Line */}
            <div className="pt-1 max-w-lg">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium text-slate-700">{activeApplication.statusText}</span>
                <span className="text-[#0E7490] font-bold font-financial">{toPersianDigits(activeApplication.progressPercent)}٪</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0E7490] rounded-full transition-all duration-500"
                  style={{ width: `${activeApplication.progressPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Required Action Callout if pending */}
            {activeApplication.requiredAction && (
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-bold">{activeApplication.requiredAction.title}: </span>
                  <span>{activeApplication.requiredAction.description}</span>
                </div>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex sm:flex-col gap-2.5 self-stretch sm:self-center sm:min-w-[190px]">
            <button
              onClick={() => onNavigate('tracking')}
              className="flex-1 sm:flex-none py-3 px-5 bg-[#0C1E30] hover:bg-[#162F4A] text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <span>پیگیری جزئیات پرونده</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            {activeApplication.requiredAction && (
              <button
                onClick={() => onNavigate('tracking')}
                className="flex-1 sm:flex-none py-2.5 px-4 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>{activeApplication.requiredAction.actionLabel}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Primary Key Actions (Rule 9: Make Important Actions Easy to Find) */}
      <div>
        <h3 className="text-sm font-bold text-slate-800 mb-3 px-1">
          اقدامات کلیدی
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {/* Action 1: انواع تسهیلات */}
          <button
            onClick={() => onNavigate('loans')}
            className="group p-4 bg-white rounded-xl border border-[#E2E8F0] hover:border-[#0E7490] hover:shadow-sm text-right transition-all flex flex-col justify-between h-32"
          >
            <div className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-cyan-50 flex items-center justify-center text-slate-700 group-hover:text-[#0E7490] transition-colors">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-xs sm:text-sm text-[#0C1E30]">مشاهده تسهیلات</p>
              <p className="text-[11px] text-slate-400 mt-0.5">مقایسه ۶ طرح فعال</p>
            </div>
          </button>

          {/* Action 2: ارزیابی شرایط من */}
          <button
            onClick={() => onNavigate('eligibility')}
            className="group p-4 bg-white rounded-xl border border-[#E2E8F0] hover:border-emerald-600 hover:shadow-sm text-right transition-all flex flex-col justify-between h-32"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center text-emerald-700 transition-colors">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-xs sm:text-sm text-[#0C1E30]">بررسی شرایط من</p>
              <p className="text-[11px] text-slate-400 mt-0.5">استعلام سقف اعتبار</p>
            </div>
          </button>

          {/* Action 3: محاسبه قسط */}
          <button
            onClick={() => onNavigate('calculator')}
            className="group p-4 bg-white rounded-xl border border-[#E2E8F0] hover:border-[#0E7490] hover:shadow-sm text-right transition-all flex flex-col justify-between h-32"
          >
            <div className="w-9 h-9 rounded-lg bg-teal-50 group-hover:bg-teal-100 flex items-center justify-center text-[#0E7490] transition-colors">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-xs sm:text-sm text-[#0C1E30]">محاسبه قسط</p>
              <p className="text-[11px] text-slate-400 mt-0.5">شبیه‌ساز دقیق بازپرداخت</p>
            </div>
          </button>

          {/* Action 4: پیشنهاد هوشمند */}
          <button
            onClick={() => onNavigate('smart_advisor')}
            className="group p-4 bg-white rounded-xl border border-[#E2E8F0] hover:border-amber-500 hover:shadow-sm text-right transition-all flex flex-col justify-between h-32"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-50 group-hover:bg-amber-100 flex items-center justify-center text-amber-600 transition-colors">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-xs sm:text-sm text-[#0C1E30]">پیشنهاد هوشمند</p>
              <p className="text-[11px] text-slate-400 mt-0.5">یافتن وام با ۳ سوال</p>
            </div>
          </button>
        </div>
      </div>

      {/* 4. Single Recommended Loan (Progressive Disclosure - Rule 6 & 8) */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C29B38]"></span>
            <h3 className="text-sm font-bold text-slate-900">
              طرح اعتباری پیشنهادی ویژه پروفایل شما
            </h3>
          </div>
          <button
            onClick={() => onNavigate('loans')}
            className="text-xs font-semibold text-[#0E7490] hover:underline flex items-center gap-1"
          >
            <span>همه تسهیلات</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Clean Loan Card (Rule 6: Loan name, Amount, Installment, Period, Main condition, CTA) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-medium">
                {recommendedLoan.badge}
              </span>
              <h4 className="text-base font-bold text-[#0C1E30]">{recommendedLoan.name}</h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div>
                <span className="text-slate-400 block text-[11px]">سقف مبلغ:</span>
                <span className="font-bold text-slate-800 font-financial">{formatToman(recommendedLoan.maxAmount)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">دوره بازپرداخت:</span>
                <span className="font-bold text-slate-800 font-financial">{toPersianDigits(recommendedLoan.maxTermMonths)} ماهه</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-slate-400 block text-[11px]">شرط اصلی دریافت:</span>
                <span className="text-slate-700 font-medium truncate block" title={recommendedLoan.mainCondition}>
                  {recommendedLoan.mainCondition}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end md:self-center">
            <button
              onClick={() => onOpenLoanDetail(recommendedLoan)}
              className="px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-white text-xs font-semibold rounded-lg transition-colors"
            >
              مشاهده جزئیات
            </button>
            <button
              onClick={() => onNavigate('new_application')}
              className="px-5 py-2.5 bg-[#0C1E30] hover:bg-[#162F4A] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>درخواست سریع</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
