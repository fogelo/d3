import { useEffect } from "react"
import "./App.css"
import axios from "axios"
import { setAppl } from "./store/dataReducer"
import LineChartContainer from "./components/LineChart/LineChartContainer"
import MultipleLineChartContainer from "./components/MultipleLineChart/MultipleLineChartContainer"


function App() {


  return (
    <div>
      <LineChartContainer />
      <MultipleLineChartContainer />
    </div>
  );
}

export default App;
