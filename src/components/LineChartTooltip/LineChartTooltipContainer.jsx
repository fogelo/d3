import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAppl } from "../../store/dataReducer";
import LineChartTooltip from "./LineChartTooltip";

const x = (d) => d.date
const y = (d) => d.close
const LineChartTooltipContainer = () => {
  const dispatch = useDispatch()
  const data = useSelector(state => state.data.appl)

  useEffect(() => {
    axios
      .get(
        "https://gist.githubusercontent.com/fogelo/74896d030000ccef733c109ee8e08dc6/raw/3042d0ef75c028680ef438fb595dceb05b47b32e/appl.json"
      )
      .then((res) => {
        dispatch(setAppl({ appl: res.data }));
      });
    setInterval(() => {
      axios
        .get(
          "https://gist.githubusercontent.com/fogelo/74896d030000ccef733c109ee8e08dc6/raw/3042d0ef75c028680ef438fb595dceb05b47b32e/appl.json"
        )
        .then((res) => {
          dispatch(setAppl({ appl: res.data }));
        });
    }, 5000);
  }, []);
  return (

      <LineChartTooltip data={data} x={x} y={y}/>

  );
};

export default LineChartTooltipContainer
