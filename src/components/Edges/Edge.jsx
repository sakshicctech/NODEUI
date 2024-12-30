import styles from "./Edge.module.css";

const Edge = ({ from, to, scale = 1 }) => {
  if (!from || !to || isNaN(from.x) || isNaN(from.y) || isNaN(to.x) || isNaN(to.y)) {
    return null; // Prevent rendering if positions are invalid
  }

  console.log('Edge from:', from);
  console.log('Edge to:', to);

  // Adjust positions for scaling
  const adjustedX1 = from.x ;
  const adjustedY1 = from.y ;
  const adjustedX2 = to.x ;
  const adjustedY2 = to.y ;

  // Adjust curvature control point dynamically
  const controlPointX = (adjustedX1 + adjustedX2) / 2;
  const controlPointY = Math.min(adjustedY1, adjustedY2) - 50;

  return (
    <svg
      className={styles.edge}
      style={{
        position: "absolute",
        pointerEvents: "none",
        overflow: "visible",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <path
        d={`M ${adjustedX1} ${adjustedY1} 
            Q ${controlPointX} ${controlPointY}, 
              ${adjustedX2} ${adjustedY2}`}
        fill="none"
        stroke="#5B84C4"
        strokeWidth="3"
        markerEnd="url(#arrowhead)"
      />
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#5B84C4" />
        </marker>
      </defs>
    </svg>
  );
};

export default Edge;
