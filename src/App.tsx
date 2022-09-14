import { useEffect } from "react";
import "./App.css";
import { fetchDataset } from "./lib/dataset";

function App() {
  useEffect(() => {
    (async () => {
      console.log(await fetchDataset(false));
      console.log(await fetchDataset(true));
    })();
  }, []);

  return <></>;
}

export default App;
