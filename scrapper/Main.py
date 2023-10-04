from Scrapper import ScrapperWeb
from Pipelines import PostgresPipeline

if __name__ == "__main__":
    try:
        pipe = PostgresPipeline()
        scrapper = ScrapperWeb()
        scrapper.start()
        pipe.store_data()
    finally:
        scrapper.close()
        pipe.close()
