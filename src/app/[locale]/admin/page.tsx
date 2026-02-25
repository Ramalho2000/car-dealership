import { auth, isAdmin } from '@/lib/auth';
import { getAllCars } from '@/lib/queries/cars';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Pencil, Shield } from 'lucide-react';
import DeleteItemButton from './DeleteItemButton';
import { getDictionary } from '@/i18n/getDictionary';
import type { Locale } from '@/i18n/config';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const dynamic = 'force-dynamic';

interface AdminPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: AdminPageProps): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return { title: dict.metadata.adminTitle };
}

export default async function AdminPage({ params }: AdminPageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const t = dict.admin;

  // Check if current user is a full admin (to show "Manage Staff" button)
  const session = await auth();
  const showStaffButton = session?.user?.email
    ? await isAdmin(session.user.email)
    : false;

  let cars: Awaited<ReturnType<typeof getAllCars>> = [];
  let dbError = false;

  try {
    cars = await getAllCars();
  } catch (error) {
    console.error('Failed to fetch cars:', error);
    dbError = true;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">{t.manageCars}</h2>
          <p className="text-muted-foreground">
            {cars.length} {t.vehiclesInInventory}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {showStaffButton && (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="text-xs sm:text-sm"
            >
              <Link href={`/${locale}/admin/users`}>
                <Shield className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">
                  {dict.adminUsers.manageStaff}
                </span>
                <span className="sm:hidden">Staff</span>
              </Link>
            </Button>
          )}
          <Button asChild size="sm" className="text-xs sm:text-sm">
            <Link href={`/${locale}/admin/cars/new`}>
              <Plus className="mr-2 h-4 w-4" />
              {t.addCar}
            </Link>
          </Button>
        </div>
      </div>

      {cars.length > 0 ? (
        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">{t.image}</TableHead>
                <TableHead>{t.vehicle}</TableHead>
                <TableHead className="hidden sm:table-cell">{t.year}</TableHead>
                <TableHead className="hidden md:table-cell">
                  {t.price}
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  {t.mileage}
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  {t.status}
                </TableHead>
                <TableHead className="text-right">{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cars.map((car) => (
                <TableRow key={car.id}>
                  <TableCell>
                    <div className="relative h-12 w-16 rounded overflow-hidden">
                      <Image
                        src={
                          car.images.length > 0
                            ? car.images[0]
                            : siteConfig.placeholderImage
                        }
                        alt={`${car.make} ${car.model}`}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>
                        {car.make} {car.model}
                      </span>
                      <span className="text-xs text-muted-foreground sm:hidden">
                        {car.year} • {dict.common.currency}
                        {car.price.toLocaleString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {car.year}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {dict.common.currency}
                    {car.price.toLocaleString()}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {car.mileage.toLocaleString()} {dict.common.distanceUnit}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {car.featured && (
                      <Badge variant="secondary">{t.featured}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/${locale}/admin/cars/${car.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DeleteItemButton
                        itemId={car.id}
                        itemName={`${car.make} ${car.model}`}
                        apiBasePath={siteConfig.apiBasePath}
                        translations={t}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : dbError ? (
        <div className="text-center py-20 border rounded-lg border-destructive/50 text-destructive">
          <p className="text-xl font-semibold">{t.dbUnavailable}</p>
          <p className="text-sm mt-2 text-muted-foreground">
            {t.dbUnavailableHint}
          </p>
        </div>
      ) : (
        <div className="text-center py-20 border rounded-lg text-muted-foreground">
          <p className="text-xl">{t.noVehicles}</p>
          <p className="text-sm mt-2">{t.noVehiclesHint}</p>
          <Button asChild className="mt-4">
            <Link href={`/${locale}/admin/cars/new`}>
              <Plus className="mr-2 h-4 w-4" />
              {t.addFirst}
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
