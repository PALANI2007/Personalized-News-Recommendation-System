import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import accuracy_score, classification_report

# Load Dataset
df = pd.read_csv("dataset/cleaned/clean_news.csv")

df["text"] = df["Title"] + " " + df["Description"]

tfidf = TfidfVectorizer(stop_words="english")
X = tfidf.fit_transform(df["text"])

y = df["Class Index"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = joblib.load("models/news_model.pkl")

y_pred = model.predict(X_test)

print("Accuracy :", accuracy_score(y_test, y_pred))
print()
print(classification_report(y_test, y_pred))