import React, { useState, useRef, useEffect } from 'react';
import { IranBankLogo } from './IranBankLogo';
import { ActiveNavTab, UserProfile } from '../types';
import {
  ChevronDown,
  Layers,
  Calculator,
  ShieldCheck,
  Sparkles,
  FilePlus,
  Search,
  History,
  HelpCircle,
  PhoneCall,
  User,
  Bell,
  Menu,
  X,
  LayoutDashboard,
  CheckCircle2,
} from 'lucide-react';

interface HeaderProps {
  currentTab: ActiveNavTab;
  onNavigate: (tab: ActiveNavTab) => void;
  user: UserProfile;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  user,
  unreadCount = 1,
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDropdownItemClick = (tab: ActiveNavTab) => {
    onNavigate(tab);
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  const isFacilityActive = ['loans', 'calculator', 'eligibility', 'smart_advisor'].includes(currentTab);
  const isApplicationActive = ['new_application', 'tracking', 'applications_history'].includes(currentTab);
  const isSupportActive = currentTab === 'support';

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-[0_1px_3px_0_rgba(15,23,42,0.03)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Right Side: Logo & Main Categorized Nav */}
            <div className="flex items-center gap-8">
              <button
                onClick={() => onNavigate('dashboard')}
                className="text-right focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0E7490] rounded-lg transition-transform hover:opacity-95"
                title="صفحه اصلی ایران بانک"
              >
                <IranBankLogo size="md" />
              </button>

              {/* Desktop Simplified Categorized Navigation */}
              <nav className="hidden md:flex items-center gap-1.5" ref={dropdownRef}>
                {/* 1. پیشخوان */}
                <button
                  onClick={() => onNavigate('dashboard')}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    currentTab === 'dashboard'
                      ? 'bg-[#F1F5F9] text-[#0C1E30] font-semibold'
                      : 'text-slate-600 hover:text-[#0C1E30] hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-slate-500" />
                  <span>پیشخوان</span>
                </button>

                {/* 2. دسته‌بندی تسهیلات */}
                <div className="relative">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === 'facilities' ? null : 'facilities')}
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      isFacilityActive
                        ? 'bg-[#F1F5F9] text-[#0C1E30] font-semibold'
                        : 'text-slate-600 hover:text-[#0C1E30] hover:bg-slate-50'
                    }`}
                    aria-expanded={activeDropdown === 'facilities'}
                  >
                    <span>تسهیلات</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                        activeDropdown === 'facilities' ? 'rotate-180 text-[#0E7490]' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu for Facilities */}
                  {activeDropdown === 'facilities' && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-[#E2E8F0] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 border-b border-slate-100">
                        خدمات و ابزارهای اعتباری
                      </div>
                      <button
                        onClick={() => handleDropdownItemClick('loans')}
                        className={`w-full text-right px-4 py-2.5 text-xs flex items-center gap-3 transition-colors ${
                          currentTab === 'loans' ? 'bg-[#F0FDFA] text-[#0E7490] font-bold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold">انواع تسهیلات</p>
                          <p className="text-[11px] text-slate-400">کشف و مقایسه طرح‌های بانکی</p>
                        </div>
                      </button>

                      <button
                        onClick={() => handleDropdownItemClick('calculator')}
                        className={`w-full text-right px-4 py-2.5 text-xs flex items-center gap-3 transition-colors ${
                          currentTab === 'calculator' ? 'bg-[#F0FDFA] text-[#0E7490] font-bold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center text-[#0E7490]">
                          <Calculator className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold">محاسبه اقساط</p>
                          <p className="text-[11px] text-slate-400">شبیه‌ساز دقیق بازپرداخت و سود</p>
                        </div>
                      </button>

                      <button
                        onClick={() => handleDropdownItemClick('eligibility')}
                        className={`w-full text-right px-4 py-2.5 text-xs flex items-center gap-3 transition-colors ${
                          currentTab === 'eligibility' ? 'bg-[#F0FDFA] text-[#0E7490] font-bold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold">ارزیابی شرایط</p>
                          <p className="text-[11px] text-slate-400">سنجش رتبه اعتباری و سقف وام</p>
                        </div>
                      </button>

                      <button
                        onClick={() => handleDropdownItemClick('smart_advisor')}
                        className={`w-full text-right px-4 py-2.5 text-xs flex items-center gap-3 transition-colors ${
                          currentTab === 'smart_advisor' ? 'bg-[#F0FDFA] text-[#0E7490] font-bold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold">پیشنهاد هوشمند</p>
                          <p className="text-[11px] text-slate-400">یافتن بهترین وام متناسب با هدف</p>
                        </div>
                      </button>
                    </div>
                  )}
                </div>

                {/* 3. دسته‌بندی درخواست‌های من */}
                <div className="relative">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === 'applications' ? null : 'applications')}
                    className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      isApplicationActive
                        ? 'bg-[#F1F5F9] text-[#0C1E30] font-semibold'
                        : 'text-slate-600 hover:text-[#0C1E30] hover:bg-slate-50'
                    }`}
                    aria-expanded={activeDropdown === 'applications'}
                  >
                    <span>درخواست‌های من</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0E7490]"></span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                        activeDropdown === 'applications' ? 'rotate-180 text-[#0E7490]' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu for Applications */}
                  {activeDropdown === 'applications' && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-[#E2E8F0] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 border-b border-slate-100">
                        مدیریت پرونده‌های بانکی
                      </div>
                      <button
                        onClick={() => handleDropdownItemClick('new_application')}
                        className={`w-full text-right px-4 py-2.5 text-xs flex items-center gap-3 transition-colors ${
                          currentTab === 'new_application' ? 'bg-[#F0FDFA] text-[#0E7490] font-bold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                          <FilePlus className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold">درخواست جدید</p>
                          <p className="text-[11px] text-slate-400">ثبت پرونده تسهیلاتی در ۴ مرحله</p>
                        </div>
                      </button>

                      <button
                        onClick={() => handleDropdownItemClick('tracking')}
                        className={`w-full text-right px-4 py-2.5 text-xs flex items-center gap-3 transition-colors ${
                          currentTab === 'tracking' ? 'bg-[#F0FDFA] text-[#0E7490] font-bold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center text-[#0E7490]">
                          <Search className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold">پیگیری درخواست</p>
                          <p className="text-[11px] text-slate-400">مشاهده گام‌های پرونده فعال</p>
                        </div>
                      </button>

                      <button
                        onClick={() => handleDropdownItemClick('applications_history')}
                        className={`w-full text-right px-4 py-2.5 text-xs flex items-center gap-3 transition-colors ${
                          currentTab === 'applications_history' ? 'bg-[#F0FDFA] text-[#0E7490] font-bold' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                          <History className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold">سوابق درخواست</p>
                          <p className="text-[11px] text-slate-400">آرشیو و رسیدهای پیشین</p>
                        </div>
                      </button>
                    </div>
                  )}
                </div>

                {/* 4. پشتیبانی */}
                <button
                  onClick={() => onNavigate('support')}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isSupportActive
                      ? 'bg-[#F1F5F9] text-[#0C1E30] font-semibold'
                      : 'text-slate-600 hover:text-[#0C1E30] hover:bg-slate-50'
                  }`}
                >
                  <PhoneCall className="w-4 h-4 text-slate-500" />
                  <span>پشتیبانی</span>
                </button>
              </nav>
            </div>

            {/* Left Side: Actions, User Badge & Mobile Button */}
            <div className="flex items-center gap-3">
              {/* Quick Loan CTA */}
              <button
                onClick={() => onNavigate('new_application')}
                className="hidden lg:inline-flex items-center gap-2 px-4 py-2 bg-[#0C1E30] hover:bg-[#162F4A] text-white text-xs font-semibold rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#0E7490] focus:ring-offset-2"
              >
                <FilePlus className="w-3.5 h-3.5" />
                <span>ثبت درخواست جدید</span>
              </button>

              {/* Notification Button */}
              <button
                onClick={() => onNavigate('tracking')}
                className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                title="اعلان پرونده جاری"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white"></span>
                )}
              </button>

              {/* User Account Capsule */}
              <button
                onClick={() => setShowProfileModal(true)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-[#E2E8F0] hover:border-[#CBD5E1] bg-white hover:bg-slate-50 text-right transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-[#0C1E30] text-white flex items-center justify-center text-xs font-bold">
                  {user.name.charAt(0)}
                </div>
                <div className="hidden sm:block text-right">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold text-slate-800">{user.name}</span>
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{user.creditTier}</span>
                </div>
              </button>

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="باز کردن منو"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-[#E2E8F0] px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-1">
              <button
                onClick={() => handleDropdownItemClick('dashboard')}
                className={`w-full text-right px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2.5 ${
                  currentTab === 'dashboard' ? 'bg-[#F1F5F9] text-[#0C1E30] font-bold' : 'text-slate-700'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-slate-500" />
                <span>پیشخوان کاربری</span>
              </button>
            </div>

            {/* تسهیلات */}
            <div className="pt-2 border-t border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 px-3 pb-1">تسهیلات</p>
              <div className="grid grid-cols-2 gap-1">
                <button
                  onClick={() => handleDropdownItemClick('loans')}
                  className={`text-right px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 ${
                    currentTab === 'loans' ? 'bg-[#F0FDFA] text-[#0E7490] font-bold' : 'text-slate-700'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>انواع تسهیلات</span>
                </button>
                <button
                  onClick={() => handleDropdownItemClick('calculator')}
                  className={`text-right px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 ${
                    currentTab === 'calculator' ? 'bg-[#F0FDFA] text-[#0E7490] font-bold' : 'text-slate-700'
                  }`}
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>محاسبه اقساط</span>
                </button>
                <button
                  onClick={() => handleDropdownItemClick('eligibility')}
                  className={`text-right px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 ${
                    currentTab === 'eligibility' ? 'bg-[#F0FDFA] text-[#0E7490] font-bold' : 'text-slate-700'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>ارزیابی شرایط</span>
                </button>
                <button
                  onClick={() => handleDropdownItemClick('smart_advisor')}
                  className={`text-right px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 ${
                    currentTab === 'smart_advisor' ? 'bg-[#F0FDFA] text-[#0E7490] font-bold' : 'text-slate-700'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>پیشنهاد هوشمند</span>
                </button>
              </div>
            </div>

            {/* درخواست‌ها */}
            <div className="pt-2 border-t border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 px-3 pb-1">درخواست‌های من</p>
              <div className="grid grid-cols-1 gap-1">
                <button
                  onClick={() => handleDropdownItemClick('new_application')}
                  className={`text-right px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 ${
                    currentTab === 'new_application' ? 'bg-[#F0FDFA] text-[#0E7490] font-bold' : 'text-slate-700'
                  }`}
                >
                  <FilePlus className="w-3.5 h-3.5" />
                  <span>درخواست جدید</span>
                </button>
                <button
                  onClick={() => handleDropdownItemClick('tracking')}
                  className={`text-right px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 ${
                    currentTab === 'tracking' ? 'bg-[#F0FDFA] text-[#0E7490] font-bold' : 'text-slate-700'
                  }`}
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>پیگیری درخواست جاری</span>
                </button>
                <button
                  onClick={() => handleDropdownItemClick('applications_history')}
                  className={`text-right px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 ${
                    currentTab === 'applications_history' ? 'bg-[#F0FDFA] text-[#0E7490] font-bold' : 'text-slate-700'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>سوابق درخواست‌ها</span>
                </button>
              </div>
            </div>

            {/* پشتیبانی */}
            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => handleDropdownItemClick('support')}
                className={`w-full text-right px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 ${
                  currentTab === 'support' ? 'bg-[#F0FDFA] text-[#0E7490] font-bold' : 'text-slate-700'
                }`}
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>پشتیبانی و سوالات متداول</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* User Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0C1E30]/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-right">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-slate-800">حساب کاربری اعتباری</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                  احراز هویت شده
                </span>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-3.5 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-500">نام و نام خانوادگی:</span>
                <span className="font-bold text-slate-800">{user.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-500">کد ملی:</span>
                <span className="font-bold font-financial text-slate-800">{user.nationalCode}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-500">شماره همراه متصل به شبا:</span>
                <span className="font-bold font-financial text-slate-800">{user.mobile}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-500">شماره حساب ایران بانک:</span>
                <span className="font-bold font-financial text-slate-800">{user.accountNumber}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-500">شماره شبا (IBAN):</span>
                <span className="font-bold font-mono text-[11px] text-slate-700" dir="ltr">{user.sheba}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-50 items-center">
                <span className="text-slate-500">رتبه اعتباری بانک مرکزی:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {user.creditTier}
                </span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  onNavigate('eligibility');
                }}
                className="flex-1 py-2.5 bg-[#0C1E30] text-white text-xs font-semibold rounded-lg hover:bg-[#162F4A] transition-colors"
              >
                بررسی مجدد رتبه اعتباری
              </button>
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2.5 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors"
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
