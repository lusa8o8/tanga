# Taanga-Taanga Publishers Limited 📚🇿🇲

A modern, elegant web platform dedicated to publishing, curating, and preserving Zambian literature and languages (including Tonga, Kiikaonde, and more).

## 🌟 Features

* **Beautiful Typography & Design:** A custom, responsive UI built with Tailwind CSS, featuring subtle micro-animations, glassmorphism, and optical typography alignments.
* **Full-stack Next.js App:** Utilizing Next.js 14 App Router for blazing fast server-side rendering and SEO optimization.
* **Admin Dashboard:** A secure, authenticated portal for publishers to manage:
  * 📖 Books (with automatic cover image uploads)
  * ✍️ Authors & Bios
  * 🏷️ Categories & Languages
* **Built-in Cover Cropper Tool:** An integrated PDF-to-Image tool that allows admins to upload full-print PDF book covers, instantly render them in the browser at high resolution, and crop out just the front cover for web usage.
* **Native Firebase Integration:** Uses Firebase Firestore for NoSQL data storage, Firebase Auth for secure admin access, and Firebase Storage for handling all image/cover uploads seamlessly.

## 🛠️ Technology Stack

* **Framework:** [Next.js 14](https://nextjs.org/) (React)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Database & Auth:** [Firebase](https://firebase.google.com/) (Firestore, Storage, Authentication)
* **Deployment & Hosting:** [Vercel](https://vercel.com)
* **PDF Processing:** PDF.js + Cropper.js

## 🚀 Getting Started (Local Development)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/lusa8o8/tanga.git
   cd tanga/artifacts/web
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory and add your Firebase configuration (see `env_template.txt` for the required structure).

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Deployment

This project is configured for seamless deployment on Vercel. 
1. Connect the GitHub repository to your Vercel account.
2. Add all required Environment Variables in the Vercel project settings.
3. Deploy! Vercel will automatically build and host the Next.js application.

---
*Preserving culture through literature.*
