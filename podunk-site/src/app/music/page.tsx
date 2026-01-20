"use client";

export default function Music() {
  return (
    <main style={{ 
      padding: "40px 24px",
      maxWidth: "900px",
      margin: "0 auto"
    }}>
      <h1 style={{ 
        fontSize: "2.5rem", 
        fontWeight: 900, 
        marginBottom: "24px",
        textAlign: "center"
      }}>
        Our Music
      </h1>

      {/* Featured Song Section */}
      <div style={{
        textAlign: "center",
        padding: "48px 24px",
        background: "linear-gradient(135deg, rgba(249, 167, 42, 0.15) 0%, rgba(19, 71, 123, 0.15) 100%)",
        border: "3px solid #F9A72A",
        borderRadius: "16px",
        marginBottom: "48px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
      }}>
        <div style={{ 
          display: "inline-block",
          padding: "8px 20px",
          background: "#F9A72A",
          color: "#13477B",
          borderRadius: "24px",
          fontSize: "1rem",
          fontWeight: "bold",
          marginBottom: "24px",
          textTransform: "uppercase",
          letterSpacing: "1.5px"
        }}>
          NOW STREAMING
        </div>
        
        <h2 style={{ 
          fontSize: "2.2rem", 
          fontWeight: 900,
          color: "#F9A72A",
          marginBottom: "16px",
          lineHeight: 1.2
        }}>
          We're on Spotify!
        </h2>
        
        <p style={{ 
          fontSize: "1.3rem", 
          lineHeight: 1.6,
          marginBottom: "32px",
          fontWeight: 500
        }}>
          Our original song <span style={{ color: "#F9A72A", fontWeight: "bold" }}>"Hot Toddy"</span> is here! 🔥
        </p>

        {/* Spotify Player */}
        <div style={{
          maxWidth: "600px",
          margin: "0 auto 32px",
          padding: "0 16px"
        }}>
          <iframe 
            style={{
              borderRadius: "12px",
              border: "none",
              width: "100%",
              height: "352px"
            }}
            src="https://open.spotify.com/embed/track/6kxI82UwjUdXNMMjmd2K5E?utm_source=generator"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="Spotify Player - Hot Toddy"
          />
        </div>

        {/* Call to Action Button */}
        <a 
          href="https://open.spotify.com/track/6kxI82UwjUdXNMMjmd2K5E"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "14px 32px",
            background: "#1DB954",
            color: "white",
            textDecoration: "none",
            borderRadius: "28px",
            fontWeight: "bold",
            fontSize: "1.1rem",
            transition: "transform 0.2s, background 0.2s",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.background = "#1ed760";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.background = "#1DB954";
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          Open in Spotify
        </a>

        <p style={{
          fontSize: "0.95rem",
          color: "rgba(255, 255, 255, 0.7)",
          marginTop: "24px",
          fontStyle: "italic"
        }}>
          Stream it, share it, add it to your playlists! 🎶
        </p>
      </div>

      <div style={{ textAlign: "center", marginTop: "48px" }}>
        <h3 style={{ 
          fontSize: "1.8rem", 
          fontWeight: 900,
          marginBottom: "20px",
          color: "#F9A72A"
        }}>
          Hear Us Live!
        </h3>
        
        <p style={{ 
          fontSize: "1.1rem", 
          lineHeight: 1.8,
          marginBottom: "28px",
          maxWidth: "700px",
          margin: "0 auto 28px"
        }}>
          Love "Hot Toddy"? Come hear it live along with our bluegrass covers, old-time tunes, and heady jams! 
          We're playing all around Columbia, SC, and throughout the Southeast.
        </p>

        <div style={{ fontSize: "2.5rem", margin: "32px 0" }}>
          🎻 🎸 🪕 🥁
        </div>

        <a 
          href="/calendar"
          style={{
            display: "inline-block",
            padding: "14px 32px",
            background: "#F9A72A",
            color: "#13477B",
            textDecoration: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            fontSize: "1.1rem",
            transition: "transform 0.2s",
            marginTop: "16px"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          📅 Check Our Show Calendar
        </a>

        <p style={{ 
          fontSize: "0.95rem", 
          fontStyle: "italic",
          color: "rgba(249, 167, 42, 0.8)",
          marginTop: "40px",
          lineHeight: 1.6
        }}>
          There's nothing quite like experiencing bluegrass live. <br />
          Bring your dancing shoes and your thirst for hot toddies! 🔥
        </p>
      </div>
    </main>
  );
}
