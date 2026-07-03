import pandas as pd
import matplotlib.pyplot as plt

# Load Dataset
df = pd.read_csv("dataset/cleaned/news_with_category.csv")

count = df["Category"].value_counts()

plt.figure(figsize=(7,7))

plt.pie(
    count,
    labels=count.index,
    autopct="%1.1f%%",
    startangle=90
)

plt.title("News Category Percentage")

plt.savefig("reports/category_pie_chart.png")

plt.show()

print("Pie Chart Saved Successfully")