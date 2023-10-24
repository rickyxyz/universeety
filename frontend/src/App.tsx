import axios from "axios";
import "./app.css";
import { useCallback, useMemo, useState } from "react";
import { AccreditationFilter, FilterType, UniversityType } from "./Types";
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
import Map from "./components/Map";
import Badge from "./components/Badge";
import { addHttpsToURL } from "./utils";

type APISearchResponse = {
  name_match: number;
  address_match: number;
  course_match: number;
  universities: UniversityType[];
};

const emptyData: APISearchResponse = {
  name_match: 0,
  address_match: 0,
  course_match: 0,
  universities: [],
};

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
  const [visibleAccreditation, setVisibleAccreditation] =
    useState<AccreditationFilter>({});
  const universities = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const visibleFilter = Object.keys(filters).filter((key) => filters[key]);
    const accreditation = Object.keys(visibleAccreditation).filter(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
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
      if (query.length < 1) return;
      setIsLanding(false);
      axios.get("/api/search/", { params: { q: query } }).then(async (res) => {
        setResults(res.data);
        const keys = [
          ...new Set(
            res.data.universities.map(
              (university: UniversityType) => university.accreditation
            )
          ),
        ];
        const acc = keys.reduce((prev, curr) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          prev[curr] = false;
          return prev;
        }, {}) as AccreditationFilter;
        setVisibleAccreditation(acc);
      });
    },
    [query]
  );

  const renderSearchBar = useMemo(
    () => (
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
            minLength={3}
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
    ),
    [handleSubmit, isLanding, isListView, query]
  );

  const stopper = useCallback((event: React.MouseEvent<HTMLElement>) => {
    event?.stopPropagation();
  }, []);

  const renderTable = useMemo(
    () => (
      <div className="list_view__list">
        {universities.map((university, idx) => (
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
                      <a
                        href={addHttpsToURL(university.website)}
                        target="_blank"
                      >
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
        ))}
      </div>
    ),
    [universities]
  );

  const renderList = useMemo(
    () => (
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
              <label htmlFor="match_name" className="list_view__checkbox_label">
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
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          //@ts-ignore
                          [accreditation]: !prev[accreditation],
                        }))
                      }
                      className="list_view__checkbox"
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      //@ts-ignore
                      checked={visibleAccreditation[accreditation]}
                    />
                    <span>{accreditation || "Not Accredited"}</span>
                  </label>
                );
              })}
            </div>
          </div>
          {renderTable}
        </div>
      </div>
    ),
    [
      filters.address,
      filters.course,
      filters.name,
      isListView,
      renderTable,
      results.address_match,
      results.course_match,
      results.name_match,
      reverseSort,
      toggleFilter,
      visibleAccreditation,
    ]
  );

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

  const renderMapControls = useMemo(() => {
    return (
      <>
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
                setViewMode((prev) => (prev == "count" ? "default" : "count"));
              }}
            >
              <span>
                <FaEye />
                {viewMode == "count" ? "default" : "count"}
              </span>
            </div>
          )}
        </div>
      </>
    );
  }, [
    filters.address,
    filters.course,
    filters.name,
    results.address_match,
    results.course_match,
    results.name_match,
    showViewControl,
    toggleFilter,
    viewMode,
  ]);

  return (
    <>
      <main className="main">
        {isLanding && <div className="overlay" onClick={stopper} />}

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
          {renderSearchBar}
          {!isLanding && !isListView && renderMapControls}
        </div>
        {renderMap}
        {renderList}
      </main>
    </>
  );
}

export default App;
