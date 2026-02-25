import ItemCard from '@/components/ItemCard';
import AnimateIn from '@/components/AnimateIn';
import { getDictionary } from '@/i18n/getDictionary';
import type { Locale } from '@/i18n/config';
import type { Metadata } from 'next';
import { Fuel, Gauge, Calendar } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { getAllCars } from '@/lib/queries/cars';

export const revalidate = 3600;

interface CarsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: CarsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    title: dict.metadata.carsTitle,
    description: dict.metadata.carsDescription,
  };
}

export default async function CarsPage({ params }: CarsPageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  let cars: Awaited<ReturnType<typeof getAllCars>> = [];

  try {
    cars = await getAllCars();
  } catch (error) {
    console.error('Failed to fetch cars:', error);
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <AnimateIn immediate className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold">{dict.cars.title}</h1>
        <p className="text-muted-foreground mt-3 text-lg">
          {dict.cars.subtitle}
        </p>
      </AnimateIn>

      {cars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car, index) => (
            <AnimateIn key={car.id} delay={index * 80}>
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
        <AnimateIn className="text-center py-20 text-muted-foreground">
          <p className="text-xl">{dict.cars.noVehicles}</p>
          <p className="text-sm mt-2">{dict.cars.noVehiclesHint}</p>
        </AnimateIn>
      )}
    </div>
  );
}
