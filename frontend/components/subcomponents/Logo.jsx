import { useState } from "react";

const Logo = ({ domain }) => {
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  const transparent = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=`;

  const clientID = import.meta.env.VITE_CLIENT_ID

  const logoCDN = `https://cdn.brandfetch.io/${domain}/fallback/404/icon?c=${clientID}`;

  const src = !isLoading && !isError ? logoCDN : transparent;

  return (
    <div className="logo-wrapper">
      <img
        onLoad={() => setLoading(false)}
        onError={() => setError(true)}
        alt={`Logo of ${domain}`}
        className="icon"
        src={src}
      />

      {isError && (
        <div className="fallback">
          <p>{domain[0].toUpperCase()}</p>
        </div>
      )}
    </div>
  );
};

export default Logo