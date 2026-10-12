/**
 * Persian number and currency formatting utilities
 */

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function toPersianDigits(n: number | string): string {
  if (n === null || n === undefined) return '';
  return n
    .toString()
    .replace(/\d/g, (d) => PERSIAN_DIGITS[parseInt(d, 10)] || d);
}

export function formatNumber(n: number | string): string {
  if (n === null || n === undefined || isNaN(Number(n))) return '۰';
  const parts = Number(n).toLocaleString('en-US').split('.');
  const formatted = parts[0];
  return toPersianDigits(formatted);
}

export function formatToman(amount: number): string {
  if (amount >= 1_000_000_000) {
    const billion = amount / 1_000_000_000;
    return `${toPersianDigits(Number.isInteger(billion) ? billion : billion.toFixed(1))} میلیارد تومان`;
  }
  if (amount >= 1_000_000) {
    const million = amount / 1_000_000;
    return `${toPersianDigits(Number.isInteger(million) ? million : million.toFixed(0))} میلیون تومان`;
  }
  return `${formatNumber(amount)} تومان`;
}

export function formatTomanExact(amount: number): string {
  return `${formatNumber(amount)} تومان`;
}

/**
 * Standard banking installment calculation (فرمول سود و قسط بانکی)
 * PMT = [P * r * (1 + r)^n] / [(1 + r)^n - 1]
 * where r = annualRate / 12 / 100
 */
export function calculateInstallment(principal: number, annualRatePercent: number, months: number): {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
} {
  if (!principal || months <= 0) {
    return { monthlyPayment: 0, totalPayment: 0, totalInterest: 0 };
  }

  // If Qardh al-Hasan (e.g. 4% commission or 0% interest)
  if (annualRatePercent <= 4) {
    const commission = Math.round(principal * (annualRatePercent / 100));
    const totalPayment = principal + commission;
    const monthlyPayment = Math.round(totalPayment / months);
    return {
      monthlyPayment,
      totalPayment,
      totalInterest: commission,
    };
  }

  const monthlyRate = annualRatePercent / 12 / 100;
  const factor = Math.pow(1 + monthlyRate, months);
  const monthlyPayment = Math.round((principal * monthlyRate * factor) / (factor - 1));
  const totalPayment = monthlyPayment * months;
  const totalInterest = Math.max(0, totalPayment - principal);

  return {
    monthlyPayment,
    totalPayment,
    totalInterest,
  };
}

/**
 * Generate monthly amortization schedule for progressive disclosure
 */
export interface AmortizationRow {
  month: number;
  payment: number;
  principalPart: number;
  interestPart: number;
  remainingBalance: number;
}

export function generateAmortizationSchedule(
  principal: number,
  annualRatePercent: number,
  months: number
): AmortizationRow[] {
  const { monthlyPayment } = calculateInstallment(principal, annualRatePercent, months);
  if (monthlyPayment <= 0 || months <= 0) return [];

  const monthlyRate = annualRatePercent / 12 / 100;
  let remaining = principal;
  const schedule: AmortizationRow[] = [];

  for (let m = 1; m <= months; m++) {
    const interestPart = Math.round(remaining * monthlyRate);
    let principalPart = monthlyPayment - interestPart;
    if (m === months || principalPart > remaining) {
      principalPart = remaining;
    }
    remaining = Math.max(0, remaining - principalPart);

    schedule.push({
      month: m,
      payment: principalPart + interestPart,
      principalPart,
      interestPart,
      remainingBalance: remaining,
    });
  }

  return schedule;
}

/**
 * Convert numeric Toman to readable Persian text
 */
export function numberToPersianWords(num: number): string {
  if (!num || num === 0) return 'صفر تومان';
  if (num < 1000) return `${toPersianDigits(num)} تومان`;

  const millions = Math.floor(num / 1_000_000);
  const billions = Math.floor(num / 1_000_000_000);

  if (billions > 0) {
    const remMillions = Math.floor((num % 1_000_000_000) / 1_000_000);
    if (remMillions > 0) {
      return `${toPersianDigits(billions)} میلیارد و ${toPersianDigits(remMillions)} میلیون تومان`;
    }
    return `${toPersianDigits(billions)} میلیارد تومان`;
  }

  if (millions > 0) {
    const thousands = Math.floor((num % 1_000_000) / 1_000);
    if (thousands > 0) {
      return `${toPersianDigits(millions)} میلیون و ${toPersianDigits(thousands)} هزار تومان`;
    }
    return `${toPersianDigits(millions)} میلیون تومان`;
  }

  return `${formatNumber(num)} تومان`;
}
