import React, { useState } from 'react';
import { LoanApplication } from '../types';
import { toPersianDigits, formatToman } from '../utils/persian';
import { CREDIT_ADVISOR } from '../data/mockData';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileUp,
  UserCheck,
  Phone,
  Mail,
  Building2,
  FileCheck2,
  ArrowLeft,
  Check,
} from 'lucide-react';

interface TrackingViewProps {
  applications: LoanApplication[];
  onUploadDocument: (appId: string) => void;
  onNewApplication: () => void;
}

export const TrackingView: React.FC<TrackingViewProps> = ({
  applications,
  onUploadDocument,
  onNewApplication,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [currentApp, setCurrentApp] = useState<LoanApplication>(
    applications[0] || null
  );
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const found = applications.find(
      (a) =>
        a.trackingCode.toLowerCase().includes(searchInput.trim().toLowerCase()) ||
        a.nationalCode.includes(searchInput.trim())
    );
    if (found) {
      setCurrentApp(found);
      setUploadSuccessMessage(null);
    }
  };

  const handleMockUpload = () => {
    onUploadDocument(currentApp.id);
    setUploadSuccessMessage('مدرک با موفقیت بارگذاری شد و در اولویت بررسی کارشناس قرار گرفت.');
    setTimeout(() => {
      setUploadSuccessMessage(null);
    }, 5000);
  };

  const timelineSteps = [
    { id: 'submitted', title: 'ثبت پرونده و تایید هویت', desc: 'اطلاعات در سامانه شاهکار تایید شد' },
    { id: 'credit_check', title: 'استعلام اعتبارسنجی سمات', desc: 'رتبه A تایید گردید - فاقد چک برگشتی' },
    { id: 'expert_review', title: 'بررسی کارشناس اعتباری', desc: 'تطبیق درآمد و پرونده تسهیلاتی' },
    { id: 'digital_sign', title: 'امضای الکترونیکی قرارداد', desc: 'صدور قرارداد رسمی با رمز یکبارمصرف' },
    { id: 'disbursed', title: 'واریز نهایی به حساب', desc: 'انتقال ساتنا به شماره شبای متقاضی' },
  ];

  // Helper to determine step status
  const getStepStatus = (stepId: string) => {
    const order = ['submitted', 'credit_check', 'expert_review', 'digital_sign', 'disbursed'];
    const currentIndex = order.indexOf(currentApp.status);
    const stepIndex = order.indexOf(stepId);

    if (currentApp.status === 'disbursed') return 'completed';
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* 1. Header (Rule 1: Clear purpose) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0C1E30]">
            پیگیری برخط وضعیت پرونده تسهیلات
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            مشاهده گام‌به‌گام مراحل اعتبارسنجی، اقدامات لازم و ارتباط مستقیم با کارشناس پرونده
          </p>
        </div>

        {/* Quick Tracking Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="جستجو با کد رهگیری (مثلاً IRB...)"
              className="pl-8 pr-3.5 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#0E7490] w-56 sm:w-64"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#0C1E30] text-white text-xs font-semibold rounded-xl hover:bg-[#162F4A] transition-colors"
          >
            جستجو
          </button>
        </form>
      </div>

      {!currentApp ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold">پرونده‌ای با این مشخصات یافت نشد.</p>
          <p className="text-xs text-slate-400 mt-1">لطفاً کد رهگیری خود را بررسی و مجدداً تلاش کنید.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 2. Primary Status Card */}
          <div className="bg-white rounded-2xl border border-[#CBD5E1] p-5 sm:p-7 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-semibold text-[#0E7490] font-financial">
                  کد رهگیری ملی: {currentApp.trackingCode}
                </span>
                <h2 className="text-lg font-black text-[#0C1E30] mt-0.5">
                  {currentApp.loanName}
                </h2>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                <span className="text-xs text-slate-400 font-financial">
                  تاریخ ثبت: {currentApp.createdAt}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-teal-50 text-[#0E7490] border border-teal-200">
                  {currentApp.statusText}
                </span>
              </div>
            </div>

            {/* Application Data Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 text-xs border-b border-slate-100 font-financial">
              <div>
                <span className="text-slate-400 block text-[11px]">متقاضی:</span>
                <span className="font-bold text-slate-800 font-sans">{currentApp.applicantName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">مبلغ مصوب:</span>
                <span className="font-bold text-[#0C1E30] text-sm">{formatToman(currentApp.amount)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">مدت بازپرداخت:</span>
                <span className="font-bold text-slate-800">{toPersianDigits(currentApp.termMonths)} ماهه</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">مبلغ هر قسط:</span>
                <span className="font-bold text-[#0E7490] text-sm">{formatToman(currentApp.monthlyInstallment)}</span>
              </div>
            </div>

            {/* Required Action Callout (Rule 8: Required Action) */}
            {currentApp.requiredAction && (
              <div className="mt-5 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>اقدام لازم متقاضی: {currentApp.requiredAction.title}</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-800">
                  {currentApp.requiredAction.description}
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleMockUpload}
                    className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <FileUp className="w-3.5 h-3.5" />
                    <span>{currentApp.requiredAction.actionLabel}</span>
                  </button>
                  {uploadSuccessMessage && (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      {uploadSuccessMessage}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 3. Steps Timeline (Rule 1 & 8) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7">
            <h3 className="text-sm font-bold text-slate-900 mb-6">
              فرآیند گردش پرونده در بانک
            </h3>

            <div className="relative">
              <div className="hidden sm:block absolute top-4 left-6 right-6 h-0.5 bg-slate-200 z-0"></div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2 relative z-10">
                {timelineSteps.map((step, index) => {
                  const status = getStepStatus(step.id);
                  return (
                    <div key={step.id} className="flex sm:flex-col items-start sm:items-center gap-3 sm:gap-2 text-right sm:text-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-all ${
                          status === 'completed'
                            ? 'bg-emerald-600 text-white'
                            : status === 'current'
                            ? 'bg-[#0E7490] text-white ring-4 ring-teal-100 animate-pulse'
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}
                      >
                        {status === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          toPersianDigits(index + 1)
                        )}
                      </div>

                      <div>
                        <p
                          className={`text-xs font-bold ${
                            status === 'current'
                              ? 'text-[#0E7490]'
                              : status === 'completed'
                              ? 'text-slate-800'
                              : 'text-slate-400'
                          }`}
                        >
                          {step.title}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4. Assigned Credit Officer Profile Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-4 text-right w-full sm:w-auto">
              <div className="w-14 h-14 rounded-full bg-[#0C1E30] text-white flex items-center justify-center font-bold text-lg flex-shrink-0 border-2 border-slate-100 shadow-sm">
                ع.ص
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">{CREDIT_ADVISOR.name}</h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                    {CREDIT_ADVISOR.bankId}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{CREDIT_ADVISOR.role}</p>
                <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-slate-400" />
                  <span>{CREDIT_ADVISOR.office}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a
                href={`tel:${CREDIT_ADVISOR.phone}`}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors font-financial"
              >
                <Phone className="w-3.5 h-3.5 text-[#0E7490]" />
                <span>تماس مستقیم: {CREDIT_ADVISOR.phone}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
