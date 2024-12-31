import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  edges: [],
};

const edgesSlice = createSlice({
  name: "edges",
  initialState,
  reducers: {
    addEdge(state, action) {
      const edge = {
        id: nanoid(),
        source: action.payload.source, 
        target: action.payload.target, 
        isSelected: false,
      };
      state.edges.push(edge);
    },
    toggleEdgeSelection(state, action) {
      const { id } = action.payload;
      const edgeIndex = state.edges.findIndex((edge) => edge.id === id);
      if (edgeIndex !== -1) {
        state.edges[edgeIndex].isSelected = !state.edges[edgeIndex].isSelected;
      }
    },
    removeEdge(state, action) {
      const { id } = action.payload;
      state.edges = state.edges.filter((edge) => edge.id !== id);
    },
  },
});

export const { addEdge, toggleEdgeSelection, removeEdge } = edgesSlice.actions;
export default edgesSlice.reducer;
