import { configureStore } from "@reduxjs/toolkit";
import  zoomReducer from "../Features/zoomSlice";


const store = configureStore({reducer: {zoom: zoomReducer}});

export default store;