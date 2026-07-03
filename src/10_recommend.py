import pandas as pd
import joblib

# Load dataset
df = pd.read_csv("dataset/cleaned/news_with_category.csv")

# Load similarity matrix
similarity = joblib.load("models/similarity.pkl")

def recommend_news(title):

    if title not in df["Title"].values:
        print("News Title Not Found")
        return

    index = df[df["Title"] == title].index[0]

    distances = list(enumerate(similarity[index]))

    distances = sorted(distances, key=lambda x: x[1], reverse=True)

    print("\nRecommended News:\n")

    count = 0

    for i in distances[1:]:
        print(df.iloc[i[0]]["Title"])
        count += 1

        if count == 5:
            break


news_title = input("Enter News Title : ")

recommend_news(news_title)