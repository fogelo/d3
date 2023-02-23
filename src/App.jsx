import "./App.css";
import LineChart from "./components/LineChart";
import aapl from "./data/aapl.json";

const x = (d) => d.date;
const y = (d) => d.close;
function App() {
  return (
    <div>
      <LineChart data={aapl} x={x} y={y} />
    </div>
  );
}

export default App;
