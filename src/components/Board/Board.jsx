import { useEffect, useState } from 'react';
import styles from './Board.module.css';
import Button from '../Button/Button';
import Node from '../Nodes/Node';
import Edge from '../Edges/Edge';

const Board = () => {
  const [grabbingBoard, setGrabbingBoard] = useState(false);
  const [scale, setScale] = useState(1);
  const [clickedPosition, setClickedPosition] = useState({ x: -1, y: -1 });
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedPorts, setSelectedPorts] = useState([]);
  const [ghostEdge, setGhostEdge] = useState(null);

  useEffect(() => {
    const boardElement = document.getElementById("board");
    if (boardElement) {
      const handleWheel = (event) => {
        event.preventDefault();
        let newScale = scale + event.deltaY * -0.005;
        newScale = Math.min(Math.max(1, newScale), 2);
        setScale(newScale);

        boardElement.style.transform = `scale(${newScale})`;
        boardElement.style.marginTop = `${(newScale - 1) * 50}vh`;
        boardElement.style.marginLeft = `${(newScale - 1) * 50}vw`;
      };

      boardElement.addEventListener("wheel", handleWheel, { passive: false });

      return () => {
        boardElement.removeEventListener("wheel", handleWheel);
      };
    }
  }, [scale]);

  const handleOnMouseDown = (event) => {
    if (!event.target.closest('.node')) {
      setGrabbingBoard(true);
      setClickedPosition({ x: event.clientX, y: event.clientY });
    }
  };

  const handleOnMouseUp = () => {
    setClickedPosition({ x: -1, y: -1 });
    setGrabbingBoard(false);
  };

  const handleOnMouseMove = (event) => {
    if (grabbingBoard && clickedPosition.x >= 0 && clickedPosition.y >= 0) {
      const dx = event.clientX - clickedPosition.x;
      const dy = event.clientY - clickedPosition.y;
      const boardWrapperElement = document.getElementById('boardWrapper');
      if (boardWrapperElement) {
        boardWrapperElement.scrollBy(-dx, -dy);
        setClickedPosition({ x: event.clientX, y: event.clientY });
      }
    }
  };

  const handleMouseMoveForGhostEdge = (event) => {
    if (selectedPorts.length > 0) {
      const { clientX, clientY } = event;
      setGhostEdge({
        from: selectedPorts[0].position,
        to: { x: clientX, y: clientY },
      });
    }
  };

  const handleMouseUpForGhostEdge = () => {
    setGhostEdge(null);
  };

  useEffect(() => {
    if (selectedPorts.length > 0) {
      document.addEventListener("mousemove", handleMouseMoveForGhostEdge);
      document.addEventListener("mouseup", handleMouseUpForGhostEdge);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMoveForGhostEdge);
      document.removeEventListener("mouseup", handleMouseUpForGhostEdge);
    };
  }, [selectedPorts]);

  const handleClick = () => {
    setNodes((prevNodes) => [
      ...prevNodes,
      {
        id: `node${prevNodes.length + 1}`,
        type: "BasicNode",
        data: { label: `Node ${prevNodes.length + 1}` },
        position: { x: Math.random() * 400, y: Math.random() * 400 },
      },
    ]);
  };

  const handlePortClick = (port, position) => {
    if (selectedPorts.length === 0) {
      setSelectedPorts([{ port, position }]);
    } else {
      const newEdge = {
        from: selectedPorts[0].position,
        to: position,
        fromPort: selectedPorts[0].port,
        toPort: port,
      };
      setEdges((prevEdges) => [...prevEdges, newEdge]);
      setSelectedPorts([]);
    }
  };

  const handlePositionChange = (nodeId, newPosition) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === nodeId ? { ...node, position: newPosition } : node
      )
    );

    setEdges((prevEdges) =>
      prevEdges.map((edge) => {
        if (edge.from.nodeId === nodeId) {
          return { ...edge, from: { ...edge.from, ...newPosition } };
        }
        if (edge.to.nodeId === nodeId) {
          return { ...edge, to: { ...edge.to, ...newPosition } };
        }
        return edge;
      })
    );
  };
  
  

  return (
    <div id="boardWrapper" className={styles.wrapper}>
      <div
        id="board"
        className={grabbingBoard ? styles.boardDragging : styles.board}
        onMouseDown={handleOnMouseDown}
        onMouseUp={handleOnMouseUp}
        onMouseMove={handleOnMouseMove}
      >
        <Button onClick={handleClick} />
        {nodes.map((node) => (
          <Node
            key={node.id}
            id={node.id}
            label={node.data.label}
            initialX={node.position.x}
            initialY={node.position.y}
            onPortClick={handlePortClick}
            onPositionChange={handlePositionChange}
          />
        ))}
        {edges.map((edge, index) => (
          <Edge key={index} from={edge.from} to={edge.to} />
        ))}
        {ghostEdge && <Edge from={ghostEdge.from} to={ghostEdge.to} />}
      </div>
    </div>
  );
};

export default Board;
