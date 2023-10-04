import csv, json, re
from seleniumwire import webdriver
from seleniumwire.utils import decode
from selenium.webdriver.firefox.options import Options


class ScrapperWeb(object):
    def __init__(self):
        CUSTOM_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36"
        SEC_CH_UA = '"Google Chrome";v="112", " Not;A Brand";v="99", "Chromium";v="112"'
        REFERER = "https://google.com"

        def request_interceptor(request):
            del request.headers["user-agent"]
            del request.headers["sec-ch-ua"]
            request.headers["user-agent"] = CUSTOM_UA
            request.headers["sec-ch-ua"] = SEC_CH_UA
            request.headers["referer"] = REFERER

        self.options = Options()
        self.options.add_argument("-headless")
        self.driver = webdriver.Firefox(options=self.options)
        self.driver.request_interceptor = request_interceptor
        self.universities = []
        self.course_links = []
        self.courses = []

    def start(self, start_page=1, max_page=5):
        print("scraping started")
        self._scrape_university(start_page, max_page)
        self._scrape_course()

    def _scrape_university(self, start_page, max_page):
        api = "https://api-frontend.kemdikbud.go.id/v2/search_pt"

        for page_number in range(start_page, max_page + 1):
            page_url = f"https://pddikti.kemdikbud.go.id/search_pt/-/-/-/-/A/-/-/{page_number}/"

            self.driver.get(page_url)
            request = self.driver.wait_for_request(api, timeout=30)
            data = decode(
                request.response.body,
                request.response.headers.get("Content-Encoding", "identity"),
            )
            data = data.decode("utf8")
            data_json = json.loads(data)

            for entry in data_json["pt"]:
                university = {
                    "university_code": entry["npsn"].strip(),
                    "name": entry["nama"],
                    "abbreviation": entry["singkatan"],
                    "accreditation": entry["akreditas"],
                    "program_count": entry["jumlah_prodi"] or 0,
                    "website": entry["website"],
                    "phone": re.sub(r"[^\d]", "", entry["no_tel"] or ""),
                    "address1": re.sub(r"[\r\n\t]", "", entry["provinsi"] or ""),
                    "address2": re.sub(r"[\r\n\t]", "", entry["jln"] or ""),
                    "latitude": entry["lintang"],
                    "longitude": entry["bujur"],
                }
                self.universities.append(university)
                self.course_links.append(
                    (
                        entry["npsn"].strip(),
                        entry["id"],
                    )
                )

            self._write_university(
                self.universities,
                f"./data_cache/university/university{start_page}-{max_page}.csv",
            )

            del self.driver.requests

    def _scrape_course(self):
        for university_code, university_hash in self.course_links:
            course_data = []
            url = f"https://pddikti.kemdikbud.go.id/data_pt/{university_hash}"
            api = f"https://api-frontend.kemdikbud.go.id/v2/detail_pt_prodi/{university_hash}"

            self.driver.get(url)
            request = self.driver.wait_for_request(api, timeout=30)
            data = decode(
                request.response.body,
                request.response.headers.get("Content-Encoding", "identity"),
            )
            data = data.decode("utf8")
            data_json = json.loads(data)

            for entry in data_json:
                course = {
                    "course_code": entry["kode_prodi"],
                    "name": entry["nm_lemb"],
                    "status": entry["stat_prodi"],
                    "level": entry["jenjang"],
                    "accreditation": entry["akreditas"],
                }
                course_data.append(course)
            self.courses.append({university_code: course_data})

            self._write_course(
                course_data, f"./data_cache/course/{university_code}.csv"
            )

            del self.driver.requests

    def _write_university(self, input, output):
        headers = [
            "university_code",
            "name",
            "abbreviation",
            "accreditation",
            "program_count",
            "website",
            "phone",
            "address1",
            "address2",
            "latitude",
            "longitude",
        ]

        with open(output, "w", encoding="UTF-8", newline="") as file:
            writer = csv.DictWriter(file, fieldnames=headers)
            writer.writeheader()
            writer.writerows(input)

    def _write_course(self, input, output):
        headers = ["course_code", "name", "status", "level", "accreditation"]

        with open(output, "w", encoding="UTF-8", newline="") as file:
            writer = csv.DictWriter(file, fieldnames=headers)
            writer.writeheader()
            writer.writerows(input)

    def close(self):
        self.driver.close()
        self.driver.quit()
        print("connection closed")


if __name__ == "__main__":
    try:
        scrapper = ScrapperWeb()
        scrapper.start()
    finally:
        scrapper.close()
