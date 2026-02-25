import Hero from '@/components/Hero';
import ItemCard from '@/components/ItemCard';
import AnimateIn from '@/components/AnimateIn';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Fuel, Gauge, Calendar } from 'lucide-react';
import { getDictionary } from '@/i18n/getDictionary';
import type { Locale } from '@/i18n/config';
import { siteConfig } from '@/config/site';
import { getFeaturedCars, getLatestCars } from '@/lib/queries/cars';

export const revalidate = 3600;

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  let featuredCars: Awaited<ReturnType<typeof getFeaturedCars>> = [];
  let latestCars: Awaited<ReturnType<typeof getLatestCars>> = [];

  try {
    featuredCars = await getFeaturedCars();
    latestCars = await getLatestCars();
  } catch (error) {
    console.error('Failed to fetch cars:', error);
  }

  const carsToShow = featuredCars.length > 0 ? featuredCars : latestCars;

  return (
    <div>
      <Hero locale={locale} translations={dict.hero} />

      {/* Featured / Latest Cars Section */}
      <section className="container mx-auto px-4 py-20">
        <AnimateIn className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">
              {featuredCars.length > 0
                ? dict.home.featuredTitle
                : dict.home.latestTitle}
            </h2>
            <p className="text-muted-foreground mt-2 text-lg">
              {dict.home.subtitle}
            </p>
          </div>
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link href={`/${locale}/cars`}>
              {dict.home.viewAll} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </AnimateIn>

        {carsToShow.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {carsToShow.map((car, index) => (
              <AnimateIn key={car.id} delay={index * 100}>
                <ItemCard
                  href={`/${locale}/cars/${car.id}`}
                  image={car.images.length > 0 ? car.images[0] : ''}
                  placeholderImage={siteConfig.placeholderImage}
                  alt={`${car.make} ${car.model}`}
                  title={`${car.make} ${car.model}`}
                  price={`${dict.common.currency}${car.price.toLocaleString()}`}
                  badge={car.featured ? dict.cars.featured : undefined}
                  details={[
                    {
                      icon: <Calendar className="h-4 w-4" />,
                      label: String(car.year),
                    },
                    {
                      icon: <Gauge className="h-4 w-4" />,
                      label: `${car.mileage.toLocaleString()} ${dict.common.distanceUnit}`,
                    },
                    {
                      icon: <Fuel className="h-4 w-4" />,
                      label:
                        dict.admin.fuelTypes[
                          car.fuelType as keyof typeof dict.admin.fuelTypes
                        ] || car.fuelType,
                    },
                  ]}
                  actionLabel={dict.cars.viewDetails}
                />
              </AnimateIn>
            ))}
          </div>
        ) : (
          <AnimateIn className="text-center py-16 text-muted-foreground">
            <p className="text-lg">{dict.home.noVehicles}</p>
            <p className="text-sm mt-1">{dict.home.noVehiclesHint}</p>
          </AnimateIn>
        )}

        {/* Mobile view-all button */}
        <div className="sm:hidden mt-6 text-center">
          <Button asChild variant="outline">
            <Link href={`/${locale}/cars`}>
              {dict.home.viewAll} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-muted/50 py-20">
        <AnimateIn className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            {dict.home.ctaTitle}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            {dict.home.ctaSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Button asChild size="lg" className="shadow-lg shadow-primary/20">
              <Link href={`/${locale}/cars`}>{dict.home.browseAll}</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={`/${locale}/about`}>{dict.home.contactUs}</Link>
            </Button>
          </div>
        </AnimateIn>
      </section>
    </div>
  );
}
