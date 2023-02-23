import { combineReducers } from "redux"
import { configureStore } from "@reduxjs/toolkit"
import { dataReducer } from "./dataReducer"

const rootReducer = combineReducers({
data: dataReducer
})

const store = configureStore({
  reducer: rootReducer,
})


export default store
