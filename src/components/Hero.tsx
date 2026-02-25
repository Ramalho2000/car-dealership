import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  MapPin,
  ShieldCheck,
  BadgeEuro,
  ClipboardCheck,
  ArrowRight,
} from 'lucide-react';

interface HeroProps {
  locale: string;
  translations: {
    badge: string;
    titleLine1: string;
    titleHighlight: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    trustGuarantee: string;
    trustFinancing: string;
    trustCertified: string;
  };
}

export default function Hero({ locale, translations: t }: HeroProps) {
  return (
    /* Reduced mobile min-h so CTAs stay above the fold on ≤667 px screens */
    <section className="relative min-h-[520px] md:min-h-[680px] flex items-center overflow-hidden">
      {/* ── Background ── */}
      <div className="absolute inset-0">
        <Image
          src="/hero-bg.png"
          alt="" /* decorative — text content conveys the meaning */
          fill
          className="object-cover object-center"
          priority
          sizes="100vw" /* full-bleed image → hint the full viewport width */
        />
        {/* Overlay: heavier on the left where text sits (85 → 50 %) for reliable WCAG contrast */}
        <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/70 to-black/50" />
        {/* Bottom vignette: taller + slightly stronger for seamless transition into the next section */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-black/70 to-transparent" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-14 md:py-28">
        {/* Tighter max-w for optimal line-length / readability */}
        <div className="max-w-2xl flex flex-col gap-5 md:gap-6">
          {/* Badge — toned down so it doesn't compete with the headline */}
          <div className="inline-flex self-start items-center gap-2 rounded-full border border-white/15 bg-white/8 backdrop-blur-md px-4 py-1.5 text-[13px] leading-none text-white/80 animate-fade-in-down">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>{t.badge}</span>
          </div>

          {/* Headline — drop-shadow guarantees legibility even if overlay bleeds.
              Amber highlight echoes the brand-yellow signage visible in the photo. */}
          <h1 className="text-[2.125rem] leading-[1.1] sm:text-5xl md:text-6xl lg:text-[4.25rem] font-extrabold tracking-tight text-white drop-shadow-lg animate-fade-in-up">
            {t.titleLine1}
            <br />
            <span className="text-amber-300">{t.titleHighlight}</span>
          </h1>

          {/* Subtitle — text-shadow as an extra safety net over busy image areas */}
          <p className="text-[15px] leading-relaxed sm:text-lg md:text-xl text-white/75 max-w-lg [text-shadow:0_1px_3px_rgba(0,0,0,0.4)] animate-fade-in-up stagger-2">
            {t.subtitle}
          </p>

          {/* CTAs — white primary for maximum pop on the dark overlay;
              glass-morph secondary stays subtle but clearly tappable */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-1 animate-fade-in-up stagger-3">
            <Button
              asChild
              size="lg"
              className="group bg-white text-gray-900 font-semibold text-[15px] h-12 px-7 rounded-lg shadow-xl shadow-black/25 hover:bg-gray-50 hover:shadow-2xl hover:shadow-black/30 active:scale-[0.98] focus-visible:ring-white/40 transition-all duration-200"
            >
              <Link href={`/${locale}/cars`}>
                {t.primaryCta}
                {/* Arrow nudges right on hover for a tactile micro-interaction */}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              className="text-[15px] h-12 px-7 rounded-lg border border-white/25 text-white/90 bg-white/7 backdrop-blur-sm hover:bg-white/15 hover:text-white hover:border-white/40 active:scale-[0.98] focus-visible:ring-white/30 transition-all duration-200"
            >
              <Link href={`/${locale}/about`}>
                <MapPin className="mr-2 h-5 w-5" />
                {t.secondaryCta}
              </Link>
            </Button>
          </div>

          {/* Trust indicators — flat icons (no heavy circles) for a cleaner, lighter feel.
              Subtle top border visually separates them from the CTA row. */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-5 border-t border-white/10 animate-fade-in-up stagger-4">
            <TrustItem
              icon={ShieldCheck}
              color="text-emerald-400"
              label={t.trustGuarantee}
            />
            <TrustItem
              icon={BadgeEuro}
              color="text-sky-400"
              label={t.trustFinancing}
            />
            <TrustItem
              icon={ClipboardCheck}
              color="text-amber-400"
              label={t.trustCertified}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Trust indicator atom ── */
function TrustItem({
  icon: Icon,
  color,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  label: string;
}) {
  return (
    /* Slight brightness lift on hover for a polished feel */
    <div className="flex items-center gap-2 text-white/70 transition-colors duration-200 hover:text-white/90">
      <Icon className={`h-4 w-4 shrink-0 ${color}`} />
      <span className="text-[13px] font-medium leading-none">{label}</span>
    </div>
  );
}
