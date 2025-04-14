README.md

# 📈 NIFTY Bell Curve Visualizer

This is a full-stack application that visualizes the normal distribution (bell curve) of NIFTY index prices using historical data.

---

## 🗂 Project Structure

bell-curve/ ├── backend/ # Flask backend API │ ├── app.py │ ├── database/ # CSV files with historical NIFTY data │ ├── venv/ # Python virtual environment (excluded via .gitignore) │ └── requirements.txt ├── frontend/ # React + Vite frontend │ ├── src/ │ ├── public/ │ └── package.json └── README.md


---

## 🚀 Getting Started

### 📦 Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
export FLASK_APP=app.py
flask run

    App runs at: http://127.0.0.1:5000

🌐 Frontend Setup

cd frontend
npm install
npm run dev

    Frontend runs at: http://localhost:5173

⚙️ Features

    🎚️ Interactive sliders for date range and expiry

    📅 Date pickers with dynamic data sync

    🌗 Theme toggle: Light & Dark

    🎨 Stylish Plotly chart with MUI components

📁 Data

Drop your CSV files in:

backend/database/

Each CSV must contain:

    Date

    Close

Format: DD-MMM-YYYY (e.g., 01-Jan-2020)
🧼 .gitignore Includes

    /frontend/node_modules

    /backend/venv

    __pycache__, .DS_Store

🧠 Built With

    React + Vite

    Flask

    Plotly.js

    Material UI (MUI)

    Day.js