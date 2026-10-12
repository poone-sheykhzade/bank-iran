import React, { useState } from 'react';
import { LoanProduct, LoanApplication } from '../types';
import {
  toPersianDigits,
  formatNumber,
  formatToman,
  calculateInstallment,
  numberToPersianWords,
} from '../utils/persian';
import {
  User,
  CreditCard,
  Briefcase,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

interface NewApplicationViewProps {
  initialLoan?: LoanProduct | null;
  loans: LoanProduct[];
  onSubmitApplication: (application: LoanApplication) => void;
  onCancel: () => void;
}

export const NewApplicationView: React.FC<NewApplicationViewProps> = ({
  initialLoan,
  loans,
  onSubmitApplication,
  onCancel,
}) => {
  const [step, setStep] = useState<number>(1);

  // Step 1: Personal info
  const [fullName, setFullName] = useState('محمدرضا رادمنش');
  const [nationalCode, setNationalCode] = useState('۰۰۲۱۴۸۹۰۱۴');
  const [mobile, setMobile] = useState('۰۹۱۲۳۴۵۶۷۸۹');
  const [postalCode, setPostalCode] = useState('۱۹۳۹۵۱۴۴');

  // Step 2: Loan selection & amount
  const [selectedLoanId, setSelectedLoanId] = useState<string>(
    initialLoan ? initialLoan.id : loans[0].id
  );
  const selectedLoan = loans.find((l) => l.id === selectedLoanId) || loans[0];
  const [amount, setAmount] = useState<number>(
    initialLoan ? initialLoan.maxAmount : 80_000_000
  );
  const [months, setMonths] = useState<number>(
    initialLoan ? initialLoan.maxTermMonths : 24
  );

  // Step 3: Income & Guarantees
  const [jobTitle, setJobTitle] = useState('کارمند رسمی فناوری اطلاعات');
  const [income, setIncome] = useState<number>(42_000_000);
  const [guaranteeType, setGuaranteeType] = useState<'credit_score' | 'cheque' | 'official_guarantor'>('credit_score');

  // Calculation
  const { monthlyPayment, totalPayment, totalInterest } = calculateInstallment(
    amount,
    selectedLoan.interestRate,
    months
  );

  const steps = [
    { num: 1, title: 'اطلاعات هویتی' },
    { num: 2, title: 'طرح و مبلغ' },
    { num: 3, title: 'درآمد و ضمانت' },
    { num: 4, title: 'تایید نهایی' },
  ];

  const handleFinalSubmit = () => {
    // Generate unique Iran Bank tracking code
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const trackingCode = `IRB-1403-${toPersianDigits(randomSuffix)}`;

    const newApp: LoanApplication = {
      id: `app-${Date.now()}`,
      trackingCode,
      loanId: selectedLoan.id,
      loanName: selectedLoan.name,
      amount,
      termMonths: months,
      monthlyInstallment: monthlyPayment,
      status: 'submitted',
      statusText: 'ثبت اولیه پرونده - ارسال جهت استعلام سیستمی سمات',
      progressPercent: 20,
      createdAt: '۱۴۰۳/۰۷/۱۵',
      updatedAt: '۱۴۰۳/۰۷/۱۵',
      applicantName: fullName,
      nationalCode,
      mobile,
      requiredAction: {
        type: 'upload_document',
        title: 'بارگذاری کارت ملی و فیش حقوقی',
        description: 'جهت تطبیق هویتی و ثبت در کارتابل ارزیابی، مدارک خود را پیوست فرمایید.',
        actionLabel: 'بارگذاری مدارک',
      },
      notes: 'پرونده با احراز هویت دیجیتال ثبت شد.',
    };

    onSubmitApplication(newApp);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-16">
      {/* 1. Header with clear context (Rule 1) */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-[#0C1E30]">
          ثبت درخواست تسهیلات
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          مراحل ثبت پرونده به صورت تمام الکترونیک و بدون مراجعه حضوری انجام می‌شود
        </p>
      </div>

      {/* 2. Step Indicator (Rule 1: What step they are currently in) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>
          {steps.map((s) => {
            const isCompleted = step > s.num;
            const isCurrent = step === s.num;
            return (
              <div key={s.num} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-[#0C1E30] text-white ring-4 ring-[#0C1E30]/20'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : toPersianDigits(s.num)}
                </div>
                <span
                  className={`text-[11px] mt-1.5 font-semibold ${
                    isCurrent ? 'text-[#0C1E30]' : 'text-slate-400'
                  }`}
                >
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Form Steps Body */}
      <div className="bg-white rounded-2xl border border-[#CBD5E1] p-6 sm:p-8 space-y-6 shadow-sm">
        {/* Step 1: Identity Info */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              مرحله ۱: تایید مشخصات هویتی متقاضی
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">نام و نام خانوادگی کامل</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-[#0E7490]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">کد ملی ۱۰ رقمی</label>
                <input
                  type="text"
                  value={nationalCode}
                  onChange={(e) => setNationalCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-financial focus:outline-none focus:border-[#0E7490]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">شماره تلفن همراه (به نام متقاضی)</label>
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-financial focus:outline-none focus:border-[#0E7490]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">کد پستی ۱۰ رقمی محل سکونت</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-financial focus:outline-none focus:border-[#0E7490]"
                />
              </div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>هویت متقاضی با سامانه شاهکار و ثبت احوال جمهوری اسلامی ایران تطبیق داده شده است.</span>
            </div>
          </div>
        )}

        {/* Step 2: Plan Selection and Amount */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              مرحله ۲: انتخاب طرح تسهیلات و مبلغ درخواستی
            </h2>

            {/* Loan Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">طرح تسهیلاتی مورد نظر</label>
              <select
                value={selectedLoanId}
                onChange={(e) => setSelectedLoanId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0E7490]"
              >
                {loans.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} — سقف {formatToman(l.maxAmount)} (سود {toPersianDigits(l.interestRate)}٪)
                  </option>
                ))}
              </select>
            </div>

            {/* Amount Slider */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-slate-700">مبلغ درخواستی</label>
                <span className="font-bold text-[#0E7490] font-financial">
                  {formatToman(amount)}
                </span>
              </div>
              <input
                type="range"
                min={selectedLoan.minAmount}
                max={selectedLoan.maxAmount}
                step={5_000_000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0C1E30]"
              />
              <div className="flex justify-between text-[11px] text-slate-400 font-financial">
                <span>حداقل: {formatToman(selectedLoan.minAmount)}</span>
                <span>سقف: {formatToman(selectedLoan.maxAmount)}</span>
              </div>
            </div>

            {/* Repayment Term */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-slate-700">مدت زمان بازپرداخت</label>
                <span className="font-bold text-[#0C1E30] font-financial">
                  {toPersianDigits(months)} ماهه
                </span>
              </div>
              <input
                type="range"
                min={selectedLoan.minTermMonths}
                max={selectedLoan.maxTermMonths}
                step={6}
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0C1E30]"
              />
            </div>

            {/* Instant Calculation Preview Card */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">مبلغ قسط ماهانه:</span>
                <span className="text-base font-black text-[#0E7490] font-financial">
                  {formatToman(monthlyPayment)}
                </span>
              </div>
              <div className="text-left">
                <span className="text-slate-400 block text-[11px]">کل سود تسهیلات:</span>
                <span className="font-bold text-slate-700 font-financial">
                  {formatToman(totalInterest)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Income and Guarantee */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              مرحله ۳: اطلاعات شغلی، درآمد و تضامین
            </h2>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">عنوان و رده شغلی</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:border-[#0E7490]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-slate-700">درآمد خالص ماهانه (تومان)</label>
                <span className="font-bold text-[#0E7490] font-financial">
                  {formatToman(income)}
                </span>
              </div>
              <input
                type="range"
                min={15_000_000}
                max={100_000_000}
                step={2_500_000}
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0C1E30]"
              />
            </div>

            {/* Guarantee Type */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 block">
                روش تامین تضمین تسهیلات
              </label>
              <div className="space-y-2 text-xs">
                <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  guaranteeType === 'credit_score'
                    ? 'border-[#0C1E30] bg-[#F1F5F9]'
                    : 'border-slate-200 hover:border-slate-300'
                }`}>
                  <input
                    type="radio"
                    name="guarantee"
                    checked={guaranteeType === 'credit_score'}
                    onChange={() => setGuaranteeType('credit_score')}
                    className="mt-0.5 accent-[#0C1E30]"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">
                      صرفاً رتبه اعتباری (ویژه رتبه‌های A و B - بدون ضامن)
                    </span>
                    <span className="text-[11px] text-slate-500">
                      استعلام خودکار رتبه سمات و توثیق اعتباری دیجیتال
                    </span>
                  </div>
                </label>

                <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  guaranteeType === 'cheque'
                    ? 'border-[#0C1E30] bg-[#F1F5F9]'
                    : 'border-slate-200 hover:border-slate-300'
                }`}>
                  <input
                    type="radio"
                    name="guarantee"
                    checked={guaranteeType === 'cheque'}
                    onChange={() => setGuaranteeType('cheque')}
                    className="mt-0.5 accent-[#0C1E30]"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">
                      یک فقره چک صیادی بنفش به نام متقاضی
                    </span>
                    <span className="text-[11px] text-slate-500">
                      ثبت در سامانه صیاد بانک مرکزی پس از موافقت اولیه
                    </span>
                  </div>
                </label>

                <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  guaranteeType === 'official_guarantor'
                    ? 'border-[#0C1E30] bg-[#F1F5F9]'
                    : 'border-slate-200 hover:border-slate-300'
                }`}>
                  <input
                    type="radio"
                    name="guarantee"
                    checked={guaranteeType === 'official_guarantor'}
                    onChange={() => setGuaranteeType('official_guarantor')}
                    className="mt-0.5 accent-[#0C1E30]"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">
                      معرفی ضامن معتبر کارمند یا کاسب
                    </span>
                    <span className="text-[11px] text-slate-500">
                      ارائه گواهی کسر از حقوق یا جواز کسب ضامن
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Final Review */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              مرحله ۴: بازبینی نهایی و تایید پرونده
            </h2>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div className="flex justify-between p-3 bg-slate-50">
                <span className="text-slate-500">طرح تسهیلاتی:</span>
                <span className="font-bold text-[#0C1E30]">{selectedLoan.name}</span>
              </div>
              <div className="flex justify-between p-3">
                <span className="text-slate-500">متقاضی:</span>
                <span className="font-bold text-slate-800">{fullName} ({nationalCode})</span>
              </div>
              <div className="flex justify-between p-3">
                <span className="text-slate-500">مبلغ درخواستی:</span>
                <span className="font-bold text-[#0C1E30] font-financial">{formatToman(amount)}</span>
              </div>
              <div className="flex justify-between p-3">
                <span className="text-slate-500">مدت بازپرداخت:</span>
                <span className="font-bold text-slate-800 font-financial">{toPersianDigits(months)} ماه</span>
              </div>
              <div className="flex justify-between p-3">
                <span className="text-slate-500">قسط تخمینی ماهانه:</span>
                <span className="font-bold text-[#0E7490] font-financial">{formatToman(monthlyPayment)}</span>
              </div>
              <div className="flex justify-between p-3">
                <span className="text-slate-500">نوع تضمین انتخابی:</span>
                <span className="font-bold text-slate-800">
                  {guaranteeType === 'credit_score'
                    ? 'رتبه اعتباری سمات'
                    : guaranteeType === 'cheque'
                    ? 'چک صیادی'
                    : 'ضامن معتبر'}
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-800">تعهدنامه متقاضی:</p>
              <p className="text-[11px] leading-relaxed">
                اینجانب صحت کلیه اطلاعات مندرج را تایید نموده و موافقت خود را جهت استعلام سیستمی رتبه اعتباری از بانک مرکزی ج.ا.ا اعلام می‌دارم.
              </p>
            </div>
          </div>
        )}

        {/* Buttons / Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              <span>مرحله قبل</span>
            </button>
          ) : (
            <button
              onClick={onCancel}
              className="px-4 py-2.5 text-slate-500 hover:text-slate-800 text-xs font-semibold transition-colors"
            >
              انصراف
            </button>
          )}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-2.5 bg-[#0C1E30] hover:bg-[#162F4A] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <span>مرحله بعد</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinalSubmit}
              className="px-7 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-colors"
            >
              <FileCheck className="w-4 h-4" />
              <span>ثبت نهایی و دریافت کد رهگیری</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
