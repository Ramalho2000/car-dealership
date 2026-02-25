'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import ImageUpload from '@/components/ImageUpload';
import type { Car } from '@/generated/prisma/client';
import { Loader2 } from 'lucide-react';
import {
  FUEL_TYPES,
  TRANSMISSION_TYPES,
  COLORS,
  BODY_TYPES,
  DRIVETRAIN_TYPES,
  DOOR_OPTIONS,
} from '@/constants/car';
import type {
  FuelType,
  TransmissionType,
  Color,
  BodyType,
  DrivetrainType,
} from '@/types/car';

interface ItemFormProps {
  initialData?: Car | null;
  locale: string;
  /** API base path for CRUD operations (e.g. "/api/cars") */
  apiBasePath?: string;
  /** Redirect path after save (e.g. "/en/admin") */
  redirectPath?: string;
  translations: {
    carImages: string;
    make: string;
    model: string;
    priceLabel: string;
    mileageLabel: string;
    colorLabel: string;
    fuelTypeLabel: string;
    transmissionLabel: string;
    descriptionLabel: string;
    featuredOnHomepage: string;
    updateCar: string;
    addCarButton: string;
    cancelButton: string;
    uploadImages: string;
    describePlaceholder: string;
    year: string;
    saveFailed: string;
    saveSuccess: string;
    makePlaceholder: string;
    modelPlaceholder: string;
    mainImage: string;
    drag: string;
    moveLeft: string;
    moveRight: string;
    fuelTypes: Record<string, string>;
    transmissionTypes: Record<string, string>;
    colors: Record<string, string>;
    // New mandatory field labels
    doorsLabel: string;
    bodyTypeLabel: string;
    drivetrainLabel: string;
    bodyTypes: Record<string, string>;
    drivetrainTypes: Record<string, string>;
    // New optional field labels
    versionLabel: string;
    versionPlaceholder: string;
    engineSizeLabel: string;
    engineSizePlaceholder: string;
    horsepowerLabel: string;
    horsepowerPlaceholder: string;
    gearsLabel: string;
    gearsPlaceholder: string;
    optional: string;
  };
}

export default function ItemForm({
  initialData,
  locale,
  apiBasePath = '/api/cars',
  redirectPath,
  translations: t,
}: ItemFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<{
    make: string;
    model: string;
    year: number | '';
    price: number | '';
    mileage: number | '';
    fuelType: FuelType;
    transmission: TransmissionType;
    color: Color;
    description: string;
    images: string[];
    featured: boolean;
    // New mandatory fields
    doors: number;
    bodyType: BodyType;
    drivetrain: DrivetrainType;
    // New optional fields
    version: string;
    engineSize: number | '';
    horsepower: number | '';
    gears: number | '';
  }>({
    make: initialData?.make || '',
    model: initialData?.model || '',
    year: initialData?.year ?? new Date().getFullYear(),
    price: initialData?.price ?? '',
    mileage: initialData?.mileage ?? '',
    fuelType: (initialData?.fuelType as FuelType) || FUEL_TYPES[0],
    transmission:
      (initialData?.transmission as TransmissionType) || TRANSMISSION_TYPES[0],
    color: (initialData?.color as Color) || COLORS[0],
    description: initialData?.description || '',
    images: initialData?.images || [],
    featured: initialData?.featured || false,
    // New mandatory fields
    doors: initialData?.doors ?? 5,
    bodyType: (initialData?.bodyType as BodyType) || BODY_TYPES[0],
    drivetrain:
      (initialData?.drivetrain as DrivetrainType) || DRIVETRAIN_TYPES[0],
    // New optional fields
    version: initialData?.version || '',
    engineSize: initialData?.engineSize ?? '',
    horsepower: initialData?.horsepower ?? '',
    gears: initialData?.gears ?? '',
  });

  const isEditing = !!initialData;
  const defaultRedirectPath = redirectPath || `/${locale}/admin`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = isEditing ? `${apiBasePath}/${initialData.id}` : apiBasePath;
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: form.price === '' ? 0 : form.price,
          mileage: form.mileage === '' ? 0 : form.mileage,
          year: form.year === '' ? new Date().getFullYear() : form.year,
          // Send null for empty optional fields
          version: form.version.trim() || null,
          engineSize: form.engineSize === '' ? null : form.engineSize,
          horsepower: form.horsepower === '' ? null : form.horsepower,
          gears: form.gears === '' ? null : form.gears,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to save');
      }

      router.push(defaultRedirectPath);
      router.refresh();
    } catch (err) {
      console.error('Error saving item:', err);
      setError(t.saveFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      {/* Error message */}
      {error && (
        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Images */}
      <div className="space-y-2">
        <Label>{t.carImages}</Label>
        <ImageUpload
          value={form.images}
          onChange={(urls) => setForm({ ...form, images: urls })}
          uploadLabel={t.uploadImages}
          mainLabel={t.mainImage}
          dragLabel={t.drag}
          moveLeftLabel={t.moveLeft}
          moveRightLabel={t.moveRight}
        />
      </div>

      {/* Make & Model */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="make">{t.make}</Label>
          <Input
            id="make"
            placeholder={t.makePlaceholder}
            value={form.make}
            onChange={(e) => setForm({ ...form, make: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="model">{t.model}</Label>
          <Input
            id="model"
            placeholder={t.modelPlaceholder}
            value={form.model}
            onChange={(e) => setForm({ ...form, model: e.target.value })}
            required
          />
        </div>
      </div>

      {/* Year & Price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="year">{t.year}</Label>
          <Input
            id="year"
            type="number"
            min={1900}
            max={2030}
            value={form.year}
            onChange={(e) =>
              setForm({
                ...form,
                year: e.target.value === '' ? '' : parseInt(e.target.value),
              })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">{t.priceLabel}</Label>
          <Input
            id="price"
            type="number"
            min={0}
            step="any"
            value={form.price}
            onChange={(e) =>
              setForm({
                ...form,
                price: e.target.value === '' ? '' : parseFloat(e.target.value),
              })
            }
            required
          />
        </div>
      </div>

      {/* Mileage & Color */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="mileage">{t.mileageLabel}</Label>
          <Input
            id="mileage"
            type="number"
            min={0}
            value={form.mileage}
            onChange={(e) =>
              setForm({
                ...form,
                mileage: e.target.value === '' ? '' : parseInt(e.target.value),
              })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <Label>{t.colorLabel}</Label>
          <Select
            value={form.color}
            onValueChange={(value) =>
              setForm({ ...form, color: value as Color })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder={t.colorLabel} />
            </SelectTrigger>
            <SelectContent>
              {COLORS.map((color) => (
                <SelectItem key={color} value={color}>
                  {t.colors[color] ?? color}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Fuel Type & Transmission */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t.fuelTypeLabel}</Label>
          <Select
            value={form.fuelType}
            onValueChange={(value) =>
              setForm({ ...form, fuelType: value as FuelType })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder={t.fuelTypeLabel} />
            </SelectTrigger>
            <SelectContent>
              {FUEL_TYPES.map((fuel) => (
                <SelectItem key={fuel} value={fuel}>
                  {t.fuelTypes[fuel] ?? fuel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t.transmissionLabel}</Label>
          <Select
            value={form.transmission}
            onValueChange={(value) =>
              setForm({ ...form, transmission: value as TransmissionType })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder={t.transmissionLabel} />
            </SelectTrigger>
            <SelectContent>
              {TRANSMISSION_TYPES.map((trans) => (
                <SelectItem key={trans} value={trans}>
                  {t.transmissionTypes[trans] ?? trans}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Body Type & Drivetrain */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t.bodyTypeLabel}</Label>
          <Select
            value={form.bodyType}
            onValueChange={(value) =>
              setForm({ ...form, bodyType: value as BodyType })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder={t.bodyTypeLabel} />
            </SelectTrigger>
            <SelectContent>
              {BODY_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {t.bodyTypes[type] ?? type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t.drivetrainLabel}</Label>
          <Select
            value={form.drivetrain}
            onValueChange={(value) =>
              setForm({ ...form, drivetrain: value as DrivetrainType })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder={t.drivetrainLabel} />
            </SelectTrigger>
            <SelectContent>
              {DRIVETRAIN_TYPES.map((dt) => (
                <SelectItem key={dt} value={dt}>
                  {t.drivetrainTypes[dt] ?? dt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Doors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t.doorsLabel}</Label>
          <Select
            value={String(form.doors)}
            onValueChange={(value) =>
              setForm({ ...form, doors: parseInt(value) })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder={t.doorsLabel} />
            </SelectTrigger>
            <SelectContent>
              {DOOR_OPTIONS.map((d) => (
                <SelectItem key={d} value={String(d)}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">{t.descriptionLabel}</Label>
        <Textarea
          id="description"
          placeholder={t.describePlaceholder}
          rows={5}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
      </div>

      {/* Version */}
      <div className="space-y-2">
        <Label htmlFor="version">
          {t.versionLabel}{' '}
          <span className="text-muted-foreground font-normal text-xs">
            ({t.optional})
          </span>
        </Label>
        <Input
          id="version"
          placeholder={t.versionPlaceholder}
          value={form.version}
          onChange={(e) => setForm({ ...form, version: e.target.value })}
        />
      </div>

      {/* Engine Size & Horsepower */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="engineSize">
            {t.engineSizeLabel}{' '}
            <span className="text-muted-foreground font-normal text-xs">
              ({t.optional})
            </span>
          </Label>
          <Input
            id="engineSize"
            type="number"
            min={0}
            placeholder={t.engineSizePlaceholder}
            value={form.engineSize}
            onChange={(e) =>
              setForm({
                ...form,
                engineSize:
                  e.target.value === '' ? '' : parseInt(e.target.value),
              })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="horsepower">
            {t.horsepowerLabel}{' '}
            <span className="text-muted-foreground font-normal text-xs">
              ({t.optional})
            </span>
          </Label>
          <Input
            id="horsepower"
            type="number"
            min={0}
            placeholder={t.horsepowerPlaceholder}
            value={form.horsepower}
            onChange={(e) =>
              setForm({
                ...form,
                horsepower:
                  e.target.value === '' ? '' : parseInt(e.target.value),
              })
            }
          />
        </div>
      </div>

      {/* Gears */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gears">
            {t.gearsLabel}{' '}
            <span className="text-muted-foreground font-normal text-xs">
              ({t.optional})
            </span>
          </Label>
          <Input
            id="gears"
            type="number"
            min={1}
            max={10}
            placeholder={t.gearsPlaceholder}
            value={form.gears}
            onChange={(e) =>
              setForm({
                ...form,
                gears: e.target.value === '' ? '' : parseInt(e.target.value),
              })
            }
          />
        </div>
      </div>

      {/* Featured Toggle */}
      <div className="flex items-center gap-3">
        <Switch
          id="featured"
          checked={form.featured}
          onCheckedChange={(checked) => setForm({ ...form, featured: checked })}
        />
        <Label htmlFor="featured">{t.featuredOnHomepage}</Label>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? t.updateCar : t.addCarButton}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(defaultRedirectPath)}
        >
          {t.cancelButton}
        </Button>
      </div>
    </form>
  );
}
