import pandas as pd

df = pd.read_csv("dataset/cleaned/clean_news.csv")

category = {
    1: "World",
    2: "Sports",
    3: "Business",
    4: "Science & Technology"
}

df["Category"] = df["Class Index"].map(category)

print(df[["Class Index", "Category"]].head())

df.to_csv("dataset/cleaned/news_with_category.csv", index=False)

print("Category Mapping Completed")