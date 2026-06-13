// ─── Game Screen ─────────────────────────────────────────────────
// The main gameplay component: hosts canvas, captures keyboard,
// manages game modes (playing/mining/buildMenu), renders overlays

import { useState, useEffect, useRef, useCallback } from 'react';
import { createGameState, updateGame, buildTower, awardMiningGold } from '../engine/GameEngine.js';
import { Renderer } from '../engine/Renderer.js';
import { loadLevelAssets } from '../engine/AssetLoader.js';
import { MAP_SIZE, TILE_SIZE } from '../engine/TileMap.js';
import { TOWERS } from '../constants/towers.js';
import { buildWeightedPool, generateCode, generateSentence } from '../constants/curriculum.js';
import { getWorld } from '../constants/worlds.js';
import { getLevelInfo } from '../constants/curriculum.js';
import { completeLevel } from '../utils/saveData.js';
import HUD from './HUD.jsx';
import MineWindow from './MineWindow.jsx';
import BuildMenu from './BuildMenu.jsx';

const CANVAS_SIZE = 1024;

export default function GameScreen({ world, level, onBack, onRestart }) {
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const gameStateRef = useRef(null);
  const mapDataRef = useRef(null);
  const assetsRef = useRef(null);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(null);
  const modeRef = useRef('playing'); // 'playing' | 'mining' | 'buildMenu'

  const [mode, setModeState] = useState('playing');
  const [hud, setHud] = useState({ gold: 0, hp: 100, wave: 0 });
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing' | 'won' | 'lost'
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  // Mining state
  const mineRef = useRef(null);
  const [mineUI, setMineUI] = useState(null);

  // Build menu state
  const buildRef = useRef(null);
  const [buildUI, setBuildUI] = useState(null);

  // Board input (typing tower site codes)
  const boardInputRef = useRef('');
  const [boardInput, setBoardInput] = useState('');

  // Build menu input
  const buildInputRef = useRef('');
  const [buildInput, setBuildInput] = useState('');

  // Toast
  const [toast, setToast] = useState('');

  const setMode = useCallback((m) => {
    modeRef.current = m;
    setModeState(m);
  }, []);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 1900);
  }, []);

  // ── Load level ───────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function init() {
      const worldInfo = getWorld(world) || { id: world, biome: 'forest', landTile: 'Land_Grass' };

      // Load map data
      let mapData;
      try {
        const mapModule = await import(`../data/maps/world${world}/level${level}.js`);
        mapData = mapModule.default;
      } catch (e) {
        console.warn(`Map not found for world ${world} level ${level}, falling back to World 1 Level ${level} layout`);
        try {
          const fallback = await import(`../data/maps/world1/level${level}.js`);
          mapData = fallback.default;
        } catch (err) {
          const fallback = await import('../data/maps/world1/level1.js');
          mapData = fallback.default;
        }
      }

      // Load assets
      const assets = await loadLevelAssets(worldInfo, (p) => {
        if (!cancelled) setLoadProgress(p);
      });

      if (cancelled) return;

      // Create game state
      const state = createGameState(mapData, world, level);
      gameStateRef.current = state;

      // Store for lazy renderer creation (canvas isn't in DOM yet during loading)
      mapDataRef.current = mapData;
      assetsRef.current = assets;

      setLoading(false);
    }

    init();
    return () => { cancelled = true; };
  }, [world, level]);

  // ── Game loop ────────────────────────────────────────────────
  useEffect(() => {
    if (loading) return;

    // Lazily create renderer now that canvas is in the DOM
    if (!rendererRef.current && canvasRef.current && mapDataRef.current) {
      rendererRef.current = new Renderer(canvasRef.current, mapDataRef.current, assetsRef.current);
    }

    const loop = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = timestamp;

      const state = gameStateRef.current;
      const renderer = rendererRef.current;

      if (state && state.status === 'playing') {
        updateGame(state, dt);

        // Check status changes
        if (state.status === 'won') {
          completeLevel(world, level, Math.floor(state.baseHP));
          setGameStatus('won');
        } else if (state.status === 'lost') {
          setGameStatus('lost');
        }

        // Update HUD
        setHud({
          gold: Math.floor(state.gold),
          hp: Math.max(0, Math.floor(state.baseHP)),
          wave: state.currentWave,
        });
      }

      if (renderer && state) {
        renderer.render(state);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [loading, world, level]);

  // ── Keyboard ─────────────────────────────────────────────────
  useEffect(() => {
    if (loading) return;

    const onKeyDown = (e) => {
      const state = gameStateRef.current;
      if (!state) return;
      if (state.status !== 'playing') return;

      const m = modeRef.current;

      // Prevent browser defaults
      if (e.key === 'Enter' || e.key === 'Escape') e.preventDefault();

      // ── Playing mode ──
      if (m === 'playing') {
        if (e.key === 'Enter') {
          // Open mine
          const sentence = generateSentence(state.keyPool);
          state.sentenceAccuracy = true;
          const ms = { sentence, idx: 0, input: '' };
          mineRef.current = ms;
          setMineUI({ ...ms });
          setMode('mining');
          return;
        }

        if (e.key === 'Escape') {
          boardInputRef.current = '';
          setBoardInput('');
          return;
        }

        // Type tower site code
        const ch = e.key.length === 1 ? e.key.toLowerCase() : null;
        if (!ch) return;

        const next = boardInputRef.current + ch;

        // Check if matches any site code
        for (const site of state.sites) {
          if (next === site.code) {
            // Open build menu for this site
            const usedCodes = new Set(state.sites.map(s => s.code));
            const codes = {};
            for (const tKey of Object.keys(TOWERS)) {
              codes[tKey] = generateCode(state.keyPool, 4, usedCodes);
            }
            const bs = { siteId: site.id, codes, currentTower: site.tower?.type || null };
            buildRef.current = bs;
            buildInputRef.current = '';
            boardInputRef.current = '';
            setBoardInput('');
            setBuildUI(bs);
            setBuildInput('');
            setMode('buildMenu');
            return;
          }
        }

        // Check if prefix of any site code
        const isPrefix = state.sites.some(s => s.code.startsWith(next));
        boardInputRef.current = isPrefix ? next : ch;
        setBoardInput(boardInputRef.current);
      }

      // ── Mining mode ──
      else if (m === 'mining') {
        if (e.key === 'Enter' || e.key === 'Escape') {
          setMode('playing');
          setMineUI(null);
          mineRef.current = null;
          return;
        }

        const ch = e.key.length === 1 ? e.key.toLowerCase() : null;
        if (!ch) return;

        const mr = mineRef.current;
        if (!mr) return;

        const curStr = mr.sentence[mr.idx];
        const expected = curStr[mr.input.length];

        // Only accept the correct character
        if (ch !== expected) {
          state.sentenceAccuracy = false;
          // Wrong key — flash error but don't advance
          return;
        }

        const newInput = mr.input + ch;

        if (newInput.length >= curStr.length) {
          // Word completed
          awardMiningGold(state, 25);
          const nextIdx = mr.idx + 1;

          if (nextIdx >= mr.sentence.length) {
            // Sentence completed
            awardMiningGold(state, 50); // sentence bonus

            if (state.sentenceAccuracy) {
              awardMiningGold(state, 25);
              showToast('✦ ACCURACY BONUS +25g ✦');
            }

            state.sentenceAccuracy = true;
            const ns = { sentence: generateSentence(state.keyPool), idx: 0, input: '' };
            mineRef.current = ns;
            setMineUI({ ...ns });
          } else {
            const ns = { ...mr, idx: nextIdx, input: '' };
            mineRef.current = ns;
            setMineUI({ ...ns });
          }
        } else {
          const ns = { ...mr, input: newInput };
          mineRef.current = ns;
          setMineUI({ ...ns });
        }
      }

      // ── Build menu mode ──
      else if (m === 'buildMenu') {
        if (e.key === 'Escape') {
          setMode('playing');
          setBuildUI(null);
          buildRef.current = null;
          buildInputRef.current = '';
          setBuildInput('');
          return;
        }

        const ch = e.key.length === 1 ? e.key.toLowerCase() : null;
        if (!ch) return;

        const br = buildRef.current;
        if (!br) return;

        const next = buildInputRef.current + ch;

        // Check if matches any tower code
        for (const [tKey, code] of Object.entries(br.codes)) {
          if (next === code) {
            const success = buildTower(state, br.siteId, tKey);
            if (!success) {
              showToast('Not enough gold!');
            }
            setMode('playing');
            setBuildUI(null);
            buildRef.current = null;
            buildInputRef.current = '';
            setBuildInput('');
            return;
          }
        }

        // Check prefix
        const isPrefix = Object.values(br.codes).some(c => c.startsWith(next));
        buildInputRef.current = isPrefix ? next : ch;
        setBuildInput(buildInputRef.current);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [loading, setMode, showToast]);

  // ── World/Level info ─────────────────────────────────────────
  const worldInfo = getWorld(world);
  const levelInfo = getLevelInfo(world, level);

  // ── Loading screen ───────────────────────────────────────────
  if (loading) {
    return (
      <div className="game-loading">
        <div className="loading-title">TYPE DEFENSE DUNGEON</div>
        <div className="loading-subtitle">Loading World {world} · Level {level}...</div>
        <div className="loading-bar-bg">
          <div className="loading-bar-fill" style={{ width: `${loadProgress * 100}%` }} />
        </div>
      </div>
    );
  }

  const waveLabel = hud.wave === 0 ? 'Wave 1 in 10s' : `Wave ${hud.wave} / 5`;

  return (
    <div className="game-container">
      {/* Header */}
      <div className="game-header">
        <div className="game-title">TYPE DEFENSE DUNGEON</div>
        <div className="game-subtitle">
          {worldInfo?.name || `World ${world}`} · Level {level} · Keys:{' '}
          <span className="game-keys">{levelInfo?.newKeys?.join('  ') || 'All'}</span>
        </div>
      </div>

      {/* HUD */}
      <HUD gold={hud.gold} hp={hud.hp} waveLabel={waveLabel} />

      {/* Canvas + overlays */}
      <div className="game-canvas-wrapper">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="game-canvas"
        />

        {/* Board input indicator */}
        {mode === 'playing' && boardInput && (
          <div className="board-input-indicator">
            {boardInput}▋
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div className="toast-notification">{toast}</div>
        )}

        {/* Mine window */}
        {mode === 'mining' && mineUI && (
          <MineWindow mineState={mineUI} />
        )}

        {/* Build menu */}
        {mode === 'buildMenu' && buildUI && (
          <BuildMenu
            buildState={buildUI}
            buildInput={buildInput}
            gold={hud.gold}
          />
        )}

        {/* Victory overlay */}
        {gameStatus === 'won' && (
          <div className="game-overlay">
            <div className="victory-panel">
              <div className="victory-title">⚔ VICTORY ⚔</div>
              <div className="victory-hp">Base HP Remaining: {hud.hp}</div>
              <div className="victory-buttons">
                <button className="btn-victory" onClick={onRestart}>PLAY AGAIN</button>
                <button className="btn-victory-secondary" onClick={onBack}>LEVEL SELECT</button>
              </div>
            </div>
          </div>
        )}

        {/* Defeat overlay */}
        {gameStatus === 'lost' && (
          <div className="game-overlay">
            <div className="defeat-panel">
              <div className="defeat-title">💀 DEFEAT 💀</div>
              <div className="defeat-text">The Na Tur'al Alliance has taken the dungeon.</div>
              <div className="defeat-buttons">
                <button className="btn-defeat" onClick={onRestart}>TRY AGAIN</button>
                <button className="btn-defeat-secondary" onClick={onBack}>LEVEL SELECT</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="game-instructions">
        Type a site code to build a tower · ENTER to mine gold · ESC to cancel · Game does not pause!
      </div>

      {/* Back button */}
      <button className="btn-back" onClick={onBack}>← Menu</button>
    </div>
  );
}
