
import  { useRef } from "react";
import styles from './Port.module.css';
const Port = ({ side, ports, onClick }) => {
  const ref = useRef(null); 

  const handleClick = (port, event) => {
    const rect = ref.current.getBoundingClientRect();
    const position = {
      x: rect.left + window.scrollX + rect.width / 2,
      y: rect.top + window.scrollY + rect.height / 2
    };
    onClick(port, position);
    console.log('Clicked port:', position);
    event.stopPropagation();
    event.target.classList.add(styles['port-selected']);  // Add class for visual feedback
  };

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "absolute",
        [side]: "-20px",
        top: "50%",
        transform: "translateY(-50%)",
      }}
    >
      {ports.map((port, index) => (
        <div
          key={index}
          className={styles.port}
          title={port}
          onMouseDown={(e) => e.stopPropagation()} // Prevent drag actions or other mouse down effects
          onClick={(e) => handleClick(port, e)}
        ></div>
      ))}
    </div>
  );
};

export default Port;
