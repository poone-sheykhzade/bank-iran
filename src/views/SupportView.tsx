import React, { useState } from 'react';
import { FAQS, CREDIT_ADVISOR } from '../data/mockData';
import {
  HelpCircle,
  Phone,
  Mail,
  Building2,
  ChevronDown,
  MessageSquare,
  Search,
  CheckCircle2,
  Clock,
  Send,
} from 'lucide-react';

export const SupportView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSent, setTicketSent] = useState(false);

  const toggleQuestion = (q: string) => {
    setOpenQuestion(openQuestion === q ? null : q);
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketMessage.trim()) return;
    setTicketSent(true);
    setTimeout(() => {
      setTicketSubject('');
      setTicketMessage('');
      setTicketSent(false);
    }, 4000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* 1. Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#0C1E30]">
          مرکز پشتیبانی و پاسخ به پرسش‌ها
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          راهنمای سریع قوانین تسهیلات، استعلام‌های بانکی و ارتباط مستقیم با مشاوران اعتباری
        </p>
      </div>

      {/* 2. Direct Channels Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#0E7490] flex items-center justify-center flex-shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">مرکز تماس ۲۴ ساعته</span>
            <span className="font-bold text-[#0C1E30] text-sm font-financial" dir="ltr">۰۲۱-۸۴۴۹۰۰۰۰</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center flex-shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">پست الکترونیک رسمی</span>
            <span className="font-bold text-slate-800 text-xs font-mono" dir="ltr">support@iranbank.ir</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">پاسخگویی آنلاین کارشناسان</span>
            <span className="font-bold text-slate-800 text-xs">شنبه تا چهارشنبه ۸ الی ۱۷</span>
          </div>
        </div>
      </div>

      {/* 3. Searchable FAQs Accordion */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#0E7490]" />
            <h2 className="text-sm font-bold text-slate-900">پرسش‌های متداول متقاضیان</h2>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در پرسش‌ها..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#0E7490]"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        <div className="space-y-4">
          {FAQS.map((category, idx) => {
            const filteredQuestions = category.questions.filter(
              (q) => q.q.includes(searchQuery) || q.a.includes(searchQuery)
            );

            if (filteredQuestions.length === 0) return null;

            return (
              <div key={idx} className="space-y-2">
                <h3 className="text-xs font-bold text-[#0E7490] px-1">{category.category}</h3>
                <div className="space-y-1.5">
                  {filteredQuestions.map((item, qIdx) => {
                    const isOpen = openQuestion === item.q;
                    return (
                      <div
                        key={qIdx}
                        className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50/50"
                      >
                        <button
                          onClick={() => toggleQuestion(item.q)}
                          className="w-full p-3.5 text-right flex items-center justify-between gap-3 text-xs font-bold text-slate-800 hover:bg-slate-100/60 transition-colors"
                        >
                          <span>{item.q}</span>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-400 transition-transform ${
                              isOpen ? 'rotate-180 text-[#0E7490]' : ''
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="p-3.5 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Ticket Form / Direct Contact */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Ticket Form (7 cols) */}
        <div className="md:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#0E7490]" />
            <h3 className="text-sm font-bold text-slate-900">ارسال پیام یا استعلام ویژه به دپارتمان تسهیلات</h3>
          </div>

          {ticketSent ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 space-y-1 text-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
              <p className="font-bold">پیام شما با شماره تیکت ۸۸۲۳ ثبت شد.</p>
              <p className="text-[11px] text-emerald-700">کارشناسان اعتباری ظرف حداکثر ۲ ساعت کاری با شما تماس خواهند گرفت.</p>
            </div>
          ) : (
            <form onSubmit={handleTicketSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">موضوع پیام</label>
                <input
                  type="text"
                  required
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="مثلاً: سوال در خصوص مدارک ضامن برای وام مسکن"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0E7490]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">متن پیام یا پرسش</label>
                <textarea
                  required
                  rows={4}
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder="لطفاً شرح درخواست یا ابهام خود را مختصراً وارد نمایید..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0E7490] leading-relaxed resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#0C1E30] hover:bg-[#162F4A] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>ثبت و ارسال پیام</span>
              </button>
            </form>
          )}
        </div>

        {/* Advisor direct contact (5 cols) */}
        <div className="md:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-[#0C1E30] text-white flex items-center justify-center font-bold text-xl mx-auto shadow-md border-2 border-slate-100">
              ع.ص
            </div>
            <h4 className="text-sm font-bold text-slate-900 mt-3">{CREDIT_ADVISOR.name}</h4>
            <p className="text-xs text-slate-500 mt-0.5">{CREDIT_ADVISOR.role}</p>
            <span className="inline-block mt-1 text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
              {CREDIT_ADVISOR.bankId}
            </span>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span>تلفن مستقیم:</span>
              <span className="font-bold text-slate-800 font-financial" dir="ltr">{CREDIT_ADVISOR.phone}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span>ایمیل رسمی:</span>
              <span className="font-mono text-[11px] text-slate-700" dir="ltr">{CREDIT_ADVISOR.email}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>دفتر کار:</span>
              <span className="text-slate-800">{CREDIT_ADVISOR.office}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
