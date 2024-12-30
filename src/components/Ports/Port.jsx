
import  { useRef } from "react";
const Port = ({ side, ports, onClick }) => {
  const ref = useRef(null); 

  const handleClick = (port, event) => {
    const rect = ref.current.getBoundingClientRect();
    const position = {
      x: rect.left + window.scrollX + rect.width / 2, 
      y: rect.top + window.scrollY + rect.height / 2  
    };
    onClick(port, position); 
    console.log('Clicked port port:', position);
    event.stopPropagation(); 
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
          style={{
            width: "15px",
            height: "15px",
            backgroundColor: "#fff",
            borderRadius: "50%",
            margin: "5px 0",
            border: "2px solid #333",
            cursor: "pointer"
          }}
          title={port}
          onMouseDown={(e) => e.stopPropagation()} // Prevent drag actions or other mouse down effects
          onClick={(e) => handleClick(port, e)}
        ></div>
      ))}
    </div>
  );
};

export default Port;
