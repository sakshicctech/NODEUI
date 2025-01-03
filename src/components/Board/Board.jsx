import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './Board.module.css';
import { decrement, increment } from '../Features/zoomSlice';
import Button from '../Button/Button';
import Node from '../Nodes/Node';
import Edge from '../Edges/Edge';
import { updateNodePosition , addNode} from '../Features/portsSlice';
import {addEdge,removeEdge} from '../Features/edgesSlice';
import { updateEdgePosition } from '../Features/edgesSlice';
import resNodes from '../resources/resNodes';

const Board = () => {
  const [grabbingBoard, setGrabbingBoard] = useState(false);
  const [clickedPosition, setClickedPosition] = useState({ x: -1, y: -1 });
  const [currentlySelectedNode, setCurrentlySelectedNode] = useState(null);

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
    setClickedPosition({ x: event.clientX, y: event.clientY });
    setGrabbingBoard(true);
  }, []);

  const handleMouseUpBoard = useCallback(() => {
    setClickedPosition({ x: -1, y: -1 });
    setGrabbingBoard(false);
  }, []);

  const handleMouseMove = useCallback((event) => {
    if (clickedPosition.x >= 0 && clickedPosition.y >= 0) {
      const boardElement = document.getElementById('boardWrapper');
      boardElement?.scrollBy(-event.movementX, -event.movementY);
      setClickedPosition({ x: event.clientX, y: event.clientY });
    }
  }, [clickedPosition]);

  
  


  const handlePortClick = (nodeId, side, portIndex, nodePosition) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) {
      console.error(`Node with id ${nodeId} not found.`);
      return;
    }
  
    const portPosition = calculatePortPosition(nodePosition, side, portIndex, node.ports[side]);
  
    if (currentlySelectedNode) {
      const startPortPosition = currentlySelectedNode.portPosition;
      dispatch(addEdge({
        id: `edge-${currentlySelectedNode.id}-${nodeId}-${Date.now()}`,
        position: {
          x0: startPortPosition.x,
          y0: startPortPosition.y,
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
      setCurrentlySelectedNode(null);
    } else {
      setCurrentlySelectedNode({ id: nodeId, portPosition, side,portIndex });
    }
  };
  
  


  const calculatePortPosition = (nodePosition, side, portIndex, totalPorts) => {
    const nodeWidth = 120; 
    const nodeHeight = 120;
    const portOffset = 24;
  
    let x = 0, y = 0;
    const scaledNodeWidth = nodeWidth * scale;
    const scaledNodeHeight = nodeHeight * scale;
    const scaledPortOffset = portOffset * scale;

    console.log(side)
  
    switch (side) {
      case "left":
        x = nodePosition.x - scaledPortOffset ;
        y = nodePosition.y + scaledNodeHeight / (totalPorts + 1) * (portIndex + 1);
        break;
      case "right":
        x = nodePosition.x + scaledNodeWidth + scaledPortOffset ;
        y = nodePosition.y + scaledNodeHeight / (totalPorts + 1) * (portIndex + 1);
        break;
      case "top":
        x = nodePosition.x + scaledNodeWidth / (totalPorts + 1) * (portIndex + 1);
        y = nodePosition.y - scaledPortOffset  ;
        break;
      case "bottom":
        x = nodePosition.x + scaledNodeWidth / (totalPorts + 1) * (portIndex + 1);
        y = nodePosition.y + scaledNodeHeight + scaledPortOffset  ;
        break;
    }
    
    return { x, y };
  };

  const handleUpdateNodePosition = useCallback(
    (id, updatedPosition) => {
      dispatch(updateNodePosition({ id, position: updatedPosition }));
  
      const connectedEdges = edges.filter(
        edge => edge.sourceNode === id || edge.targetNode === id
      );
  
      connectedEdges.forEach(edge => {
        const edgeToUpdate = {
          id: edge.id,
          position: { ...edge.position } 
        };
  
        if (edge.sourceNode === id) {
          const sourcePosition = calculatePortPosition(
            updatedPosition,
            edge.sourceSide,
            edge.sourcePort,
            nodes.find(n => n.id === edge.sourceNode).ports[edge.sourceSide]
          );
          edgeToUpdate.position.x0 = sourcePosition.x;
          edgeToUpdate.position.y0 = sourcePosition.y;
        }
  
        if (edge.targetNode === id) {
          const targetNode = nodes.find(n => n.id === edge.targetNode);
          const targetPosition = calculatePortPosition(
            targetNode.position,
            edge.targetSide,
            edge.targetPort,
            targetNode.ports[edge.targetSide]
          );
          edgeToUpdate.position.x1 = targetPosition.x;
          edgeToUpdate.position.y1 = targetPosition.y;
        }
  
        console.log(`Updating edge ${edge.id} position:`, edgeToUpdate.position);
        dispatch(updateEdgePosition(edgeToUpdate));
      });
    },
    [dispatch, edges, nodes]
  );

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
        {nodes.map((node, index) => (
          <Node key={index} node={node} onNodeUpdate={handleUpdateNodePosition} onPortClick={handlePortClick}/>
        ))}
        {edges.map((edge) => (
        <Edge
          key={edge.id}
          edge={edge}
          selected={false}
          onDelete={(id) => dispatch(removeEdge({ id }))}
        />
      ))}
      </div>
    </div>
  );
}

export default Board;
