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
        ...action.payload,
        isSelected: false,
      };
      state.edges.push(edge);
    },
    
    removeEdge(state, action) {
      const { id } = action.payload;
      state.edges = state.edges.filter((edge) => edge.id !== id);
    },
  },
});

export const { addEdge, removeEdge } = edgesSlice.actions;
export default edgesSlice.reducer;
