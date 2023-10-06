import axios from "axios";
import "./App.css";
import { useState } from "react";
import { Card } from "./components/Card";

export interface University {
  id: number;
  code: string;
  name: string;
  abbreviation: string;
  accreditation: string;
  program_count: number;
  website: string;
  phone: string;
  address1: string;
  address2: string;
  latitude: number;
  longitude: number;
}

function App() {
  const [result, setResult] = useState<University[]>([]);
  const [query, setQuery] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axios
      .get("/api/search/", { params: { q: query } })
      .then((res) => setResult(res.data));
  };

  return (
    <div className="main">
      <div className="main__search">
        <form onSubmit={handleSubmit} method="POST">
          <input
            type="text"
            name="query"
            id="query"
            onChange={handleInputChange}
          />
          <button type="submit">search</button>
        </form>
      </div>
      <div className="result">
        <div className="result__header">
          <span>grid view</span>
          <span>map view</span>
        </div>
        <div className="result__result">
          {result.map((datum) =>
            Card({ university: datum, className: "result__card" })
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
