import React, { useState } from 'react';
import { ActiveNavTab, LoanProduct, LoanApplication } from './types';
import { LOAN_PRODUCTS, INITIAL_APPLICATIONS, currentUser } from './data/mockData';
import { Header } from './components/Header';
import { MobileNav } from './components/MobileNav';
import { IranBankLogo } from './components/IranBankLogo';
import { DashboardView } from './views/DashboardView';
import { LoansView } from './views/LoansView';
import { LoanDetailModal } from './views/LoanDetailModal';
import { CalculatorView } from './views/CalculatorView';
import { EligibilityView } from './views/EligibilityView';
import { SmartAdvisorView } from './views/SmartAdvisorView';
import { NewApplicationView } from './views/NewApplicationView';
import { TrackingView } from './views/TrackingView';
import { ApplicationHistoryView } from './views/ApplicationHistoryView';
import { SupportView } from './views/SupportView';
import { CheckCircle2, Shield, Phone, ExternalLink } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ActiveNavTab>('dashboard');
  const [loans] = useState<LoanProduct[]>(LOAN_PRODUCTS);
  const [applications, setApplications] = useState<LoanApplication[]>(INITIAL_APPLICATIONS);
  
  // Selected loan for modal popup (Rule 6: Progressive Disclosure)
  const [selectedLoanForDetail, setSelectedLoanForDetail] = useState<LoanProduct | null>(null);

  // Pre-fill state when transferring between views
  const [initialLoanForApplication, setInitialLoanForApplication] = useState<LoanProduct | null>(null);
  const [calculatorState, setCalculatorState] = useState<{ amount: number; months: number; rate: number }>({
    amount: 100_000_000,
    months: 24,
    rate: 21,
  });

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Handlers
  const handleNavigate = (tab: ActiveNavTab) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLoanDetail = (loan: LoanProduct) => {
    setSelectedLoanForDetail(loan);
  };

  const handleApplyFromLoan = (loan: LoanProduct) => {
    setSelectedLoanForDetail(null);
    setInitialLoanForApplication(loan);
    setCurrentTab('new_application');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCalculateFromLoan = (loan: LoanProduct) => {
    setSelectedLoanForDetail(null);
    setCalculatorState({
      amount: loan.maxAmount,
      months: loan.maxTermMonths,
      rate: loan.interestRate,
    });
    setCurrentTab('calculator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyFromCalculator = (amount: number, months: number, rate: number) => {
    // Find closest loan
    const matched = loans.find((l) => l.interestRate === rate) || loans[0];
    setInitialLoanForApplication(matched);
    setCurrentTab('new_application');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewApplicationSubmit = (newApp: LoanApplication) => {
    setApplications([newApp, ...applications]);
    showToast(`درخواست شما با کد رهگیری ${newApp.trackingCode} با موفقیت ثبت شد.`);
    setCurrentTab('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUploadDocument = (appId: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            status: 'expert_review',
            progressPercent: 75,
            requiredAction: undefined,
            statusText: 'مدارک دریافت شد - پرونده در صف تایید نهایی کارشناس',
          };
        }
        return app;
      })
    );
    showToast('مدرک با موفقیت بارگذاری و در پرونده اعمال شد.');
  };

  const activeApp = applications.find((a) => a.status !== 'disbursed') || applications[0];
  const recommendedLoan = loans[0]; // e.g. Omid loan

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col antialiased selection:bg-[#0E7490] selection:text-white">
      {/* 1. Global Navigation Header */}
      <Header
        currentTab={currentTab}
        onNavigate={handleNavigate}
        user={currentUser}
        unreadCount={activeApp?.requiredAction ? 1 : 0}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-[#0C1E30] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-[#162F4A] text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* 2. Main Content Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 md:pb-16">
        {currentTab === 'dashboard' && (
          <DashboardView
            onNavigate={handleNavigate}
            activeApplication={activeApp}
            recommendedLoan={recommendedLoan}
            onOpenLoanDetail={handleOpenLoanDetail}
          />
        )}

        {currentTab === 'loans' && (
          <LoansView
            loans={loans}
            onSelectLoan={handleOpenLoanDetail}
            onApplyLoan={handleApplyFromLoan}
          />
        )}

        {currentTab === 'calculator' && (
          <CalculatorView
            initialAmount={calculatorState.amount}
            initialMonths={calculatorState.months}
            initialRate={calculatorState.rate}
            onProceedToApply={handleApplyFromCalculator}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'eligibility' && (
          <EligibilityView
            onApplyForLoan={() => {
              setInitialLoanForApplication(loans[0]);
              setCurrentTab('new_application');
            }}
            onNavigate={handleNavigate}
            loans={loans}
          />
        )}

        {currentTab === 'smart_advisor' && (
          <SmartAdvisorView
            loans={loans}
            onSelectLoan={handleOpenLoanDetail}
            onApplyLoan={handleApplyFromLoan}
          />
        )}

        {currentTab === 'new_application' && (
          <NewApplicationView
            initialLoan={initialLoanForApplication}
            loans={loans}
            onSubmitApplication={handleNewApplicationSubmit}
            onCancel={() => setCurrentTab('dashboard')}
          />
        )}

        {currentTab === 'tracking' && (
          <TrackingView
            applications={applications}
            onUploadDocument={handleUploadDocument}
            onNewApplication={() => {
              setInitialLoanForApplication(null);
              setCurrentTab('new_application');
            }}
          />
        )}

        {currentTab === 'applications_history' && (
          <ApplicationHistoryView
            applications={applications}
            onSelectApplication={(app) => {
              setCurrentTab('tracking');
            }}
            onNewApplication={() => {
              setInitialLoanForApplication(null);
              setCurrentTab('new_application');
            }}
          />
        )}

        {currentTab === 'support' && <SupportView />}
      </main>

      {/* 3. Progressive Disclosure Modal for Loan Details (Rule 6) */}
      {selectedLoanForDetail && (
        <LoanDetailModal
          loan={selectedLoanForDetail}
          onClose={() => setSelectedLoanForDetail(null)}
          onApply={handleApplyFromLoan}
          onCalculate={handleCalculateFromLoan}
        />
      )}

      {/* 4. Mobile Bottom Nav Bar (Rule 11) */}
      <MobileNav currentTab={currentTab} onNavigate={handleNavigate} />

      {/* 5. Minimal Institutional Footer */}
      <footer className="hidden md:block bg-white border-t border-[#E2E8F0] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <IranBankLogo size="sm" />
            <span className="text-[11px] text-slate-400">
              سامانه یکپارچه خدمات اعتباری و تسهیلات خرد
            </span>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <button onClick={() => handleNavigate('support')} className="hover:text-slate-800 transition-colors">
              قوانین و مقررات
            </button>
            <button onClick={() => handleNavigate('support')} className="hover:text-slate-800 transition-colors">
              حریم خصوصی و امنیت
            </button>
            <span className="text-slate-400 font-financial">
              پشتیبانی ۲۴ ساعته: ۰۲۱-۸۴۴۹۰۰۰۰
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
