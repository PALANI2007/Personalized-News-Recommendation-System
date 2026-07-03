import matplotlib.pyplot as plt

accuracy = 88.68

plt.figure(figsize=(5,5))

plt.bar(["Logistic Regression"], [accuracy])

plt.ylim(0,100)

plt.ylabel("Accuracy (%)")

plt.title("Model Accuracy")

plt.text(0, accuracy+1, f"{accuracy}%")

plt.savefig("reports/accuracy_chart.png")

plt.show()

print("Accuracy Chart Saved Successfully")