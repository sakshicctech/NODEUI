/**
 * BoardComponent.jsx
 */

import React, { useEffect, useState } from "react";
import Node from "../Nodes/Node";
import Edge from "../Edges/Edge";
import Button from "../Button/Button";
import styles from "./Board.module.css";

function BoardComponent() {
  // --------------------------
  // React State
  // --------------------------
  const [grabbingBoard, setGrabbingBoard] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [newEdge, setNewEdge] = useState(null);

  const [insideInput, setInsideInput] = useState(null);
  const [clickedPosition, setClickedPosition] = useState({ x: -1, y: -1 });

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [scale, setScale] = useState(1);

  // --------------------------
  // Zoom (Wheel) Listener
  // --------------------------
  useEffect(() => {
    const boardElement = document.getElementById("board");
    if (!boardElement) return;

    const handleWheel = (event) => {
      event.preventDefault();
      const newValue = scale + event.deltaY * -0.01;
      const clampedValue = Math.min(Math.max(newValue, 0.5), 2);
      setScale(clampedValue);
      boardElement.style.transform = `scale(${clampedValue})`;
    };

    boardElement.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      boardElement.removeEventListener("wheel", handleWheel);
    };
  }, [scale]);

  // --------------------------
  // Functions matching original logic
  // --------------------------
  const handleOnClickAdd = (numberInputs, numberOutputs) => {
    const newNode = {
      id: `node_${Math.random().toString(36).substring(2, 8)}`,
      x: Math.random() * 800, // example
      y: Math.random() * 600, // example
      numberInputs,
      numberOutputs,
      currPosition: { x: 100, y: 100 }, // example position
    };
    setNodes((prev) => [...prev, newNode]);
  };

  const handleOnMouseDownBoard = (event) => {
    setSelectedNode(null);
    setSelectedEdge(null);
    setGrabbingBoard(true);
    setClickedPosition({ x: event.clientX, y: event.clientY });
  };

  const handleOnMouseUpBoard = () => {
    setClickedPosition({ x: -1, y: -1 });
    setGrabbingBoard(false);

    // If we started making a new edge but did not connect it
    if (newEdge && !insideInput) {
      setNewEdge(null);
    }

    // If we started making a new edge and we are inside an input
    if (newEdge && insideInput) {
      addNewEdge();
    }
  };

  const handleOnMouseMove = (event) => {
    // Dragging a node?
    if (clickedPosition.x >= 0 && clickedPosition.y >= 0) {
      if (selectedNode) {
        moveNode(event);
      } else if (grabbingBoard) {
        moveBoard(event);
      }
    }

    // If we are in the middle of creating a new edge
    if (newEdge) {
      updateNewEdgeCoordinates(event);
    }
  };

  const handleOnMouseDownNode = (nodeId, event) => {
    event.stopPropagation();
    setSelectedEdge(null);
    setSelectedNode(nodeId);
    setClickedPosition({ x: event.clientX, y: event.clientY });
  };

  const handleOnMouseDownOutput = (nodeId, outputIndex, event) => {
    event.stopPropagation();
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    const newEdgeStart = {
      x: node.currPosition.x + event.clientX / scale,
      y: node.currPosition.y + event.clientY / scale,
    };
    startNewEdge(nodeId, outputIndex, newEdgeStart);
  };

  const handleOnMouseEnterInput = (nodeId, inputIndex, event) => {
    setInsideInput({
      nodeId,
      inputIndex,
      position: { x: event.clientX, y: event.clientY },
    });
  };

  const handleOnMouseLeaveInput = () => {
    setInsideInput(null);
  };

  const handleOnMouseDownEdge = (edgeId) => {
    setSelectedNode(null);
    setSelectedEdge(edgeId);
  };

  const handleOnClickDelete = () => {
    if (selectedNode) {
      deleteNode();
    } else if (selectedEdge) {
      deleteEdge();
    }
  };

  // --------------------------
  // Helper functions
  // --------------------------
  function moveNode(event) {
    const deltaX = event.clientX - clickedPosition.x;
    const deltaY = event.clientY - clickedPosition.y;
    const updatedNodes = nodes.map((node) => {
      if (node.id === selectedNode) {
        return {
          ...node,
          currPosition: {
            x: node.currPosition.x + deltaX / scale,
            y: node.currPosition.y + deltaY / scale,
          },
        };
      }
      return node;
    });
    setNodes(updatedNodes);
    setClickedPosition({ x: event.clientX, y: event.clientY });
  }

  function moveBoard(event) {
    const deltaX = event.clientX - clickedPosition.x;
    const deltaY = event.clientY - clickedPosition.y;
    const boardWrapperElement = document.getElementById("boardWrapper");
    if (boardWrapperElement) {
      boardWrapperElement.scrollLeft -= deltaX;
      boardWrapperElement.scrollTop -= deltaY;
    }
    setClickedPosition({ x: event.clientX, y: event.clientY });
  }

  function updateNewEdgeCoordinates(event) {
    setNewEdge((edge) => {
      if (!edge) return null;
      return {
        ...edge,
        currEndPosition: {
          x: event.clientX + window.scrollX,
          y: event.clientY + window.scrollY,
        },
      };
    });
  }

  function startNewEdge(nodeStartId, outputIndex, startPosition) {
    setNewEdge({
      id: "",
      nodeStartId,
      nodeEndId: undefined,
      inputIndex: undefined,
      outputIndex,
      prevStartPosition: { ...startPosition },
      currStartPosition: { ...startPosition },
      prevEndPosition: { ...startPosition },
      currEndPosition: { ...startPosition },
    });
  }

  function addNewEdge() {
    if (!newEdge || !insideInput) return;
    const edgeToAdd = {
      ...newEdge,
      nodeEndId: insideInput.nodeId,
      inputIndex: insideInput.inputIndex,
      id: `${newEdge.nodeStartId}-${insideInput.nodeId}`,
    };
    setEdges((prev) => [...prev, edgeToAdd]);
    setNewEdge(null);
  }

  function deleteNode() {
    const updatedNodes = nodes.filter((node) => node.id !== selectedNode);
    setNodes(updatedNodes);
    setSelectedNode(null);

    // Also remove edges that referenced this node
    const updatedEdges = edges.filter((edge) => {
      return edge.nodeStartId !== selectedNode && edge.nodeEndId !== selectedNode;
    });
    setEdges(updatedEdges);
  }

  function deleteEdge() {
    setEdges((prev) => prev.filter((edge) => edge.id !== selectedEdge));
    setSelectedEdge(null);
  }

  // --------------------------
  // Render
  // --------------------------
  return (
    <div id="boardWrapper" className={styles.wrapper}>
      <Button
        showDelete={selectedNode !== null || selectedEdge !== null}
        onClickAdd={handleOnClickAdd}
        onClickDelete={handleOnClickDelete}
      />
      <div
        id="board"
        className={grabbingBoard ? styles.boardDragging : styles.board}
        onMouseDown={handleOnMouseDownBoard}
        onMouseUp={handleOnMouseUpBoard}
        onMouseMove={handleOnMouseMove}
      >
        {nodes.map((node) => (
          <Node
            key={node.id}
            id={node.id}
            x={node.currPosition.x}
            y={node.currPosition.y}
            numberInputs={node.numberInputs}
            numberOutputs={node.numberOutputs}
            selected={selectedNode === node.id}
            onMouseDownNode={handleOnMouseDownNode}
            onMouseDownOutput={handleOnMouseDownOutput}
            onMouseEnterInput={handleOnMouseEnterInput}
            onMouseLeaveInput={handleOnMouseLeaveInput}
          />
        ))}

        {edges.map((edge) => (
          <Edge
            key={edge.id}
            selected={selectedEdge === edge.id}
            position={{
              x0: edge.currStartPosition.x,
              y0: edge.currStartPosition.y,
              x1: edge.currEndPosition.x,
              y1: edge.currEndPosition.y,
            }}
            onMouseDownEdge={() => handleOnMouseDownEdge(edge.id)}
            onClickDelete={() => {
              // If your Edge component triggers deletion:
              setSelectedEdge(edge.id);
              deleteEdge();
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default BoardComponent;
