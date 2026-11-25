//AI assisted
import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import SongDetail from '../components/SongDetail';
import { getSong } from '../api/itunes';

export default function SongDetailPage() {
  const { id } = useParams();
  const location = useLocation();

  // Check if the song was already passed through navigation state
  const stateSong = location.state?.song;

  const [song, setSong] = useState(
    stateSong && String(stateSong.id) === id ? stateSong : null
  );
  const [loading, setLoading] = useState(
    !(stateSong && String(stateSong.id) === id)
  );
  const [error, setError] = useState(null);

  useEffect(() => {
    // Use the song from navigation state if its ID matches
    if (stateSong && String(stateSong.id) === id) {
      setSong(stateSong);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();

    async function fetchSong() {
      setLoading(true);
      setSong(null);
      setError(null);

      try {
        const result = await getSong(id, {
          signal: controller.signal,
        });

        setSong(result);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchSong();

    // Cancel the request if the component unmounts or ID changes
    return () => {
      controller.abort();
    };
  }, [id, stateSong]);

  if (loading) {
    return <p className="status-message" role="status">Loading song…</p>;
  }

  if (error) {
    return (
      <div className="error-message" role= "alert">
        <p>{error}</p>
        <Link to="/" className="back-button">
          Back to songs
        </Link>
      </div>
    );
  }

  if (!song) {
    return (
      <div className="detail-page">
        <p>This song doesn't exist or isn't available in Canada.</p>
        <Link to="/" className="back-button">
          Back to songs
        </Link>
      </div>
    );
  }

  return <SongDetail song={song} />;
}