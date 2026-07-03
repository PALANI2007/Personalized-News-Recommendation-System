import pandas as pd

df = pd.read_csv("dataset/raw/news_dataset.csv")

print(df.head())

print(df.shape)

print(df.columns)