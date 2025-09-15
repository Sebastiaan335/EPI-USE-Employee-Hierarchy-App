# 📖 Employee Hierarchy App – User Guide

---

## 1. Introduction

The **EPI-USE Employee Hierarchy App** enables you to manage employee data and visualize reporting structures in a clear, interactive way.  
It supports creating, viewing, updating, and deleting employee records, while maintaining accurate reporting lines between managers and subordinates.

- **Cloud-hosted** and deployed via Vercel
- **Easy access** through a provided URL
- **No login required**

---

## 2. Dashboard (Home Page)

The Dashboard provides a quick overview of organizational data:

- **Total employees**
- **Total managers**
- **Departments** (currently a placeholder metric)
- **Average salary** (displayed in ZAR)

**Quick Actions:**

- Add Employee
- View Employees
- View Org Chart

A **Recent Activities** log records the latest changes, such as new employees being added or updates to existing records.

---

## 3. Employees Page

The Employees Page is the central location for managing employee data.

### 3.1 Viewing Employees

- Displays all employees in a **sortable, filterable, searchable table**
- **Search** by name, surname, employee number, or role
- **Filter** by role using a dropdown
- **Sort** by clicking column headers (Employee #, Name, Role, Salary, Birth Date)

**Table Features:**

- Fixed height with scrolling
- Sticky headers
- Optimized column widths:
    - Employee # = narrow
    - Name = wide (includes email)
    - Role = narrow
- Text wraps inside cells for readability
- Each row displays the employee’s **profile picture (via Gravatar)** and manager

### 3.2 Adding an Employee

1. Click **Add Employee**
2. Fill in the required fields:
     - Employee Number (must be unique 6 digit number)
     - First Name & Surname
     - Email (used for Gravatar avatar)
     - Birth Date
     - Salary
     - Role
     - Manager (optional; leave blank for CEO/top-level employees)
3. Click **Save**

The employee will be saved to the database and appear in both the table and organizational chart.

### 3.3 Editing an Employee

- Click the **Edit (✏)** button in the table
- A modal opens with prefilled details
- Update any fields and click **Save Changes**
- Changes are saved immediately to the database

### 3.4 Deleting an Employee

- Click the **Delete (🗑)** button in the table
- Confirm deletion
- If the employee has subordinates, they must first be reassigned to another manager before deletion can proceed
- Once confirmed, the employee is removed from both the table and the database

---

## 4. Organizational Chart

The Org Chart provides a visual hierarchical tree of employees and their reporting lines.  
The layout is powered by **ELK.js** and uses directed edges (arrows) to show manager → employee relationships.

### 4.1 Viewing and Navigation

- **Pan:** Click and drag to reposition the chart
- **Zoom:** Use the + / – buttons
- **Reset:** Re-centers the chart and clears search results

### 4.2 Node Details

Each employee node displays:

- Profile picture (via Gravatar)
- Name & surname
- Employee number
- Role
- Salary

### 4.3 Searching

- Use the search bar to find employees by name, surname, role, or employee number
- Matching employees are highlighted and centered in the chart

### 4.4 Actions on Nodes

- **Edit:** Update employee details via modal
- **Delete:** Remove the employee (requires reassignment of subordinates if applicable)

---

## 5. Profile Pictures (Avatars)

- Employee avatars are automatically fetched from **Gravatar** using the employee’s email address
- If the email has no linked Gravatar, a default identicon is displayed

---

## 6. Navigation & Access

**Header Navigation:**

- Dashboard
- Employees
- Org Chart

**Footer Links** (currently placeholders):

- About
- Support
- Documentation


---

## 7. Notes & Tips

- **Unique Data:** Employee numbers and emails must be unique
- **Hierarchy Integrity:** Subordinates must be reassigned before deleting a manager
- **Currency:** Salary values are displayed in South African Rand (ZAR)
- **Managers:** If no manager is assigned, the system displays “No Manager”
- **Search & Filter:** Combine filters and search for precise results
- **Avatars:** For profile pictures, ensure the employee’s email is linked to a Gravatar account

---

## Appendix: Technical Summary

- **Frontend:** Next.js, TailwindCSS, shadcn/ui
- **Backend:** Prisma ORM
- **Database:** AWS RDS (PostgreSQL, Cape Town region for low latency)
- **Deployment:** Vercel (global CDN, South African edge for low-latency access)
- **CI/CD:** GitHub Actions integrated with GitHub repository

**Features Implemented:**

- Employee CRUD (Create, Read, Update, Delete)
- Organizational hierarchy visualization (Org Chart)
- Search, filtering, sorting
- Gravatar avatar integration
- Dashboard statistics and reporting

