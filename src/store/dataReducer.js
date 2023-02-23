import { createSlice } from "@reduxjs/toolkit"

const initState = {
    appl: []
}

const slice = createSlice({
    name: "data",
    initialState: initState,
    reducers: {
        setAppl: (state, action) => {
            state.appl = action.payload.appl
        },
    },
})

// reducer
export const dataReducer = slice.reducer

// actions
export const { setAppl } = slice.actions

