import axios from "axios"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setUnemployment } from "../../store/dataReducer"
import MultipleLineChart from "./MultipleLineChart"


const x = d => d.date
const y = d => d.unemployment
const z = d => d.division

const MultipleLineChartContainer = () => {

    const dispatch = useDispatch()
    const unemployments = useSelector(state => state.data.unemployments)
    useEffect(() => {
        axios.get("https://gist.githubusercontent.com/fogelo/ab5755fea80c0c107c0f40048b647dfe/raw/c6a7d696f396335e6994d3706cef488417bd90d3/unemployment.json")
            .then(res => {
                dispatch(setUnemployment({ unemployments: res.data }))
            })
        setInterval(() => {
            axios.get("https://gist.githubusercontent.com/fogelo/ab5755fea80c0c107c0f40048b647dfe/raw/c6a7d696f396335e6994d3706cef488417bd90d3/unemployment.json")
                .then(res => {
                    dispatch(setUnemployment({ unemployments: res.data }))
                })
        }, 5000)
    }, [])
    return (
        <MultipleLineChart data={unemployments} x={x} y={y} z={z} />
    )
}

export default MultipleLineChartContainer