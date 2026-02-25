import { notFound } from 'next/navigation';
import ItemForm from '@/components/ItemForm';
import { getDictionary } from '@/i18n/getDictionary';
import type { Locale } from '@/i18n/config';
import { siteConfig } from '@/config/site';
import { getCarById } from '@/lib/queries/cars';

export const dynamic = 'force-dynamic';

interface EditCarPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: EditCarPageProps) {
  const { locale, id } = await params;
  const dict = await getDictionary(locale as Locale);
  try {
    const car = await getCarById(id);
    if (!car) return { title: dict.metadata.carNotFound };
    return {
      title: `${dict.admin.editMetaTitle} ${car.make} ${car.model} | ${siteConfig.brandName}`,
    };
  } catch {
    return { title: `${dict.admin.editMetaTitle} | ${siteConfig.brandName}` };
  }
}

export default async function EditCarPage({ params }: EditCarPageProps) {
  const { locale, id } = await params;
  const dict = await getDictionary(locale as Locale);
  const t = dict.admin;

  let car;
  try {
    car = await getCarById(id);
  } catch (error) {
    console.error('Failed to fetch car:', error);
  }

  if (!car) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          {car.make} {car.model}
        </h2>
        <p className="text-muted-foreground">{t.editSubtitle}</p>
      </div>
      <ItemForm initialData={car} locale={locale} translations={t} />
    </div>
  );
}
