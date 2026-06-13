import { useState, useEffect } from 'react';
import { WORLDS, getWorld } from '../constants/worlds.js';
import { isWorldUnlocked, loadProgress, resetProgress, saveProgress } from '../utils/saveData.js';

export default function MainMenu({ onSelectWorld }) {
  const [progress, setProgress] = useState({ completed: {}, bestHP: {} });
  const [devMode, setDevMode] = useState(() => {
    return localStorage.getItem('typeDefense_devMode') === 'true';
  });

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all your progress?')) {
      resetProgress();
      localStorage.removeItem('typeDefense_devMode');
      setDevMode(false);
      setProgress(loadProgress());
    }
  };

  const toggleDevMode = () => {
    const newVal = !devMode;
    setDevMode(newVal);
    localStorage.setItem('typeDefense_devMode', newVal ? 'true' : 'false');
  };

  return (
    <div className="main-menu-container">
      {/* Dev Mode toggle at very top right */}
      <div className="dev-mode-bar">
        <label className="dev-toggle">
          <input
            type="checkbox"
            checked={devMode}
            onChange={toggleDevMode}
          />
          <span className="dev-toggle-text">DEV: UNLOCK ALL</span>
        </label>
      </div>

      <div className="main-menu-frame">
        <h1 className="main-menu-title">TYPE DEFENSE DUNGEON</h1>
        <p className="main-menu-subtitle">
          The Na Tur'al Alliance has invaded. Reclaim your dungeon, Lord of the Underworld!
        </p>

        <div className="worlds-grid">
          {WORLDS.map((w) => {
            const unlocked = devMode || isWorldUnlocked(w.id);
            const prevCompleted = progress.completed[w.id] || 0;
            const pct = Math.min(100, Math.round((prevCompleted / w.levels) * 100));

            return (
              <div
                key={w.id}
                className={`world-card ${unlocked ? 'unlocked' : 'locked'}`}
                style={{
                  '--world-color': w.color,
                  '--world-glow': `${w.color}44`,
                }}
                onClick={() => unlocked && onSelectWorld(w.id)}
              >
                <div className="world-card-header">
                  <span className="world-id">WORLD {w.id}</span>
                  {!unlocked && <span className="world-lock">🔒</span>}
                </div>
                <h3 className="world-name">{w.name}</h3>
                <p className="world-biome">Biome: {w.biome.toUpperCase()}</p>
                
                {unlocked ? (
                  <div className="world-progress-bar-container">
                    <div className="world-progress-label">
                      <span>Progress</span>
                      <span>{prevCompleted}/{w.levels} Cleaned</span>
                    </div>
                    <div className="world-progress-bar-bg">
                      <div
                        className="world-progress-bar-fill"
                        style={{ width: `${pct}%`, backgroundColor: w.color }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="world-locked-hint">
                    Complete World {w.id - 1} to unlock
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="main-menu-footer">
          <button className="btn-danger-reset" onClick={handleReset}>
            💀 RESET PROGRESS 💀
          </button>
        </div>
      </div>
    </div>
  );
}
