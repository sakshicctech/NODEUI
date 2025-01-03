import { createSlice } from "@reduxjs/toolkit";



const zoomSlice = createSlice({
    name: 'zoom',
    initialState : 1,
    reducers: {
        increment: (state) => {
            const newState = Math.min(state + 0.1, 2);
            return newState;
        },
        decrement: (state) => {
            const newState = Math.max(state - 0.1, 0.8);
            return newState;
        },
    }
})

export const { increment, decrement } = zoomSlice.actions
export default zoomSlice.reducer