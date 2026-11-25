import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div>
      <h1>Page not found</h1>
      <p>That page doesn't exist.</p>
      <p><Link to="/">Back to Home</Link></p>
    </div>
  );
}