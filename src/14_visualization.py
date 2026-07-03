import pandas as pd
import matplotlib.pyplot as plt

# Load Dataset
df = pd.read_csv("dataset/cleaned/news_with_category.csv")

# Count Categories
count = df["Category"].value_counts()

# Bar Chart
plt.figure(figsize=(8,5))
count.plot(kind="bar")

plt.title("News Category Distribution")
plt.xlabel("Category")
plt.ylabel("Number of News")

plt.tight_layout()

plt.savefig("reports/category_distribution.png")

plt.show()

print("Bar Chart Saved Successfully")