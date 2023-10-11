import axios from "axios";
import "./app.css";
import { useCallback, useState } from "react";
import { UniversityType } from "./Types";
import { Search, X, HelpCircle } from "react-feather";
import Map from "./Map";
import Badge from "./components/Badge";

function App() {
  const [isLanding, setIsLanding] = useState<boolean>(true);
  const [query, setQuery] = useState<string>("");
  const [result, setResult] = useState<UniversityType[]>([]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsLanding(false);
      axios.get("/api/search/", { params: { q: query } }).then(async (res) => {
        setResult(res.data);
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
          />
          {query.length > 0 && (
            <span className="search__reset" onClick={() => setQuery("")}>
              <X size={"1.3rem"} strokeWidth={"3"} />
            </span>
          )}
          <span className="search__separator"></span>
          <button type="submit" className="search__button">
            <Search size={"1.3rem"} strokeWidth={"3"} />
          </button>
        </form>
        {!isLanding && (
          <div className="search__controls">
            <Badge
              content={
                <>
                  {result.length} result found{" "}
                  <HelpCircle size={"1.3rem"} strokeWidth={"2"} />
                </>
              }
              popup_content={
                <ul>
                  <li>{result.length} university found</li>
                  <li>{result.length} course found</li>
                  <li>{result.length} location found</li>
                </ul>
              }
            />
          </div>
        )}
      </div>
      <Map universities={result} />
    </div>
  );
}

export default App;
