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
    updateEdgePosition: (state, action) => {
      const { id, position } = action.payload;
      const index = state.findIndex(edge => edge.id === id);
      if (index !== -1) {
        state[index].position = position;
      }
    },
  },
});

export const { addEdge, removeEdge, updateEdgePosition } = edgesSlice.actions;
export default edgesSlice.reducer;
