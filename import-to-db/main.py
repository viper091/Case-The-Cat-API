
import json
import traceback
import requests


def get_database():

    from pymongo import MongoClient
    try:
        # Python 3.x
        from urllib.parse import quote_plus
    except ImportError:
        # Python 2.x
        from urllib import quote_plus

    uri = "mongodb://%s:%s@%s" % (
        quote_plus("root"), quote_plus("example"), "mongo")
    client = MongoClient(uri)

    return client['animals']
    

def get_three_images(breed_id):
    urls = []
    data = requests.get(f"https://api.thecatapi.com/v1/images/search?limit=3&breed_id={breed_id}")
    if data:
        data = data.json()
        i = 0
        for d in data:
            # print(json.dumps(d))
            url = ""
            if d['url']:
                url = d['url']
            urls.append(url)
    return urls

def load_cats(dbname):
    cats = dbname["cats"]

    if cats.count_documents({}) >= 65:
        print ( "load_cats already done ")
        return 
    breeds_data = requests.get("https://api.thecatapi.com/v1/breeds")
    if breeds_data:
        data = breeds_data.json()
        db_data = []
        for b in data:
            try:
                desc = b['description']
                name = b['name']
                origin = b['origin']
                id = b['id']
                temperament = b['temperament']
                imgs = get_three_images(id)
                # print(imgs)
                
                db_data.append(
                    {"name": name,"desc": desc,"origin": origin,"imgs":imgs,"temperament":temperament}
                )
            except  Exception:
                print(json.dumps(b))
                traceback.print_exc()
                exit(0)

        cats.insert_many(db_data)

        print(f"loaded { len(db_data)}")
    else:
        print("failed to get cats api")

def load_with_hat(dbname):
    hat = dbname["hat"]
    if hat.count_documents({}) >= 3:
        print ( "load_with_hat already done ")
        return 
    data = requests.get("https://api.thecatapi.com/v1/images/search?category_ids=1&limit=3")
    urls = []
    if data:
        data = data.json()    

        for d in data:
            # print(json.dumps(d))
            url = ""
            if d['url']:
                url = d['url']
            urls.append({"img":url})
        hat.insert_many (urls)     

def load_with_sunglasses(dbname):
    sunglasses = dbname["sunglasses"]
    if sunglasses.count_documents({}) >= 3:
        print ( "load_with_sunglasses already done ")
        return 
    data = requests.get("https://api.thecatapi.com/v1/images/search?category_ids=1&limit=4")
    urls = []
    if data:
        data = data.json()    

        for d in data:
            # print(json.dumps(d))
            url = ""
            if d['url']:
                url = d['url']
            urls.append({"img":url})

        sunglasses.insert_many (urls)     
        

if __name__ == "__main__":    
    
    # Get the database'
    dbname = get_database()
    load_cats(dbname)
    load_with_hat(dbname)
    load_with_sunglasses(dbname)