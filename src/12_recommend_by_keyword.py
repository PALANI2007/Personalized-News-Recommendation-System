import pandas as pd
import joblib

# Load Dataset
df = pd.read_csv("dataset/cleaned/news_with_category.csv")

# Load Similarity Matrix
similarity = joblib.load("models/similarity.pkl")

# User Keyword
keyword = input("Enter Keyword : ").lower()

# Search Matching News
result = df[
    df["Title"].str.lower().str.contains(keyword) |
    df["Description"].str.lower().str.contains(keyword)
]

# Check if any news found
if result.empty:
    print("\nNo News Found!")
    exit()

print("\nMatching News:\n")

# Display matching news with index
for i, (index, row) in enumerate(result.iterrows()):
    print(f"{i+1}. {row['Title']}")

# User Selection
choice = int(input("\nChoose News Number : "))

# Get original dataframe index
selected_index = result.index[choice - 1]

# Find Similar News
distances = list(enumerate(similarity[selected_index]))

# Sort by similarity
distances = sorted(distances, key=lambda x: x[1], reverse=True)

print("\nTop 5 Recommended News\n")

count = 0

for news in distances[1:]:
    news_index = news[0]

    print("------------------------------------------")
    print("Category :", df.iloc[news_index]["Category"])
    print("Title    :", df.iloc[news_index]["Title"])
    print("Score    :", round(news[1], 3))
    print("------------------------------------------")

    count += 1

    if count == 5:
        break