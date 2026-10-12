import React, { useState } from 'react';
import { LoanProduct } from '../types';
import { toPersianDigits, formatToman, calculateInstallment, formatNumber } from '../utils/persian';
import {
  X,
  CheckCircle2,
  FileText,
  CreditCard,
  ListOrdered,
  ArrowLeft,
  Info,
  Clock,
  Percent,
} from 'lucide-react';

interface LoanDetailModalProps {
  loan: LoanProduct;
  onClose: () => void;
  onApply: (loan: LoanProduct) => void;
  onCalculate: (loan: LoanProduct) => void;
}

export const LoanDetailModal: React.FC<LoanDetailModalProps> = ({
  loan,
  onClose,
  onApply,
  onCalculate,
}) => {
  const [activeTab, setActiveTab] = useState<'conditions' | 'documents' | 'fees' | 'steps'>('conditions');

  // Quick default calculation preview
  const previewAmount = loan.maxAmount;
  const previewMonths = loan.maxTermMonths;
  const { monthlyPayment, totalPayment, totalInterest } = calculateInstallment(
    previewAmount,
    loan.interestRate,
    previewMonths
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0C1E30]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-50 border-b border-slate-200 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {loan.badge && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-teal-100 text-[#0E7490]">
                  {loan.badge}
                </span>
              )}
              <span className="text-xs text-slate-400 font-financial">
                نرخ سود مصوب: {toPersianDigits(loan.interestRate)}٪ سالانه
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-[#0C1E30]">
              {loan.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 line-clamp-2">
              {loan.description}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            title="بستن"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Financial Summary Strip */}
        <div className="grid grid-cols-3 divide-x divide-x-reverse divide-slate-100 bg-[#F8FAFC] border-b border-slate-200 p-3.5 text-center text-xs">
          <div>
            <span className="text-[11px] text-slate-500 block">سقف مبلغ:</span>
            <span className="font-bold text-[#0C1E30] font-financial text-sm">
              {formatToman(loan.maxAmount)}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block">دوره بازپرداخت:</span>
            <span className="font-bold text-[#0C1E30] font-financial text-sm">
              {toPersianDigits(loan.maxTermMonths)} ماهه
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block">قسط ماهانه تخمینی:</span>
            <span className="font-bold text-[#0E7490] font-financial text-sm">
              {formatToman(monthlyPayment)}
            </span>
          </div>
        </div>

        {/* Tab Navigation for Progressive Disclosure (Rule 3) */}
        <div className="flex border-b border-slate-200 px-6 gap-6 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('conditions')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'conditions'
                ? 'border-[#0C1E30] text-[#0C1E30]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>شرایط و ضوابط</span>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'documents'
                ? 'border-[#0C1E30] text-[#0C1E30]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>مدارک مورد نیاز</span>
          </button>

          <button
            onClick={() => setActiveTab('fees')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'fees'
                ? 'border-[#0C1E30] text-[#0C1E30]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>کارمزد و هزینه‌ها</span>
          </button>

          <button
            onClick={() => setActiveTab('steps')}
            className={`py-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'steps'
                ? 'border-[#0C1E30] text-[#0C1E30]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>مراحل دریافت</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs text-slate-700 leading-relaxed">
          {activeTab === 'conditions' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm mb-2">شرایط احراز و صلاحیت متقاضی</h4>
              <ul className="space-y-2.5">
                {loan.eligibilityConditions.map((cond, index) => (
                  <li key={index} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0E7490] mt-2 flex-shrink-0"></span>
                    <span>{cond}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 text-[11px] flex items-center gap-2">
                <Info className="w-4 h-4 text-[#0E7490] flex-shrink-0" />
                <span>زمان ارزیابی سیستمی و پاسخگویی: حداکثر {toPersianDigits(loan.turnaroundDays)} روز کاری.</span>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm mb-2">مدارک و تاییدیه‌های مورد نیاز</h4>
              <ul className="space-y-2.5">
                {loan.requiredDocuments.map((doc, index) => (
                  <li key={index} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-slate-500 mt-3">
                * تمامی مدارک به صورت تصویر باکیفیت و بدون نیاز به مراجعه حضوری در مرحله درخواست بارگذاری می‌گردند.
              </p>
            </div>
          )}

          {activeTab === 'fees' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm mb-2">تعرفه‌ها و کارمزدهای قانونی</h4>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {loan.fees.map((fee, index) => (
                  <div key={index} className="flex justify-between items-center p-3 text-xs">
                    <span className="text-slate-600">{fee.title}</span>
                    <span className="font-bold text-slate-800 font-financial">{fee.amount}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center p-3 bg-slate-50 text-xs">
                  <span className="text-slate-600">کل سود دوره (با سقف مبلغ):</span>
                  <span className="font-bold text-[#0E7490] font-financial">{formatToman(totalInterest)}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'steps' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 text-sm mb-2">گام‌های دریافت تسهیلات از ابتدا تا واریز</h4>
              <div className="space-y-3">
                {loan.steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#0C1E30] text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                      {toPersianDigits(index + 1)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer CTAs */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => onCalculate(loan)}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-[#0E7490] hover:text-[#0C1E30] hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            تنظیم مبلغ در ماشین‌حساب اقساط
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-white text-xs font-medium rounded-lg transition-colors"
            >
              بستن
            </button>
            <button
              onClick={() => {
                onClose();
                onApply(loan);
              }}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-[#0C1E30] hover:bg-[#162F4A] text-white text-xs font-semibold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>ثبت درخواست برای این طرح</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
