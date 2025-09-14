import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    try {
    const employee = await prisma.employees.findUnique({
      where: { id: Number(id) },
      include: { manager: true },
    });
    if (!employee) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(employee);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch employee' }, { status: 500 });
  }
  }

  // otherwise: list all employees
  try {
    const employees = await prisma.employees.findMany({
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
    const newEmployee = await prisma.employees.create({ data });
    return NextResponse.json(newEmployee, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    const data = await req.json();
    const updated = await prisma.employees.update({where: { id }, data });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update employee' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    await prisma.employee.delete({ where: { id } });
    return NextResponse.json({ message: 'Deleted' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 });
  }
}
