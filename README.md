# Taanga-Taanga Publishers Ltd — Local Workspace Guide

A Next.js application for a Zambian local-language book press (Kiikaonde and Tonga/Chitonga titles) featuring a public site, bulk inquiry forms, and a custom admin panel.

---

## Local Setup & Development

This workspace is configured to use a portable Node.js runtime and the `pnpm` workspace system.

### Running the Dev Server

Use the copy-pasteable commands below depending on your shell to navigate to the project directory, load Node.js, and start the development server.

#### Option A: In PowerShell
```powershell
# 1. Navigate to the project directory
cd C:\Users\lusam\.gemini\antigravity\scratch\tanga

# 2. Add the portable Node.js directory to your PATH
$env:PATH = "C:\Users\lusam\.gemini\antigravity\scratch\node;" + $env:PATH

# 3. Start the Next.js dev server (pnpm.cmd bypasses script execution policy restrictions)
pnpm.cmd --filter web dev
```


#### Option B: In Command Prompt (CMD)
```cmd
:: 1. Navigate to the project directory
cd C:\Users\lusam\.gemini\antigravity\scratch\tanga

:: 2. Add the portable Node.js directory to your PATH
set PATH=C:\Users\lusam\.gemini\antigravity\scratch\node;%PATH%

:: 3. Start the Next.js dev server
pnpm --filter web dev
```

The site will be live at: **`http://localhost:3000`**

---

## Database Seeding

To populate your live Google Firebase / Firestore project with the default admin user and initial catalog data (authors and books), execute the following command:

**In PowerShell:**
```powershell
$env:PATH = "C:\Users\lusam\.gemini\antigravity\scratch\node;" + $env:PATH
pnpm.cmd seed-db
```

**In CMD:**
```cmd
set PATH=C:\Users\lusam\.gemini\antigravity\scratch\node;%PATH%
pnpm seed-db
```


## Firebase Mock / Offline Mode

To support immediate, out-of-the-box development and testing without requiring real Firebase project credentials, a **graceful Firebase mock layer** is built-in.

### How it works:
- **Auto-detection**: When the environment variables in `.env` contain placeholder values (`REPLACE_ME`) or are missing, the mock layer activates automatically.
- **Local Persistence**: A file-backed JSON database is created at `artifacts/web/mock-db.json` to persist any edits or additions of books and authors.
- **Admin Authentication**:
  - Sign in at `http://localhost:3000/admin/login` using the default credentials:
    - **Email**: `admin@taanga-taanga.com`
    - **Password**: `taanga2024admin`
- **Offline Image Upload**: Image uploads in the admin panel are intercepted and converted into local base64 Data URLs, allowing uploaded cover images to render immediately on the site offline.

### Swapping to Real Credentials:
To run against real Firebase services, simply update the `.env` file in the project root with your live API keys and credentials. The application will automatically detect the presence of real keys and disable the mock layer.

---

## Key Directories

- `artifacts/web/` — Next.js web application (pages, api endpoints, and public assets)
- `artifacts/web/mock-db.json` — Local database file used in mock mode
- `artifacts/web/src/lib/mock-db.ts` — Contains the mock Firestore, Auth, and Storage SDK class definitions
- `artifacts/web/src/lib/firebase-admin.ts` — Firebase Admin SDK setup (swaps between mock and real)
- `artifacts/web/src/lib/firebase.ts` — Client-side Firebase SDK setup (swaps between mock and real)
- `artifacts/web/src/lib/storage.ts` — Intercepts uploads to return local base64 URLs in mock mode
