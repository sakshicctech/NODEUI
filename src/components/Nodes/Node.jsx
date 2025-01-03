import { useState, useRef, useEffect } from "react";
import Port from "../Ports/Port";
import PortButton from "../Ports/PortButton";
import styles from './Node.module.css';

const Node = ({ id, label, initialX, initialY, onPortClick, onPositionChange }) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [ports, setPorts] = useState({ left: [], right: [] });
  const nodeRef = useRef(null);

  useEffect(() => {
    if (nodeRef.current) {
      onPositionChange(id, position);
    }
  }, [position, ports]);

  

  const handleMouseDown = (event) => {
    event.stopPropagation();
    const startX = event.clientX;
    const startY = event.clientY;
    const startPosX = position.x;
    const startPosY = position.y;

    const handleMouseMove = (moveEvent) => {
      const newX = startPosX + (moveEvent.clientX - startX);
      const newY = startPosY + (moveEvent.clientY - startY);
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    event.preventDefault();
  };

  const addPort = (side) => {
    const newPortId = `${id}-${side}-${ports[side].length + 1}`;
    setPorts((prevPorts) => ({
      ...prevPorts,
      [side]: [...prevPorts[side], { id: newPortId }],
    }));
  };

  return (
    <div
      className={`node ${styles.nodeComponent}`}
      onMouseDown={handleMouseDown}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      ref={nodeRef}
    >
      <Port side="left" ports={ports.left} onClick={(port, position) => onPortClick(port, position)} />
      <div style={{ textAlign: "center", flex: "1", fontWeight: "bold", margin: "0 20px" }}>
        {label || `Node ${id}`}
      </div>
      <Port side="right" ports={ports.right} onClick={(port, position) => onPortClick(port, position)} />

      <PortButton side="left" addPort={addPort} />
      <PortButton side="right" addPort={addPort} />
    </div>
  );
};

export default Node;
