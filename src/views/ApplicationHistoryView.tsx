import React from 'react';
import { LoanApplication } from '../types';
import { toPersianDigits, formatToman } from '../utils/persian';
import {
  FileText,
  Search,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Download,
  FilePlus,
} from 'lucide-react';

interface ApplicationHistoryViewProps {
  applications: LoanApplication[];
  onSelectApplication: (app: LoanApplication) => void;
  onNewApplication: () => void;
}

export const ApplicationHistoryView: React.FC<ApplicationHistoryViewProps> = ({
  applications,
  onSelectApplication,
  onNewApplication,
}) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0C1E30]">
            سوابق درخواست‌های تسهیلات
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            آرشیو پرونده‌های جاری، پرداخت‌شده و مدارک صادرشده در سامانه ایران بانک
          </p>
        </div>

        <button
          onClick={onNewApplication}
          className="px-4 py-2.5 bg-[#0C1E30] hover:bg-[#162F4A] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors self-start sm:self-center"
        >
          <FilePlus className="w-3.5 h-3.5" />
          <span>درخواست جدید</span>
        </button>
      </div>

      {/* 2. Applications Ledger Cards */}
      <div className="space-y-3.5">
        {applications.map((app) => {
          const isCompleted = app.status === 'disbursed';

          return (
            <div
              key={app.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 p-5 sm:p-6 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-[#0E7490] font-financial">
                    {app.trackingCode}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-teal-50 text-[#0E7490] border border-teal-200'
                    }`}
                  >
                    {app.statusText}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#0C1E30]">
                  {app.loanName}
                </h3>

                <div className="flex flex-wrap gap-4 text-xs text-slate-500 font-financial">
                  <span>
                    مبلغ: <strong className="text-slate-800">{formatToman(app.amount)}</strong>
                  </span>
                  <span>·</span>
                  <span>
                    اقساط: <strong className="text-slate-800">{toPersianDigits(app.termMonths)} ماهه</strong>
                  </span>
                  <span>·</span>
                  <span>
                    تاریخ ثبت: <span className="text-slate-700">{app.createdAt}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 self-end sm:self-center">
                <button
                  onClick={() => onSelectApplication(app)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Search className="w-3.5 h-3.5 text-slate-500" />
                  <span>پیگیری</span>
                </button>

                <button
                  onClick={() => alert(`رسید الکترونیکی پرونده ${app.trackingCode} با موفقیت آماده دانلود شد.`)}
                  className="p-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                  title="دانلود گواهی و رسید"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
