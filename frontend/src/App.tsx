import axios from "axios";
import "./app.css";
import { useCallback, useMemo, useState } from "react";
import { FilterType, UniversityType } from "./Types";
import { FaXmark } from "react-icons/fa6";
import {
  FaSearch,
  FaBook,
  FaUniversity,
  FaMapMarkedAlt,
  FaEye,
  FaChevronRight,
  FaChevronLeft,
  FaSortAmountDown,
  FaSortAmountUpAlt,
} from "react-icons/fa";
import Map from "./Map";
import Badge from "./components/Badge";
import { addHttpsToURL } from "./utils";

type APISearchResponse = {
  name_match: number;
  address_match: number;
  course_match: number;
  universities: UniversityType[];
};

const testData: APISearchResponse = {
  name_match: 5,
  address_match: 2,
  course_match: 0,
  universities: [
    {
      id: 268,
      match_type: "name",
      code: "031072",
      name: "Universitas Indonesia Maju",
      abbreviation: "UIMA",
      accreditation: "B",
      program_count: 19,
      website: "www.uima.ac.id",
      phone: "02178894045",
      address:
        "Jl. Harapan No.50, RT.2/RW.7, Lenteng Agung, Kec. Jagakarsa, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12610, Indonesia",
      latitude: -6.3343444,
      longitude: 106.83788,
      province: "Jakarta",
      place_id: "ChIJMxqufMntaS4Rf1EBhmGqVIY",
    },
    {
      id: 269,
      match_type: "name",
      code: "041093",
      name: "Universitas Indonesia Membangun",
      abbreviation: "Universitas Inaba",
      accreditation: "B",
      program_count: 7,
      website: "www.inaba.ac.id",
      phone: "0227563919",
      address:
        "Jl. Soekarno Hatta No.448, Batununggal, Kec. Bandung Kidul, Kota Bandung, Jawa Barat 40266, Indonesia",
      latitude: -6.9499226,
      longitude: 107.622856,
      province: "West Java",
      place_id: "ChIJfUmgll_oaC4RuvUawaRSGJQ",
    },
    {
      id: 1724,
      match_type: "address",
      code: "095014",
      name: "Politeknik Indonesia",
      abbreviation: "POLINDO",
      accreditation: "",
      program_count: 5,
      website: "www.polindo.ac.id",
      phone: "",
      address:
        "Universitas Indonesia, Jl. Prof. DR. G.A. Siwabessy, Kukusan, Kecamatan Beji, Kota Depok, Jawa Barat 16425, Indonesia",
      latitude: -6.370776,
      longitude: 106.82367,
      province: "West Java",
      place_id: "ChIJ35u1qxzsaS4RKfN3Rk74tCg",
    },
    {
      id: 1854,
      match_type: "address",
      code: "005002",
      name: "Politeknik Negeri Jakarta",
      abbreviation: "PNJ",
      accreditation: "",
      program_count: 53,
      website: "www.pnj.ac.id",
      phone: "0217270036",
      address:
        "Kota Depok - Prov. Jawa Barat - Indonesia Kampus Baru Universitas Indonesia",
      latitude: -6.370776,
      longitude: 106.82367,
      province: "West Java",
      place_id: "ChIJ35u1qxzsaS4RKfN3Rk74tCg",
    },
    {
      id: 5187,
      match_type: "name",
      code: "001002",
      name: "Universitas Indonesia",
      abbreviation: "UI",
      accreditation: "Unggul",
      program_count: 293,
      website: "www.ui.ac.id",
      phone: "0217270020",
      address:
        "Kota Jakarta Pusat - Prov. D.K.I. Jakarta - Indonesia Jalan Salemba Raya 4 ",
      latitude: -6.360623,
      longitude: 106.82723,
      province: "West Java",
      place_id: "ChIJhYtOgBrsaS4RB-p8l-GAv9c",
    },
    {
      id: 5188,
      match_type: "name",
      code: "041095",
      name: "Universitas Indonesia Mandiri",
      abbreviation: "UIM",
      accreditation: "",
      program_count: 9,
      website: "uimandiri.ac.id",
      phone: "02189468034",
      address:
        "M2RM+J5C, Jl. Teratai Putih, RT.001/RW.006, Cimuning, Kec. Mustika Jaya, Kota Bks, Jawa Barat 17310, Indonesia",
      latitude: -6.3084483,
      longitude: 107.032906,
      province: "West Java",
      place_id: "ChIJ____m8GRaS4RRkhblfrxCEI",
    },
    {
      id: 5189,
      match_type: "name",
      code: "091034",
      name: "Universitas Indonesia Timur",
      abbreviation: "UIT",
      accreditation: "Baik Sekali",
      program_count: 22,
      website: "www.uit.ac.id",
      phone: "0411831555",
      address:
        "Kec. Rappocini - Kota Makassar - Prov. Sulawesi Selatan Jl Rappocini Raya No 171-173 ",
      latitude: -5.16969,
      longitude: 119.443054,
      province: "South Sulawesi",
      place_id: "ChIJYbx2kfLivi0RCibF6TwHLMQ",
    },
  ],
};

const emptyData: APISearchResponse = {
  name_match: 0,
  address_match: 0,
  course_match: 0,
  universities: [],
};

const testMode = true;

function App() {
  const [isListView, setIsListView] = useState(false);
  const [viewMode, setViewMode] = useState("default");
  const [showViewControl, setShowViewControl] = useState(false);
  const [isLanding, setIsLanding] = useState(true);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<APISearchResponse>(emptyData);
  const [filters, setFilters] = useState<FilterType>({
    name: true,
    address: true,
    course: true,
  });
  const [sortBy, setSortBy] = useState("name");
  const [reverseSort, setReverseSort] = useState(false);
  const [visibleAccreditation, setVisibleAccreditation] = useState({});
  const universities = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const visibleFilter = Object.keys(filters).filter((key) => filters[key]);
    const accreditation = Object.keys(visibleAccreditation).filter(
      (key) => visibleAccreditation[key]
    );
    return results.universities
      .filter((university) => visibleFilter.includes(university.match_type))
      .filter((university) =>
        isListView ? !accreditation.includes(university.accreditation) : true
      )
      .sort((a, b) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        return a[sortBy].localeCompare(b[sortBy]) * (reverseSort ? -1 : 1);
      });
  }, [
    filters,
    isListView,
    results.universities,
    reverseSort,
    sortBy,
    visibleAccreditation,
  ]);

  const toggleFilter = useCallback((filter: keyof FilterType) => {
    setFilters((prev) => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (testMode) {
        setIsLanding(false);
        setResults(testData);
        const keys = [
          ...new Set(
            testData.universities.map((university) => university.accreditation)
          ),
        ];
        const acc = keys.reduce((prev, curr) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          prev[curr] = false;
          return prev;
        }, {});
        setVisibleAccreditation(acc);
        return;
      }
      if (query.length < 1) return;
      setIsLanding(false);
      axios.get("/api/search/", { params: { q: query } }).then(async (res) => {
        setResults(res.data);
        const keys = [
          ...new Set(
            res.data.universities.map((university) => university.accreditation)
          ),
        ];
        const acc = keys.reduce((prev, curr) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          prev[curr] = false;
          return prev;
        }, {});
        setVisibleAccreditation(acc);
      });
    },
    [query]
  );

  const stopper = useCallback((event: React.MouseEvent<HTMLElement>) => {
    event?.stopPropagation();
  }, []);

  const renderTable = useMemo(() => {
    return universities.map((university, idx) => {
      return (
        <div className="list_item" key={idx}>
          <span className="list_item__header">
            <h2>{university.name}</h2>
            {university.abbreviation ? `(${university.abbreviation})` : ""}
            <span className="list_item__accreditation"></span>
          </span>
          <table>
            <tbody>
              <tr>
                <th>Accreditation</th>
                <td>{university.accreditation || "Not Accredited"}</td>
              </tr>
              <tr>
                <th>Address</th>
                <td>
                  <a
                    href={`https://www.google.com/maps/place/?q=place_id:${university.place_id}`}
                    target="_new"
                  >
                    {university.address || "-"}
                  </a>
                </td>
              </tr>
              <tr>
                <th>Website</th>
                <td>
                  {(university.website && (
                    <a href={addHttpsToURL(university.website)} target="_blank">
                      {university.website}
                    </a>
                  )) ||
                    "-"}
                </td>
              </tr>
              <tr>
                <th>Phone</th>
                <td>{university.phone || "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    });
  }, [universities]);

  const renderMap = useMemo(() => {
    const mapContainerStyle = isListView
      ? { width: "0", height: "100vh", transition: "width 0.5s ease-in-out" }
      : {
          width: "100%",
          height: "100vh",
          transition: "width 0.5s ease-in-out",
        };
    const map = (
      <Map
        universities={universities}
        onClick={() => {
          setShowViewControl(false);
        }}
        viewMode={viewMode}
        containerStyle={mapContainerStyle}
      />
    );
    return map;
  }, [universities, viewMode, isListView]);

  return (
    <>
      <main className="main">
        {isLanding && <div className="overlay" onClick={stopper}></div>}
        <div
          className={`float_wrapper ${
            isLanding ? "float_wrapper-centered" : ""
          } ${isListView ? "float_wrapper-list_view" : ""}`}
        >
          <>
            <h1 className={`search__title ${isLanding ? "" : "isHidden"}`}>
              Explore <span>Universities</span> In Indonesia
            </h1>
            <h3 className={`search__subtitle ${isLanding ? "" : "isHidden"}`}>
              Enter a <span>name, location, or study program</span> to begin
            </h3>
          </>
          <div className="float_wrapper-top">
            {!isLanding && (
              <div
                className={`navigation navigation-left ${
                  !isListView ? "isInvisible" : ""
                } ${isListView ? "noShadow" : ""}`}
                onClick={() => setIsListView(false)}
              >
                <FaChevronLeft size={"1rem"} strokeWidth={"3"} />
              </div>
            )}
            <form
              className={`search ${isLanding ? "" : "search-top"} ${
                isListView ? "noShadow" : ""
              }`}
              onSubmit={handleSubmit}
              method="GET"
            >
              <input
                type="text"
                name="query"
                id="query"
                onChange={handleInputChange}
                className="search__input"
                value={query}
                autoFocus
                // minLength={3}
              />
              {query.length > 0 && (
                <span
                  className="search__reset"
                  onClick={() => {
                    setQuery("");
                    setResults({
                      name_match: 0,
                      address_match: 0,
                      course_match: 0,
                      universities: [],
                    });
                  }}
                >
                  <FaXmark size={"1.3rem"} strokeWidth={"3"} />
                </span>
              )}
              <span className="search__separator"></span>
              <button type="submit" className="search__button">
                <FaSearch size={"1.3rem"} strokeWidth={"3"} />
              </button>
            </form>
            {!isLanding && (
              <div
                className={`navigation navigation-right ${
                  isListView ? "isInvisible" : ""
                } ${isListView ? "noShadow" : ""}`}
                onClick={() => setIsListView(true)}
              >
                <FaChevronRight size={"1rem"} strokeWidth={"3"} />
              </div>
            )}
          </div>
          {/* filter control */}
          {!isLanding && !isListView && (
            <div className="search__controls">
              <Badge
                isActive={filters.name}
                content={
                  <>
                    {results.name_match} universities{" "}
                    <FaUniversity size={"1.2rem"} strokeWidth={"2"} />
                  </>
                }
                popup_content={
                  filters.name
                    ? "click to hide name matches"
                    : "click to show name matches"
                }
                onClick={() => toggleFilter("name")}
              />
              <Badge
                isActive={filters.address}
                content={
                  <>
                    {results.address_match} addresses
                    <FaMapMarkedAlt size={"1.2rem"} strokeWidth={"2"} />
                  </>
                }
                popup_content={
                  filters.address
                    ? "click to hide address matches"
                    : "click to show address matches"
                }
                onClick={() => toggleFilter("address")}
              />
              <Badge
                isActive={filters.course}
                content={
                  <>
                    {results.course_match} courses{" "}
                    <FaBook size={"1.2rem"} strokeWidth={"2"} />
                  </>
                }
                popup_content={
                  filters.course
                    ? "click to hide course matches"
                    : "click to show course matches"
                }
                onClick={() => toggleFilter("course")}
              />
            </div>
          )}
          {/* layer control */}
          {!isLanding && !isListView && (
            <div className="layer_control">
              <div
                className={`layer_control__current ${
                  viewMode != "count"
                    ? "layer_control__bg-default"
                    : "layer_control__bg-count"
                }`}
                onClick={() => {
                  setShowViewControl((prev) => !prev);
                }}
              >
                <span>
                  <FaEye />
                  {viewMode != "count" ? "default" : "count"}
                </span>
              </div>
              {showViewControl && (
                <div
                  className={`layer_control__other ${
                    viewMode == "count"
                      ? "layer_control__bg-default"
                      : "layer_control__bg-count"
                  }`}
                  onClick={() => {
                    setShowViewControl(false);
                    setViewMode((prev) =>
                      prev == "count" ? "default" : "count"
                    );
                  }}
                >
                  <span>
                    <FaEye />
                    {viewMode == "count" ? "default" : "count"}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
        {renderMap}
        <div
          className={`list_view ${
            isListView ? "list_view-maximized" : "list_view-minimized"
          }`}
        >
          <div className="list_view__header" />
          <div className="list_view__main">
            <div className="list_view__toolbar">
              <div className="list_view__toolbar_group">
                <h4>Include matching:</h4>
                <label
                  htmlFor="match_name"
                  className="list_view__checkbox_label"
                >
                  <input
                    type="checkbox"
                    name="match_name"
                    id="match_name"
                    onChange={() => toggleFilter("name")}
                    className="list_view__checkbox"
                    checked={filters.name}
                  />
                  <span>Name ({results.name_match})</span>
                </label>
                <label
                  htmlFor="match_address"
                  className="list_view__checkbox_label"
                >
                  <input
                    type="checkbox"
                    name="match_address"
                    id="match_address"
                    onChange={() => toggleFilter("address")}
                    className="list_view__checkbox"
                    checked={filters.address}
                  />
                  <span>Address ({results.address_match})</span>
                </label>
                <label
                  htmlFor="match_course"
                  className="list_view__checkbox_label"
                >
                  <input
                    type="checkbox"
                    name="match_course"
                    id="match_course"
                    onChange={() => toggleFilter("course")}
                    className="list_view__checkbox"
                    checked={filters.course}
                  />
                  <span>Course ({results.course_match})</span>
                </label>
              </div>
              <div className="list_view__toolbar_group">
                <h4>Sort by:</h4>
                <div className="list_view__sort_group">
                  <select
                    name="sort"
                    id="sort"
                    onChange={(e) => {
                      setSortBy(e.target.value);
                    }}
                    defaultValue={"name"}
                  >
                    <option value="name">Name</option>
                    <option value="accreditation">Accreditation</option>
                  </select>
                  <span
                    className="list_view__sort_reverse"
                    onClick={() => setReverseSort((prev) => !prev)}
                  >
                    {reverseSort ? <FaSortAmountUpAlt /> : <FaSortAmountDown />}
                  </span>
                </div>
              </div>
              <div className="list_view__toolbar_group">
                <h4>Hide accreditation:</h4>
                {Object.keys(visibleAccreditation).map((accreditation, idx) => {
                  return (
                    <label
                      htmlFor={`acc_${accreditation}`}
                      className="list_view__checkbox_label"
                      key={"acc" + idx}
                    >
                      <input
                        type="checkbox"
                        name={`acc_${accreditation}`}
                        id={`acc_${accreditation}`}
                        onChange={() =>
                          setVisibleAccreditation((prev) => ({
                            ...prev,
                            [accreditation]: !prev[accreditation],
                          }))
                        }
                        className="list_view__checkbox"
                        checked={visibleAccreditation[accreditation]}
                      />
                      <span>{accreditation || "Not Accredited"}</span>
                    </label>
                  );
                })}
              </div>
            </div>
            <div className="list_view__list">{renderTable}</div>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
