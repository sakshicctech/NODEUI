import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './Board.module.css';
import { decrement, increment } from '../Features/zoomSlice';
import Button from '../Button/Button';
import Node from '../Nodes/Node';
import Edge from '../Edges/Edge';
import { updateNodePosition, addNode } from '../Features/portsSlice';
import { addEdge, removeEdge, updateEdgePosition } from '../Features/edgesSlice';
import resNodes from '../resources/resNodes';

const Board = () => {
  const [grabbingBoard, setGrabbingBoard] = useState(false);
  const [clickedPosition, setClickedPosition] = useState({ x: -1, y: -1 });
  const [currentlySelectedNode, setCurrentlySelectedNode] = useState(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);
  const [draggingNodeId, setDraggingNodeId] = useState(null);

  const dispatch = useDispatch();
  const scale = useSelector(state => state.zoom);
  const nodes = useSelector(state => state.ports.nodes);
  const edges = useSelector((state) => state.edges);

  useEffect(() => {
    resNodes.forEach(node => {
      dispatch(addNode({
        position: node.position,
        ports: node.ports
      }));
    });
  }, [dispatch]);

  const calculatePortPosition = useCallback((nodePosition, side, portIndex, totalPorts) => {
    const nodeWidth = 120;
    const nodeHeight = 120;
    const portOffset = 24;
    
    let x = nodePosition.x;
    let y = nodePosition.y;
    const portSpacing = side === 'left' || side === 'right' 
      ? nodeHeight / (totalPorts + 1)
      : nodeWidth / (totalPorts + 1);
    
    switch (side) {
      case 'left':
        x -= portOffset * scale;
        y += portSpacing * (portIndex + 1);
        break;
      case 'right':
        x += (nodeWidth + portOffset) * scale;
        y += portSpacing * (portIndex + 1);
        break;
      case 'top':
        x += portSpacing * (portIndex + 1);
        y -= portOffset * scale;
        break;
      case 'bottom':
        x += portSpacing * (portIndex + 1);
        y += (nodeHeight + portOffset) * scale;
        break;
      default:
        break;
    }
    
    return { x, y };
  }, [scale]);

  const updateEdgePositions = useCallback((nodeId, newPosition) => {
    const relatedEdges = edges.filter(
      edge => edge.sourceNode === nodeId || edge.targetNode === nodeId
    );

    relatedEdges.forEach(edge => {
      const sourceNode = nodes.find(n => n.id === edge.sourceNode);
      const targetNode = nodes.find(n => n.id === edge.targetNode);
      
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

      dispatch(updateEdgePosition({
        id: edge.id,
        position: {
          x0: startPort.x,
          y0: startPort.y,
          x1: endPort.x,
          y1: endPort.y
        }
      }));
    });
  }, [dispatch, edges, nodes, calculatePortPosition]);

  const handleUpdateNodePosition = useCallback(
    (id, updatedPosition) => {
      dispatch(updateNodePosition({ id, position: updatedPosition }));
      updateEdgePositions(id, updatedPosition);
      setDraggingNodeId(id);
    },
    [dispatch, updateEdgePositions]
  );

  const handleWheel = useCallback((event) => {
    event.preventDefault();
    if (event.deltaY < 0) {
      dispatch(increment());
    } else {
      dispatch(decrement());
    }
  }, [dispatch]);

  useEffect(() => {
    const boardElement = document.getElementById('board');
    boardElement?.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      boardElement?.removeEventListener('wheel', handleWheel);
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

  const handleMouseMove = useCallback((event) => {
    if (clickedPosition.x >= 0 && clickedPosition.y >= 0) {
      const boardElement = document.getElementById('boardWrapper');
      boardElement?.scrollBy(-event.movementX, -event.movementY);
      setClickedPosition({ x: event.clientX, y: event.clientY });
    }
  }, [clickedPosition]);

  const handlePortClick = useCallback((nodeId, side, portIndex, nodePosition) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    const portPosition = calculatePortPosition(nodePosition, side, portIndex, node.ports[side]);

    if (currentlySelectedNode) {
      // Prevent self-connection
      if (currentlySelectedNode.id === nodeId) {
        setCurrentlySelectedNode(null);
        return;
      }

      // Prevent duplicate connections
      const isDuplicate = edges.some(edge => 
        (edge.sourceNode === currentlySelectedNode.id && edge.targetNode === nodeId) ||
        (edge.sourceNode === nodeId && edge.targetNode === currentlySelectedNode.id)
      );

      if (!isDuplicate) {
        dispatch(addEdge({
          id: `edge-${Date.now()}`,
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
          targetPort: portIndex
        }));
      }
      setCurrentlySelectedNode(null);
    } else {
      setCurrentlySelectedNode({ 
        id: nodeId, 
        portPosition, 
        side, 
        portIndex 
      });
    }
  }, [currentlySelectedNode, dispatch, edges, nodes, calculatePortPosition]);

  const handleEdgeClick = useCallback((edgeId) => {
    setSelectedEdgeId(edgeId);
  }, []);

  return (
    <div id="boardWrapper" className={styles.wrapper}>
      <div id="board"
           className={`${styles.board} ${grabbingBoard ? styles.boardDragging : ''}`}
           style={{
             transform: `scale(${scale})`,
             backgroundSize: `${30 / scale}px ${30 / scale}px`,
           }}
           onMouseDown={handleMouseDownBoard}
           onMouseUp={handleMouseUpBoard}
           onMouseMove={handleMouseMove}>
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