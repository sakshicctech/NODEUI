const PortButton = ({ side, addPort }) => {
    return (
      <div
        id="port-position"
        style={{
          position: "absolute",
          [side]: "10px",
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        <button
        id="port-btn"
          onClick={(e) => {
            e.stopPropagation();
            addPort(side);
          }}
          style={{

            background: "none",
            border: "1px solid #ccc",
            borderRadius: "50%",
            padding: "5px",
            cursor: "pointer",
          }}
        >
          +
        </button>
      </div>
    );
  };
  
  export default PortButton;
  