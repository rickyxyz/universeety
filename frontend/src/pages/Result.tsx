import axios from "axios";
import "./result.css";
import { useEffect, useMemo, useState } from "react";
import { Card } from "../components/Card";
import { UniversityType } from "../Types";
import { useSearchParams } from "react-router-dom";

export function Result() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [result, setResult] = useState<UniversityType[]>([]);
  useEffect(() => {
    if (query)
      axios.get("/api/search/", { params: { q: query } }).then(async (res) => {
        setResult(res.data);
      });
  }, [query]);

  const renderResult = useMemo(() => {
    if (!result) {
      return <div>Loading</div>;
    }
    if (result.length < 1) {
      return <div>No Result Found</div>;
    }
    return (
      <div className="result__result">
        {result.map((datum, index) => (
          <Card key={index} university={datum} className="result__card" />
        ))}
      </div>
    );
  }, [result]);

  return (
    <div className="result">
      <div className="result__header">
        <span>grid view</span>
        <span>map view</span>
      </div>
      {renderResult}
    </div>
  );
}
