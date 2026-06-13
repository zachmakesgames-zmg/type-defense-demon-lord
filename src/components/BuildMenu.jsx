// ─── Build Menu ──────────────────────────────────────────────────
// Overlay showing all 6 towers with codes for building

import { TOWERS } from '../constants/towers.js';

export default function BuildMenu({ buildState, buildInput, gold }) {
  if (!buildState) return null;

  return (
    <div className="game-overlay">
      <div className="build-panel">
        <div className="build-title">🏗 BUILD TOWER</div>
        <div className="build-subtitle">Type the code to build · ESC to cancel</div>

        <div className="build-grid">
          {Object.entries(TOWERS).map(([key, tower]) => {
            const code = buildState.codes[key];
            const canAfford = gold >= tower.cost;
            const isInstalled = buildState.currentTower === key;
            const isActive = buildInput && code.startsWith(buildInput);

            return (
              <div
                key={key}
                className={`build-card ${isInstalled ? 'installed' : ''} ${!canAfford && !isInstalled ? 'cant-afford' : ''} ${isActive ? 'active' : ''}`}
              >
                <div className="build-tower-name" style={{ color: tower.color }}>
                  {tower.name}
                </div>
                <div className="build-tower-cost">💰 {tower.cost}g</div>
                <div className="build-tower-stats">
                  <span>⚔{tower.damage}</span>
                  <span>📏{tower.range}</span>
                  <span>⏱{tower.rof}</span>
                  {tower.splash > 0 && <span>💥{tower.splash}</span>}
                  {tower.dot > 0 && <span>🔥{tower.dot}s</span>}
                  {tower.aoe && <span>🌀AoE</span>}
                  {tower.slow > 0 && <span>🐌{Math.round(tower.slow * 100)}%</span>}
                </div>

                {!isInstalled ? (
                  <div className="build-code">
                    {code.split('').map((ch, i) => (
                      <span
                        key={i}
                        className={`build-code-char ${i < buildInput.length ? 'typed' : canAfford ? 'ready' : 'disabled'}`}
                      >
                        {ch}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="build-installed">INSTALLED</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
