import { useState, useEffect } from 'react';

const PREVIEW_LENGTH = 30;

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

export default function SongPreview({ song }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  // fake playback until we hook up the API
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setElapsed((prev) => {
        if (prev + 1 >= PREVIEW_LENGTH) {
          setIsPlaying(false);
          return PREVIEW_LENGTH;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  function togglePlay() {
    // start over if it already finished
    if (elapsed >= PREVIEW_LENGTH) setElapsed(0);
    setIsPlaying((prev) => !prev);
  }

  function restart() {
    setElapsed(0);
    setIsPlaying(false);
  }

  const status = isPlaying ? 'Playing' : elapsed >= PREVIEW_LENGTH ? 'Finished' : 'Paused';

  return (
    <section className="player" aria-labelledby="preview-heading">
      <h2 id="preview-heading" className="visually-hidden">Song preview</h2>

      <div className="player-bar">
        <button type="button" className="play-button" onClick={togglePlay}>
          {isPlaying ? (
            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" /></svg>
          )}
          {/* Hidden text gives the button its name for screen readers (and the tests) */}
          <span className="visually-hidden">{isPlaying ? 'Pause Preview' : 'Play Preview'}</span>
        </button>

        <span className="player-time">{formatTime(elapsed)}</span>

        <label htmlFor="preview-progress" className="visually-hidden">
          Preview progress
        </label>
        <progress id="preview-progress" max={PREVIEW_LENGTH} value={elapsed} />

        <span className="player-time">{formatTime(PREVIEW_LENGTH)}</span>

        <button
          type="button"
          className="icon-button"
          onClick={restart}
          disabled={elapsed === 0}
          title="Restart"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.34-5.66M4 4v4h4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <span className="visually-hidden">Restart</span>
        </button>
      </div>

      <p className="visually-hidden" aria-live="polite">{status}</p>

      <p className="preview-note">
        Simulated {PREVIEW_LENGTH}-second preview of “{song.title}”. Real audio will play once
        the API is connected.
      </p>
    </section>
  );
}