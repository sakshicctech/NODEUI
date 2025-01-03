import Node from './Node';

const BasicNode = ({ nodes }) => {

  

  return (
    <div>
      {nodes.map((node) => {
        const { id, data: { label }, position: { x: initialX, y: initialY } } = node;
        return (
          <Node key={id} id={id} label={label} initialX={initialX} initialY={initialY} />
        );
      })}
    </div>
  );
};

export default BasicNode;
