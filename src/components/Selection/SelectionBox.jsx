import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateMultipleSelections, clearNodeSelections } from '../Features/portsSlice';

const SelectionBox = ({ scale = 1, isSpacePressed }) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionBox, setSelectionBox] = useState(null);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const dispatch = useDispatch();
  const nodes = useSelector(state => state.ports.nodes);

  const getScaledBoardCoordinates = useCallback((clientX, clientY) => {
    const board = document.getElementById('board');
    if (!board) return { x: 0, y: 0 };

    const rect = board.getBoundingClientRect();
    const scrollLeft = board.parentElement?.scrollLeft || 0;
    const scrollTop = board.parentElement?.scrollTop || 0;

    return {
      x: (clientX + scrollLeft - rect.left) / scale,
      y: (clientY + scrollTop - rect.top) / scale
    };
  }, [scale]);

  const isNodeInSelection = useCallback((nodePosition, box) => {
    if (!box) return false;

    const nodeWidth = 120;
    const nodeHeight = 120;

    const nodeLeft = nodePosition.x;
    const nodeTop = nodePosition.y;
    const nodeRight = nodeLeft + nodeWidth;
    const nodeBottom = nodeTop + nodeHeight;

    const selectionLeft = Math.min(box.left, box.left + box.width);
    const selectionRight = Math.max(box.left, box.left + box.width);
    const selectionTop = Math.min(box.top, box.top + box.height);
    const selectionBottom = Math.max(box.top, box.top + box.height);

    return (
      nodeLeft < selectionRight &&
      nodeRight > selectionLeft &&
      nodeTop < selectionBottom &&
      nodeBottom > selectionTop
    );
  }, []);

  const selectNodes = useCallback((selectionArea) => {
    if (!selectionArea) return;

    const updatedSelections = nodes.map(node => ({
      id: node.id,
      isSelected: isNodeInSelection(node.position, selectionArea)
    }));

    dispatch(updateMultipleSelections(updatedSelections));
  }, [nodes, isNodeInSelection, dispatch]);

  useEffect(() => {
    const board = document.getElementById('board');
    if (!board) return;

    const handleMouseDown = (e) => {
      // Only start selection if not space-pressed and clicking directly on the board
      if (e.button === 0 && !isSpacePressed && e.target.id === 'board') {
        e.stopPropagation(); // Prevent board dragging when selecting
        const point = getScaledBoardCoordinates(e.clientX, e.clientY);
        setStartPoint(point);
        setIsSelecting(true);
        dispatch(clearNodeSelections());
      }
    };

    const handleMouseMove = (e) => {
      if (!isSelecting) return;

      const currentPoint = getScaledBoardCoordinates(e.clientX, e.clientY);
      
      const newBox = {
        left: Math.min(startPoint.x, currentPoint.x),
        top: Math.min(startPoint.y, currentPoint.y),
        width: Math.abs(currentPoint.x - startPoint.x),
        height: Math.abs(currentPoint.y - startPoint.y)
      };

      setSelectionBox(newBox);
      selectNodes(newBox);
    };

    const handleMouseUp = () => {
      setIsSelecting(false);
      setSelectionBox(null);
    };

    board.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      board.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isSelecting, startPoint, dispatch, getScaledBoardCoordinates, selectNodes, isSpacePressed]);

  if (!selectionBox) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: `${selectionBox.left * scale}px`,
        top: `${selectionBox.top * scale}px`,
        width: `${selectionBox.width * scale}px`,
        height: `${selectionBox.height * scale}px`,
        border: '2px dashed #e38c29',
        backgroundColor: 'rgba(227, 140, 41, 0.1)',
        pointerEvents: 'none',
        zIndex: 99,
      }}
    />
  );
};

export default SelectionBox;