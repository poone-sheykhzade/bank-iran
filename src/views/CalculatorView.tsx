import React, { useState } from 'react';
import {
  toPersianDigits,
  formatNumber,
  formatToman,
  calculateInstallment,
  numberToPersianWords,
  generateAmortizationSchedule,
} from '../utils/persian';
import { ActiveNavTab } from '../types';
import {
  Calculator as CalcIcon,
  ChevronDown,
  ArrowLeft,
  Info,
  CheckCircle2,
  Table,
} from 'lucide-react';

interface CalculatorViewProps {
  initialAmount?: number;
  initialMonths?: number;
  initialRate?: number;
  onProceedToApply: (amount: number, months: number, rate: number) => void;
  onNavigate: (tab: ActiveNavTab) => void;
}

export const CalculatorView: React.FC<CalculatorViewProps> = ({
  initialAmount = 100_000_000,
  initialMonths = 24,
  initialRate = 21,
  onProceedToApply,
  onNavigate,
}) => {
  const [amount, setAmount] = useState<number>(initialAmount);
  const [months, setMonths] = useState<number>(initialMonths);
  const [rate, setRate] = useState<number>(initialRate);
  const [showAmortization, setShowAmortization] = useState(false);

  const { monthlyPayment, totalPayment, totalInterest } = calculateInstallment(
    amount,
    rate,
    months
  );

  const amortizationSchedule = showAmortization
    ? generateAmortizationSchedule(amount, rate, months)
    : [];

  const handleAmountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, '');
    const num = Number(rawVal);
    setAmount(num);
  };

  const presetRates = [
    { label: 'قرض‌الحسنه (۴٪)', value: 4 },
    { label: 'مرابحه سلامت (۱۵٪)', value: 15 },
    { label: 'مسکن و کالا (۱۸٪)', value: 18 },
    { label: 'فوری بدون ضامن (۲۱٪)', value: 21 },
    { label: 'سفارشی (۲۳٪)', value: 23 },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* 1. Header: Single Primary Purpose */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#0C1E30]">
          محاسبه‌گر اقساط و سود تسهیلات
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          مبلغ، تعداد اقساط و نوع تسهیلات را مشخص کنید تا مبالغ دقیق و شفاف نمایش داده شوند
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left/Main Column: Sliders and Inputs (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-7 space-y-6">
          {/* Amount Input & Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-800">مبلغ تسهیلات (تومان)</label>
              <span className="font-semibold text-[#0E7490] text-xs">
                {numberToPersianWords(amount)}
              </span>
            </div>

            <div className="relative">
              <input
                type="text"
                value={formatNumber(amount)}
                onChange={handleAmountInputChange}
                className="w-full pl-14 pr-4 py-3 bg-slate-50 border border-[#CBD5E1] rounded-xl text-base font-bold font-financial text-[#0C1E30] focus:outline-none focus:border-[#0E7490] focus:ring-1 focus:ring-[#0E7490]"
              />
              <span className="absolute left-4 top-3.5 text-xs font-semibold text-slate-400">
                تومان
              </span>
            </div>

            {/* Slider */}
            <input
              type="range"
              min={10_000_000}
              max={1_000_000_000}
              step={5_000_000}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0C1E30]"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-financial">
              <span>۱۰ میلیون تومان</span>
              <span>۱ میلیارد تومان</span>
            </div>
          </div>

          {/* Repayment Term Slider */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-800">مدت زمان بازپرداخت</label>
              <span className="font-bold text-[#0C1E30] font-financial text-sm">
                {toPersianDigits(months)} ماه ({toPersianDigits((months / 12).toFixed(1))} سال)
              </span>
            </div>

            <input
              type="range"
              min={6}
              max={60}
              step={6}
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0C1E30]"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-financial">
              <span>۶ ماه</span>
              <span>۱۲</span>
              <span>۲۴</span>
              <span>۳۶</span>
              <span>۴۸</span>
              <span>۶۰ ماه</span>
            </div>
          </div>

          {/* Interest Rate Selector */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <label className="font-bold text-slate-800 text-xs block">
              نرخ سالانه کارمزد / سود مصوب
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {presetRates.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setRate(preset.value)}
                  className={`py-2 px-2.5 rounded-lg text-xs font-semibold border transition-all text-center ${
                    rate === preset.value
                      ? 'border-[#0C1E30] bg-[#0C1E30] text-white shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Calculation Result Card (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#CBD5E1] p-5 sm:p-6 shadow-sm space-y-6">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">
              مبلغ قسط ماهانه برآورد شده:
            </span>
            <div className="text-2xl sm:text-3xl font-black text-[#0C1E30] font-financial">
              {formatToman(monthlyPayment)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              طی {toPersianDigits(months)} قسط مساوی در سررسیدهای ماهانه
            </p>
          </div>

          {/* Breakdown summary */}
          <div className="space-y-2.5 py-4 border-y border-slate-100 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">اصل مبلغ تسهیلات:</span>
              <span className="font-bold text-slate-800 font-financial">{formatToman(amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">کل سود و کارمزد دوره:</span>
              <span className="font-bold text-[#0E7490] font-financial">{formatToman(totalInterest)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-100 font-bold">
              <span className="text-slate-800">مجموع بازپرداخت:</span>
              <span className="text-[#0C1E30] font-financial">{formatToman(totalPayment)}</span>
            </div>
          </div>

          {/* Primary CTA */}
          <div className="space-y-2.5">
            <button
              onClick={() => onProceedToApply(amount, months, rate)}
              className="w-full py-3 bg-[#0C1E30] hover:bg-[#162F4A] text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <span>ثبت درخواست با این شرایط</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('eligibility')}
              className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors"
            >
              آیا شرایط دریافت این مبلغ را دارم؟
            </button>
          </div>
        </div>
      </div>

      {/* Progressive Disclosure: Amortization Schedule (Rule 3) */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <button
          onClick={() => setShowAmortization(!showAmortization)}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-right hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-slate-500" />
            <span className="text-xs sm:text-sm font-bold text-slate-800">
              مشاهده جدول تفکیک ماهانه اقساط (Amortization Schedule)
            </span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform ${
              showAmortization ? 'rotate-180' : ''
            }`}
          />
        </button>

        {showAmortization && (
          <div className="p-4 sm:p-6 border-t border-slate-200 overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
                  <th className="py-2.5 px-3">شماره قسط</th>
                  <th className="py-2.5 px-3">مبلغ قسط</th>
                  <th className="py-2.5 px-3">سهم اصل وام</th>
                  <th className="py-2.5 px-3">سهم سود ماهانه</th>
                  <th className="py-2.5 px-3">مانده کل بدهی</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-financial">
                {amortizationSchedule.slice(0, 12).map((row) => (
                  <tr key={row.month} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 text-slate-700 font-bold">قسط {toPersianDigits(row.month)}</td>
                    <td className="py-2.5 px-3 text-slate-900 font-bold">{formatNumber(row.payment)} تومان</td>
                    <td className="py-2.5 px-3 text-emerald-700">{formatNumber(row.principalPart)} تومان</td>
                    <td className="py-2.5 px-3 text-slate-600">{formatNumber(row.interestPart)} تومان</td>
                    <td className="py-2.5 px-3 text-slate-500">{formatNumber(row.remainingBalance)} تومان</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {months > 12 && (
              <p className="text-[11px] text-slate-400 mt-3 text-center">
                نمایش ۱۲ ماه ابتدایی از {toPersianDigits(months)} قسط. جدول کامل هنگام صدور دفترچه اقساط الکترونیک قابل دانلود است.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
