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
              data-instgrm-permalink="https://www.instagram.com/p/DPRuV7KD-T2/?utm_source=ig_embed&amp;utm_campaign=loading"
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