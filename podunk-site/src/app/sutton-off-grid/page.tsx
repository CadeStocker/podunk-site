"use client";

// easter egg page for sutton since he doesn't do social media
export default function SuttonOffGrid() {
  return (
    <main style={{ 
      padding: "40px 24px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "calc(100vh - 200px)",
      textAlign: "center"
    }}>
      <div style={{ maxWidth: "600px" }}>
        <h1 style={{ 
          fontSize: "3rem", 
          fontWeight: 900, 
          marginBottom: "24px",
          color: "#F9A72A"
        }}>
          🏔️ OFF THE GRID 🏔️
        </h1>
        
        <div style={{ 
          fontSize: "5rem", 
          margin: "32px 0",
          animation: "float 3s ease-in-out infinite"
        }}>
          🚫📱
        </div>

        <h2 style={{ 
          fontSize: "1.8rem", 
          marginBottom: "16px",
          fontWeight: 700
        }}>
          Sutton Has Left the Building
        </h2>
        
        <p style={{ 
          fontSize: "1.2rem", 
          lineHeight: 1.8,
          marginBottom: "24px"
        }}>
          Looking for Sutton on social media? You've come to the wrong place, friend.
        </p>

        <div style={{
          background: "rgba(249, 167, 42, 0.1)",
          border: "2px solid #F9A72A",
          borderRadius: "8px",
          padding: "24px",
          marginBottom: "32px"
        }}>
          <p style={{ 
            fontSize: "1rem", 
            lineHeight: 1.6,
            marginBottom: "12px"
          }}>
            <strong>Current Status:</strong> Doing wizardly activities
          </p>
          <p style={{ 
            fontSize: "1rem", 
            lineHeight: 1.6,
            marginBottom: "12px"
          }}>
            <strong>Last Seen:</strong> Shredding guitar somewhere in the woods
          </p>
          <p style={{ 
            fontSize: "1rem", 
            lineHeight: 1.6
          }}>
            <strong>Social Media Presence:</strong> Nah Bruh
          </p>
        </div>

        <div style={{ fontSize: "2rem", margin: "24px 0" }}>
          🎸 🌲 ☮️ 📻 🎵
        </div>

        <p style={{ 
          fontSize: "0.9rem", 
          fontStyle: "italic",
          color: "#F9A72A",
          marginTop: "32px"
        }}>
          If you want to reach Sutton, you'll have to catch him at a show. <br />
          He's probably practicing jazz licks right now.
        </p>

        <a 
          href="/about"
          style={{
            display: "inline-block",
            marginTop: "32px",
            padding: "12px 24px",
            background: "#F9A72A",
            color: "#13477B",
            textDecoration: "none",
            borderRadius: "4px",
            fontWeight: "bold",
            transition: "transform 0.2s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          ← Back to the Band
        </a>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </main>
  );
}
