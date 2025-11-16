const GhostShape = ({ shape, x = 0, y = 0, cellSize = 40 }) => {
  return (
    <div
      className="pointer-events-none absolute top-0 left-0 z-50"
      style={{ transform: `translate(${x}px, ${y}px)`, opacity: 0.85 }}
    >
      {shape.cells.map(([cx, cy], i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: cellSize,
            height: cellSize,
            left: cx * cellSize,
            top: cy * cellSize,
            background: "rgba(50,50,50,0.9)",
            border: "1px solid rgba(255,255,255,0.5)",
            boxSizing: "border-box",
          }}
        />
      ))}
    </div>
  );
};

export default GhostShape;
