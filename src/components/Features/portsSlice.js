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
          label:'Node',
          ports:action.payload.ports,
          isSelected:false,
          position:action.payload.position
        } 
        state.nodes.push(node)
    },
    updateNodePosition(state, action) {
      const { id, position } = action.payload;
      const nodeIndex = state.nodes.findIndex(node => node.id === id);
      if (nodeIndex !== -1) {
        state.nodes[nodeIndex].position = position;
      }
    },
    toggleNodeSelection(state, action) {
      const { id } = action.payload;
      const nodeIndex = state.nodes.findIndex(node => node.id === id);
      if (nodeIndex !== -1) {
        state.nodes[nodeIndex].isSelected = !state.nodes[nodeIndex].isSelected;
      }
    },
    removeNode(state, action) {
      const { id } = action.payload;
      console.log(`Removing node with id: ${id}`);
      const updatedNodes = state.nodes.filter(node => node.id !== id); 
      return {
        ...state,
        nodes: updatedNodes,
      };
    }
    ,
    clearNodeSelections: (state) => {
      state.nodes.forEach(node => {
        node.isSelected = false;
      });
    },
    setNodeSelection: (state, action) => {
      const node = state.nodes.find(n => n.id === action.payload.id);
      if (node) {
        node.isSelected = action.payload.isSelected;
      }
    },
    updateMultipleSelections: (state, action) => {
      action.payload.forEach(update => {
        const node = state.nodes.find(n => n.id === update.id);
        if (node) {
          node.isSelected = update.isSelected;
        }
      });
    }
    
  
        
    }
});

export const getNodePosition = (state, id) => {
  const node = state.ports.nodes.find(node => node.id === id);
  return node ? node.position : { x: 0, y: 0 }; // Default position if not found
};

export const { addNode,updateNodePosition ,toggleNodeSelection,removeNode,clearNodeSelections,setNodeSelection,updateMultipleSelections} = portsSlice.actions;

export default portsSlice.reducer