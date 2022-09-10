import json

class HistoryException(Exception):
    pass

class History:
    def __init__(self, filename):
        self.filename = filename
        with open(filename) as f:
            database = json.load(f)
        self.__database = database
        self.__users = database["users"]
    
    def __save_to_database(self):
        with open(self.filename, "w+") as f:
            json.dump(self.__database, f)
    
    def add(self, uuid, title, source, score, author, date_added):
        """Add a new article as read by user `uuid`."""
        if uuid not in self.__users:
            self.__users[uuid] = []
        
        self.__users[uuid].append({
            "title": title,
            "source": source,
            "score": score,
            "author": author,
            "date_added": date_added
        })

        self.__save_to_database()
        
        return "success"

    def visited(self, uuid):
        """Return a list of articles in which the user, identified by `uuid`, has already read."""
        if uuid not in self.__users:
            return []
        
        return self.__users[uuid]

if __name__ == "__main__":
    history = History("database.json")
    assert history.add("3c4d947dcff94c1ab50604284cbbe4be", "John Cena defeats Tom", "ABC News", "-80", "Irwin", "1657975610") == "success"
    print(history.visited("3c4d947dcff94c1ab50604284cbbe4be"))
    assert history.visited("invalid user") == []
    assert history.add("27874d3a77884d009beed2aa9d5d12d7", "New user", "CBC News", "60", "Johnny", "1657975671") == "success"
