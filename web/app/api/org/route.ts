import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
export const dynamic = "force-dynamic";

type OrgNode = { id: number; label: string; role?: string };
type OrgEdge = { id: number; source: number; target: number };

export async function GET() {
  try {
    const employees = await prisma.employees.findMany({
      select: { id: true, name: true, surname: true, role: true, managerid: true },
      orderBy: { id: "asc" },
    });

    // Build adjacency list: manager -> reports
    const adj = new Map<string, string[]>();
    const ids = new Set<string>();
    for (const e of employees) {
      ids.add(String(e.id));
      if (e.managerid != null) {
        if (!adj.has(String(e.managerid))) adj.set(String(e.managerid), []);
        adj.get(String(e.managerid))!.push(String(e.id));
      }
      if (!adj.has(String(e.id))) adj.set(String(e.id), []);
    }

    // Detect cycles (DFS)
    const WHITE = 0, GRAY = 1, BLACK = 2;
    const color = new Map<string, number>();
    const parent = new Map<string, string | null>();
    ids.forEach((i) => { color.set(i, WHITE); parent.set(i, null); });

    const cyclePath: string[] = [];
    let foundCycle = false;

    const dfs = (u: string) => {
      color.set(u, GRAY);
      for (const v of adj.get(u) || []) {
        if (color.get(v) === WHITE) {
          parent.set(v, u);
          dfs(v);
          if (foundCycle) return;
        } else if (color.get(v) === GRAY) {
          // back-edge -> cycle
          foundCycle = true;
          // reconstruct cycle path
          const path: string[] = [v];
          let cur: string | null = u;
          while (cur !== null && cur !== v) {
            path.push(cur);
            cur = parent.get(cur) ?? null;
          }
          path.push(v);
          cyclePath.push(...path.reverse());
          return;
        }
      }
      color.set(u, BLACK);
    };

    for (const i of ids) {
      if (color.get(i) === WHITE) {
        dfs(i);
        if (foundCycle) break;
      }
    }

    if (foundCycle) {
      return NextResponse.json(
        {
          error: "Cycle detected in reporting structure",
          cycle: cyclePath,
        },
        { status: 400 }
      );
    }

    // Build React Flow nodes/edges (positions will be computed client-side)
    interface Employee {
      id: string | number;
      name: string;
      surname: string;
      role?: string | null;
      managerid?: string | number | null;
    }

    const nodes: OrgNode[] = employees.map((e: Employee): OrgNode => ({
      id: Number(e.id),
      label: `${e.name} ${e.surname}`,
      role: e.role ?? undefined,
    }));

    interface EmployeeWithManager {
      id: string | number;
      name: string;
      surname: string;
      role?: string | null;
      managerid?: string | number | null;
    }

    const edges: OrgEdge[] = (employees as EmployeeWithManager[])
      .filter((e: EmployeeWithManager) => e.managerid != null)
      .map((e: EmployeeWithManager): OrgEdge => ({
      id: Number(e.managerid),
      source: Number(e.managerid),
      target: Number(e.id),
      }));

    return NextResponse.json({ nodes, edges });
  } catch (err) {
    return NextResponse.json({ error: "Failed to build org graph" }, { status: 500 });
  }
}
