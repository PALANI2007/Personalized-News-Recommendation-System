import pandas as pd

df = pd.read_csv("dataset/raw/news_dataset.csv")

df = df.drop_duplicates()

df = df.dropna()

df.to_csv("dataset/cleaned/clean_news.csv", index=False)

print("Cleaning Completed")
