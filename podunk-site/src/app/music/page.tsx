export default function Music() {
  return (
    <main style={{ 
      padding: "40px 24px",
      maxWidth: "800px",
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

      <div style={{
        textAlign: "center",
        padding: "48px 24px",
        background: "rgba(249, 167, 42, 0.1)",
        border: "2px solid #F9A72A",
        borderRadius: "12px",
        marginBottom: "32px"
      }}>
        <div style={{ fontSize: "4rem", marginBottom: "24px" }}>
          🎵 🎤 🎸 🪕
        </div>
        
        <h2 style={{ 
          fontSize: "1.8rem", 
          fontWeight: 700,
          color: "#F9A72A",
          marginBottom: "16px"
        }}>
          Coming Soon to a Streaming Service Near You!
        </h2>
        
        <p style={{ 
          fontSize: "1.2rem", 
          lineHeight: 1.8,
          marginBottom: "24px"
        }}>
          We don't have any recorded songs on streaming services... <em>yet</em>.
        </p>

        <div style={{
          background: "rgba(19, 71, 123, 0.3)",
          padding: "24px",
          borderRadius: "8px",
          marginTop: "32px"
        }}>
          <p style={{ 
            fontSize: "1.1rem", 
            lineHeight: 1.6,
            marginBottom: "12px"
          }}>
            <strong>Hot News:</strong>
          </p>
          <p style={{ 
            fontSize: "1rem", 
            lineHeight: 1.6
          }}>
            We're about to record our one original song, <span style={{ color: "#F9A72A", fontWeight: "bold" }}>"Hot Toddies"</span>! 
            Stay tuned for the hottest bluegrass track OF ALL TIME to hit the airwaves.
          </p>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <h3 style={{ 
          fontSize: "1.5rem", 
          fontWeight: 700,
          marginBottom: "16px"
        }}>
          In the Meantime...
        </h3>
        
        <p style={{ 
          fontSize: "1rem", 
          lineHeight: 1.6,
          marginBottom: "24px"
        }}>
          Catch us live! We're playing all around Columbia, SC, and other areas in the Southeast serving up bluegrass, old-time tunes, heady jams, and eventually, "Hot Toddies."
        </p>

        <div style={{ fontSize: "2rem", margin: "24px 0" }}>
          🎻 🎶 🎺 🥁
        </div>

        <p style={{ 
          fontSize: "0.9rem", 
          fontStyle: "italic",
          color: "#F9A72A",
          marginTop: "32px"
        }}>
          Until then, you'll just have to hear us the old-fashioned way: <br />
          in person, with your actual ears.
        </p>
      </div>
    </main>
  );
}
