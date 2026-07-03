import pandas as pd
import joblib
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import ConfusionMatrixDisplay

# Load dataset
df = pd.read_csv("dataset/cleaned/clean_news.csv")

df["text"] = df["Title"] + " " + df["Description"]

tfidf = TfidfVectorizer(stop_words="english")
X = tfidf.fit_transform(df["text"])
y = df["Class Index"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = joblib.load("models/news_model.pkl")

ConfusionMatrixDisplay.from_estimator(model, X_test, y_test)
plt.savefig("reports/confusion_matrix.png")
plt.show()

print("Confusion Matrix Saved")