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
    const body = await req.json();

    // Destructure body (you can validate with Zod here if you want stricter checks)
    const {
      name,
      surname,
      birthdate,
      employeenumber,
      email,
      salary,
      role,
      managerid,
    } = body;

    // Prevent self-manager case
    if (managerid && body.id && managerid === body.id) {
      return NextResponse.json(
        { error: "An employee cannot be their own manager." },
        { status: 400 }
      );
    }

    const employee = await prisma.employees.create({
      data: {
        name,
        surname,
        birthdate: new Date(birthdate),
        employeenumber,
        email,
        salary,
        role,
        managerid: managerid ?? null,
      },
    });

    return NextResponse.json(employee, { status: 201 });
  } catch (err: any) {
    console.error("Error creating employee:", err);
    return NextResponse.json(
      { error: "Failed to create employee", details: err.message },
      { status: 500 }
    );
  }
}


export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    const body = await req.json();

    // Remove id (and any relation objects you don’t want to update directly)
    const { id: _, manager, other_employees, ...data } = body;

    // Convert salary to number (if string from form)
    if (data.salary) {
      data.salary = Number(data.salary);
    }

    // Convert birthdate if string
    if (data.birthdate) {
      data.birthdate = new Date(data.birthdate);
    }

    const updated = await prisma.employees.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update employee" },
      { status: 500 }
    );
  }
}


export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    await prisma.employees.delete({ where: { id } });
    return NextResponse.json({ message: 'Deleted' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 });
  }
}
