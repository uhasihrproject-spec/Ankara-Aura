export default function ShopLoading() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "grid",
        placeItems: "center",
        background: "#f7f6f4",
        color: "#0b0b0a",
        fontFamily: "'Bebas Neue', sans-serif",
        letterSpacing: "0.16em",
      }}
      aria-busy="true"
    >
      LOADING SHOP...
    </div>
  );
}
