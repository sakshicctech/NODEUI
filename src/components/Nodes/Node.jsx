import { useState } from "react";
import Port from "../Ports/Port";
import PortButton from "../Ports/PortButton";
import styles from './Node.module.css';

const Node = ({ id, label, initialX, initialY, onPortClick ,scale}) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [ports, setPorts] = useState({ left: [], right: [] });

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
    const newPortId = `Port ${ports[side].length + 1}`;
    setPorts((prevPorts) => ({
      ...prevPorts,
      [side]: [...prevPorts[side], newPortId],
    }));
  };

  return (
    <div
      id="nodeComponent"
      className={`node ${styles.nodeComponent}`}
      onMouseDown={handleMouseDown}
      style={{
        '--position-x': `${position.x}px`,
        '--position-y': `${position.y}px`,
      }}
    >
      <Port side="left" ports={ports.left} onClick={(port,position) => onPortClick(port,position)} />
      <div style={{ textAlign: "center", flex: "1", fontWeight: "bold", margin: "0 20px" }}>
        {label || `Node ${id}`}
      </div>
      <Port side="right" ports={ports.right} onClick={(port,position) => onPortClick(port,position)} />

      <PortButton side="left" addPort={addPort} />
      <PortButton side="right" addPort={addPort} />
    </div>
  );
};

export default Node;
