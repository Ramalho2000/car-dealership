import { revalidatePath } from 'next/cache';
import { locales } from '@/i18n/config';

export function revalidateCarPages(carId?: string) {
  for (const locale of locales) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/cars`);
    revalidatePath(`/${locale}/admin`);
    if (carId) {
      revalidatePath(`/${locale}/cars/${carId}`);
    }
  }
}

export function revalidateUserPages() {
  for (const locale of locales) {
    revalidatePath(`/${locale}/admin/users`);
  }
}
