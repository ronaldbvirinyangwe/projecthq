/**
 * Av – circular avatar with initials.
 * @param {string} initials  e.g. "AM"
 * @param {string} color     accent hex colour
 * @param {number} [size=30] diameter in px
 */
export default function Av({ initials, color, size = 30 }) {
  return (
    <div
      title={initials}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: color + "22",
        border: `1.5px solid ${color}55`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Space Mono",
        fontSize: size * 0.3,
        color,
        fontWeight: 700,
        flexShrink: 0,
        letterSpacing: "0.5px",
      }}
    >
      {initials}
    </div>
  );
}