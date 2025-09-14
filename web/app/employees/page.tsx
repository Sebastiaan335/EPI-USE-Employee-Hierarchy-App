import Employees, { Employee } from "../../components/ui/Employees";

// This is a SERVER component by default
export default async function EmployeesPage() {
  // Fetch employees from your API/DB
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/employees`, {
    cache: "no-store",
  });
  const employees: Employee[] = await res.json();

  return <Employees employees={employees} />;
}
