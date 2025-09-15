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
    const raw = await req.json();

    // Drop id if it exists
    const { id, ...rest } = raw;

    // Normalize types (birthdate, salary, managerid)
    const data = {
      ...rest,
      birthdate: rest.birthdate ? new Date(rest.birthdate) : null,
      salary: rest.salary ? rest.salary.toString() : null,
      managerid: rest.managerid ? Number(rest.managerid) : null,
    };

    const newEmployee = await prisma.employees.create({ data });
    return NextResponse.json(newEmployee, { status: 201 });
  } catch (err: any) {
    if (err.code === "P2002") {
      return NextResponse.json(
        { error: `Unique constraint failed on ${err.meta?.target?.join(", ")}` },
        { status: 409 }
      );
    }
    console.error("Error creating employee:", err);
    return NextResponse.json(
      { error: "Failed to create employee" },
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
