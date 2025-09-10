import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// Basic body validation helper
function assertCreate(body: any) {
  const required = ["name", "surname", "birthDate", "employeeNumber", "salary", "role"];
  for (const k of required) if (body?.[k] === undefined) throw new Error(`Missing field: ${k}`);
  if (body.managerId && body.managerId === body.id) throw new Error("Employee cannot be their own manager");
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Optional query params: ?q=&page=&pageSize=&sort=field&order=asc|desc
    const q = searchParams.get("q")?.trim();
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") || 20)));
    const sort = searchParams.get("sort") || "createdAt";
    const order = (searchParams.get("order") === "asc" ? "asc" : "desc") as "asc" | "desc";
    const where = q
      ? {
          OR: [
            { name: { contains: q, mode: Prisma.QueryMode.insensitive } },
            { surname: { contains: q, mode: Prisma.QueryMode.insensitive } },
            { role: { contains: q, mode: Prisma.QueryMode.insensitive } },
            { employeeNumber: { contains: q, mode: Prisma.QueryMode.insensitive } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        orderBy: { [sort]: order },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { manager: { select: { id: true, firstName: true, lastName: true, role: true } } },
      }),
      prisma.employee.count({ where }),
    ]);

    return NextResponse.json({ items, total, page, pageSize });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Failed to fetch employees" }, { status: 400 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    assertCreate(body);

    // Update the destructuring to match your actual Employee model fields
    const { firstName, lastName, birthDate, employeeNumber, salary, role, managerId } = body;

    if (managerId && typeof managerId === "string") {
      // Ensure manager exists
      const exists = await prisma.employee.findUnique({ where: { id: managerId } });
      if (!exists) throw new Error("managerId does not reference an existing employee");
    }

    if (managerId && body.id && managerId === body.id) throw new Error("Employee cannot be their own manager");

    const employee = await prisma.employee.create({
      data: {
        firstName,
        lastName,
        birthDate: new Date(birthDate),
        employeeNumber,
        salary: Number(salary),
        role,
        managerId: managerId ?? null,
      },
    });

    return NextResponse.json(employee, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Failed to create employee" }, { status: 400 });
  }
}
