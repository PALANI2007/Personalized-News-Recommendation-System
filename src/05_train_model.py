import pandas as pd
import joblib

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression

# Load Dataset
df = pd.read_csv("dataset/cleaned/clean_news.csv")

# Merge text
df["text"] = df["Title"] + " " + df["Description"]

# Features
tfidf = TfidfVectorizer(stop_words="english")
X = tfidf.fit_transform(df["text"])

# Target
y = df["Class Index"]

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train Model
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

# Save Model
joblib.dump(model, "models/news_model.pkl")
joblib.dump(tfidf, "models/tfidf.pkl")

print("Model Training Completed")
