import { useState, useCallback, useEffect } from "react";
import styles from "./Node.module.css";
import { useDispatch } from "react-redux";
import { toggleNodeSelection, removeNode } from "../Features/portsSlice";
import DeleteIcon from "@mui/icons-material/Delete";

const Node = ({ node, onNodeUpdate, onPortClick, isDragging }) => {
  const dispatch = useDispatch();
  const { id, ports, isSelected, label, position: initialPosition } = node;
  const [position, setPosition] = useState(initialPosition);

  useEffect(() => {
    if (!isDragging) {
      setPosition(initialPosition);
    }
  }, [initialPosition, isDragging]);

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