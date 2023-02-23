import { useEffect } from "react";
import "./App.css";
import LineChart from "./components/LineChart";
import aapl from "./data/aapl.json";
import axios from "axios"
import { setAppl } from "./store/dataReducer";
import { useDispatch } from "react-redux";

const x = (d) => d.date;
const y = (d) => d.close;
function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    axios.get("https://gist.githubusercontent.com/fogelo/74896d030000ccef733c109ee8e08dc6/raw/3042d0ef75c028680ef438fb595dceb05b47b32e/appl.json")
    .then(res => {
      dispatch(setAppl({ appl: res.data }))
    })
    setInterval(() => {
      axios.get("https://gist.githubusercontent.com/fogelo/74896d030000ccef733c109ee8e08dc6/raw/3042d0ef75c028680ef438fb595dceb05b47b32e/appl.json")
        .then(res => {
          dispatch(setAppl({ appl: res.data }))
        })
    }, 5000)
  }, [])
  return (
    <div>
      <LineChart data={aapl} x={x} y={y} />
    </div>
  );
}

export default App;
