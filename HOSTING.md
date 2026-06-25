# 🚀 ShoRubenix Project Hosting Guide

This guide walks you through deploying your full-stack application (React frontend, FastAPI backend, and MongoDB database) to the cloud for free.

---

## 📁 Hosting Architecture Overview
```mermaid
graph TD
    User([Browser Client]) -->|Requests App| Vercel[Vercel (React Frontend)]
    User -->|Interacts| API[Render (FastAPI Backend)]
    API <--> Atlas[(MongoDB Atlas Cloud DB)]
```

---

## 1. 🍃 Setup MongoDB Atlas (Cloud Database)
Since the local MongoDB (`localhost:27017`) is not accessible from the internet, you must host your data in the cloud.

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
2. Create a new project and select the **M0 Shared Cluster** (Free Tier).
3. Under **Database Access**, create a user (e.g. `admin`) and set a strong password.
4. Under **Network Access**, add an IP entry for `0.0.0.0/0` (Allows connection from Render's dynamic backend servers).
5. Go to **Database -> Cluster -> Connect -> Connect your application** to get your connection string. It will look like this:
   ```text
   mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<username>` and `<password>` in the connection string with your database user credentials.

---

## 2. 🐍 Deploy FastAPI Backend (Render)
Render is an excellent platform for hosting Python servers for free.

1. Sign up for a free account on [Render](https://render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub account and select your repository **`shorubenixinfo`**.
4. Configure the Web Service settings:
   * **Name**: `shorubenix-api`
   * **Region**: Choose the closest region (e.g., Singapore or US East).
   * **Branch**: `main`
   * **Root Directory**: `backend` (⚠️ *Very Important: This sets the context to your backend folder*)
   * **Runtime**: `Python`
   * **Build Command**: `pip install -r requirements.txt`
   * **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Expand the **Advanced** section and add the following **Environment Variables**:
   | Key | Value | Notes |
   | :--- | :--- | :--- |
   | `MONGODB_URI` | `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority` | Your MongoDB Atlas Connection String |
   | `MONGODB_DB` | `shorubenix` | Database Name |
   | `SMTP_HOST` | `smtp.gmail.com` | SMTP Host |
   | `SMTP_PORT` | `587` | SMTP Port |
   | `SMTP_EMAIL` | `shorubenixinfotechnology@gmail.com` | Your system's Gmail |
   | `SMTP_PASSWORD` | `kdun uzfu gwev upnv` | Gmail App Password |
6. Click **Deploy Web Service**. Render will build and launch your backend. Once deployed, note down the backend URL (e.g., `https://shorubenix-api.onrender.com`).

---

## 3. ⚛️ Deploy React Frontend (Vercel)
Vercel is the recommended hosting platform for React/Vite frontends.

1. Go to [Vercel](https://vercel.com/) and sign up with your GitHub account.
2. Click **Add New -> Project**.
3. Select your GitHub repository **`shorubenixinfo`** and click **Import**.
4. Configure the project settings:
   * **Framework Preset**: `Vite`
   * **Root Directory**: `./` (Leave as default)
   * **Build and Development Settings**: Leave as default (`npm run build`, output directory `dist`).
5. Expand the **Environment Variables** section and add:
   * **Key**: `VITE_API_URL`
   * **Value**: `https://shorubenix-api.onrender.com/api` (⚠️ *Replace this with your actual Render backend URL followed by `/api`*)
6. Click **Deploy**. Vercel will build and host your website, providing a custom production domain name!

---

### 🔄 Verification Check
Once both deployments complete:
1. Navigate to your Vercel URL in your browser.
2. Submit a callback request on the contact page or register a user.
3. Check the MongoDB Atlas collections and confirm the new entries are saved.
