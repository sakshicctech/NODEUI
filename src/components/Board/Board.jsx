import  { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import styles from './Board.module.css'
import { decrement, increment } from '../Features/zoomSlice';
import Button from '../Button/Button';

const Board = () => {
  const [grabbingBoard, setGrabbingBoard] = useState(false)
  const [clickedPosition, setClickedPosition] = useState({x: -1, y: -1})

  const dispatch = useDispatch()
  const scale = useSelector(state => state.zoom)

  useEffect(() => {
    const boardElement = document.getElementById('board');

    const handleWheel = (event) => {
      event.preventDefault();

      if (event.deltaY < 0) {
        dispatch(increment()); 
      } else {
        dispatch(decrement()); 
      }
    };

    if (boardElement) {
      boardElement.addEventListener('wheel', handleWheel,{ passive: false });
    }

    return () => {
      if (boardElement) {
        boardElement.removeEventListener('wheel', handleWheel);
      }
    };
  }, [dispatch]);

  const handleMouseDownBoard = (event) => {
    setClickedPosition({x: event.clientX, y: event.clientY})

    setGrabbingBoard(true)

    
  }

  const handleMouseUpBoard = () => {
    setClickedPosition({x: -1, y: -1})
    setGrabbingBoard(false)
  }

  const handleMouseMove = (event) => {
    if(clickedPosition.x >= 0 && clickedPosition.y >= 0) {
      const boardElement = document.getElementById('boardWrapper');
      if(boardElement) {
        boardElement.scrollBy(-event.movementX, -event.movementY)
        setClickedPosition({x: event.clientX, y: event.clientY})
      }
    }
  }


  return (
    <div id="boardWrapper" className={styles.wrapper}> 
          

        <div id="board" 
        className={`${styles.board} ${grabbingBoard ? styles.boardDragging : styles.board}` } 
        style={{
          transform: `scale(${scale})`, 
          backgroundSize: `${30 / scale}px ${30 / scale}px`,
        }}
        onMouseDown={handleMouseDownBoard} 
        onMouseUp={handleMouseUpBoard}
        onMouseMove={handleMouseMove}
        >
          <Button hanldeOnClick={() => {}}/>
          

        </div>
    </div>
  )
}

export default Board