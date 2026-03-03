export default function ProductLoading() {
  return (
    <div
      style={{
        minHeight: "70vh",
        display: "grid",
        placeItems: "center",
        background: "#f7f6f4",
        color: "#0b0b0a",
        fontFamily: "'Bebas Neue', sans-serif",
        letterSpacing: "0.16em",
      }}
      aria-busy="true"
    >
      LOADING PIECE...
    </div>
  );
}
