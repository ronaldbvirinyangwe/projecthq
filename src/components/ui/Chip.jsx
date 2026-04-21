/**
 * Chip – coloured inline badge.
 * @param {string} label
 * @param {string} color  text / border colour
 * @param {string} [bg]   optional background override
 */
export default function Chip({ label, color, bg }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 8px",
        borderRadius: 4,
        fontSize: 11,
        fontFamily: "DM Sans",
        fontWeight: 600,
        color,
        background: bg || color + "20",
        letterSpacing: "0.3px",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}