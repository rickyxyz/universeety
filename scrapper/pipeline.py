import csv, os
import psycopg2
import googlemaps

POSTGRES_HOST = os.getenv("POSTGRES_HOST") or "localhost"
POSTGRES_USER = os.getenv("POSTGRES_USER") or "root"
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD") or "root"
POSTGRES_DB = os.getenv("POSTGRES_DB") or "test_db"
GMAPS_KEY = os.getenv("GMAPS_KEY")


class PostgresPipeline(object):
    def __init__(self):
        self.connection = psycopg2.connect(
            host=POSTGRES_HOST,
            user=POSTGRES_USER,
            password=POSTGRES_PASSWORD,
            database=POSTGRES_DB,
            port="5432",
        )
        self.curr = self.connection.cursor()
        self.gmaps = googlemaps.Client(key=GMAPS_KEY)

    def store_data(self):
        print("storing data")
        self._build_tables()
        self._store_university()
        self._store_course()
        print("data stored")

    def _build_tables(self):
        self.curr.execute(
            """
                DROP TABLE IF EXISTS university_course, university, course;
            """
        )
        self.curr.execute(
            """
                CREATE TABLE IF NOT EXISTS university(
                    id SERIAL NOT NULL PRIMARY KEY,
                    code VARCHAR(255) UNIQUE NOT NULL,
                    name VARCHAR(255) NOT NULL,
                    abbreviation VARCHAR(255) NOT NULL,
                    accreditation VARCHAR(255) NOT NULL,
                    program_count INTEGER NOT NULL,
                    website VARCHAR(255) NOT NULL,
                    phone VARCHAR(255) NOT NULL,
                    address VARCHAR(600) NOT NULL,
                    latitude FLOAT4,
                    longitude FLOAT4,
                    province VARCHAR(255) NOT NULL,
                    place_id VARCHAR(255) NOT NULL
                );
            """
        )
        self.curr.execute(
            """
                CREATE TABLE IF NOT EXISTS course(
                    id SERIAL NOT NULL PRIMARY KEY,
                    code VARCHAR(255) UNIQUE NOT NULL,
                    name VARCHAR(255) NOT NULL,
                    level VARCHAR(255) NOT NULL
                );
            """
        )
        self.curr.execute(
            """
                CREATE TABLE IF NOT EXISTS public.university_course
                (
                    id serial,
                    course_code character varying,
                    university_code character varying,
                    status character varying,
                    accreditation character varying,
                    PRIMARY KEY (id),
                    UNIQUE (university_code, course_code),
                    FOREIGN KEY (university_code)
                        REFERENCES public.university (code) MATCH SIMPLE
                        ON UPDATE CASCADE
                        ON DELETE CASCADE
                        NOT VALID,
                    FOREIGN KEY (course_code)
                        REFERENCES public.course (code) MATCH SIMPLE
                        ON UPDATE CASCADE
                        ON DELETE CASCADE
                        NOT VALID
                );

                ALTER TABLE IF EXISTS public.university_course
                    OWNER to root;
            """
        )
        self.connection.commit()

    def _store_university(self):
        insert_query = f"""
            INSERT INTO university(
            code,
            name,
            abbreviation,
            accreditation,
            program_count,
            website,
            phone,
            address,
            latitude,
            longitude,
            province,
            place_id
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT DO NOTHING;
        """

        universities = []
        with open("./data_cache/transformed_university.csv") as file:
            csv_data = csv.DictReader(file)
            for row in csv_data:
                universities.append(
                    (
                        row.get("university_code", ""),
                        row.get("name", ""),
                        row.get("abbreviation", ""),
                        row.get("accreditation", ""),
                        row.get("program_count", 0),
                        row.get("website", 0),
                        row.get("phone", ""),
                        row.get("address", ""),
                        row.get("latitude", None),
                        row.get("longitude", None),
                        row.get("province", ""),
                        row.get("place_id", ""),
                    )
                )

        self.curr.executemany(insert_query, universities)
        self.connection.commit()

    def _store_course(self):
        courses = []
        university_course = []

        insert_query_course = f"""
            INSERT INTO course(
                code,
                name,
                level
            )
            VALUES (%s, %s, %s)
            ON CONFLICT DO NOTHING;
        """

        insert_query_university_course = f"""
            INSERT INTO university_course(
                university_code,
                course_code,
                accreditation,
                status
            )
            VALUES (%s, %s, %s, %s)
            ON CONFLICT DO NOTHING;
        """

        for source in os.listdir("./data_cache/course"):
            with open(f"./data_cache/course/{source}") as file:
                csv_data = csv.DictReader(file)
                for row in csv_data:
                    courses.append(
                        (
                            row["course_code"] or "",
                            row["name"] or "",
                            row["level"] or "",
                        )
                    )
                    university_course.append(
                        (
                            source[:-4],
                            row["course_code"] or "",
                            row["accreditation"] or "",
                            row["status"] or "",
                        )
                    )

        self.curr.executemany(insert_query_course, courses)
        self.curr.executemany(insert_query_university_course, university_course)
        self.connection.commit()

    def close(self):
        self.curr.close()
        self.connection.close()


if __name__ == "__main__":
    pipe = PostgresPipeline()
    pipe.store_data()
    pipe.close()
