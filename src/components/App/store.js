import { configureStore } from "@reduxjs/toolkit";
import  zoomReducer from "../Features/zoomSlice";
import  portsReducer from "../Features/portsSlice";
import  edgesReducer from "../Features/edgesSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { combineReducers } from "redux";

const persistConfig = {
    key: "root",
    storage,    
  };

const rootReducer = combineReducers({    
    zoom: zoomReducer,
    ports: portsReducer,
    edges: edgesReducer
  });

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({reducer: persistedReducer,middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false})});


// const store = configureStore({reducer: {
//     zoom: zoomReducer,
//     ports: portsReducer,
//     edges: edgesReducer}});

export default store;