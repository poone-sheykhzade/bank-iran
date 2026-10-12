import React, { useState } from 'react';
import { LoanProduct } from '../types';
import { toPersianDigits, formatToman, calculateInstallment } from '../utils/persian';
import {
  Search,
  ArrowLeft,
  SlidersHorizontal,
  ChevronDown,
  Info,
} from 'lucide-react';

interface LoansViewProps {
  loans: LoanProduct[];
  onSelectLoan: (loan: LoanProduct) => void;
  onApplyLoan: (loan: LoanProduct) => void;
}

export const LoansView: React.FC<LoansViewProps> = ({
  loans,
  onSelectLoan,
  onApplyLoan,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'همه طرح‌ها' },
    { id: 'urgent', label: 'فوری و بدون ضامن' },
    { id: 'housing', label: 'مسکن و نوسازی' },
    { id: 'business', label: 'کسب‌وکار و اصناف' },
    { id: 'personal', label: 'خرید کالا و قرض‌الحسنه' },
  ];

  const filteredLoans = loans.filter((loan) => {
    const matchesCategory = selectedCategory === 'all' || loan.category === selectedCategory;
    const matchesSearch =
      loan.name.includes(searchQuery) ||
      loan.mainCondition.includes(searchQuery) ||
      loan.description.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* 1. Page Header (Rule 1: Clear purpose) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0C1E30]">
            انواع تسهیلات و طرح‌های اعتباری
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            طرح‌های بانکی شفاف با شرایط مشخص، کمترین نرخ سود قانونی و بازپرداخت منعطف
          </p>
        </div>

        {/* Minimal Search Bar */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی عنوان وام یا شرایط..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0E7490] focus:ring-1 focus:ring-[#0E7490]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* 2. Category Filter Bar (Clean unboxed tabs) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 text-xs font-semibold whitespace-nowrap rounded-lg transition-all ${
                isActive
                  ? 'bg-[#0C1E30] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 3. Loans Grid (Strict adherence to Rule 6 Progressive Disclosure) */}
      {filteredLoans.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold">موردی با این مشخصات یافت نشد.</p>
          <p className="text-xs text-slate-400 mt-1">لطفاً دسته‌بندی دیگری را انتخاب کنید یا عبارت جستجو را تغییر دهید.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {filteredLoans.map((loan) => {
            // Estimated payment for max loan & term
            const { monthlyPayment } = calculateInstallment(
              loan.maxAmount,
              loan.interestRate,
              loan.maxTermMonths
            );

            return (
              <div
                key={loan.id}
                className="bg-white rounded-2xl border border-[#E2E8F0] hover:border-[#CBD5E1] hover:shadow-[0_4px_12px_-2px_rgba(15,23,42,0.06)] p-5 sm:p-6 flex flex-col justify-between transition-all"
              >
                {/* Header: Title + Badge */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    {loan.badge ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-[#0E7490] border border-teal-100">
                        {loan.badge}
                      </span>
                    ) : <span />}
                    <span className="text-xs text-slate-400 font-financial">
                      کارمزد: {toPersianDigits(loan.interestRate)}٪
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#0C1E30] leading-snug">
                    {loan.name}
                  </h3>

                  {/* Progressive Disclosure Essential Data Points (Rule 6) */}
                  <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[11px] text-slate-400 block">سقف مبلغ تسهیلات:</span>
                      <span className="font-bold text-[#0C1E30] font-financial text-sm">
                        {formatToman(loan.maxAmount)}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400 block">قسط ماهانه تخمینی:</span>
                      <span className="font-bold text-[#0E7490] font-financial text-sm">
                        {formatToman(monthlyPayment)}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400 block">دوره بازپرداخت:</span>
                      <span className="font-semibold text-slate-700 font-financial">
                        تا {toPersianDigits(loan.maxTermMonths)} ماه
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400 block">شرط اصلی دریافت:</span>
                      <span className="font-semibold text-slate-700 truncate block" title={loan.mainCondition}>
                        {loan.mainCondition}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Primary CTA + Progressive Details Trigger */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => onSelectLoan(loan)}
                    className="text-xs font-semibold text-slate-600 hover:text-[#0C1E30] px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    شرایط و مدارک کامل
                  </button>

                  <button
                    onClick={() => onApplyLoan(loan)}
                    className="px-4 py-2 bg-[#0C1E30] hover:bg-[#162F4A] text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
                  >
                    <span>ثبت درخواست</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
