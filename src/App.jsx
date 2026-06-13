import { useState, useCallback } from 'react';
import MainMenu from './components/MainMenu.jsx';
import LevelSelect from './components/LevelSelect.jsx';
import GameScreen from './components/GameScreen.jsx';
import './index.css';

export default function App() {
  const [screen, setScreen] = useState('menu'); // 'menu' | 'levels' | 'game'
  const [world, setWorld] = useState(1);
  const [level, setLevel] = useState(1);

  const startLevel = useCallback((w, l) => {
    setWorld(w);
    setLevel(l);
    setScreen('game');
  }, []);

  const selectWorld = useCallback((w) => {
    setWorld(w);
    setScreen('levels');
  }, []);

  const goBackToMenu = useCallback(() => {
    setScreen('menu');
  }, []);

  const goBackToLevels = useCallback(() => {
    setScreen('levels');
  }, []);

  const restart = useCallback(() => {
    setScreen('levels');
    setTimeout(() => {
      setScreen('game');
    }, 50);
  }, []);

  if (screen === 'game') {
    return (
      <GameScreen
        world={world}
        level={level}
        onBack={goBackToLevels}
        onRestart={restart}
      />
    );
  }

  if (screen === 'levels') {
    return (
      <LevelSelect
        worldId={world}
        onSelectLevel={startLevel}
        onBack={goBackToMenu}
      />
    );
  }

  return <MainMenu onSelectWorld={selectWorld} />;
}

