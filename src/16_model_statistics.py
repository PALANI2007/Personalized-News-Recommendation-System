import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import accuracy_score

# Load Dataset
df = pd.read_csv("dataset/cleaned/news_with_category.csv")

# Prepare Data
df["text"] = df["Title"] + " " + df["Description"]

X = df["text"]
y = df["Class Index"]

# TF-IDF
tfidf = TfidfVectorizer(stop_words="english")
X = tfidf.fit_transform(X)

# Train/Test Split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# Load Model
model = joblib.load("models/news_model.pkl")

# Prediction
y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)

print("=" * 50)
print("MODEL INFORMATION")
print("=" * 50)

print("Algorithm          : Logistic Regression")
print("Training Samples   :", X_train.shape[0])
print("Testing Samples    :", X_test.shape[0])
print("TF-IDF Features    :", X.shape[1])
print("Accuracy           :", round(accuracy * 100, 2), "%")

print("=" * 50)