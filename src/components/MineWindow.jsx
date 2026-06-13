// ─── Mine Window ─────────────────────────────────────────────────
// Overlay that appears when ENTER is pressed — type strings for gold

export default function MineWindow({ mineState }) {
  if (!mineState) return null;

  return (
    <div className="game-overlay">
      <div className="mine-panel">
        <div className="mine-title">⛏ MINE FOR GOLD</div>
        <div className="mine-subtitle">Type each string · ENTER or ESC to return · Game continues!</div>

        <div className="mine-words">
          {mineState.sentence.map((word, i) => {
            const done = i < mineState.idx;
            const active = i === mineState.idx;
            const typed = active ? (mineState.input || '') : '';

            return (
              <div
                key={i}
                className={`mine-word ${done ? 'done' : ''} ${active ? 'active' : ''}`}
              >
                {word.split('').map((ch, ci) => {
                  let charClass = 'upcoming';
                  if (done) charClass = 'done';
                  else if (active) {
                    if (ci < typed.length) charClass = 'typed';
                    else if (ci === typed.length) charClass = 'current';
                  }

                  return (
                    <span key={ci} className={`mine-char ${charClass}`}>
                      {ch}
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className="mine-reward-info">
          +25g per string · +50g sentence bonus · +25g perfect accuracy
        </div>
      </div>
    </div>
  );
}
