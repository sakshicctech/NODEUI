import { useState, useCallback } from 'react';
import styles from './Node.module.css';
import { useDispatch } from 'react-redux';
import { toggleNodeSelection, removeNode } from '../Features/portsSlice';
import DeleteIcon from '@mui/icons-material/Delete';

const Node = ({ node, onNodeUpdate }) => {
  const dispatch = useDispatch();
  const { id, ports, isSelected, label, position: initialPosition } = node;

  const [position, setPosition] = useState(initialPosition);
  const [nodeIds, setNodeIDs] = useState([]);

  const handleMouseDown = useCallback((e) => {
    e.stopPropagation();
    if (!isSelected) {
      dispatch(toggleNodeSelection({ id }));
    }

    const startPos = { x: e.clientX, y: e.clientY };

    const onMouseMove = (moveEvent) => {
      const newPos = {
        x: position.x + (moveEvent.clientX - startPos.x),
        y: position.y + (moveEvent.clientY - startPos.y),
      };
      setPosition(newPos);
      moveEvent.preventDefault();
    };

    const onMouseUp = () => {
      onNodeUpdate(id, position); 
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [id, isSelected, position, onNodeUpdate, dispatch]);

  const handleOnPortClick = useCallback((e, side, index) => {
    e.stopPropagation();
    const portPosition = calculateSinglePortPosition(side, index);
    updateNodeIDs(id);
  }, [position, ports]);

  const updateNodeIDs = useCallback((newId) => {
    setNodeIDs(prevNodeIDs => {
      if (!prevNodeIDs.includes(newId)) {
        return [...prevNodeIDs, newId];
      }
      return prevNodeIDs;
    });
  }, []);

  const generatePorts = useCallback((count, side) => {
    return Array.from({ length: count }, (_, index) => (
      <div
        key={`${side}-${index}`}
        className={styles.port}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => handleOnPortClick(e, side, index)}
      />
    ));
  }, [handleOnPortClick]);

  const calculateSinglePortPosition = useCallback((side, index) => {
    const nodeWidth = 120;
    const nodeHeight = 120;
    const portOffset = 24;
    const portSize = 12;
    const count = ports[side];
    
    let x, y;
    switch(side) {
      case 'left':
        x = position.x - portOffset;
        y = position.y + (nodeHeight / (count + 1)) * (index + 1) - portSize / 2;
        break;
      case 'right':
        x = position.x + nodeWidth + portOffset - portSize;
        y = position.y + (nodeHeight / (count + 1)) * (index + 1) - portSize / 2;
        break;
      case 'top':
        x = position.x + (nodeWidth / (count + 1)) * (index + 1) - portSize / 2;
        y = position.y - portOffset;
        break;
      case 'bottom':
        x = position.x + (nodeWidth / (count + 1)) * (index + 1) - portSize / 2;
        y = position.y + nodeHeight + portOffset - portSize;
        break;
    }
    return { x, y };
  }, [ports, position]);

  return (
    <div
      className={`${styles.node} ${isSelected ? styles.nodeSelected : ''}`}
      style={{ left: `${position.x}px`, top: `${position.y}px`, position: 'absolute' }}
      onMouseDown={handleMouseDown}
    >
      <div className={styles.nodeContent}>{label}</div>
      {isSelected && (
        <button
          className={styles.deleteButton}
          onClick={(e) => {
            e.stopPropagation();
            dispatch(removeNode({ id }));
          }}
        >
          <DeleteIcon />
        </button>
      )}
      {['left', 'right', 'top', 'bottom'].map((side) =>
        <div key={side} className={styles[`${side}sWrapper`]}>
          {generatePorts(ports[side], side)}
        </div>
      )}
    </div>
  );
};

export default Node;
