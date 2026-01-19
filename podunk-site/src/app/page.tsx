"use client";

import { useEffect, useState } from "react";
import MailingListSignup from "../components/MailingListSignup";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      // Small delay to ensure DOM is ready
      const processInstagram = () => {
        if ((window as any).instgrm) {
          (window as any).instgrm.Embeds.process();
        }
      };

      // Load Instagram script if not already loaded
      if (!document.querySelector('script[src*="instagram.com/embed.js"]')) {
        const script = document.createElement('script');
        script.src = 'https://www.instagram.com/embed.js';
        script.async = true;
        script.onload = () => {
          setTimeout(processInstagram, 100);
        };
        document.body.appendChild(script);
      } else {
        // If script is already loaded, process the embeds with a small delay
        setTimeout(processInstagram, 100);
      }
    }
  }, [mounted]);

  return (
    <main style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto"}}>
      {/* Hero Section */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem", fontWeight: 900 }}>
          Welcome to Podunk Ramblers
        </h1>
        <p style={{ fontSize: "1.2rem", marginBottom: "1rem", lineHeight: 1.6 }}>
          Combining our love for traditional Bluegrass and modern Jamgrass.
        </p>
        <p style={{ fontSize: "1rem", color: "#F9A72A" }}>
          Based in Columbia, SC
        </p>
      </div>

      {/* New Song Spotlight - Spotify */}
      <section style={{ 
        marginBottom: "4rem",
        padding: "2rem",
        background: "linear-gradient(135deg, rgba(249, 167, 42, 0.1) 0%, rgba(19, 71, 123, 0.1) 100%)",
        borderRadius: "16px",
        border: "2px solid #F9A72A"
      }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <span style={{
            display: "inline-block",
            padding: "6px 16px",
            background: "#F9A72A",
            color: "#13477B",
            borderRadius: "20px",
            fontSize: "0.9rem",
            fontWeight: "bold",
            marginBottom: "1rem",
            textTransform: "uppercase",
            letterSpacing: "1px"
          }}>
            🎵 New Release
          </span>
          <h2 style={{ 
            fontSize: "2.5rem", 
            fontWeight: 900, 
            marginBottom: "1rem",
            color: "#F9A72A"
          }}>
            Listen Now on Spotify
          </h2>
          <p style={{ fontSize: "1.1rem", marginBottom: "2rem" }}>
            Check out our latest song! Stream it now and add it to your playlist.
          </p>
        </div>
        
        <div style={{
          maxWidth: "700px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem"
        }}>
          {/* 
            INSTRUCTIONS TO ADD YOUR SPOTIFY SONG:
            
            1. Go to your song on Spotify (web player or app)
            2. Click the "..." (three dots) menu
            3. Select "Share" → "Embed track"
            4. Copy the iframe embed code
            5. Replace the src URL below with your song's embed URL
            
            The URL format looks like:
            https://open.spotify.com/embed/track/YOUR_TRACK_ID
            
            Example:
            https://open.spotify.com/embed/track/3n3Ppam7vgaVa1iaRUc9Lp
          */}
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
            title="Spotify Player"
          />
          
          <div style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap"
          }}>
            <a 
              href="https://open.spotify.com/track/6kxI82UwjUdXNMMjmd2K5E"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                background: "#1DB954",
                color: "white",
                textDecoration: "none",
                borderRadius: "24px",
                fontWeight: "bold",
                fontSize: "1rem",
                transition: "transform 0.2s, background 0.2s"
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
              🎧 Open in Spotify
            </a>
          </div>
        </div>
      </section>

      {/* Instagram Feed */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ 
          fontSize: "2rem", 
          fontWeight: 900, 
          marginBottom: "2rem",
          textAlign: "center"
        }}>
          Recent Shows & Moments
        </h2>
        
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "24px",
          marginBottom: "2rem"
        }}>
          {/* 
            To add Instagram posts:
            1. Go to the Instagram post you want to embed
            2. Click the "..." menu (top right)
            3. Click "Embed"
            4. Copy the embed code
            5. Paste it below, replacing this placeholder
            
            Example Instagram embed:
            <blockquote 
              className="instagram-media" 
              data-instgrm-permalink="https://www.instagram.com/p/YOUR_POST_ID/"
              data-instgrm-version="14"
              style={{
                background: "#FFF",
                border: 0,
                borderRadius: "3px",
                boxShadow: "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
                margin: "1px",
                maxWidth: "540px",
                minWidth: "326px",
                padding: 0,
                width: "calc(100% - 2px)"
              }}
            >
            </blockquote>
          */}
          
          {!mounted ? (
            // Show loading placeholders during SSR
            <>
              <div style={{ minHeight: "600px", background: "rgba(249, 167, 42, 0.1)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ color: "#F9A72A" }}>Loading...</p>
              </div>
              <div style={{ minHeight: "600px", background: "rgba(249, 167, 42, 0.1)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ color: "#F9A72A" }}>Loading...</p>
              </div>
              <div style={{ minHeight: "600px", background: "rgba(249, 167, 42, 0.1)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ color: "#F9A72A" }}>Loading...</p>
              </div>
              <div style={{ minHeight: "600px", background: "rgba(249, 167, 42, 0.1)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ color: "#F9A72A" }}>Loading...</p>
              </div>
            </>
          ) : (
            <>
              {/* Instagram Post 1 */}
              <div style={{ minHeight: "600px", display: "flex", alignItems: "flex-start" }}>
                <blockquote 
              className="instagram-media" 
              data-instgrm-permalink="https://www.instagram.com/p/DOQ5i5AEaKo/?utm_source=ig_embed&amp;utm_campaign=loading"
              data-instgrm-version="14"
              style={{
                background: "#FFF",
                border: 0,
                borderRadius: "3px",
                boxShadow: "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
                margin: "1px auto",
                maxWidth: "540px",
                minWidth: "326px",
                padding: 0,
                width: "calc(100% - 2px)"
              }}
            >
            </blockquote>
          </div>

          {/* Instagram Post 2 */}
          <div style={{ minHeight: "600px", display: "flex", alignItems: "flex-start" }}>
            <blockquote 
              className="instagram-media" 
              data-instgrm-permalink="https://www.instagram.com/reel/DNlUyQsRVMv/?utm_source=ig_embed&amp;utm_campaign=loading"
              data-instgrm-version="14"
              style={{
                background: "#FFF",
                border: 0,
                borderRadius: "3px",
                boxShadow: "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
                margin: "1px auto",
                maxWidth: "540px",
                minWidth: "326px",
                padding: 0,
                width: "calc(100% - 2px)"
              }}
            >
            </blockquote>
          </div>

          {/* Instagram Post 3 */}
          <div style={{ minHeight: "600px", display: "flex", alignItems: "flex-start" }}>
            <blockquote 
              className="instagram-media" 
              data-instgrm-permalink="https://www.instagram.com/reel/DKvQ0i2PLAN/?utm_source=ig_embed&amp;utm_campaign=loading"
              data-instgrm-version="14"
              style={{
                background: "#FFF",
                border: 0,
                borderRadius: "3px",
                boxShadow: "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
                margin: "1px auto",
                maxWidth: "540px",
                minWidth: "326px",
                padding: 0,
                width: "calc(100% - 2px)"
              }}
            >
            </blockquote>
          </div>

          {/* Instagram Post 4 */}
          <div style={{ minHeight: "600px", display: "flex", alignItems: "flex-start" }}>
            <blockquote 
              className="instagram-media" 
              data-instgrm-permalink="https://www.instagram.com/reel/DKvRKfnvkZc/?utm_source=ig_embed&amp;utm_campaign=loading"
              data-instgrm-version="14"
              style={{
                background: "#FFF",
                border: 0,
                borderRadius: "3px",
                boxShadow: "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
                margin: "1px auto",
                maxWidth: "540px",
                minWidth: "326px",
                padding: 0,
                width: "calc(100% - 2px)"
              }}
            >
            </blockquote>
          </div>

          {/* Instagram Post 5 */}
          <div style={{ minHeight: "600px", display: "flex", alignItems: "flex-start" }}>
            <blockquote 
              className="instagram-media" 
              data-instgrm-permalink="https://www.instagram.com/reel/DL2h9EpRS1-/?utm_source=ig_embed&amp;utm_campaign=loading"
              data-instgrm-version="14"
              style={{
                background: "#FFF",
                border: 0,
                borderRadius: "3px",
                boxShadow: "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
                margin: "1px auto",
                maxWidth: "540px",
                minWidth: "326px",
                padding: 0,
                width: "calc(100% - 2px)"
              }}
            >
            </blockquote>
          </div>

          {/* Instagram Post 6 */}
          <div style={{ minHeight: "600px", display: "flex", alignItems: "flex-start" }}>
            <blockquote 
              className="instagram-media" 
              data-instgrm-captioned
              data-instgrm-permalink="https://www.instagram.com/reel/DTV9L2Xj38_/?utm_source=ig_embed&amp;utm_campaign=loading"
              data-instgrm-version="14"
              style={{
                background: "#FFF",
                border: 0,
                borderRadius: "3px",
                boxShadow: "0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)",
                margin: "1px auto",
                maxWidth: "540px",
                minWidth: "326px",
                padding: 0,
                width: "calc(100% - 2px)"
              }}
            >
            </blockquote>
          </div>
            </>
          )}

        </div>
        
        <div style={{ 
          textAlign: "center", 
          marginTop: "24px",
          display: "flex",
          gap: "16px",
          justifyContent: "center",
          flexWrap: "wrap"
        }}>
          <a 
            href="https://www.instagram.com/podunkramblers" 
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              background: "linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)",
              color: "white",
              textDecoration: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "1rem",
              transition: "transform 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            📸 Follow us on Instagram
          </a>
          
          <a 
            href="https://www.facebook.com/p/PodunkRamblers-61574545337725/" 
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              padding: "12px 24px",
              background: "linear-gradient(45deg, #1877f2 0%, #166fe5 50%, #1565c0 100%)",
              color: "white",
              textDecoration: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "1rem",
              transition: "transform 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            👍 Like us on Facebook
          </a>
        </div>
      </section>

      {/* Mailing List Signup */}
      <section style={{ marginBottom: "3rem" }}>
        <MailingListSignup compact={true} />
      </section>

      {/* Call to Action */}
      <div style={{
        textAlign: "center",
        padding: "2rem",
        background: "rgba(249, 167, 42, 0.1)",
        border: "2px solid #F9A72A",
        borderRadius: "12px"
      }}>
        <h3 style={{ fontSize: "1.5rem", fontWeight: 900, marginBottom: "1rem" }}>
          Catch Us Live!
        </h3>
        <p style={{ fontSize: "1rem", marginBottom: "1.5rem" }}>
          Check out our calendar for upcoming shows around Columbia, SC
        </p>
        <a 
          href="/calendar"
          style={{
            display: "inline-block",
            padding: "12px 32px",
            background: "#F9A72A",
            color: "#13477B",
            textDecoration: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            fontSize: "1.1rem",
            transition: "transform 0.2s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          View Calendar
        </a>
      </div>
    </main>
  )
}