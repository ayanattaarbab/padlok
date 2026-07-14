# Padlok

Padlok is a lightweight, self-hosted, full-stack password management application featuring an elegant responsive UI, dynamic status badges, smooth transitions, and instant clipboard operations.

## 🚀 Key Features

*   **Full CRUD Integration**: Seamlessly create, retrieve, update, and delete credential entries with a backend Express API and direct MongoDB driver integrations.
*   **Live Database Connection Status**: A dynamic, pulsing connection status indicator in the header that monitors server connectivity.
*   **Independent Password Masking**: A secure dictionary state tracker that allows you to toggle the visibility of individual passwords without exposing any other entries in the table.
*   **Seamless Copy-to-Clipboard**: Copy usernames, passwords, or website URLs with a single click, paired with beautifully styled dark Toast notifications.
*   **Custom Micro-Interactions**: High-performance UI styling utilizing custom CSS animations, transition-based focus states on inputs, and tactile scaling on active buttons.

## 🛠️ Tech Stack

### Frontend
*   **Vite React**: High-performance client build tool.
*   **Tailwind CSS (v4)**: Modern, class-driven styling with smooth utility transitions[cite: 2].
*   **UUID (v4)**: Collision-free client-side unique identifier generator.
*   **Iconify**: Dynamic web component icons loaded asynchronously.
*   **React-Toastify**: Professional dark-themed system alerts.

### Backend
*   **Node.js & Express**: High-speed server routing handling API requests.
*   **MongoDB (Raw Driver)**: Direct connection to your database using the native `mongodb` npm package driver.

## ⚡ Quick Start

Follow these simple steps to run both the client and server environments locally:

### 1. Clone the Repository

```bash
git clone https://github.com/ayanattaarbab/padlok.git
cd padlok
```

### 2. Configure Environment Variables

Navigate to the `/backend` directory and set up your variables:

```bash
cd backend
cp .env.example .env
```

Open the newly created `.env` file and insert your configuration details:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_uri
DB_NAME=your_database_name
```

### 3. Install Dependencies & Start the Backend

```bash
# From the /backend directory
npm install
npm run dev
```

### 4. Install Dependencies & Start the Frontend

Open a separate terminal window at the **root** of the project directory:

```bash
# From the root directory
npm install
npm run dev
```

Your frontend server will compile and boot up at `http://localhost:5173`. Open it in your browser and your local password manager is fully live!