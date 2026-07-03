import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer

# Load cleaned dataset
df = pd.read_csv("dataset/cleaned/clean_news.csv")

# Combine Title and Description
df["text"] = df["Title"] + " " + df["Description"]

# TF-IDF
tfidf = TfidfVectorizer(stop_words="english")

X = tfidf.fit_transform(df["text"])

y = df["Class Index"]

print("Feature Matrix Shape :", X.shape)
print("Target Shape :", y.shape)