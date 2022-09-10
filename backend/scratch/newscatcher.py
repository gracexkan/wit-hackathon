from newscatcherapi import NewsCatcherApiClient
API_KEY = "w2djGZtoAcCGop5u_eoWc9NfwbgsT2LOp6kMyMy8uzI"
newscatcherapi = NewsCatcherApiClient(x_api_key=API_KEY)

news_articles = newscatcherapi.get_search(q="white whale washes up")
titles = set()
for article in news_articles['articles']:
    if article["title"] in titles:
        continue
    titles.add(article["title"])
    print(article["title"])
    print(article["link"])
    print(article["clean_url"])
