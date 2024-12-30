import { useEffect, useState } from 'react';
import styles from './Board.module.css';
import Button from '../Button/Button';
import Node from '../Nodes/Node';   
import nodes from '../Nodes/nodes';
import Edge from '../Edges/Edge';


// const intialNodes = nodes
const Board = () => {
    const [grabbingBoard, setGrabbingBoard] = useState(false);
    const [scale, setScale] = useState(1);
    const [clickedPosition, setClickedPosition] = useState({ x: -1, y: -1 });
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [dragging, setDragging] = useState(false);
    const [selectedPorts, setSelectedPorts] = useState([]);


    useEffect(() => {
        const boardElement = document.getElementById("board");
        console.log(boardElement);
    
        if (boardElement) {
          const handleWheel = (event) => {
            event.preventDefault();  
    
            let newScale = scale + event.deltaY * -0.005;
            console.log(newScale);
            newScale = Math.min(Math.max(1, newScale), 2);
            setScale(newScale);
    
            boardElement.style.transform = `scale(${newScale})`;
            boardElement.style.marginTop = `${(newScale - 1) * 50}vh`;
            boardElement.style.marginLeft = `${(newScale - 1) * 50}vw`;
          };
    
          boardElement.addEventListener("wheel", handleWheel, { passive: false });
    
          return () => {
            boardElement.removeEventListener("wheel", handleWheel);
          };
        }
      }, [scale]);

    const handleOnMouseDown = (event) => {
        setGrabbingBoard(true);
        setClickedPosition({ x: event.clientX, y: event.clientY });
    };

    const handleOnMouseUp = () => {
        setClickedPosition({ x: -1, y: -1 });
        setGrabbingBoard(false);
    };

    const handleOnMouseMove = (event) => {
        if ( clickedPosition.x >= 0 && clickedPosition.y >= 0) {
            const dx = event.clientX - clickedPosition.x;
            const dy = event.clientY - clickedPosition.y;
            const boardWrapperElement = document.getElementById('boardWrapper');
            if (boardWrapperElement) {
                boardWrapperElement.scrollBy(-dx, -dy);
                setClickedPosition({ x: event.clientX, y: event.clientY });
            }
        }
    };

    const handleClick = () => {
        setNodes((prevNodes) => [
          ...prevNodes,
          {
            id: `node${prevNodes.length + 1}`,
            type: "BasicNode",
            data: { label: `Node ${prevNodes.length + 1}` },
            position: { x: Math.random() * 400, y: Math.random() * 400 }, 
          },
        ]);
      };

      const handlePortClick = (port, position) => {
        console.log('Clicked port:', port);
        console.log('Position:', position);
        
        if (selectedPorts.length === 0) {
            setSelectedPorts([ { port, position } ]);
        } else {
            const newEdge = {
                from: selectedPorts[0].position,
                to: position
            };
            setEdges(prevEdges => [...prevEdges, newEdge]);
            setSelectedPorts([]); 
        }
    };
      
    
   

    return (
        <div id="boardWrapper" className={styles.wrapper}>
            <div
                id="board"
                className={grabbingBoard ? styles.boardDragging : styles.board}
                onMouseDown={handleOnMouseDown}
                onMouseUp={handleOnMouseUp}
                onMouseMove={handleOnMouseMove}
            >
                <Button onClick={handleClick}/>
                {nodes.map((node) => {
                    const { id, data: { label }, position: { x: initialX, y: initialY } } = node;
                    console.log(node);
                    return (
                        <Node 
                            key={id} 
                            id={id} 
                            label={label} 
                            initialX={initialX} 
                            initialY={initialY} 
                            onPortClick={handlePortClick}
                            scale={scale}
                        />
                    );
                })}
                {edges.map((edge, index) => (
                    <Edge key={index} from={edge.from} to={edge.to} scale={scale} />
                ))}
            </div>
        </div>
    )
}

export default Board;
