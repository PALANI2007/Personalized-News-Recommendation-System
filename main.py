import os

while True:

    print("\n")
    print("=" * 50)
    print(" PERSONALIZED NEWS RECOMMENDATION SYSTEM ")
    print("=" * 50)
    print("1. Dataset Information")
    print("2. Search News")
    print("3. Recommend News")
    print("4. Model Information")
    print("5. Exit")
    print("=" * 50)

    choice = input("Enter Choice : ")

    if choice == "1":
        os.system("py src/13_dataset_statistics.py")

    elif choice == "2":
        os.system("py src/11_search.py")

    elif choice == "3":
        os.system("py src/12_recommend_by_keyword.py")

    elif choice == "4":
        os.system("py src/16_model_statistics.py")

    elif choice == "5":
        print("Thank You")
        break

    else:
        print("Invalid Choice")