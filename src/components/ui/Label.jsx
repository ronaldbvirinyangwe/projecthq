import { C } from "../../constants/colors";

/**
 * Label – small all-caps section heading.
 */
export default function Label({ children }) {
  return (
    <p
      style={{
        fontSize: 10,
        color: C.textMuted,
        fontFamily: "Space Mono",
        textTransform: "uppercase",
        letterSpacing: "0.7px",
        marginBottom: 8,
      }}
    >
      {children}
    </p>
  );
}