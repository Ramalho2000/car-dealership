import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireStaff } from '@/lib/api-auth';
import { carSchema } from '@/lib/validations/car';
import { revalidateCarPages } from '@/lib/revalidate';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/cars/[id] - Get a single car
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const car = await prisma.car.findUnique({ where: { id } });

    if (!car) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    return NextResponse.json(car);
  } catch (error) {
    console.error('Error fetching car:', error);
    return NextResponse.json({ error: 'Failed to fetch car' }, { status: 500 });
  }
}

// PUT /api/cars/[id] - Update a car (admin required)
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await requireStaff();
    if (session instanceof NextResponse) return session;

    const { id } = await params;
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

    const car = await prisma.car.update({
      where: { id },
      data: parsed.data,
    });

    revalidateCarPages(id);

    return NextResponse.json(car);
  } catch (error) {
    console.error('Error updating car:', error);
    return NextResponse.json(
      { error: 'Failed to update car' },
      { status: 500 },
    );
  }
}

// DELETE /api/cars/[id] - Delete a car (admin required)
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const session = await requireStaff();
    if (session instanceof NextResponse) return session;

    const { id } = await params;
    await prisma.car.delete({ where: { id } });

    revalidateCarPages(id);

    return NextResponse.json({ message: 'Car deleted' });
  } catch (error) {
    console.error('Error deleting car:', error);
    return NextResponse.json(
      { error: 'Failed to delete car' },
      { status: 500 },
    );
  }
}
