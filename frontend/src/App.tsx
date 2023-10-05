import axios from "axios";
import './App.css'
import { useState } from "react";

function App() {
  const [query, setQuery] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axios
    .get("/api/search/", {params: {q: query}})
    .then((res) => console.log(res))
  }

  return (
    <form onSubmit={handleSubmit} method="POST">
      <input type="text" name="query" id="query" onChange={handleInputChange} />
      <button type="submit">search</button>
    </form>
  )
}

export default App
