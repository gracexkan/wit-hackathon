from google.cloud import language_v1
from textblob import TextBlob
import json
import regex
import os

# import requests

def analyse_sentiment_textblob(text_content):
    return TextBlob(text_content).sentiment.polarity

def analyse_sentiment_google(text_content):
    """
    Perform sentiment analysis on text.

    Args:
        text_content (str): The text content to analyse.
    """

    # cred_path = os.getcwd() + 'uplift.json'
    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'uplift.json'
    
    client = language_v1.LanguageServiceClient()

    # Available types: PLAIN_TEXT, HTML
    type_ = language_v1.Document.Type.PLAIN_TEXT

    # Optional. If not specified, the language is automatically detected.
    # For list of supported languages:
    # https://cloud.google.com/natural-language/docs/languages
    language = "en"
    document = {"content": text_content, "type_": type_, "language": language}

    # Available values: NONE, UTF8, UTF16, UTF32
    encoding_type = language_v1.EncodingType.UTF8

    response = client.analyze_sentiment(request = {'document': document, 'encoding_type': encoding_type})
    # Get overall sentiment of the input document
    return response.document_sentiment.score
    """"
    # Get sentiment for all sentences in the document
    for sentence in response.sentences:
        print(u"Sentence text: {}".format(sentence.text.content))
        print(u"Sentence sentiment score: {}".format(sentence.sentiment.score))
        print(u"Sentence sentiment magnitude: {}".format(sentence.sentiment.magnitude))
    """

    # Get the language of the text, which will be the same as
    # the language specified in the request or, if not specified,
    # the automatically-detected language.
    # print(u"Language of the text: {}".format(response.language))

def analyse_sentiment_avg_test():
    # load the headlines from the JSON file
    with open("tests.json") as f:
        tests = json.load(f)

    headlines = tests["headlines"]
    
    # for each headline
    for index, headline in enumerate(headlines):
        # average the sentiment analysis from google and textblob
        google = analyse_sentiment_google(headline) * 100
        textblob = analyse_sentiment_textblob(headline) * 100
        average_sentiment_anlysis = (google + textblob) / 2
        
        if index:
            print(f"\n{headline}\n{round(average_sentiment_anlysis, 2)}")
        else:
            print(f"{headline}\n{round(average_sentiment_anlysis, 2)}")
        
        print(f"Google: {round(google, 2)} Textblob: {round(textblob, 2)}")

def analyse_sentiment_avg(text_content):
    google = analyse_sentiment_google(text_content) * 100
    textblob = analyse_sentiment_textblob(text_content) * 100
    result = (google + textblob) / 2
    
    return round(result, 2)

def content_score(title, description, content):
    content = regex.sub(r"\….*", '', content)
    text = title + description + content
    return analyse_sentiment_avg(text)

def main():
    pass
    # response = requests.get('https://newsapi.org/v2/top-headlines?country=us&apiKey=f1db92c3cee347cf85bc56c4226da4ab')
    # top_article = response.json()['articles'][0]
    # print(top_article)
    # print(content_score(top_article['title'], top_article['description'], top_article['content']))

if __name__ == "__main__":
    main()
