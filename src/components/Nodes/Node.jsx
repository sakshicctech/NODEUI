import { useState, useCallback, useEffect } from "react";
import styles from "./Node.module.css";
import { useDispatch } from "react-redux";
import { toggleNodeSelection, removeNode, addNode } from "../Features/portsSlice";
import { removeEdge } from "../Features/edgesSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const Node = ({ node, onNodeUpdate, onPortClick, isDragging, edges }) => {
  const dispatch = useDispatch();
  const { id, ports, isSelected, label, position: initialPosition } = node;
  const [position, setPosition] = useState(initialPosition);

  useEffect(() => {
    if (!isDragging) {
      setPosition(initialPosition);
    }
  }, [initialPosition, isDragging]);

  const handleNodeDelete = useCallback((e) => {
    e.stopPropagation();
    // Get all edges connected to this node
    const connectedEdges = edges.filter(
      edge => edge.sourceNode === id || edge.targetNode === id
    );
    
    // Delete all connected edges first
    connectedEdges.forEach(edge => {
      dispatch(removeEdge({ id: edge.id }));
    });
    
    // Then delete the node
    dispatch(removeNode({ id }));
  }, [dispatch, id, edges]);

  const handleNodeAdd = useCallback((e) => {
    e.stopPropagation();
    // Create a new node with an offset from the current node's position
    const newNode = {
      id: `node-${Date.now()}`, // Generate unique ID
      label: label, // Same label as current node
      position: {
        x: position.x + 100, // Offset by 100px to the right
        y: position.y + 50   // Offset by 50px down
      },
      ports: { ...ports },   // Copy the same port configuration
      isSelected: false
    };
    
    dispatch(addNode(newNode));
  }, [dispatch, label, position, ports]);

  const handleMouseDown = useCallback(
    (e) => {
      if (e.target.classList.contains(styles.port)) {
        return;
      }
      e.stopPropagation();
      if (!isSelected) {
        dispatch(toggleNodeSelection({ id }));
      }

      const startPos = { x: e.clientX, y: e.clientY };
      const initialNodePos = { ...position };

      const onMouseMove = (moveEvent) => {
        const dx = moveEvent.clientX - startPos.x;
        const dy = moveEvent.clientY - startPos.y;
        
        const newPos = {
          x: initialNodePos.x + dx,
          y: initialNodePos.y + dy
        };
        
        setPosition(newPos);
        onNodeUpdate(id, newPos);
        moveEvent.preventDefault();
      };

      const onMouseUp = () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [id, isSelected, position, onNodeUpdate, dispatch]
  );

  const handlePortClick = useCallback(
    (side, index) => {
      onPortClick(id, side, index, position);
    },
    [id, position, onPortClick]
  );

  const generatePorts = useCallback(
    (count, side) => {
      return Array.from({ length: count }, (_, index) => (
        <div
          key={`${side}-${index}`}
          className={styles.port}
          onClick={(e) => {
            e.stopPropagation();
            handlePortClick(side, index);
          }}
        />
      ));
    },
    [handlePortClick]
  );

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(`.${styles.node}`)) {
        if (isSelected) {
          dispatch(toggleNodeSelection({ id }));
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSelected, dispatch, id]);

  return (
    <div
      data-node-id={id}
      className={`${styles.node} ${isSelected ? styles.nodeSelected : ""}`}
      style={{ left: `${position.x}px`, top: `${position.y}px`, position: "absolute" ,border: isSelected ? '2px solid #e38c29' : '1px solid #ccc',
      zIndex: isSelected ? 100 : 1}}
      onMouseDown={handleMouseDown}
      
    >
      <div className={styles.nodeContent}>{label}</div>
      {isSelected && (
        <div>
          <button
            className={styles.deleteButton}
            onClick={handleNodeDelete}
          >
            <DeleteIcon />
          </button>
          <button 
            className={styles.addButton}
            onClick={handleNodeAdd}
          >
            <AddIcon />
          </button>
        </div>
      )}
      <div className={styles.leftsWrapper}>{generatePorts(ports.left, "left")}</div>
      <div className={styles.rightsWrapper}>{generatePorts(ports.right, "right")}</div>
      <div className={styles.topsWrapper}>{generatePorts(ports.top, "top")}</div>
      <div className={styles.bottomsWrapper}>{generatePorts(ports.bottom, "bottom")}</div>
    </div>
  );
};

export default Node;