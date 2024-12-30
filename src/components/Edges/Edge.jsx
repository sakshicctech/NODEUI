import { useEffect, useRef } from "react";
import styles from './Edge.module.css';

const Edge = ({ from, to }) => {
  const edgeRef = useRef(null);

  useEffect(() => {
    if (edgeRef.current) {
      const startX = from.x;
      const startY = from.y;
      const endX = to.x;
      const endY = to.y;

      // Update the SVG path dynamically
      const path = `M ${startX},${startY} C ${startX + 50},${startY} ${endX - 50},${endY} ${endX},${endY}`;
      edgeRef.current.setAttribute("d", path);
    }
  }, [from, to]);

  return (
    <svg
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      <path
        ref={edgeRef}
        className={styles.edgePath}
        stroke="#007AFF"
        strokeWidth="3"
        fill="none"
      />
    </svg>
  );
};

export default Edge;
