import {
  Route,
  Routes,
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Result } from "./pages/Result";
import "./app.css";
import "./pages/result.css";
import { University } from "./pages/University";
import { useState } from "react";

function App() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState<string>(searchParams.get("q") || "");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(
      {
        pathname: "/",
        search: createSearchParams({
          q: query,
        }).toString(),
      },
      { replace: true }
    );
  };

  return (
    <div className="wrapper">
      <header>
        <button onClick={() => navigate(-1)}>back button</button>Header
      </header>
      <div className="main">
        <div className="main__search">
          <form onSubmit={handleSubmit} method="POST">
            <input
              type="text"
              name="query"
              id="query"
              onChange={handleInputChange}
              defaultValue={searchParams.get("q") || ""}
            />
            <button type="submit">search</button>
          </form>
        </div>
        <Routes>
          <Route path="/" element={<Result />} />
          <Route path="/u/:code" element={<University />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
