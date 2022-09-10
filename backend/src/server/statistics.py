import json

with open("database.json") as f:
    data = json.load(f)

def avg_score(uuid):
    """ return average sentiment score for articles read by a user """

    sum = 0
    n = 0
    if uuid not in data["users"]:
        data["users"][uuid] = []
    for item in data['users'][str(uuid)]:
        sum += item['score']
        n += 1

    if n == 0:
        return str(0)
    else:
        return str(int(sum/n))

def most_common_source(uuid):
    """ return most common source for articles read by user """
    
    sources = {}
    if uuid not in data["users"]:
        data["users"][uuid] = []
    for item in data['users'][str(uuid)]:
        source = item['source']
        if source in sources:
            sources[source] += 1
        else:
            sources[source] = 1
    
    if sources == {}:
        return 'None'
    else:
        return max(sources, key=sources.get)


def most_common_author(uuid):
    """ return most common source for articles read by user """
    
    authors = {}
    if uuid not in data["users"]:
        data["users"][uuid] = []
    for item in data['users'][str(uuid)]:
        author = item['author']
        if author in authors:
            authors[author] += 1
        else:
            authors[author] = 1
    
    if authors == {}:
        return 'None'
    else:
        return max(authors, key=authors.get)

def read_bias_ratio(uuid):
    """ return number from 0 to 100 to indicate balance of articles from different sources and authors """
    
    sources = {}
    authors = {}

    if uuid not in data["users"]:
        data["users"][uuid] = []

    for item in data['users'][str(uuid)]:
        author = item['author']
        source = item['source']
        if author in authors:
            authors[author] += 1
        else:
            authors[author] = 1

        if source in sources:
            sources[source] += 1
        else:
            sources[source] = 1
    
    if sources == {} or authors == {}:
        return 0
        
    unique_sources = len(set(sources))
    total_count = sum(sources.values())
    source_balance = unique_sources/total_count

    unique_authors = len(set(authors))
    total_count = sum(authors.values())
    author_balance = unique_authors/total_count

    total_balance = int(((1 - source_balance + author_balance)/2)*100)

    return total_balance
    