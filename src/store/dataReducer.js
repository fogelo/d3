import { createSlice } from "@reduxjs/toolkit"

const initState = {
    appl: [],
    unemployments: []
}

const slice = createSlice({
    name: "data",
    initialState: initState,
    reducers: {
        setAppl: (state, action) => {
            console.log(action.payload.appl);
            state.appl = action.payload.appl.map(d => ({ ...d, close: d.close + Math.random() * 25 }))
        },
        setUnemployment: (state, action) => {
            state.unemployments = action.payload.unemployments
        },
    },
})

// reducer
export const dataReducer = slice.reducer

// actions
export const { setAppl, setUnemployment } = slice.actions

