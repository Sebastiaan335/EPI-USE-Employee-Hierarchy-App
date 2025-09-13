import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
export const dynamic = "force-dynamic";

type Params = { params: { id: string } };

export async function GET(_: Request, { params }: Params) {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: Number(params.id) },
      include: { manager: true },
    });
    if (!employee) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(employee);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch employee' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const data = await req.json();
    const updated = await prisma.employee.update({
      where: { id: Number(params.id) },
      data,
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update employee' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    await prisma.employee.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ message: 'Deleted' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 });
  }
}
