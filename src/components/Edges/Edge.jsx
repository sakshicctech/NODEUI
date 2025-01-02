import React, { useState, useEffect, useCallback } from "react";
import styles from "./Edge.module.css";

const Edge = ({ edge, selected, onDelete }) => {
  const { id, position } = edge;
  const [middlePoint, setMiddlePoint] = useState({
    x: position.x0 + (position.x1 - position.x0) / 2,
    y: position.y0 + (position.y1 - position.y0) / 2,
  });

  useEffect(() => {
    const middleX = position.x0 + (position.x1 - position.x0) / 2;
    const middleY = position.y0 + (position.y1 - position.y0) / 2;
    setMiddlePoint({ x: middleX, y: middleY });
  }, [position]);

  const handleDelete = useCallback(
    (event) => {
      event.stopPropagation();
      onDelete(id);
    },
    [id, onDelete]
  );

  return (
    <svg className={styles.wrapper}>
      <path
        className={selected ? styles.edgeSelected : styles.edge}
        d={`M ${position.x0} ${position.y0} C ${position.x0 + (position.x1 - position.x0) } ${position.y0}, ${
          position.x1 - (position.x1 - position.x0) 
        } ${position.y1}, ${position.x1} ${position.y1}`}
      />
      <g
        className={selected ? styles.delete : styles.deleteHidden}
        transform={`translate(${middlePoint.x}, ${middlePoint.y - (selected ? 24 : 0)})`}
        onMouseDown={handleDelete}
      >
        <circle className={styles.circle} />
        <svg
          fill="currentColor"
          strokeWidth="0"
          width="30"
          height="30"
          viewBox="210 240 1000 1000"
          style={{ overflow: "visible" }}
          className={styles.icon}
        >
          <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0h120.4c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64s14.3-32 32-32h96l7.2-14.3zM32 128h384v320c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
        </svg>
      </g>
    </svg>
  );
};

export default Edge;
