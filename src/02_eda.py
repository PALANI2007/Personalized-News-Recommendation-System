import pandas as pd

df = pd.read_csv("dataset/raw/news_dataset.csv")

print(df.info())

print(df.describe())

print(df.isnull().sum())

print(df.duplicated().sum())