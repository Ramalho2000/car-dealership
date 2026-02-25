import {
  FUEL_TYPES,
  TRANSMISSION_TYPES,
  COLORS,
  BODY_TYPES,
  DRIVETRAIN_TYPES,
} from '@/constants/car';

export type FuelType = (typeof FUEL_TYPES)[number];

export type TransmissionType = (typeof TRANSMISSION_TYPES)[number];

export type Color = (typeof COLORS)[number];

export type BodyType = (typeof BODY_TYPES)[number];

export type DrivetrainType = (typeof DRIVETRAIN_TYPES)[number];
