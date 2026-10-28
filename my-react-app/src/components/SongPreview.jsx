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

  return (
    <section className="song-preview" aria-labelledby="preview-heading">
      <h2 id="preview-heading">Song Preview</h2>

      <p className="preview-note">
        Simulated {PREVIEW_LENGTH}-second preview of “{song.title}”. Real audio
        will play once the API is connected.
      </p>

      <div className="preview-controls">
        <button
          type="button"
          className="button"
          onClick={togglePlay}
          aria-pressed={isPlaying}
        >
          {isPlaying ? 'Pause Preview' : 'Play Preview'}
        </button>

        <button
          type="button"
          className="button secondary"
          onClick={restart}
          disabled={elapsed === 0}
        >
          Restart
        </button>
      </div>

      <label htmlFor="preview-progress" className="visually-hidden">
        Preview progress
      </label>
      <progress id="preview-progress" max={PREVIEW_LENGTH} value={elapsed} />

      <p className="preview-time" aria-live="polite">
        {isPlaying ? 'Playing' : elapsed >= PREVIEW_LENGTH ? 'Finished' : 'Paused'}
        {' · '}
        {formatTime(elapsed)} / {formatTime(PREVIEW_LENGTH)}
      </p>
    </section>
  );
}