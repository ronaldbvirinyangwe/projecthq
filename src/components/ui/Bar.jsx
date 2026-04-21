/**
 * Bar – horizontal progress bar.
 * @param {number} value   0-100
 * @param {string} color   fill colour
 * @param {number} [h=6]   bar height in px
 */
export default function Bar({ value, color, h = 6 }) {
  return (
    <div
      style={{
        width: "100%",
        height: h,
        background: "#1a2d4a",
        borderRadius: h / 2,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${Math.min(value, 100)}%`,
          height: "100%",
          background: color,
          borderRadius: h / 2,
          transition: "width 0.5s ease",
        }}
      />
    </div>
  );
}