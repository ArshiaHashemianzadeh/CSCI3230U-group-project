// AI-assisted (real audio from previewUrl) - see AI-USAGE.md #8
import { useRef, useState } from 'react';

// iTunes previews are about 30 seconds; we use the real length once the audio loads
const PREVIEW_LENGTH = 30;

function formatTime(seconds) {
  const whole = Math.floor(seconds);
  const m = Math.floor(whole / 60);
  const s = String(whole % 60).padStart(2, '0');
  return `${m}:${s}`;
}

export default function SongPreview({ song }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [length, setLength] = useState(PREVIEW_LENGTH);
  const [finished, setFinished] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const hasPreview = Boolean(song.previewUrl) && !loadError;

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    if (finished) {
      audio.currentTime = 0;
      setElapsed(0);
      setFinished(false);
    }

    setIsPlaying(true);
    // play() returns a promise that rejects if the browser can't play the file
    const attempt = audio.play();
    if (attempt?.catch) {
      attempt.catch((err) => {
        if (err?.name === 'AbortError') return; // paused before it started - fine
        setIsPlaying(false);
        setLoadError(true);
      });
    }
  }

  function restart() {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setElapsed(0);
    setFinished(false);
    setIsPlaying(false);
  }

  const status = isPlaying ? 'Playing' : finished ? 'Finished' : 'Paused';

  return (
    <section className="player" aria-labelledby="preview-heading">
      <h2 id="preview-heading" className="visually-hidden">Song preview</h2>

      {song.previewUrl && (
        <audio
          ref={audioRef}
          src={song.previewUrl}
          preload="none"
          onLoadedMetadata={(e) => {
            if (Number.isFinite(e.currentTarget.duration)) setLength(e.currentTarget.duration);
          }}
          onTimeUpdate={(e) => setElapsed(e.currentTarget.currentTime)}
          onEnded={() => {
            setIsPlaying(false);
            setFinished(true);
          }}
          onError={() => {
            setIsPlaying(false);
            setLoadError(true);
          }}
        />
      )}

      <div className="player-bar">
        <button
          type="button"
          className="play-button"
          onClick={togglePlay}
          disabled={!hasPreview}
        >
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
        <progress id="preview-progress" max={length} value={Math.min(elapsed, length)} />

        <span className="player-time">{formatTime(length)}</span>

        <button
          type="button"
          className="icon-button"
          onClick={restart}
          disabled={elapsed === 0 && !isPlaying}
          title="Restart"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.34-5.66M4 4v4h4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <span className="visually-hidden">Restart</span>
        </button>
      </div>

      <p className="visually-hidden" aria-live="polite">{status}</p>

      <p className="preview-note">
        {hasPreview
          ? `30-second preview of “${song.title}”, provided by Apple.`
          : `No preview is available for “${song.title}”.`}
      </p>
    </section>
  );
}
