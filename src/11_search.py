import pandas as pd

df = pd.read_csv("dataset/cleaned/news_with_category.csv")

keyword = input("Enter Keyword : ").lower()

result = df[
    df["Title"].str.lower().str.contains(keyword) |
    df["Description"].str.lower().str.contains(keyword)
]

if len(result) == 0:
    print("No News Found")
else:
    print(result[["Category","Title"]].head(10))