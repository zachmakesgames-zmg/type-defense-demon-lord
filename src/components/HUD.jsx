// ─── HUD Component ───────────────────────────────────────────────

export default function HUD({ gold, hp, waveLabel }) {
  const hpColor = hp > 50 ? '#88ff88' : hp > 25 ? '#ffaa00' : '#ff4444';

  return (
    <div className="hud">
      <span className="hud-gold">💰 {gold}g</span>
      <span className="hud-hp" style={{ color: hpColor }}>🏰 {hp} HP</span>
      <span className="hud-wave">⚔ {waveLabel}</span>
    </div>
  );
}
