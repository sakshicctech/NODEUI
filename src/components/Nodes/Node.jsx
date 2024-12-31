/**
 * Node.jsx
 * 
 * Corrected Node component based on your original code.
 * 
 * Adjust import paths for `styles` as needed, and ensure
 * you have matching .node, .nodeSelected, etc. in your CSS.
 */

import React, { useMemo } from "react";
import styles from "./Node.module.css";

const Node = ({
  id,
  x,
  y,
  numberInputs,
  numberOutputs,
  selected,
  onMouseDownNode,
  onMouseDownOutput,
  onMouseEnterInput,
  onMouseLeaveInput,
}) => {
  // Create refs for each input/output. We use `useMemo` so that
  // these refs don't get recreated every render.
  const inputRefs = useMemo(
    () => Array.from({ length: numberInputs }, () => React.createRef()),
    [numberInputs]
  );
  const outputRefs = useMemo(
    () => Array.from({ length: numberOutputs }, () => React.createRef()),
    [numberOutputs]
  );

  // Handle mousedown on a specific output
  const handleMouseDownOutput = (event, outputIndex) => {
    event.stopPropagation();
    const ref = outputRefs[outputIndex];
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    onMouseDownOutput(id, outputIndex, event, centerX, centerY);
  };

  // Handle mouse enter on a specific input
  const handleMouseEnterInput = (inputIndex) => {
    const ref = inputRefs[inputIndex];
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    onMouseEnterInput(id, inputIndex, centerX, centerY);
  };

  // Handle mouse leave on a specific input
  const handleMouseLeaveInput = (inputIndex) => {
    onMouseLeaveInput(id, inputIndex);
  };

  return (
    <div
      className={selected ? styles.nodeSelected : styles.node}
      style={{ transform: `translate(${x}px, ${y}px)` }}
      onMouseDown={(event) => {
        // Stop the board from being selected
        event.stopPropagation();
        onMouseDownNode(id, event);
      }}
    >
      <div className={styles.inputsWrapper}>
        {Array.from({ length: numberInputs }).map((_, index) => (
          <div
            key={`input-${index}`}
            ref={inputRefs[index]}
            className={styles.input}
            onMouseEnter={() => handleMouseEnterInput(index)}
            onMouseLeave={() => handleMouseLeaveInput(index)}
          />
        ))}
      </div>

      <div className={styles.outputsWrapper}>
        {Array.from({ length: numberOutputs }).map((_, index) => (
          <div
            key={`output-${index}`}
            ref={outputRefs[index]}
            className={styles.output}
            onMouseDown={(event) => handleMouseDownOutput(event, index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Node;
