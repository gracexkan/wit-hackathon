def pattern_matching():
    command = input("What are you doing next? ")
    # analyze the result of command.split()

    match command.split():
        case ["quit"]:
            print("Goodbye!")
        case ["look"]:
            print("Looking.")
        case ["get", obj]:
            print(f"Getting {obj}.")
        case ["go", direction]:
            print(f"Going {direction}")
        # The rest of your commands go here

from textblob import TextBlob
import json

with open("tests.json") as f:
    tests = json.load(f)

headlines = tests["headlines"]
for headline in headlines:
    blob = TextBlob(headline)
    print(f"{headline}\n{blob.sentiment}")
