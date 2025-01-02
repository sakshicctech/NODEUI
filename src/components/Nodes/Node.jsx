import { useState, useCallback } from "react";
import styles from "./Node.module.css";
import { useDispatch } from "react-redux";
import { toggleNodeSelection, removeNode } from "../Features/portsSlice";
import DeleteIcon from "@mui/icons-material/Delete";

const Node = ({ node, onNodeUpdate, onPortClick }) => {
  const dispatch = useDispatch();
  const { id, ports, isSelected, label, position: initialPosition } = node;

  const [position, setPosition] = useState(initialPosition);

  const handleMouseDown = useCallback(
    (e) => {
      e.stopPropagation();
      if (!isSelected) {
        dispatch(toggleNodeSelection({ id }));
      }

      const startPos = { x: e.clientX, y: e.clientY };

      const onMouseMove = (moveEvent) => {
        const newPos = {
          x: position.x + (moveEvent.clientX - startPos.x),
          y: position.y + (moveEvent.clientY - startPos.y),
        };
        setPosition(newPos);
        moveEvent.preventDefault();
      };

      const onMouseUp = () => {
        onNodeUpdate(id, position);
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

  return (
    <div
      className={`${styles.node} ${isSelected ? styles.nodeSelected : ""}`}
      style={{ left: `${position.x}px`, top: `${position.y}px`, position: "absolute" }}
      onMouseDown={handleMouseDown}
    >
      <div className={styles.nodeContent}>{label}</div>
      {isSelected && (
        <button
          className={styles.deleteButton}
          onClick={(e) => {
            e.stopPropagation();
            dispatch(removeNode({ id }));
          }}
        >
          <DeleteIcon />
        </button>
      )}
      <div className={styles.leftsWrapper}>{generatePorts(ports.left, "left")}</div>
      <div className={styles.rightsWrapper}>{generatePorts(ports.right, "right")}</div>
      <div className={styles.topsWrapper}>{generatePorts(ports.top, "top")}</div>
      <div className={styles.bottomsWrapper}>{generatePorts(ports.bottom, "bottom")}</div>
    </div>
  );
};

export default Node;
