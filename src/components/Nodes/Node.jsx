import { useState } from 'react';
import styles from './Node.module.css';
import { useDispatch } from 'react-redux';
import { toggleNodeSelection, removeNode } from '../Features/portsSlice';
import DeleteIcon from '@mui/icons-material/Delete';

const Node = ({ node, onNodeUpdate }) => {
  const dispatch = useDispatch();
  const { id, ports, isSelected, label } = node;
  const [position, setPosition] = useState(node.position);

  const handleMouseDown = (e) => {
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
      onNodeUpdate(id, position); // Update the node position
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

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

      <div className={styles.inputsWrapper}>{generatePorts(ports.left, 'left')}</div>
      <div className={styles.outputsWrapper}>{generatePorts(ports.right, 'right')}</div>
      <div className={styles.topsWrapper}>{generatePorts(ports.top, 'top')}</div>
      <div className={styles.bottomsWrapper}>{generatePorts(ports.bottom, 'bottom')}</div>
    </div>
  );
};

const generatePorts = (count, className) => {
  return Array.from({ length: count }, (_, index) => (
    <div
      key={`${className}-${index}`}
      className={styles.port}
      onMouseDown={(e) => e.stopPropagation()}
    />
  ));
};


export default Node;
