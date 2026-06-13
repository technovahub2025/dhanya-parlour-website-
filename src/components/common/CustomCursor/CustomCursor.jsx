export default function CustomCursor({ cursorDotRef, cursorOutlineRef }) {
  return (
    <>
      <div className="cursor-dot" ref={cursorDotRef}></div>
      <div className="cursor-outline" ref={cursorOutlineRef}></div>
    </>
  );
}
