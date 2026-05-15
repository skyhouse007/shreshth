export const STORAGE_TOKEN = 'shresth_token';
export const STORAGE_USER = 'shresth_user';
export const STORAGE_COMPARE = 'shresth_compare';
export const STORAGE_FAVORITES = 'shresth_favorites';
export const STORAGE_DASHBOARD_SEEN = 'shresth_dashboard_seen_at';

export const WHATSAPP_DEFAULT = import.meta.env.VITE_WHATSAPP_NUMBER || '';

export function formatPrice(value, purpose) {
  const n = Number(value) || 0;
  if (purpose === 'rent') {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(
      n
    ) + '/mo';
  }
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

export function statusBadgeClass(status) {
  switch (status) {
    case 'sold':
    case 'rented':
      return 'bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-100';
    case 'pending':
      return 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100';
    default:
      return 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-100';
  }
}

export function statusLabel(status) {
  if (status === 'rented') return 'Rented';
  if (status === 'sold') return 'Sold';
  if (status === 'pending') return 'Pending';
  return 'Active';
}
