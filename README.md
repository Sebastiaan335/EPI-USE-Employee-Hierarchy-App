# 📘 Technical Summary — Employee Hierarchy Management App
### by Sebastiaan van den Berg
* https://github.com/Sebastiaan335/EPI-USE-Employee-Hierarchy-App
---

## 1. Architecture of the Solution

The solution is a **cloud-hosted, full-stack web application** for managing employees, visualizing organizational hierarchies, and supporting CRUD functionality.  
**Deployment:** Vercel  
**Database:** AWS RDS PostgreSQL  
**Stack:** Modern TypeScript-first tooling for reliability and scalability.

### High-Level Overview

```mermaid
graph TD
    A[Browser (React UI)]
    B[Next.js 14 (App Router + API routes)]
    C[Prisma ORM]
    D[PostgreSQL (AWS RDS, Cape Town)]
    E[Gravatar (avatars)]

    A --> B
    B --> C
    C --> D
    C --> E
```
---

## 2. Design Patterns Applied

- **Repository / Factory:** Prisma ORM encapsulates raw SQL queries
- **Service Layer:** Business logic separated from API handlers
- **Composite Pattern:** Org chart as nodes (employees), composites (managers)
- **Adapter Pattern:** Gravatar integration (email → avatar URL via MD5)
- **Observer Pattern:** React state hooks (`useState`, `useEffect`)
- **Strategy Pattern:** Table sorting/filtering logic
- **Factory Pattern (UI):** Builders for chart nodes/edges

**MVC Inspiration:**
- **Models:** Prisma schema + PostgreSQL
- **Controllers:** API route handlers
- **Views:** React components/pages

---

## 3. Technologies & Integrations
### **Frontend / UI**
- **Next.js (App Router):** Server-side rendering and interactive client-side UI
- **React + TypeScript:** Modular, type-safe components
- **Tailwind CSS + shadcn/ui:** Responsive, modern styling
- **Lucide Icons:** Visual enhancements
- **ELK.js:** Automated hierarchical org chart layouts
- **TanStack Table:** Advanced table sorting and filtering

### **Backend / API**
- **Next.js API Routes:** Endpoints under `/api/employees` and `/api/org`
- **Prisma ORM:** Type-safe database access
- **RESTful Endpoints:** `GET`, `POST`, `PUT`, `DELETE`
- **Service Layer:** Enforces business rules (cycle prevention, self-manager checks)

### **Database**
- **AWS RDS PostgreSQL:** Hosted in Cape Town (`af-south-1`)
- **Schema:** Self-referencing `managerId` foreign key
- **Constraints:** Unique email & employee number, no cycles, no self-managers
- **Indexes:** Employee number and manager columns

### **Deployment & CI/CD**
- **Vercel:** Hosting with GitHub auto-deployments
- **GitHub Actions:** Linting, type-checking, Prisma client generation, build steps
- **Global CDN:** Low-latency access in South Africa

### **Tooling**
- **Python `generate.py`:** Faker-powered employee data seeding
- **Schema:** Self-referencing `managerId` foreign key
- **Constraints:** Unique email & employee number, no cycles, no self-managers (e.g., average salary).

- **Indexes:** Employee number and manager columns---

## 4. Developer Considerations & Fixes

**Prisma Unique Constraint Errors**
- Resolved by removing `id` from POST requests and resetting frontend forms to prevent duplicate key issues.

**Autoincrement Bug**
- Fixed by resetting the database sequence to ensure 6-digit employee IDs.

**Delete API Mismatch**
- Standardized deletion to use RESTful dynamic route: `/api/employees/[id]`.

**Org Chart Edges**
- Corrected edge rendering by manually constructing polyline points and adding arrowheads for clarity.

**UI Fixes**
- Table headers layout corrected using flexbox.
- Long values now wrap using `word-break: break-word`.
- Implemented sticky table headers with a scrollable table body.

**Deployment Issue**
- Fixed `useSearchParams()` build error on Vercel by wrapping usage in `<Suspense>`.

**Consistency Improvements**
- Unified modal dialogs for editing employees across both Employees and Org Chart views.

## 5. Features Delivered

### **Employees Page**
- **Full CRUD:** Create, read, update, and delete employees via modal dialogs
- **Advanced Table:** Sorting, filtering, and search capabilities
- **Salary Display:** Formatted in ZAR (South African Rand)
- **Gravatar Integration:** Employee avatars via Gravatar
- **Sticky Header:** Table header remains visible while scrolling

### **Org Chart**
- **Hierarchical Visualization:** Interactive org chart powered by ELK.js
- **Navigation:** Zoom, pan, and reset controls
- **Node Search/Filter:** Quickly locate employees in the chart
- **Inline Actions:** Edit or delete employees directly from chart nodes
- **Consistent Modals:** Unified editing experience across views

### **Dashboard (Home Page)**
- **Key Stats:** Total employees, managers, departments, and average salary
- **Quick Actions:** Add employee, view employees, and access org chart

---

## 6. Justification for the Chosen Stack

- **TypeScript Everywhere:** End-to-end type safety
- **Next.js (App Router):** Unified frontend/backend, easy deployment/maintenance
- **Prisma ORM:** Strong schema, migrations, DX improvements
- **PostgreSQL (AWS RDS):** Reliable, scalable, secure, low latency
- **Vercel Deployment:** Industry-standard, global CDN, GitHub integration
- **Tailwind + shadcn/ui:** Rapid, consistent, modern UI
- **ELK.js:** Specialized org chart layouts
- **CI/CD (GitHub Actions):** Automated quality/reliability
- **Error Fixes & Resilience:** Hardened against common pitfalls

---

> This solution reflects modern industry best practices for internal CRUD and visualization tools. It balances scalability, developer productivity, performance, and user experience—making it the best-fit implementation for EPI-USE Africa’s employee hierarchy system.
