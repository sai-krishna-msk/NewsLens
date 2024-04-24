import datetime
import math
import json

import pandas as pd

import requests
from newsplease import NewsPlease


def read_config(path='config/config.json'):
    
    params = None
    with open(path) as f:
        try:
            params = json.load(f)
        except Exception as e:
            print('Error reading config: ', e)
            
    if not ('api_key' in params and 'topics' in params and 'domains' in params and 'pageSize' in params and 'page_limit' in params):
        params = None
    
    return params



def request_top_articles(api_key, q, domains='', page=1, pageSize=20):
    
    params = {
    'apiKey': api_key,
    'q' : q,
    'domains' : domains,
    'pageSize': pageSize,
    'language': 'en',
    'sortBy' : 'publishedAt',
    'page' : page
}
    

    url = 'https://newsapi.org/v2/everything?'
    response = None

    try:
        response = requests.get(url, params)
    except Exception as e:
        print("Error making API request: ", e)
        return None
    

    if response.status_code == 200:
        return response.json()
    else:
        print("No data retrieved")
        return None
    if 'articles' not in response.json():
        print("Data not retrieved")
        return None
    elif response.json()['articles'] == []:
        print("No Articles found")
        return None
    


def scrape_all_articles(df, articles_list):
    
    if articles_list['articles'] is None:
        return df
    

    for data in articles_list['articles']:


        scraped  = 0
        try:
            article = NewsPlease.from_url(data['url'], timeout=20)
        except Exception as e:
            print("News article could not be scraped: ", e)
            scraped = -1
        

        if (scraped == 0) and (article != {}):
            if (article.maintext is None) or (len(str(article.maintext)) > 7000) or (len(article.maintext.strip()) == 0):
                continue
            
            line = [data['source']['name'], data['author'], data['title'], data['description'], article.maintext, data['url'], data["urlToImage"], data['publishedAt'], datetime.datetime.now()]
            new = pd.DataFrame(columns=df.columns, data=[line])
            df = pd.concat([df, new], axis=0, ignore_index=True)
            print("article " + data['url'] + " added.")
    
    return df
    
    

def get_and_scrape_all_pages(q, params):
    
    api_key = params['api_key']
    domains = ','.join(params['domains'])
    pageSize = params['pageSize']
    page_limit = params['page_limit']
    

    df = pd.DataFrame(columns=['media_source','author','headline','description','content','url','image_url', 'publish_date', 'current_date'])
    

    articles_list = request_top_articles(api_key, q, domains, 1, pageSize)
    

    if articles_list is None:
        print('No results')
        return df
    else: 
        total_articles = articles_list['totalResults']
        final_page = math.ceil(total_articles/pageSize)
    if final_page < page_limit:
        page_limit = final_page
    

    df = scrape_all_articles(df, articles_list)
    
  
    for i in range(1, page_limit):

        articles_list = request_top_articles(api_key, q, domains, i+1, pageSize)
        
      
        df = scrape_all_articles(df, articles_list)
        
    return df
  

def scrape_combine_articles(q_list, params):
    

    df = pd.DataFrame()
    for q in q_list:
        df = pd.concat([df, get_and_scrape_all_pages(q, params)])
        

    df = df[df['content'].notna()]
    df = df[df['headline'].notna()]
    df = df[df['description'].notna()]
    

    existing_df = pd.read_csv('merged_data.csv')   
    df = pd.concat([df, existing_df])
    

    df.drop_duplicates(subset=['content'], keep=False, inplace=True)
    

    def clean_text(text):
        return "".join(s for s in text if ord(s)<128)
    df['content'] = df['content'].apply(clean_text)
    df['headline'] = df['headline'].apply(clean_text)
    df['description'] = df['description'].apply(clean_text)
    
    df = df.sort_values(by=['publish_date'], ascending=False)
    
    return df
    

if __name__ == "__main__":
    

    params = read_config()
  
    if params is not None:
        df = scrape_combine_articles(params['topics'], params)
        
        print('Data Retrieved Succesfully!')
        

        df.to_csv('merged_data.csv')
        
        print('Data saved to csv')
        
    else:
        print('Incorrect Config file')
        
           
    
    









