import os
import io
import time
import pandas as pd
import numpy as np
import joblib
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS

# ReportLab imports for PDF generation
from sklearn.metrics.pairwise import cosine_similarity
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

app = Flask(__name__)

# ─── CORS Configuration ───────────────────────────────────────────────────────
# Allow Vercel frontend + localhost for development
FRONTEND_URL = os.environ.get("FRONTEND_URL", "*")
CORS(app, resources={r"/*": {"origins": [
    FRONTEND_URL,
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]}})

# ─── Path Resolution ──────────────────────────────────────────────────────────
# Works both locally (running from backend/) and on Render
# On Render with rootDirectory=backend, __file__ is /opt/render/project/src/app.py
# and dataset/models/reports are one level up at the repo root
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.dirname(BACKEND_DIR)  # repo root

# Check if dataset exists at repo root level, otherwise check relative to backend
def resolve_path(relative_path):
    """Try repo-root first, then backend dir, then current working directory."""
    candidates = [
        os.path.join(BASE_DIR, relative_path),
        os.path.join(BACKEND_DIR, relative_path),
        os.path.join(os.getcwd(), relative_path),
        os.path.join(os.path.dirname(os.getcwd()), relative_path),
    ]
    for path in candidates:
        if os.path.exists(path):
            return path
    # Return the first candidate (repo root) as default even if not found
    return candidates[0]

DATASET_PATH = resolve_path(os.path.join("dataset", "cleaned", "news_with_category.csv"))
MODEL_PATH = resolve_path(os.path.join("models", "news_model.pkl"))
TFIDF_PATH = resolve_path(os.path.join("models", "tfidf.pkl"))
TFIDF_VECT_PATH = resolve_path(os.path.join("models", "tfidf_vectorizer.pkl"))
REPORTS_DIR = resolve_path("reports")

# Global variables
df = None
tfidf_vectorizer = None
tfidf_matrix_global = None
model = None
init_error = None  # Track initialization errors

# Pre-computed static stats
MODEL_ACCURACY = 88.68
CONFUSION_MATRIX = [
    {"actual": "World", "predicted_world": 333, "predicted_sports": 16, "predicted_business": 16, "predicted_science_tech": 8, "total": 373},
    {"actual": "Sports", "predicted_world": 6, "predicted_sports": 378, "predicted_business": 3, "predicted_science_tech": 2, "total": 389},
    {"actual": "Business", "predicted_world": 15, "predicted_sports": 3, "predicted_business": 303, "predicted_science_tech": 38, "total": 359},
    {"actual": "Science & Technology", "predicted_world": 26, "predicted_sports": 10, "predicted_business": 29, "predicted_science_tech": 334, "total": 399}
]

def init_app():
    global df, tfidf_vectorizer, tfidf_matrix_global, model, init_error
    print("=== Initializing News Recommendation System Backend ===")
    print(f"  BACKEND_DIR: {BACKEND_DIR}")
    print(f"  BASE_DIR:    {BASE_DIR}")
    print(f"  CWD:         {os.getcwd()}")
    print(f"  DATASET:     {DATASET_PATH}")
    print(f"  MODEL:       {MODEL_PATH}")
    print(f"  TFIDF:       {TFIDF_VECT_PATH}")
    print(f"  REPORTS:     {REPORTS_DIR}")

    if not os.path.exists(DATASET_PATH):
        init_error = f"Dataset CSV not found at {DATASET_PATH}"
        raise FileNotFoundError(init_error)

    print(f"Loading dataset from: {DATASET_PATH}")
    df = pd.read_csv(DATASET_PATH)
    df["Title"] = df["Title"].fillna("")
    df["Description"] = df["Description"].fillna("")
    df["Category"] = df["Category"].fillna("Unknown")
    df["text"] = df["Title"] + " " + df["Description"]

    if os.path.exists(MODEL_PATH):
        print(f"Loading Classification Model from: {MODEL_PATH}")
        model = joblib.load(MODEL_PATH)

    if os.path.exists(TFIDF_VECT_PATH):
        print("Loading:", TFIDF_VECT_PATH)
        tfidf_vectorizer = joblib.load(TFIDF_VECT_PATH)
        print("Vocabulary Exists:", hasattr(tfidf_vectorizer, "vocabulary_"))
    elif os.path.exists(TFIDF_PATH):
        tfidf_vectorizer = joblib.load(TFIDF_PATH)
    else:
        from sklearn.feature_extraction.text import TfidfVectorizer
        tfidf_vectorizer = TfidfVectorizer(stop_words="english")
        tfidf_vectorizer.fit(df["text"])

    
    print("Generating TF-IDF Matrix...")

    tfidf_matrix_global = tfidf_vectorizer.transform(df["text"])

    print("TF-IDF Matrix Shape :", tfidf_matrix_global.shape)

    init_error = None
    print("=== Initialization Completed ===\n")

try:
    init_app()
except Exception as e:
    init_error = str(e)
    print(f"Error during initialization: {init_error}")

# ====================================================
# API ROUTES
# ====================================================

@app.route("/", methods=["GET"])
@app.route("/api", methods=["GET"])
def index():
    return jsonify({
        "status": "online",
        "message": "Personalized News Recommendation System API",
        "dataset_records": len(df) if df is not None else 0,
        "model_loaded": model is not None,
        "similarity_loaded": tfidf_matrix_global is not None,
        "init_error": init_error
    })

@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint for Render."""
    return jsonify({"status": "healthy", "init_error": init_error}), 200

@app.route("/api/categories", methods=["GET"])
def get_categories():
    if df is None:
        return jsonify({"error": "Dataset not loaded", "init_error": init_error}), 500
    categories = sorted(df["Category"].unique().tolist())
    return jsonify({"categories": categories})

@app.route("/api/statistics", methods=["GET"])
def get_statistics():
    if df is None:
        return jsonify({"error": "Dataset not loaded", "init_error": init_error}), 500
    word_counts = df["Description"].apply(lambda x: len(str(x).split()))
    cat_distribution = df["Category"].value_counts().to_dict()
    missing_vals = int(df.isnull().sum().sum())
    duplicate_rows = int(df.duplicated(subset=["Title", "Description"]).sum())
    return jsonify({
        "total_records": len(df),
        "total_categories": df["Category"].nunique(),
        "missing_values": missing_vals,
        "duplicate_records": duplicate_rows,
        "categories": df["Category"].unique().tolist(),
        "category_counts": cat_distribution,
        "word_count_stats": {
            "avg": round(word_counts.mean(), 2),
            "max": int(word_counts.max()),
            "min": int(word_counts.min())
        },
        "dataset_shape": list(df.shape),
        "model_accuracy": MODEL_ACCURACY
    })

@app.route("/api/search", methods=["GET"])
def search_news():
    if df is None:
        return jsonify({"error": "Dataset not loaded", "init_error": init_error}), 500
    keyword = request.args.get("keyword", "").strip()
    category = request.args.get("category", "").strip()
    page = max(1, int(request.args.get("page", 1)))
    limit = min(int(request.args.get("limit", 50)), 100)
    sort_by = request.args.get("sort", "relevance")

    filtered_df = df.copy()
    if category and category.lower() != "all":
        filtered_df = filtered_df[filtered_df["Category"].str.lower() == category.lower()]
    if keyword:
        keyword_lower = keyword.lower()
        title_match = filtered_df["Title"].str.lower().str.contains(keyword_lower, na=False)
        desc_match = filtered_df["Description"].str.lower().str.contains(keyword_lower, na=False)
        filtered_df = filtered_df[title_match | desc_match]
    if sort_by == "category":
        filtered_df = filtered_df.sort_values("Category")

    total_results = len(filtered_df)
    start = (page - 1) * limit
    end = start + limit
    page_results = filtered_df.iloc[start:end].to_dict(orient="records")

    return jsonify({
        "query": {"keyword": keyword, "category": category},
        "total_results": total_results,
        "total_pages": max(1, (total_results + limit - 1) // limit),
        "current_page": page,
        "results": page_results
    })

@app.route("/api/recommend", methods=["POST"])
def recommend_news():
    if df is None or tfidf_matrix_global is None:
        return jsonify({"error": "Dataset or recommendation matrix not initialized", "init_error": init_error}), 500
    data = request.get_json()
    if not data or "title" not in data:
        return jsonify({"error": "Missing title in request body"}), 400
    title = data["title"].strip()

    t_start = time.time()
    matches = df[df["Title"].str.lower() == title.lower()]
    if matches.empty:
        matches = df[df["Title"].str.lower().str.contains(title.lower(), regex=False, na=False)]
    if matches.empty:
        return jsonify({"error": "News Title Not Found", "message": "No exact or partial match found. Please try another title."}), 404

    idx = matches.index[0]
    matched_article = df.loc[idx].to_dict()
    query_vector = tfidf_matrix_global[idx]

    scores = cosine_similarity(
        query_vector,
        tfidf_matrix_global
    ).flatten()

    similarity_scores = sorted(
        list(enumerate(scores)),
        key=lambda x: x[1],
        reverse=True
    )
    recommendations = []
    seen_titles = {matched_article["Title"].lower()}
    for item in similarity_scores:
        rec_idx = item[0]
        score = float(item[1])
        if rec_idx == idx:
            continue
        rec_article = df.loc[rec_idx]
        rec_title = rec_article["Title"]
        if rec_title.lower() in seen_titles:
            continue
        recommendations.append({
            "Title": rec_title,
            "Description": rec_article["Description"],
            "Category": rec_article["Category"],
            "Class Index": int(rec_article["Class Index"]),
            "Similarity Score": round(score, 4),
            "Similarity Percent": round(score * 100, 1)
        })
        seen_titles.add(rec_title.lower())
        if len(recommendations) == 5:
            break

    elapsed_ms = round((time.time() - t_start) * 1000, 2)
    return jsonify({
        "queried_article": {
            "Title": matched_article["Title"],
            "Description": matched_article["Description"],
            "Category": matched_article["Category"]
        },
        "recommendations": recommendations,
        "computation_time_ms": elapsed_ms
    })

@app.route("/api/reports", methods=["GET"])
def get_reports():
    if df is not None:
        cat_counts = df["Category"].value_counts().to_dict()
        total_len = len(df)
        pie_data = [
            {"name": name, "value": count, "percentage": round((count / total_len) * 100, 2)}
            for name, count in cat_counts.items()
        ]
    else:
        pie_data = []

    split_data = [
        {"name": "Training Set (80%)", "value": 6080},
        {"name": "Testing Set (20%)", "value": 1520}
    ]
    metrics_data = [
        {"category": "World", "precision": 0.88, "recall": 0.89, "f1_score": 0.88, "support": 373},
        {"category": "Sports", "precision": 0.93, "recall": 0.97, "f1_score": 0.95, "support": 389},
        {"category": "Business", "precision": 0.86, "recall": 0.84, "f1_score": 0.85, "support": 359},
        {"category": "Science & Tech", "precision": 0.87, "recall": 0.84, "f1_score": 0.86, "support": 399}
    ]
    image_files = ["confusion_matrix.png", "category_distribution.png", "category_pie_chart.png", "accuracy_chart.png"]
    report_images = {img.replace(".png", ""): os.path.exists(os.path.join(REPORTS_DIR, img)) for img in image_files}

    return jsonify({
        "accuracy": MODEL_ACCURACY,
        "algorithm": "Logistic Regression",
        "vectorizer": "TF-IDF Vectorizer",
        "confusion_matrix": CONFUSION_MATRIX,
        "pie_chart_data": pie_data,
        "split_data": split_data,
        "metrics": metrics_data,
        "report_images": report_images
    })

@app.route("/api/reports/images/<filename>", methods=["GET"])
def serve_report_image(filename):
    """Serve report PNG images from the reports/ directory."""
    allowed = {"confusion_matrix.png", "category_distribution.png", "category_pie_chart.png", "accuracy_chart.png"}
    if filename not in allowed:
        return jsonify({"error": "Image not found"}), 404
    img_path = os.path.join(REPORTS_DIR, filename)
    if not os.path.exists(img_path):
        return jsonify({"error": f"{filename} not found in reports directory"}), 404
    return send_file(img_path, mimetype="image/png")

@app.route("/api/dashboard", methods=["GET"])

def get_dashboard():
    try:
        """Extended dashboard metrics including vocabulary, TF-IDF features, model size."""
        if df is None:
            return jsonify({"error": "Dataset not loaded", "init_error": init_error}), 500

        word_counts = df["Description"].apply(lambda x: len(str(x).split()))

        vocab_size = 0
        tfidf_features = 0
        if tfidf_vectorizer is not None:
            try:
                vocab_size = len(tfidf_vectorizer.vocabulary_)
                tfidf_features = tfidf_matrix_global.shape[1] if tfidf_matrix_global is not None else vocab_size
            except Exception:
                pass

        model_size_kb = round(os.path.getsize(MODEL_PATH) / 1024, 1) if os.path.exists(MODEL_PATH) else 0
        dataset_size_kb = round(os.path.getsize(DATASET_PATH) / 1024, 1) if os.path.exists(DATASET_PATH) else 0
        similarity_matrix_mb = 0
        return jsonify({
            "total_articles": len(df),
            "total_categories": df["Category"].nunique(),
            "model_accuracy": MODEL_ACCURACY,
            "vocabulary_size": vocab_size,
            "avg_description_length": round(word_counts.mean(), 1),
            "tfidf_features": tfidf_features,
            "model_size_kb": model_size_kb,
            "dataset_size_kb": dataset_size_kb,
            "similarity_matrix_mb": similarity_matrix_mb,
            "category_distribution": df["Category"].value_counts().to_dict(),
            "radar_data": [
                {"category": "World", "precision": 88, "recall": 89, "f1": 88},
                {"category": "Sports", "precision": 93, "recall": 97, "f1": 95},
                {"category": "Business", "precision": 86, "recall": 84, "f1": 85},
                {"category": "Sci & Tech", "precision": 87, "recall": 84, "f1": 86},
            ],
            "split_data": [
                {"name": "Training (80%)", "value": 6080},
                {"name": "Testing (20%)", "value": 1520}
            ]
        })
    except Exception as e:
        import traceback
        traceback.print_exc()

        return jsonify({
            "error": str(e)
        }), 500

@app.route("/api/dataset", methods=["GET"])
def get_dataset():
    """Dataset preview with pagination and random sample."""
    if df is None:
        return jsonify({"error": "Dataset not loaded", "init_error": init_error}), 500

    page = max(1, int(request.args.get("page", 1)))
    limit = min(int(request.args.get("limit", 10)), 50)
    sample = request.args.get("sample", "false").lower() == "true"

    word_counts = df["Description"].apply(lambda x: len(str(x).split()))

    if sample:
        preview_records = df.sample(min(5, len(df))).to_dict(orient="records")
    else:
        start = (page - 1) * limit
        preview_records = df.iloc[start:start + limit].to_dict(orient="records")

    total_records = len(df)
    return jsonify({
        "total_records": total_records,
        "total_pages": max(1, (total_records + limit - 1) // limit),
        "current_page": page,
        "total_categories": df["Category"].nunique(),
        "missing_values": int(df.isnull().sum().sum()),
        "duplicate_records": int(df.duplicated(subset=["Title", "Description"]).sum()),
        "word_count_stats": {
            "avg": round(word_counts.mean(), 2),
            "max": int(word_counts.max()),
            "min": int(word_counts.min())
        },
        "category_counts": df["Category"].value_counts().to_dict(),
        "columns": list(df.columns),
        "preview": preview_records
    })

@app.route("/api/model", methods=["GET"])
def get_model_info():
    """Model metadata and performance specs."""
    vocab_size = 0
    tfidf_features = 0
    if tfidf_vectorizer is not None:
        try:
            vocab_size = len(tfidf_vectorizer.vocabulary_)
            tfidf_features = tfidf_matrix_global.shape[1] if tfidf_matrix_global is not None else vocab_size
        except Exception:
            pass
    model_size_kb = round(os.path.getsize(MODEL_PATH) / 1024, 1) if os.path.exists(MODEL_PATH) else 0

    return jsonify({
        "algorithm": "Logistic Regression",
        "feature_extraction": "TF-IDF (Term Frequency-Inverse Document Frequency)",
        "similarity_metric": "Cosine Similarity",
        "accuracy": MODEL_ACCURACY,
        "training_samples": 6080,
        "testing_samples": 1520,
        "total_samples": 7600,
        "classes": ["World", "Sports", "Business", "Science & Technology"],
        "num_classes": 4,
        "vocabulary_size": vocab_size,
        "tfidf_features": tfidf_features,
        "model_size_kb": model_size_kb,
        "max_iter": 1000,
        "test_split": 0.2,
        "random_state": 42
    })

@app.route("/api/export/csv", methods=["GET"])
def export_csv():
    """Export dataset as CSV."""
    if df is None:
        return jsonify({"error": "Dataset not loaded"}), 500
    output = io.StringIO()
    df[["Title", "Description", "Category", "Class Index"]].to_csv(output, index=False)
    output.seek(0)
    return send_file(
        io.BytesIO(output.getvalue().encode("utf-8")),
        mimetype="text/csv",
        as_attachment=True,
        download_name="news_dataset_export.csv"
    )

@app.route("/api/export/json", methods=["GET"])
def export_json():
    """Export summary statistics as JSON."""
    if df is None:
        return jsonify({"error": "Dataset not loaded"}), 500
    import json
    word_counts = df["Description"].apply(lambda x: len(str(x).split()))
    summary = {
        "project": "Personalized News Recommendation System",
        "algorithm": "Logistic Regression + TF-IDF + Cosine Similarity",
        "accuracy": MODEL_ACCURACY,
        "total_records": len(df),
        "total_categories": df["Category"].nunique(),
        "categories": df["Category"].value_counts().to_dict(),
        "word_count_avg": round(word_counts.mean(), 2),
        "word_count_max": int(word_counts.max()),
        "word_count_min": int(word_counts.min()),
        "training_samples": 6080,
        "testing_samples": 1520,
        "confusion_matrix": CONFUSION_MATRIX
    }
    json_bytes = json.dumps(summary, indent=2).encode("utf-8")
    return send_file(
        io.BytesIO(json_bytes),
        mimetype="application/json",
        as_attachment=True,
        download_name="news_project_summary.json"
    )

@app.route("/api/download-report", methods=["GET"])
def download_report():
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40)
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle('DocTitle', parent=styles['Heading1'], fontName='Helvetica-Bold', fontSize=22, textColor=colors.HexColor('#1e1b4b'), spaceAfter=12, alignment=1)
    h1_style = ParagraphStyle('H1', parent=styles['Heading2'], fontName='Helvetica-Bold', fontSize=15, textColor=colors.HexColor('#0284c7'), spaceBefore=14, spaceAfter=8)
    body_style = ParagraphStyle('Body', parent=styles['Normal'], fontName='Helvetica', fontSize=10, leading=14, textColor=colors.HexColor('#1e293b'), spaceAfter=8)
    th_style = ParagraphStyle('TH', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=10, textColor=colors.white)
    td_style = ParagraphStyle('TD', parent=styles['Normal'], fontName='Helvetica', fontSize=9, textColor=colors.HexColor('#334155'))
    elements = []
    elements.append(Paragraph("Personalized News Recommendation System", title_style))
    elements.append(Spacer(1, 10))
    elements.append(Paragraph("1. Project Overview", h1_style))
    elements.append(Paragraph("This project implements an advanced Personalized News Recommendation System using TF-IDF vectorization and Cosine Similarity for content-based filtering, and Logistic Regression for news category classification achieving 88.68% accuracy.", body_style))
    elements.append(Paragraph("2. Model Specifications", h1_style))
    model_data = [
        [Paragraph("Parameter", th_style), Paragraph("Value", th_style)],
        [Paragraph("Algorithm", td_style), Paragraph("Logistic Regression", td_style)],
        [Paragraph("Feature Engineering", td_style), Paragraph("TF-IDF Vectorizer", td_style)],
        [Paragraph("Accuracy", td_style), Paragraph("88.68%", td_style)],
        [Paragraph("Dataset Size", td_style), Paragraph("7,600 Records", td_style)],
        [Paragraph("Training Split", td_style), Paragraph("80% (6,080 records)", td_style)],
        [Paragraph("Testing Split", td_style), Paragraph("20% (1,520 records)", td_style)],
    ]
    t1 = Table(model_data, colWidths=[200, 300])
    t1.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e1b4b')),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f8fafc')),
    ]))
    elements.append(t1)
    elements.append(Spacer(1, 12))
    elements.append(Paragraph("3. Classification Metrics", h1_style))
    m_data = [
        [Paragraph("Category", th_style), Paragraph("Precision", th_style), Paragraph("Recall", th_style), Paragraph("F1-Score", th_style), Paragraph("Support", th_style)],
        [Paragraph("World", td_style), Paragraph("88%", td_style), Paragraph("89%", td_style), Paragraph("88%", td_style), Paragraph("373", td_style)],
        [Paragraph("Sports", td_style), Paragraph("93%", td_style), Paragraph("97%", td_style), Paragraph("95%", td_style), Paragraph("389", td_style)],
        [Paragraph("Business", td_style), Paragraph("86%", td_style), Paragraph("84%", td_style), Paragraph("85%", td_style), Paragraph("359", td_style)],
        [Paragraph("Science & Tech", td_style), Paragraph("87%", td_style), Paragraph("84%", td_style), Paragraph("86%", td_style), Paragraph("399", td_style)],
    ]
    t2 = Table(m_data, colWidths=[130, 90, 90, 90, 100])
    t2.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0284c7')),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#cbd5e1')),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#f8fafc')),
    ]))
    elements.append(t2)
    doc.build(elements)
    buffer.seek(0)
    return send_file(buffer, as_attachment=True, download_name="News_Recommendation_System_Report.pdf", mimetype="application/pdf")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"Starting server on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=True)
