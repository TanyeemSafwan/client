/** Kept separate from the Recharts components so importing sizes doesn't pull Recharts in. */
const ROW_HEIGHT = 34;

/** Height that fits every bar row plus the axis band (no nested scroll). */
export function barListHeight(rows: number) {
  return Math.max(rows, 1) * ROW_HEIGHT + 16;
}
