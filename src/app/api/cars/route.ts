import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireStaff } from '@/lib/api-auth';
import { carSchema } from '@/lib/validations/car';
import { revalidateCarPages } from '@/lib/revalidate';

// GET /api/cars - List all cars
export async function GET() {
  try {
    const cars = await prisma.car.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(cars);
  } catch (error) {
    console.error('Error fetching cars:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cars' },
      { status: 500 },
    );
  }
}

// POST /api/cars - Create a new car (admin required)
export async function POST(request: Request) {
  try {
    const session = await requireStaff();
    if (session instanceof NextResponse) return session;

    const body = await request.json();
    const parsed = carSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const car = await prisma.car.create({ data: parsed.data });

    revalidateCarPages();

    return NextResponse.json(car, { status: 201 });
  } catch (error) {
    console.error('Error creating car:', error);
    return NextResponse.json(
      { error: 'Failed to create car' },
      { status: 500 },
    );
  }
}
