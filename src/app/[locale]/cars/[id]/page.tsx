import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AnimateIn from '@/components/AnimateIn';
import {
  ArrowLeft,
  Calendar,
  Fuel,
  Gauge,
  Palette,
  Settings2,
  CarFront,
  Cog,
  DoorOpen,
  Tag,
  Cylinder,
  Zap,
} from 'lucide-react';
import { getDictionary } from '@/i18n/getDictionary';
import { locales, type Locale } from '@/i18n/config';
import ImageGallery from '@/components/ImageGallery';
import { siteConfig } from '@/config/site';
import { getCarById } from '@/lib/queries/cars';
import { prisma } from '@/lib/prisma';

export const revalidate = 3600;

export async function generateStaticParams() {
  const cars = await prisma.car.findMany({ select: { id: true } });
  return cars.flatMap((car) =>
    locales.map((locale) => ({ locale, id: car.id })),
  );
}

interface CarDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({ params }: CarDetailPageProps) {
  const { locale, id } = await params;
  const dict = await getDictionary(locale as Locale);
  try {
    const car = await getCarById(id);
    if (!car) return { title: dict.metadata.carNotFound };
    return {
      title: `${car.make} ${car.model} ${car.year} | ${siteConfig.brandName}`,
      description: car.description,
    };
  } catch {
    return { title: siteConfig.brandName };
  }
}

export default async function CarDetailPage({ params }: CarDetailPageProps) {
  const { locale, id } = await params;
  const dict = await getDictionary(locale as Locale);

  let car;
  try {
    car = await getCarById(id);
  } catch (error) {
    console.error('Failed to fetch car:', error);
  }

  if (!car) {
    notFound();
  }

  const specs: {
    icon: React.ReactNode;
    label: string;
    value: string;
    fullWidth?: boolean;
  }[] = [
    {
      icon: <Calendar className="h-5 w-5 text-primary/70" />,
      label: dict.carDetail.year,
      value: String(car.year),
    },
    {
      icon: <Gauge className="h-5 w-5 text-primary/70" />,
      label: dict.carDetail.mileage,
      value: `${car.mileage.toLocaleString()} ${dict.common.distanceUnit}`,
    },
    {
      icon: <Fuel className="h-5 w-5 text-primary/70" />,
      label: dict.carDetail.fuelType,
      value:
        dict.admin.fuelTypes[
          car.fuelType as keyof typeof dict.admin.fuelTypes
        ] || car.fuelType,
    },
    {
      icon: <Settings2 className="h-5 w-5 text-primary/70" />,
      label: dict.carDetail.transmission,
      value:
        dict.admin.transmissionTypes[
          car.transmission as keyof typeof dict.admin.transmissionTypes
        ] || car.transmission,
    },
    {
      icon: <Palette className="h-5 w-5 text-primary/70" />,
      label: dict.carDetail.color,
      value:
        dict.admin.colors[car.color as keyof typeof dict.admin.colors] ||
        car.color,
    },
    // New mandatory specs
    {
      icon: <DoorOpen className="h-5 w-5 text-primary/70" />,
      label: dict.carDetail.doors,
      value: String(car.doors),
    },
    {
      icon: <CarFront className="h-5 w-5 text-primary/70" />,
      label: dict.carDetail.bodyType,
      value:
        dict.admin.bodyTypes[
          car.bodyType as keyof typeof dict.admin.bodyTypes
        ] || car.bodyType,
    },
    {
      icon: <Cog className="h-5 w-5 text-primary/70" />,
      label: dict.carDetail.drivetrain,
      value:
        dict.admin.drivetrainTypes[
          car.drivetrain as keyof typeof dict.admin.drivetrainTypes
        ] || car.drivetrain,
    },
  ];

  // Optional specs - only show when value is present
  if (car.version) {
    specs.push({
      icon: <Tag className="h-5 w-5 text-primary/70" />,
      label: dict.carDetail.version,
      value: car.version,
    });
  }
  if (car.engineSize) {
    specs.push({
      icon: <Cylinder className="h-5 w-5 text-primary/70" />,
      label: dict.carDetail.engineSize,
      value: `${car.engineSize.toLocaleString()} cc`,
    });
  }
  if (car.horsepower) {
    specs.push({
      icon: <Zap className="h-5 w-5 text-primary/70" />,
      label: dict.carDetail.horsepower,
      value: `${car.horsepower} cv`,
    });
  }
  if (car.gears) {
    specs.push({
      icon: <Settings2 className="h-5 w-5 text-primary/70" />,
      label: dict.carDetail.gears,
      value: String(car.gears),
    });
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <AnimateIn immediate>
        <Button asChild variant="ghost" className="mb-6 -ml-2">
          <Link href={`/${locale}/cars`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {dict.cars.backToInventory}
          </Link>
        </Button>
      </AnimateIn>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image Gallery */}
        <AnimateIn animation="scale-in" immediate>
          <ImageGallery
            images={car.images}
            alt={`${car.make} ${car.model}`}
            badge={car.featured ? dict.cars.featured : undefined}
            placeholderSrc={siteConfig.placeholderImage}
          />
        </AnimateIn>

        {/* Car Details */}
        <div className="space-y-6">
          <AnimateIn immediate delay={100}>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                {car.make} {car.model}
              </h1>
              <p className="text-4xl font-bold text-primary mt-3">
                {dict.common.currency}
                {car.price.toLocaleString()}
              </p>
            </div>
          </AnimateIn>

          <Separator />

          {/* Specs Grid */}
          <AnimateIn delay={200}>
            <div className="grid grid-cols-2 gap-3">
              {specs.map((spec, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border/40 hover:border-primary/20 hover:bg-muted/80 transition-colors duration-200 ${spec.fullWidth ? 'col-span-2' : ''}`}
                >
                  {spec.icon}
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {spec.label}
                    </p>
                    <p className="font-medium">{spec.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimateIn>

          <Separator />

          {/* Description */}
          <AnimateIn delay={300}>
            <div>
              <h2 className="text-xl font-semibold mb-3">
                {dict.carDetail.description}
              </h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {car.description}
              </p>
            </div>
          </AnimateIn>

          {/* CTA */}
          <AnimateIn delay={400}>
            <div className="bg-linear-to-br from-muted/50 to-muted/80 rounded-xl p-6 space-y-3 border border-border/40">
              <h3 className="font-semibold text-lg">
                {dict.carDetail.interestedTitle}
              </h3>
              <p className="text-sm text-muted-foreground">
                {dict.carDetail.interestedSubtitle}
              </p>
              <Button asChild className="shadow-sm">
                <Link href={`/${locale}/about`}>
                  {dict.carDetail.contactUs}
                </Link>
              </Button>
            </div>
          </AnimateIn>
        </div>
      </div>
    </div>
  );
}
