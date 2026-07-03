import pandas as pd
import joblib

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Load Dataset
df = pd.read_csv("dataset/cleaned/news_with_category.csv")

# Combine Title and Description
df["text"] = df["Title"] + " " + df["Description"]

# TF-IDF
tfidf = TfidfVectorizer(stop_words="english")

matrix = tfidf.fit_transform(df["text"])

# Cosine Similarity
similarity = cosine_similarity(matrix)

print("Similarity Matrix Shape :", similarity.shape)

# Save Files
joblib.dump(similarity, "models/similarity.pkl")
joblib.dump(tfidf, "models/tfidf_vectorizer.pkl")

print("Similarity Matrix Saved Successfully")