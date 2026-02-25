import { Separator } from '@/components/ui/separator';
import AnimateIn from '@/components/AnimateIn';
import { MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';
import { getDictionary } from '@/i18n/getDictionary';
import type { Locale } from '@/i18n/config';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    title: dict.metadata.aboutTitle,
    description: dict.metadata.aboutDescription,
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const t = dict.about;
  const { contact } = siteConfig;

  const contactItems = [
    {
      icon: <MapPin className="h-6 w-6 text-primary" />,
      title: t.address,
      content: (
        <a
          href={contact.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          {contact.address}
        </a>
      ),
    },
    {
      icon: <Phone className="h-6 w-6 text-primary" />,
      title: t.phone,
      content: (
        <a
          href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`}
          className="hover:text-foreground transition-colors"
        >
          {contact.phone}
        </a>
      ),
    },
    {
      icon: <Mail className="h-6 w-6 text-primary" />,
      title: t.email,
      content: (
        <a
          href={`mailto:${contact.email}`}
          className="hover:text-foreground transition-colors"
        >
          {contact.email}
        </a>
      ),
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: t.hours,
      content: (
        <div className="space-y-1 text-sm">
          <p>{t.hoursWeekday}</p>
          <p>{t.hoursSaturday}</p>
          <p>{t.hoursSunday}</p>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header */}
      <AnimateIn immediate className="max-w-3xl mb-14">
        <h1 className="text-4xl md:text-5xl font-bold">{t.title}</h1>
        <p className="text-muted-foreground mt-4 text-lg">{t.subtitle}</p>
      </AnimateIn>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div className="space-y-8">
          <AnimateIn>
            <h2 className="text-2xl font-semibold mb-6">{t.contactTitle}</h2>
            <div className="space-y-5">
              {contactItems.map((item, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-4 rounded-xl border border-border/40 hover:border-primary/20 hover:bg-muted/30 transition-colors duration-200"
                >
                  <div className="shrink-0 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <div className="text-muted-foreground">{item.content}</div>
                  </div>
                </div>
              ))}
            </div>
          </AnimateIn>

          <Separator />

          {/* About Section */}
          <AnimateIn>
            <h2 className="text-2xl font-semibold mb-4">{t.storyTitle}</h2>
            <div className="text-muted-foreground space-y-4 leading-relaxed">
              <p>{t.story1}</p>
              <p>{t.story2}</p>
              <p>{t.story3}</p>
            </div>
          </AnimateIn>
        </div>

        {/* Map */}
        <AnimateIn animation="scale-in">
          <div className="space-y-4 lg:sticky lg:top-24">
            <h2 className="text-2xl font-semibold">{t.findUs}</h2>
            <div className="relative w-full aspect-square lg:aspect-4/3 rounded-xl overflow-hidden border shadow-sm">
              <iframe
                src={contact.mapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={t.mapTitle}
                className="absolute inset-0"
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{t.findUsHint}</p>
              <a
                href={contact.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                Google Maps
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </AnimateIn>
      </div>
    </div>
  );
}
