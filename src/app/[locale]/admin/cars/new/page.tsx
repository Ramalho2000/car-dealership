import ItemForm from '@/components/ItemForm';
import { getDictionary } from '@/i18n/getDictionary';
import type { Locale } from '@/i18n/config';
import type { Metadata } from 'next';

interface NewCarPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: NewCarPageProps): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return { title: dict.metadata.addCarTitle };
}

export default async function NewCarPage({ params }: NewCarPageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const t = dict.admin;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">{t.addNewTitle}</h2>
        <p className="text-muted-foreground">{t.addNewSubtitle}</p>
      </div>
      <ItemForm locale={locale} translations={t} />
    </div>
  );
}
