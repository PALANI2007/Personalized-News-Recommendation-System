import pandas as pd

# Load Dataset
df = pd.read_csv("dataset/cleaned/news_with_category.csv")

print("=" * 50)
print("      DATASET INFORMATION")
print("=" * 50)

print("Total News            :", len(df))
print("Total Columns         :", len(df.columns))
print("Total Categories      :", df["Category"].nunique())

print("\nCategory Names :")
for category in df["Category"].unique():
    print("-", category)

print("\nMissing Values :", df.isnull().sum().sum())
print("Duplicate Rows :", df.duplicated().sum())

print("\nDataset Shape :", df.shape)

print("=" * 50)