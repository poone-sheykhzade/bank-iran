export interface LoanProduct {
  id: string;
  name: string;
  badge?: string;
  category: 'personal' | 'business' | 'housing' | 'urgent';
  minAmount: number; // in Toman
  maxAmount: number; // in Toman
  interestRate: number; // annual percentage e.g. 18, 23, 4
  minTermMonths: number;
  maxTermMonths: number;
  mainCondition: string; // The single primary condition for card display
  description: string;
  isQardhAlHassan?: boolean; // 4% fee
  
  // Secondary details for progressive disclosure
  eligibilityConditions: string[];
  requiredDocuments: string[];
  fees: { title: string; amount: string }[];
  steps: string[];
  turnaroundDays: number;
}

export type ApplicationStatus = 
  | 'submitted'      // ثبت اولیه
  | 'credit_check'   // اعتبارسنجی و سمات
  | 'expert_review'  // بررسی کارشناس اعتباری
  | 'digital_sign'   // آماده امضای قرارداد
  | 'disbursed'      // واریز شده
  | 'rejected';      // رد شده

export interface LoanApplication {
  id: string;
  trackingCode: string; // e.g. "IRB-1403-88291"
  loanId: string;
  loanName: string;
  amount: number; // in Toman
  termMonths: number;
  monthlyInstallment: number;
  status: ApplicationStatus;
  statusText: string;
  progressPercent: number; // 0 to 100
  createdAt: string;
  updatedAt: string;
  applicantName: string;
  nationalCode: string;
  mobile: string;
  requiredAction?: {
    type: 'upload_document' | 'digital_sign' | 'settle_fee' | 'guarantor_action';
    title: string;
    description: string;
    actionLabel: string;
  };
  notes?: string;
}

export interface CreditEvaluation {
  score: number; // 300 to 900
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
  gradeTitle: string;
  maxRecommendedLoan: number;
  riskLevel: 'بسیار کم' | 'کم' | 'متوسط' | 'بالا';
  factors: {
    title: string;
    status: 'good' | 'average' | 'poor';
    desc: string;
  }[];
}

export interface UserProfile {
  name: string;
  nationalCode: string;
  mobile: string;
  accountNumber: string;
  sheba: string;
  isVerified: boolean;
  creditTier: string;
}

export type ActiveNavTab = 
  | 'dashboard'
  | 'loans'
  | 'loan_detail'
  | 'calculator'
  | 'eligibility'
  | 'smart_advisor'
  | 'new_application'
  | 'tracking'
  | 'applications_history'
  | 'support';
