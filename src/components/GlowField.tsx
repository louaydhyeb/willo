const ORBS = [
  { size: 18, color: "#e07a3d" },
  { size: 12, color: "#6b8f71" },
  { size: 22, color: "#f0b27a" },
  { size: 10, color: "#c45c26" },
  { size: 16, color: "#8aa37a" },
  { size: 14, color: "#e8c39e" },
];

export function GlowField() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: 10 }, (_, index) => {
        const orb = ORBS[index % ORBS.length];
        return (
          <span
            key={index}
            className="float-orb"
            style={{
              left: `${5 + ((index * 13) % 90)}%`,
              width: orb.size,
              height: orb.size,
              background: orb.color,
              animationDelay: `${index * 1.3}s`,
              animationDuration: `${13 + (index % 5)}s`,
            }}
          />
        );
      })}
    </div>
  );
}
