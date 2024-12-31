// src/Edge/Edge.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleEdgeSelection, removeEdge } from '../Features/edgesSlice';
import { getNodePosition } from '../Features/portsSlice';
import styles from './Edge.module.css';

const Edge = ({ edge }) => {
  const dispatch = useDispatch();
  const { id, source, target, isSelected } = edge;

  // Get the positions of the source and target nodes from the Redux store
  const sourcePosition = useSelector((state) => getNodePosition(state, source));
  const targetPosition = useSelector((state) => getNodePosition(state, target));

  const handleClick = () => {
    dispatch(toggleEdgeSelection({ id }));
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    dispatch(removeEdge({ id }));
  };

  return (
    <svg className={styles.edgeWrapper} onClick={handleClick}>
      <line
        x1={sourcePosition.x}
        y1={sourcePosition.y}
        x2={targetPosition.x}
        y2={targetPosition.y}
        className={`${styles.edge} ${isSelected ? styles.edgeSelected : ''}`}
      />
      {isSelected && (
        <button className={styles.deleteButton} onClick={handleDeleteClick}>
          <DeleteIcon />
        </button>
      )}
    </svg>
  );
};

export default Edge;
