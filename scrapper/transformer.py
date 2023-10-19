import csv, os
import googlemaps


GMAPS_KEY = os.getenv("GMAPS_KEY")


class Transformer(object):
    def __init__(self):
        self.gmaps = googlemaps.Client(key=GMAPS_KEY)

    def transform_data(self):
        print("transforming data")
        self._store_university()
        print("transformed data stored")

    def _get_data_from_google(self, name, address1, address2):
        latitude = 0
        longitude = 0
        province = None
        address = f"{address1} {address2}"
        try:
            places = self.gmaps.find_place(name, "textquery")
            if places["status"] == "OK":
                place_id = places["candidates"][0]["place_id"]
                geocode_result = self.gmaps.reverse_geocode(place_id)
            else:
                geocode_result = self.gmaps.geocode(name) + self.gmaps.geocode(address)

            if not address1 or not address2:
                address = geocode_result[0]["formatted_address"]
            latitude = geocode_result[0]["geometry"]["location"]["lat"]
            longitude = geocode_result[0]["geometry"]["location"]["lng"]
            place_id = geocode_result[0]["place_id"]

            for component in geocode_result[0]["address_components"]:
                if "administrative_area_level_1" in component["types"]:
                    province = component["long_name"]

            return (place_id, province, latitude, longitude, address)
        except Exception as e:
            print(e)
            print(name)
            return (None, None, 0, 0, "")

    def _store_university(self):
        universities = []
        for source in os.listdir("./data_cache/university"):
            with open(f"./data_cache/university/{source}") as input:
                print(f"reading {source}")
                csv_data = csv.DictReader(input)
                for row in csv_data:
                    (
                        place_id,
                        province,
                        latitude,
                        longitude,
                        address,
                    ) = self._get_data_from_google(
                        row["name"], row["address1"], row["address2"]
                    )
                    universities.append(
                        {
                            "university_code": row["university_code"] or "",
                            "name": row["name"] or "",
                            "abbreviation": row["abbreviation"] or "",
                            "accreditation": row["accreditation"] or "",
                            "program_count": row["program_count"],
                            "website": row["website"] or "",
                            "phone": row["phone"] or "",
                            "address": address,
                            "latitude": latitude,
                            "longitude": longitude,
                            "province": province,
                            "place_id": place_id,
                        }
                    )

        with open(
            "data_cache/transformed_university.csv",
            "w",
            encoding="UTF-8",
            newline="",
        ) as output:
            headers = [
                "university_code",
                "name",
                "abbreviation",
                "accreditation",
                "program_count",
                "website",
                "phone",
                "address",
                "latitude",
                "longitude",
                "province",
                "place_id",
            ]
            writer = csv.DictWriter(output, fieldnames=headers)
            writer.writeheader()
            writer.writerows(universities)


if __name__ == "__main__":
    transformer = Transformer()
    transformer.transform_data()
