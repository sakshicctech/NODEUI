import { createSlice,nanoid } from "@reduxjs/toolkit";

const initialState = {
    nodes:[]
  }

const portsSlice = createSlice({
    name: 'checked',
    initialState ,
    reducers: {
      addNode(state, action) {
        
        const node={
          id:nanoid(),
          ports:action.payload.ports
        } 
        state.nodes.push(node)
    },
        
    }
});

export const { addNode } = portsSlice.actions;

export default portsSlice.reducer