import "./App.css"
import LineChartContainer from "./components/LineChart/LineChartContainer"
import MultipleLineChartContainer from "./components/MultipleLineChart/MultipleLineChartContainer"
import LineChartTooltipContainer from "./components/LineChartTooltip/LineChartTooltipContainer" 


function App() {


  return (
    <div>
      <LineChartContainer />
      <LineChartTooltipContainer />
      <MultipleLineChartContainer />
    </div>
  );
}

export default App;
