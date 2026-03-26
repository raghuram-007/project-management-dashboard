# ProFlow — Project Management Dashboard

A full-featured project management dashboard built with React, Redux Toolkit, and drag-and-drop support.

---

## 🚀 Features

- **Employee Management** — Add, edit, delete employees with profile photos
- **Project Management** — Full CRUD with logo upload, date range, and employee assignment
- **Task Management** — Tasks linked to projects, assigned to project employees, with reference images
- **Kanban Board** — Drag-and-drop task board with 5 columns: Need to Do, In Progress, Need for Test, Completed, Re-open
- **Filter by Project** — Dropdown filter on the Kanban board
- **Validation** — React Hook Form + Yup validation on all forms
- **Persistent State** — All data saved to localStorage
- **Toast Notifications** — Instant feedback on all CRUD operations

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 (Functional + Hooks) |
| Routing | React Router DOM v6 |
| State | Redux Toolkit |
| Forms | React Hook Form + Yup |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |
| Styling | Custom CSS with CSS Variables |

---

## 📦 Setup & Installation

### Prerequisites
- Node.js v16+
- npm or yarn

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/pm-dashboard.git
cd pm-dashboard

# 2. Install dependencies
npm install

# 3. Start the development server
npm start

# 4. Open in browser
# http://localhost:3000
```

### Build for Production
```bash
npm run build
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── common/          # Reusable: Modal, Avatar, Toast, ImageUpload, Sidebar
│   ├── dashboard/       # Kanban board with drag-and-drop
│   ├── employees/       # Employee CRUD
│   ├── projects/        # Project CRUD + detail view
│   └── tasks/           # Task CRUD
├── store/
│   ├── index.js         # Redux store + localStorage persistence
│   └── slices/          # employeesSlice, projectsSlice, tasksSlice, uiSlice
├── utils/
│   ├── helpers.js       # Date formatting, base64, initials
│   └── validation.js    # Yup schemas
├── App.jsx              # Router + Layout
└── index.css            # Global design system
```

---

## 🎯 How to Use

### 1. Add Employees First
Go to **Employees** → click **+ Add Employee** → fill in name, position, email, and upload a profile photo.

### 2. Create a Project
Go to **Projects** → click **+ New Project** → fill in details and **assign employees**.

> ⚠️ Only employees assigned to a project can be selected for that project's tasks.

### 3. Create Tasks
Go to **Tasks** or the **Dashboard** → click **+ New Task** → select a project, then pick from its assigned employees.

### 4. Use the Kanban Board
Go to **Dashboard** → drag task cards between columns to update their status.
Use the **project dropdown** to filter tasks by project.

---

## ✅ Validation Rules

- All fields are required
- Email must be valid and unique across employees
- Project end date must be after start date
- Only employees assigned to a project appear in task assignment dropdown
- Profile image and project logo are required via file upload

---

## 📐 Design

- Dark theme with purple accent (`#7c6af7`)
- Typography: **Syne** (display) + **DM Sans** (body)
- Fully responsive layout
- CSS variables for consistent theming

---

## 📸 Screenshots

> *(Add screenshots or a screen-recorded GIF here before submission)*

---

## 🌐 Live Demo

> *(Add deployment URL here if hosted — e.g., Vercel, Netlify)*

---

## 📬 Contact

For any queries: career@psts-sg.com | WhatsApp: +91-9994041671
