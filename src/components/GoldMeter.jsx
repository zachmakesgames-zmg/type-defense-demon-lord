// ─── Gold Meter Sidebar ───────────────────────────────────────────
// Left panel: rising gold bar. Right panel: tower unlock icons.

import { TOWER_LIST } from '../constants/towers.js';

const MAX_GOLD = 3000;

// Tower asset key → same scheme used by Renderer / AssetLoader
function towerAssetKey(tower) {
  return `tower_${tower.asset.replace('.png', '')}`;
}

export function GoldMeterLeft({ gold, isMining }) {
  const pct = Math.min(1, gold / MAX_GOLD);

  return (
    <div className={`gold-meter-panel gold-meter-left${isMining ? ' mining-active' : ''}`}>
      <div className="gm-label">GOLD</div>

      <div className="gm-bar-track">
        <div className="gm-bar-fill" style={{ height: `${pct * 100}%` }} />
        {/* tick marks every 25% */}
        {[0.25, 0.5, 0.75].map(t => (
          <div key={t} className="gm-tick" style={{ bottom: `${t * 100}%` }} />
        ))}
      </div>

      <div className="gm-value">{gold}g</div>
    </div>
  );
}

export function GoldMeterRight({ gold, assets, isMining }) {
  // Sort towers cheapest → most expensive
  const sorted = [...TOWER_LIST].sort((a, b) => a.cost - b.cost);

  return (
    <div className={`gold-meter-panel gold-meter-right${isMining ? ' mining-active' : ''}`}>
      <div className="gm-label">TOWERS</div>
      <div className="gm-tower-list">
        {sorted.map(tower => {
          const canAfford = gold >= tower.cost;
          const img = assets?.[towerAssetKey(tower)];
          return (
            <div
              key={tower.id}
              className={`gm-tower-row${canAfford ? ' can-afford' : ''}`}
              title={`${tower.name} — ${tower.cost}g`}
            >
              <div className="gm-tower-icon">
                {img
                  ? <img src={img.src} alt={tower.label} />
                  : <div className="gm-tower-fallback" style={{ background: tower.color }} />
                }
                {canAfford && <div className="gm-afford-glow" />}
              </div>
              <div className="gm-tower-cost" style={{ color: canAfford ? '#ffd700' : '#7a5a18' }}>
                {tower.cost}g
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
