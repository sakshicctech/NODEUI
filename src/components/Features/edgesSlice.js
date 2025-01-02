import { createSlice } from '@reduxjs/toolkit';

const edgesSlice = createSlice({
  name: 'edges',
  initialState: [],
  reducers: {
    addEdge: (state, action) => {
      state.push(action.payload); 
    },
    removeEdge: (state, action) => {
      return state.filter(edge => edge.id !== action.payload.id);
    },
    updateEdge: (state, action) => {
      const edgeIndex = state.findIndex(edge => edge.id === action.payload.id);
      if (edgeIndex !== -1) {
        state[edgeIndex] = { ...state[edgeIndex], ...action.payload };
      }
    },
  },
});

export const { addEdge, removeEdge, updateEdge } = edgesSlice.actions;
export default edgesSlice.reducer;
