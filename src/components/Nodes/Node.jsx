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
      const updatedPorts = calculatePortPositions();
      onPositionChange(id, position, updatedPorts);
    }
  }, [position, ports]);

  const calculatePortPositions = () => {
    if (!nodeRef.current) return { left: [], right: [] };
    const rect = nodeRef.current.getBoundingClientRect();
    const leftPorts = ports.left.map((_, index) => ({
      x: rect.left + window.scrollX - 10,
      y: rect.top + window.scrollY + 20 + index * 25,
      nodeId: id,
      id: `left-${index}`
    }));
    const rightPorts = ports.right.map((_, index) => ({
      x: rect.right + window.scrollX + 10,
      y: rect.top + window.scrollY + 20 + index * 25,
      nodeId: id,
      id: `right-${index}`
    }));
    return { left: leftPorts, right: rightPorts };
  };

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

      const updatedPorts = calculatePortPositions();
      onPositionChange(id, { x: newX, y: newY }, updatedPorts);
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
