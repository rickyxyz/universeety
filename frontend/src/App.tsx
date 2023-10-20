import axios from "axios";
import "./app.css";
import { useCallback, useState } from "react";
import { FilterType, UniversityType } from "./Types";
import { FaXmark } from "react-icons/fa6";
import {
  FaSearch,
  FaBook,
  FaUniversity,
  FaMapMarkedAlt,
  FaEye,
} from "react-icons/fa";
import Map from "./Map";
import Badge from "./components/Badge";

type APISearchResponse = {
  name_match: number;
  address_match: number;
  course_match: number;
  universities: UniversityType[];
};

function App() {
  const [viewMode, setViewMode] = useState<string>("default");
  const [showViewControl, setShowViewControl] = useState<boolean>(false);
  const [isLanding, setIsLanding] = useState<boolean>(true);
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<APISearchResponse>({
    name_match: 0,
    address_match: 0,
    course_match: 0,
    universities: [],
  });
  const [filterShow, setFilterShow] = useState<FilterType>({
    name: true,
    address: true,
    course: true,
  });

  const toggleFilter = useCallback((filter: keyof FilterType) => {
    setFilterShow((prev) => ({
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
      });
    },
    [query]
  );

  const stopper = useCallback((event: React.MouseEvent<HTMLElement>) => {
    event?.stopPropagation();
  }, []);

  return (
    <div className="main">
      {isLanding && <div className="overlay" onClick={stopper}></div>}
      <div
        className={`float_wrapper ${isLanding ? "float_wrapper-centered" : ""}`}
      >
        <h1 className={`search__title ${isLanding ? "" : "isHidden"}`}>
          Explore <span>Universities</span> In Indonesia
        </h1>
        <h3 className={`search__subtitle ${isLanding ? "" : "isHidden"}`}>
          Enter a <span>name, location, or study program</span> to begin
        </h3>
        <form
          className={`search ${isLanding ? "" : "search-top"}`}
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
          <div className="search__controls">
            <Badge
              isActive={filterShow.name}
              content={
                <>
                  {results.name_match} universities{" "}
                  <FaUniversity size={"1.2rem"} strokeWidth={"2"} />
                </>
              }
              popup_content={
                filterShow.name ? "click to hide name" : "click to show name"
              }
              onClick={() => toggleFilter("name")}
            />
            <Badge
              isActive={filterShow.address}
              content={
                <>
                  {results.address_match} addresses
                  <FaMapMarkedAlt size={"1.2rem"} strokeWidth={"2"} />
                </>
              }
              popup_content={
                filterShow.address
                  ? "click to hide address"
                  : "click to show address"
              }
              onClick={() => toggleFilter("address")}
            />
            <Badge
              isActive={filterShow.course}
              content={
                <>
                  {results.course_match} courses{" "}
                  <FaBook size={"1.2rem"} strokeWidth={"2"} />
                </>
              }
              popup_content={
                filterShow.course
                  ? "click to hide course"
                  : "click to show course"
              }
              onClick={() => toggleFilter("course")}
            />
          </div>
        )}
        {!isLanding && (
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
      <Map
        universities={results.universities}
        filters={filterShow}
        onClick={() => {
          setShowViewControl(false);
        }}
        viewMode={viewMode}
      />
    </div>
  );
}

export default App;
