import { cache } from 'react';
import { prisma } from '@/lib/prisma';

export const getCarById = cache(async (id: string) => {
  return prisma.car.findUnique({ where: { id } });
});

export const getAllCars = cache(async () => {
  return prisma.car.findMany({ orderBy: { createdAt: 'desc' } });
});

export const getFeaturedCars = cache(async () => {
  return prisma.car.findMany({
    where: { featured: true },
    orderBy: { createdAt: 'desc' },
    take: 6,
  });
});

export const getLatestCars = cache(async () => {
  return prisma.car.findMany({
    orderBy: { createdAt: 'desc' },
    take: 6,
  });
});
