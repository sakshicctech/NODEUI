import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Board.module.css";
import { decrement, increment } from "../Features/zoomSlice";
import Button from "../Button/Button";
import Node from "../Nodes/Node";
import Edge from "../Edges/Edge";
import { updateNodePosition, addNode } from "../Features/portsSlice";
import { addEdge, removeEdge, updateEdgePosition } from "../Features/edgesSlice";
import SelectionBox from "../Selection/SelectionBox";

const sampleJson = {
  annotations: { description: "Simple energy transfer system" },
  edges: {
    edge1: {
      annotations: { description: "Transfers mechanical energy from Generator to Engine" },
      kind: "mechanical-energy-flow",
      labels: ["transfer", "mechanical"],
      name: "edge1",
      source: "node1",
      target: "node2",
      uuid: "edge1",
      weights: { default: 1 },
    },
    edge2: {
      annotations: { description: "Transfers electrical energy from Engine to Battery" },
      kind: "electrical-energy-flow",
      labels: ["transfer", "electrical"],
      name: "edge2",
      source: "node2",
      target: "node3",
      uuid: "edge2",
      weights: { default: 1 },
    },
  },
  kind: "energy_transfer_system",
  labels: ["example", "simple"],
  name: "Basic Energy Transfer Model",
  nodes: {
    node1: {
      annotations: { description: "Generates mechanical energy" },
      children: [],
      is_bus: false,
      kind: "generator",
      labels: ["generator", "mechanical"],
      name: "Generator",
      parent: null,
      uuid: "node1",
      weights: { default: 1 },
    },
    node2: {
      annotations: { description: "Converts mechanical energy to electrical energy" },
      children: [],
      is_bus: false,
      kind: "engine",
      labels: ["engine", "converter"],
      name: "Engine",
      parent: null,
      uuid: "node2",
      weights: { default: 1 },
    },
    node3: {
      annotations: { description: "Stores electrical energy" },
      children: [],
      is_bus: false,
      kind: "battery",
      labels: ["battery", "storage"],
      name: "Battery",
      parent: null,
      uuid: "node3",
      weights: { default: 1 },
    },
  },
};

const transformJsonToReduxState = (json) => {
  const nodes = Object.values(json.nodes).map((node) => ({
    id: node.uuid,
    label: node.name,
    ports: { left: 1, right: 1, top: 1, bottom: 1 },
    isSelected: false,
    position: { x: 0, y: 0 },
  }));

  const edges = Object.values(json.edges).map((edge) => ({
    id: edge.uuid,
    sourceNode: edge.source,
    targetNode: edge.target,
    sourceSide: "right",
    targetSide: "left",
    sourcePort: 0,
    targetPort: 0,
    position: { x0: 0, y0: 0, x1: 0, y1: 0 },
  }));

  return { nodes, edges };
};

const Board = () => {
  const [grabbingBoard, setGrabbingBoard] = useState(false);
  const [clickedPosition, setClickedPosition] = useState({ x: -1, y: -1 });
  const [currentlySelectedNode, setCurrentlySelectedNode] = useState(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);
  const [draggingNodeId, setDraggingNodeId] = useState(null);

  const dispatch = useDispatch();
  const scale = useSelector((state) => state.zoom);
  const nodes = useSelector((state) => state.ports.nodes);
  const edges = useSelector((state) => state.edges);

  useEffect(() => {
    const { nodes, edges } = transformJsonToReduxState(sampleJson);
    nodes.forEach((node) => dispatch(addNode(node)));
    edges.forEach((edge) => dispatch(addEdge(edge)));
  }, [dispatch]);

  const calculatePortPosition = useCallback(
    (nodePosition, side, portIndex, totalPorts) => {
      const nodeWidth = 120;
      const nodeHeight = 120;
      const portOffset = 24;

      let x = nodePosition.x;
      let y = nodePosition.y;
      const portSpacing =
        side === "left" || side === "right"
          ? nodeHeight / (totalPorts + 1)
          : nodeWidth / (totalPorts + 1);

      switch (side) {
        case "left":
          x -= portOffset * scale;
          y += portSpacing * (portIndex + 1);
          break;
        case "right":
          x += (nodeWidth + portOffset) * scale;
          y += portSpacing * (portIndex + 1);
          break;
        case "top":
          x += portSpacing * (portIndex + 1);
          y -= portOffset * scale;
          break;
        case "bottom":
          x += portSpacing * (portIndex + 1);
          y += (nodeHeight + portOffset) * scale;
          break;
        default:
          break;
      }

      return { x, y };
    },
    [scale]
  );

  const updateEdgePositions = useCallback(
    (nodeId, newPosition) => {
      const relatedEdges = edges.filter(
        (edge) => edge.sourceNode === nodeId || edge.targetNode === nodeId
      );

      relatedEdges.forEach((edge) => {
        const sourceNode = nodes.find((n) => n.id === edge.sourceNode);
        const targetNode = nodes.find((n) => n.id === edge.targetNode);

        if (!sourceNode || !targetNode) return;

        const sourcePosition = edge.sourceNode === nodeId ? newPosition : sourceNode.position;
        const targetPosition = edge.targetNode === nodeId ? newPosition : targetNode.position;

        const startPort = calculatePortPosition(
          sourcePosition,
          edge.sourceSide,
          edge.sourcePort,
          sourceNode.ports[edge.sourceSide]
        );

        const endPort = calculatePortPosition(
          targetPosition,
          edge.targetSide,
          edge.targetPort,
          targetNode.ports[edge.targetSide]
        );

        dispatch(
          updateEdgePosition({
            id: edge.id,
            position: {
              x0: startPort.x,
              y0: startPort.y,
              x1: endPort.x,
              y1: endPort.y,
            },
          })
        );
      });
    },
    [dispatch, edges, nodes, calculatePortPosition]
  );

  const handleUpdateNodePosition = useCallback(
    (id, updatedPosition) => {
      dispatch(updateNodePosition({ id, position: updatedPosition }));
      updateEdgePositions(id, updatedPosition);
      setDraggingNodeId(id);
    },
    [dispatch, updateEdgePositions]
  );

  const handleWheel = useCallback(
    (event) => {
      event.preventDefault();
      if (event.deltaY < 0) {
        dispatch(increment());
      } else {
        dispatch(decrement());
      }
    },
    [dispatch]
  );

  useEffect(() => {
    const boardElement = document.getElementById("board");
    boardElement?.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      boardElement?.removeEventListener("wheel", handleWheel);
    };
  }, [handleWheel]);

  const handleMouseDownBoard = useCallback((event) => {
    if (!event.target.classList.contains(styles.port)) {
      setClickedPosition({ x: event.clientX, y: event.clientY });
      setGrabbingBoard(true);
      setSelectedEdgeId(null);
    }
  }, []);

  const handleMouseUpBoard = useCallback(() => {
    setClickedPosition({ x: -1, y: -1 });
    setGrabbingBoard(false);
    setDraggingNodeId(null);
  }, []);

  const handleMouseMove = useCallback(
    (event) => {
      if (clickedPosition.x >= 0 && clickedPosition.y >= 0) {
        const boardElement = document.getElementById("boardWrapper");
        boardElement?.scrollBy(-event.movementX, -event.movementY);
        setClickedPosition({ x: event.clientX, y: event.clientY });
      }
    },
    [clickedPosition]
  );

  const handlePortClick = useCallback(
    (nodeId, side, portIndex, nodePosition) => {
      const node = nodes.find((n) => n.id === nodeId);
      if (!node) return;

      const portPosition = calculatePortPosition(nodePosition, side, portIndex, node.ports[side]);

      if (currentlySelectedNode) {
        // Prevent self-connection
        if (currentlySelectedNode.id === nodeId) {
          setCurrentlySelectedNode(null);
          return;
        }
        // Prevent duplicate connections
        const isDuplicate = edges.some(
          (edge) =>
            (edge.sourceNode === currentlySelectedNode.id && edge.targetNode === nodeId) ||
            (edge.sourceNode === nodeId && edge.targetNode === currentlySelectedNode.id)
        );

        if (!isDuplicate) {
          dispatch(
            addEdge({
              position: {
                x0: currentlySelectedNode.portPosition.x,
                y0: currentlySelectedNode.portPosition.y,
                x1: portPosition.x,
                y1: portPosition.y,
              },
              sourceNode: currentlySelectedNode.id,
              targetNode: nodeId,
              sourceSide: currentlySelectedNode.side,
              targetSide: side,
              sourcePort: currentlySelectedNode.portIndex,
              targetPort: portIndex,
            })
          );
        }
        setCurrentlySelectedNode(null);
      } else {
        setCurrentlySelectedNode({
          id: nodeId,
          portPosition,
          side,
          portIndex,
        });
      }
    },
    [currentlySelectedNode, dispatch, edges, nodes, calculatePortPosition]
  );

  const handleEdgeClick = useCallback((edgeId) => {
    setSelectedEdgeId(edgeId);
  }, []);

  return (
    <div id="boardWrapper" className={styles.wrapper}>
      <div
        id="board"
        className={`${styles.board} ${grabbingBoard ? styles.boardDragging : ""}`}
        style={{
          transform: `scale(${scale})`,
          backgroundSize: `${30 / scale}px ${30 / scale}px`,
        }}
        onMouseDown={handleMouseDownBoard}
        onMouseUp={handleMouseUpBoard}
        onMouseMove={handleMouseMove}
      >
        <SelectionBox scale={scale} />
        <Button handleOnClick={() => {}} />
        {nodes.map((node) => (
          <Node
            key={node.id}
            node={node}
            edges={edges}
            onNodeUpdate={handleUpdateNodePosition}
            onPortClick={handlePortClick}
            isDragging={draggingNodeId === node.id}
          />
        ))}
        {edges.map((edge) => (
          <Edge
            key={edge.id}
            edge={edge}
            selected={selectedEdgeId === edge.id}
            onDelete={(id) => dispatch(removeEdge({ id }))}
            onClick={() => handleEdgeClick(edge.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Board;