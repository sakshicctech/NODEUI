import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './Board.module.css';
import { decrement, increment } from '../Features/zoomSlice';
import Button from '../Button/Button';
import Node from '../Nodes/Node';
import { updateNodePosition } from '../Features/portsSlice';

const Board = () => {
  const [grabbingBoard, setGrabbingBoard] = useState(false);
  const [clickedPosition, setClickedPosition] = useState({ x: -1, y: -1 });

  const dispatch = useDispatch();
  const scale = useSelector(state => state.zoom);
  const nodes = useSelector(state => state.ports.nodes);

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

  const handleUpdateNodePosition = useCallback((id, position) => {
    dispatch(updateNodePosition({ id, position }));
  }, [dispatch]);

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
          <Node key={index} node={node} onNodeUpdate={handleUpdateNodePosition} />
        ))}
      </div>
    </div>
  );
}

export default Board;
