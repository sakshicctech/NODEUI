import { configureStore } from "@reduxjs/toolkit";
import  zoomReducer from "../Features/zoomSlice";
import  portsReducer from "../Features/portsSlice";


const store = configureStore({reducer: {
    zoom: zoomReducer,
    ports: portsReducer,}});

export default store;