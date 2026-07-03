# Personalized News Recommendation System

An advanced, end-to-end Machine Learning web application designed to classify news stories and recommend similar articles dynamically using Text Mining, Natural Language Processing (NLP), and Content-Based Filtering.

This repository features a modern, responsive React frontend styled with Tailwind CSS, Framer Motion, and Recharts, connected to a Flask backend serving custom Scikit-Learn models and TF-IDF Cosine Similarity recommendations.

---

## 🌟 Project Features

1. **Animated Hero Landing Page**: Styled with glassmorphism, background grids, custom gradient glows, and key project statistics.
2. **Interactive News Search**: Multi-field search across titles/descriptions with category filters.
3. **Content Similarity Engine**: Implements a debounced auto-suggest headline search bar and computes a Cosine Similarity matrix to return the Top 5 matching news stories.
4. **Interactive Dashboard**: Displays real-time metrics, class ratios, and evaluation bar charts using Recharts.
5. **Academic Reports & PDF Download**: Renders category precision/recall metrics, interactive heat-mapped confusion matrices, and allows downloading a dynamically generated PDF report.
6. **Dataset Analytics**: Reviews dataset sizes, null records, token length metrics, and category distributions.

---

## 🛠️ Technology Stack

### Frontend
- **React 18 & Vite**: High-performance, fast-building single-page application.
- **React Router DOM**: Client-side routing for transitions between modules.
- **Tailwind CSS**: Modern design system customized with dark theme styles and glassmorphism.
- **Framer Motion**: Smooth entry and hover animations.
- **Recharts**: Interactive charting (Bar, Pie, Cell) for analytics.
- **Axios**: Network requests to Flask microservices.
- **Lucide React**: Clean vector icon suite.

### Backend
- **Python & Flask**: Lightweight API framework with Flask-CORS.
- **Scikit-Learn**: Loaded Logistic Regression class prediction models and TF-IDF vectors.
- **Pandas & NumPy**: Data processing and array mathematics.
- **Joblib**: Model deserialization.
- **ReportLab**: Dynamic programmatic PDF generator.

---

## 📂 Project Structure

```
news-recommendation-system/
├── backend/
│   ├── app.py                # Flask API application
│   └── requirements.txt      # Backend Python dependencies
├── dataset/
│   └── cleaned/
│       ├── clean_news.csv            # Preprocessed raw news
│       └── news_with_category.csv    # Final mapped dataset (7600 records)
├── frontend/
│   ├── index.html            # Entry HTML with custom SVG favicon
│   ├── package.json          # Node dependencies
│   ├── tailwind.config.js    # Design tokens & dark mode color configurations
│   ├── postcss.config.js     # PostCSS configurations
│   ├── vite.config.js        # Port configurations
│   └── src/
│       ├── App.jsx           # App shell and routes
│       ├── main.jsx          # Mount entry
│       ├── index.css         # Styling utilities & custom scrollbar
│       ├── components/
│       │   ├── Navbar.jsx    # Sticky navigation with mobile menu
│       │   ├── Footer.jsx    # Footer with socials
│       │   ├── NewsCard.jsx  # Reusable card with match metrics
│       │   └── Loader.jsx    # Glowing loading spinners
│       ├── utils/
│       │   └── api.js        # Axios network configuration
│       └── pages/
│           ├── Home.jsx      # Landing Hero & overview
│           ├── Search.jsx    # Filterable keyword search
│           ├── Recommendation.jsx # Content matching engine
│           ├── Dashboard.jsx # Key metrics and distributions
│           ├── Reports.jsx   # Heatmaps & PDF download
│           ├── DatasetAnalytics.jsx # Token distribution curves
│           ├── About.jsx     # Institutionalcapstone layout
│           └── Contact.jsx   # Input validated contact form
├── models/
│   ├── news_model.pkl        # Logistic Regression classifier pkl
│   ├── tfidf.pkl             # Pre-trained TF-IDF vectorizer pkl
│   └── tfidf_vectorizer.pkl  # Additional pre-trained vectorizer
└── reports/                  # Precomputed static figures
```

---

## ⚙️ How to Run Locally

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ & npm

### 2. Run Flask Backend
From the project root:
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the Flask app
python app.py
```
*The server will run on `http://localhost:5000`.*

### 3. Run React Frontend
Open a new terminal window at the project root:
```bash
# Navigate to frontend directory
cd frontend

# Install Node modules
npm install

# Run the development server
npm run dev
```
*The app will automatically open at `http://localhost:3000`.*

---

## 🚀 Deployment Guide

### Frontend → Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to `frontend/` directory.
3. Add a `.env.production` file to `frontend/` containing:
   ```env
   VITE_API_BASE_URL=https://your-backend-render-url.onrender.com/api
   ```
4. Run `vercel` and follow the prompts.
5. Make sure the output directory is configured as `dist` and build command is `npm run build`.

### Backend → Render
1. Create a Web Service on Render.
2. Select your Repository.
3. Configure the following environment settings:
   - **Environment**: `Python`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `gunicorn --chdir backend app:app` (gunicorn runs on port 10000 by default, port overrides are handled by Render).
   - **Root Directory**: Leave blank or set to repository root to access dataset/models.