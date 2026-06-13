import { useState, useEffect } from 'react';
import { getLevelInfo, getActiveKeys } from '../constants/curriculum.js';
import { getWorld } from '../constants/worlds.js';
import { isLevelUnlocked, getLevelBestHP, loadProgress } from '../utils/saveData.js';

export default function LevelSelect({ worldId, onSelectLevel, onBack }) {
  const world = getWorld(worldId);
  const [progress, setProgress] = useState({ completed: {}, bestHP: {} });
  const devMode = localStorage.getItem('typeDefense_devMode') === 'true';

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  if (!world) return null;

  return (
    <div className="level-select-container" style={{ '--world-color': world.color }}>
      <button className="btn-back-menu" onClick={onBack}>
        ← Back to Worlds
      </button>

      <div className="level-select-frame">
        <h2 className="level-select-world-title" style={{ color: world.color }}>
          {world.name.toUpperCase()}
        </h2>
        <p className="level-select-world-subtitle">
          Biome: <span className="highlight-text">{world.biome.toUpperCase()}</span> · Choose a floor to defend
        </p>

        <div className="levels-container">
          {Array.from({ length: world.levels }, (_, i) => {
            const levelNum = i + 1;
            const unlocked = devMode || isLevelUnlocked(worldId, levelNum);
            const levelInfo = getLevelInfo(worldId, levelNum);
            const bestHP = getLevelBestHP(worldId, levelNum);
            const isCompleted = (progress.completed[worldId] || 0) >= levelNum;

            return (
              <div
                key={levelNum}
                className={`level-card ${unlocked ? 'unlocked' : 'locked'} ${isCompleted ? 'completed' : ''}`}
                style={{ borderColor: unlocked ? `${world.color}88` : '#222' }}
              >
                <div className="level-card-header">
                  <span className="level-card-num">FLOOR {levelNum}</span>
                  {!unlocked && <span className="level-card-lock">🔒</span>}
                  {isCompleted && <span className="level-card-star">★</span>}
                </div>

                <div className="level-card-body">
                  <div className="level-keys-section">
                    <span className="level-keys-label">Keys:</span>
                    <span className="level-keys-list">
                      {levelInfo?.newKeys?.length > 0
                        ? levelInfo.newKeys.join('  ').toUpperCase()
                        : 'ALL KEYS'}
                    </span>
                  </div>

                  <p className="level-focus-text">
                    {levelInfo?.focus || 'Fluency training and speed progression.'}
                  </p>

                  {isCompleted && (
                    <div className="level-best-hp">
                      Best Base HP: <span style={{ color: bestHP > 50 ? '#88ff88' : '#ffd700' }}>{bestHP}%</span>
                    </div>
                  )}
                </div>

                {unlocked ? (
                  <button
                    className="btn-launch-level"
                    style={{ backgroundColor: world.color }}
                    onClick={() => onSelectLevel(worldId, levelNum)}
                  >
                    ⚔ ENTER DUNGEON ⚔
                  </button>
                ) : (
                  <div className="level-locked-hint">
                    Locked
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
