import { configureStore } from "@reduxjs/toolkit";
import  zoomReducer from "../Features/zoomSlice";
import  portsReducer from "../Features/portsSlice";
import  edgesReducer from "../Features/edgesSlice";


const store = configureStore({reducer: {
    zoom: zoomReducer,
    ports: portsReducer,
    edges: edgesReducer}});

export default store;