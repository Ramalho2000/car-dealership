import { z } from 'zod';
import {
  FUEL_TYPES,
  TRANSMISSION_TYPES,
  BODY_TYPES,
  DRIVETRAIN_TYPES,
} from '@/constants/car';

export const carSchema = z.object({
  make: z.string().min(1, 'Make is required').max(100),
  model: z.string().min(1, 'Model is required').max(100),
  year: z
    .number()
    .int()
    .min(1900, 'Year must be 1900 or later')
    .max(new Date().getFullYear() + 1, 'Year cannot be in the far future'),
  price: z.number().min(0, 'Price must be non-negative'),
  mileage: z.number().int().min(0, 'Mileage must be non-negative'),
  fuelType: z.enum(FUEL_TYPES),
  transmission: z.enum(TRANSMISSION_TYPES),
  color: z.string().min(1, 'Color is required').max(50),
  description: z.string().min(1, 'Description is required').max(5000),
  images: z.array(z.string().url('Each image must be a valid URL')).default([]),
  featured: z.boolean().default(false),
  // New mandatory fields
  doors: z.number().int().min(2).max(5),
  bodyType: z.enum(BODY_TYPES),
  drivetrain: z.enum(DRIVETRAIN_TYPES),
  // New optional fields
  version: z.string().max(100).nullable().optional(),
  engineSize: z.number().int().positive().nullable().optional(),
  horsepower: z.number().int().positive().nullable().optional(),
  gears: z.number().int().min(1).max(10).nullable().optional(),
});

export type CarInput = z.infer<typeof carSchema>;
