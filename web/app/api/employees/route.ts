import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      include: { manager: true },
    });
    return NextResponse.json(employees);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const newEmployee = await prisma.employee.create({ data });
    return NextResponse.json(newEmployee, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 });
  }
}
