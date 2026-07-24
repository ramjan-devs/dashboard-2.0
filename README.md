# 🚀 Modern Admin Dashboard

A high-performance, responsive, and visually stunning Admin Dashboard built with **Next.js 16**, **React 19**, **Tailwind CSS v4**, **Redux Toolkit**, and **Next Themes**.

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.0-764ABC?style=for-the-badge&logo=redux)

---

## ✨ Features

- 🎨 **Theme Customization**: Seamless Dark & Light Mode toggle with `next-themes` and zero hydration mismatch (`useSyncExternalStore`).
- 📱 **Fully Responsive Layout**: Mobile-first design with interactive drawer navigation and fluid desktop sidebar.
- ⚡ **State Management**: Global dashboard state powered by **Redux Toolkit**.
- ⏱️ **Live Status Counter**: Real-time ticker tracking session activity.
- 📆 **Flexible Date Range Selector**: Dropdown filter for quick analytics range selection.
- 💎 **Modern UI Components**: Styled with modern glassmorphism, smooth animations, and curated Tailwind color tokens.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **[Next.js 16](https://nextjs.org/)** | React framework with App Router |
| **[React 19](https://react.dev/)** | Core UI library |
| **[TypeScript](https://www.typescriptlang.org/)** | Type safety & developer experience |
| **[Tailwind CSS v4](https://tailwindcss.com/)** | Utility-first modern styling framework |
| **[Redux Toolkit](https://redux-toolkit.js.org/)** | Global application state management |
| **[Lucide React](https://lucide.dev/)** | Clean & modern icon set |
| **[Next Themes](https://github.com/pacocoursey/next-themes)** | System-aware dark mode support |
| **[Sonner](https://sonner.emilkowal.si/)** | Smooth toast notifications |

---

## 📁 Project Structure

```text
src/
├── app/                  # Next.js App Router (pages & layouts)
├── components/           # Reusable UI & Layout Components
│   ├── dashboard/        # Dashboard specific components
│   │   ├── navbar.tsx    # Header navbar with search, theme & profile
│   │   └── sidebar.tsx   # Collapsible main navigation sidebar
│   └── ui/               # Primitive base components
├── lib/                  # Utilities & Redux Store setup
│   ├── redux/            # Slices, store configuration & hooks
│   └── utils.ts          # Utility functions (cn helper)
└── providers/            # Context & Redux Providers wrapper
```

---

## 🚦 Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js**: `v18.x` or higher
- **npm** or **yarn** / **pnpm**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/pavann27/pavann27_Admin_Dashboard.git
   cd pavann27_Admin_Dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the development server at `localhost:3000` |
| `npm run build` | Builds the production bundle |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs ESLint checks across project files |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
