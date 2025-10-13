"use client";

import { useState } from "react";

export default function AboutPage() {
  const [isAssembling, setIsAssembling] = useState(false);
  const [showMegazord, setShowMegazord] = useState(false);

  const handleAssemble = () => {
    setIsAssembling(true);
    
    // Show the megazord after animation completes
    setTimeout(() => {
      setShowMegazord(true);
    }, 2000);
  };

  const handleReset = () => {
    setIsAssembling(false);
    setShowMegazord(false);
  };

  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ marginTop: 0, fontWeight: 900, fontSize: "1.6rem" }}>About Us</h1>
      <p>
        <br />
        We're a 5 piece Bluegrass band based out of Columbia, SC playing a mix of traditional Bluegrass and modern Jamgrass.
        <br />
        Our goal is to bring high-energy performances and fast pickin' to every show we play.
      </p>

      {/* Band member section */}
      <section style={{ marginTop: 48 }}>
        <h2 style={{ fontWeight: 900, fontSize: "1.4rem", marginBottom: 32 }}>Meet the Band</h2>
        
        <div className="band-grid">
          {/* Ethan Masset */}
          <div style={{ textAlign: "center" }}>
            <a 
              href="https://www.instagram.com/bymasset/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="band-member-link"
            >
              <div style={{ 
                width: "200px", 
                height: "200px", 
                margin: "0 auto 16px",
                borderRadius: "50%",
                overflow: "hidden",
                background: "#ddd"
              }}>
                <img 
                  src="/band-members/ethan2.png" 
                  alt="Ethan Masset"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </a>
            <h3 style={{ marginBottom: 8, fontSize: "1.2rem" }}>Ethan Masset</h3>
            <p style={{ fontWeight: "bold", margin: "8px 0", color: "#F9A72A" }}>Mandolin, Vocals</p>
            <p style={{ fontSize: "0.9rem", lineHeight: 1.6 }}>
            Ethan sings and shreds the mandolin with passion, hailing from the beautiful state of Ohio.
            </p>
          </div>

          {/* Sutton Jenkins */}
          <div style={{ textAlign: "center" }}>
            <a 
              href="/sutton-off-grid"
              className="band-member-link"
            >
              <div style={{ 
                width: "200px", 
                height: "200px", 
                margin: "0 auto 16px",
                borderRadius: "50%",
                overflow: "hidden",
                background: "#ddd"
              }}>
                <img 
                  src="/band-members/sutton2.png" 
                  alt="Sutton Jenkins"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </a>
            <h3 style={{ marginBottom: 8, fontSize: "1.2rem" }}>Sutton Jenkins</h3>
            <p style={{ fontWeight: "bold", margin: "8px 0", color: "#F9A72A" }}>Guitar, Vocals</p>
            <p style={{ fontSize: "0.9rem", lineHeight: 1.6 }}>
                Sutton is a jazz studies major, bringing tasty licks and raw bodaciousness to his shredding. He comes all the way from Georgia.
            </p>
          </div>

          {/* Tripp Sponseller */}
          <div style={{ textAlign: "center" }}>
            <a 
              href="https://www.instagram.com/tripp_sponseller/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="band-member-link"
            >
              <div style={{ 
                width: "200px", 
                height: "200px", 
                margin: "0 auto 16px",
                borderRadius: "50%",
                overflow: "hidden",
                background: "#ddd"
              }}>
                <img 
                  src="/band-members/tripp2.png" 
                  alt="Tripp Sponseller"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </a>
            <h3 style={{ marginBottom: 8, fontSize: "1.2rem" }}>Tripp Sponseller</h3>
            <p style={{ fontWeight: "bold", margin: "8px 0", color: "#F9A72A" }}>Banjo, Vocals</p>
            <p style={{ fontSize: "0.9rem", lineHeight: 1.6 }}>
            Tripp plays both 3-finger and clawhammer styles of banjo. He is a true grasser from South Carolina.
            </p>
          </div>

          {/* Thomas Johnson */}
          <div className="band-member-left" style={{ textAlign: "center" }}>
            <a 
              href="https://www.instagram.com/thomas.jay.johnson/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="band-member-link"
            >
              <div style={{ 
                width: "200px", 
                height: "200px", 
                margin: "0 auto 16px",
                borderRadius: "50%",
                overflow: "hidden",
                background: "#ddd"
              }}>
                <img 
                  src="/band-members/tj2.png" 
                  alt="Thomas Johnson"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </a>
            <h3 style={{ marginBottom: 8, fontSize: "1.2rem" }}>Thomas Johnson</h3>
            <p style={{ fontWeight: "bold", margin: "8px 0", color: "#F9A72A" }}>Bass</p>
            <p style={{ fontSize: "0.9rem", lineHeight: 1.6 }}>
                Thomas "TJ" Johnson thumps the bass and keeps the band grounded with his steady rhythms. He hails from the lowcountry of South Carolina.
            </p>
          </div>

          {/* Cade Stocker */}
          <div className="band-member-right" style={{ textAlign: "center" }}>
            <a 
              href="https://www.instagram.com/cadestocker/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="band-member-link"
            >
              <div style={{ 
                width: "200px", 
                height: "200px", 
                margin: "0 auto 16px",
                borderRadius: "50%",
                overflow: "hidden",
                background: "#ddd"
              }}>
                <img 
                  src="/band-members/cade2.png" 
                  alt="Cade Stocker"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </a>
            <h3 style={{ marginBottom: 8, fontSize: "1.2rem" }}>Cade Stocker</h3>
            <p style={{ fontWeight: "bold", margin: "8px 0", color: "#F9A72A" }}>Guitar, Vocals</p>
            <p style={{ fontSize: "0.9rem", lineHeight: 1.6 }}>
                Cade sings and flatpicks with fervor, bringing energy and harmony to the band's sound. He hails from South Carolina.
            </p>
          </div>
        </div>

        {/* Assemble Button */}
        {!showMegazord && (
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <button
              onClick={handleAssemble}
              disabled={isAssembling}
              style={{
                padding: "16px 32px",
                fontSize: "1.3rem",
                fontWeight: 900,
                background: isAssembling ? "#666" : "linear-gradient(45deg, #F9A72A, #ff6b00)",
                color: "#13477B",
                border: "4px solid #F9A72A",
                borderRadius: "8px",
                cursor: isAssembling ? "not-allowed" : "pointer",
                boxShadow: "0 4px 15px rgba(249, 167, 42, 0.5)",
                transition: "all 0.3s",
                textTransform: "uppercase",
                letterSpacing: "2px"
              }}
              onMouseEnter={(e) => {
                if (!isAssembling) {
                  e.currentTarget.style.transform = "scale(1.1)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(249, 167, 42, 0.8)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(249, 167, 42, 0.5)";
              }}
            >
              {isAssembling ? "⚡ ASSEMBLING... ⚡" : "🎸 ASSEMBLE THE RAMBLERS 🎸"}
            </button>
          </div>
        )}
      </section>

      {/* Merging Animation Overlay */}
      {isAssembling && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
            pointerEvents: "none"
          }}
        >
          {/* Cloned images that fly to center and merge */}
          <div style={{ position: "relative", width: "300px", height: "300px" }}>
            <div style={{
              position: "absolute",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              overflow: "hidden",
              animation: "flyFromTop 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
              boxShadow: "0 0 60px rgba(249, 167, 42, 1), 0 0 100px rgba(249, 167, 42, 0.8), 0 0 140px rgba(249, 167, 42, 0.6)"
            }}>
              <img src="/band-members/ethan2.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            
            <div style={{
              position: "absolute",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              overflow: "hidden",
              animation: "flyFromLeft 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
              boxShadow: "0 0 60px rgba(249, 167, 42, 1), 0 0 100px rgba(249, 167, 42, 0.8), 0 0 140px rgba(249, 167, 42, 0.6)"
            }}>
              <img src="/band-members/sutton2.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            
            <div style={{
              position: "absolute",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              overflow: "hidden",
              animation: "flyFromRight 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
              boxShadow: "0 0 60px rgba(249, 167, 42, 1), 0 0 100px rgba(249, 167, 42, 0.8), 0 0 140px rgba(249, 167, 42, 0.6)"
            }}>
              <img src="/band-members/tripp2.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            
            <div style={{
              position: "absolute",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              overflow: "hidden",
              animation: "flyFromBottomLeft 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
              boxShadow: "0 0 60px rgba(249, 167, 42, 1), 0 0 100px rgba(249, 167, 42, 0.8), 0 0 140px rgba(249, 167, 42, 0.6)"
            }}>
              <img src="/band-members/tj2.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            
            <div style={{
              position: "absolute",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              overflow: "hidden",
              animation: "flyFromBottomRight 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
              boxShadow: "0 0 60px rgba(249, 167, 42, 1), 0 0 100px rgba(249, 167, 42, 0.8), 0 0 140px rgba(249, 167, 42, 0.6)"
            }}>
              <img src="/band-members/cade2.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </div>
        </div>
      )}

      {/* Megazord Overlay */}
      {showMegazord && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.95)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            animation: "fadeIn 0.5s"
          }}
          onClick={handleReset}
        >
          <div style={{ textAlign: "center", maxWidth: "90%" }}>
            <h2 style={{
              fontSize: "3rem",
              fontWeight: 900,
              color: "#F9A72A",
              marginBottom: "24px",
              textShadow: "0 0 20px #F9A72A",
              animation: "pulse 2s infinite"
            }}>
              ⚡ BLUEGRASS MEGAZORD ACTIVATED ⚡
            </h2>
            
            <div style={{
              width: "400px",
              height: "400px",
              maxWidth: "90vw",
              maxHeight: "60vh",
              margin: "0 auto",
              borderRadius: "50%",
              overflow: "hidden",
              border: "6px solid #F9A72A",
              boxShadow: "0 0 40px #F9A72A, 0 0 80px rgba(249, 167, 42, 0.5)",
              animation: "heroAppear 0.8s ease-out"
            }}>
              <img
                src="https://i.discogs.com/A1ab_pd7MLN7KrNDtMt59xL66czQyKWHOdqelLLO2c4/rs:fit/g:sm/q:90/h:360/w:505/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9BLTM3MDYx/Mi0xNjE0ODA3OTQ1/LTM5MTguanBlZw.jpeg"
                alt="The Legendary Bluegrass Megazord"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />
            </div>

            <p style={{
              fontSize: "1.5rem",
              marginTop: "32px",
              color: "#fff",
              fontWeight: 700
            }}>
                YOU'VE SUMMONED A TONY RICE <br />
              THE ULTIMATE BLUEGRASS POWER!
            </p>

            <p style={{
              fontSize: "1rem",
              marginTop: "16px",
              color: "#F9A72A",
              fontStyle: "italic"
            }}>
              (Click anywhere to disassemble)
            </p>
          </div>
        </div>
      )}

      {/* Assembly Animation Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes heroAppear {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.2) rotate(180deg);
          }
          100% {
            transform: scale(1) rotate(360deg);
            opacity: 1;
          }
        }

        /* Flying animations for each member */
        @keyframes flyFromTop {
          0% {
            top: -300px;
            left: 50%;
            transform: translate(-50%, 0) scale(1) rotate(0deg);
            opacity: 1;
          }
          100% {
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes flyFromLeft {
          0% {
            top: 50%;
            left: -300px;
            transform: translate(0, -50%) scale(1) rotate(0deg);
            opacity: 1;
          }
          100% {
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes flyFromRight {
          0% {
            top: 50%;
            right: -300px;
            left: auto;
            transform: translate(0, -50%) scale(1) rotate(0deg);
            opacity: 1;
          }
          100% {
            top: 50%;
            left: 50%;
            right: auto;
            transform: translate(-50%, -50%) scale(0) rotate(-720deg);
            opacity: 0;
          }
        }

        @keyframes flyFromBottomLeft {
          0% {
            bottom: -300px;
            left: 20%;
            top: auto;
            transform: translate(-50%, 0) scale(1) rotate(0deg);
            opacity: 1;
          }
          100% {
            top: 50%;
            left: 50%;
            bottom: auto;
            transform: translate(-50%, -50%) scale(0) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes flyFromBottomRight {
          0% {
            bottom: -300px;
            left: 80%;
            top: auto;
            transform: translate(-50%, 0) scale(1) rotate(0deg);
            opacity: 1;
          }
          100% {
            top: 50%;
            left: 50%;
            bottom: auto;
            transform: translate(-50%, -50%) scale(0) rotate(-720deg);
            opacity: 0;
          }
        }

        .band-grid {
          ${isAssembling ? `
            position: relative;
          ` : ''}
        }

        .band-grid > div {
          ${isAssembling ? `
            opacity: 0.3;
            transition: opacity 0.5s;
          ` : ''}
        }
      `}</style>
    </main>
  );
}
