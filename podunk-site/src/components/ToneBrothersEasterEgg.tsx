'use client'

import { useState, useEffect } from 'react'

interface ToneBrothersEasterEggProps {
  username: string
  onComplete: () => void
}

export default function ToneBrothersEasterEgg({ username, onComplete }: ToneBrothersEasterEggProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [showAnimation, setShowAnimation] = useState(true)

  // Check if this is one of the Tone Brothers
  const isToneBrother = () => {
    const name = username.toLowerCase()
    return name.includes('sutton') || name.includes('thomas') || name.includes('tj')
  }

  useEffect(() => {
    if (!isToneBrother()) {
      onComplete()
      return
    }

    // Animation sequence for the Tone Brothers
    const steps = [
      { delay: 500, step: 1 },   // Recognition
      { delay: 1500, step: 2 },  // Bass detection
      { delay: 2500, step: 3 },  // Tone brother confirmation
      { delay: 4000, step: 4 },  // Bass celebration
      { delay: 5500, step: 5 },  // Welcome message
    ]

    steps.forEach(({ delay, step }) => {
      setTimeout(() => setCurrentStep(step), delay)
    })

    // Complete animation
    setTimeout(() => {
      setShowAnimation(false)
      onComplete()
    }, 7000)
  }, [username, onComplete])

  if (!isToneBrother() || !showAnimation) {
    return null
  }

  const getBrotherName = () => {
    const name = username.toLowerCase()
    if (name.includes('sutton')) return 'Sutton'
    if (name.includes('thomas')) return 'Thomas'
    if (name.includes('tj')) return 'TJ'
    return username
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(45deg, #1a0033 0%, #330066 25%, #663399 50%, #330066 75%, #1a0033 100%)',
      backgroundSize: '400% 400%',
      animation: 'bassWave 3s ease-in-out infinite',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      overflow: 'hidden',
      color: '#fff'
    }}>
      
      {/* Animated Musical Notes Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        fontSize: '3rem',
        opacity: 0.1
      }}>
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `floatNote ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          >
            {Math.random() > 0.5 ? '🎵' : '🎶'}
          </div>
        ))}
      </div>

      {/* Bass Guitar Visual */}
      <div style={{
        fontSize: '8rem',
        marginBottom: '2rem',
        opacity: currentStep >= 2 ? 1 : 0,
        transform: currentStep >= 2 ? 'scale(1) rotate(0deg)' : 'scale(0.3) rotate(-45deg)',
        transition: 'all 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        animation: currentStep >= 4 ? 'bassGroove 0.5s ease-in-out infinite alternate' : 'none'
      }}>
        🎸
      </div>

      {/* Status Messages */}
      <div style={{
        textAlign: 'center',
        fontFamily: 'Georgia, serif',
        fontSize: '1.4rem',
        fontWeight: 'bold',
        textShadow: '0 0 20px #ff6b9d, 0 0 40px #ff6b9d',
        letterSpacing: '1px',
        height: '4rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {currentStep === 0 && (
          <div style={{ animation: 'glow 1s ease-in-out infinite alternate' }}>
            Scanning new user...
          </div>
        )}
        {currentStep === 1 && (
          <div style={{ animation: 'glow 1s ease-in-out infinite alternate' }}>
            🔍 Analyzing musical DNA...
          </div>
        )}
        {currentStep === 2 && (
          <div style={{ animation: 'glow 1s ease-in-out infinite alternate', color: '#ffeb3b' }}>
            🎯 BASS FREQUENCY DETECTED!
          </div>
        )}
        {currentStep === 3 && (
          <div style={{ animation: 'rainbow 2s linear infinite', fontSize: '1.8rem' }}>
            🎉 TONE BROTHER IDENTIFIED! 🎉
          </div>
        )}
        {currentStep === 4 && (
          <div style={{ animation: 'bounce 0.6s ease-in-out infinite alternate' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              🎸 Welcome to the low end, {getBrotherName()}! 🎸
            </div>
            <div style={{ fontSize: '1.2rem', color: '#ff6b9d' }}>
              The foundation of every great song! 🎵
            </div>
          </div>
        )}
        {currentStep === 5 && (
          <div style={{ 
            animation: 'fadeInScale 1s ease-out',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>
              🎼 Keep those strings humming! 🎼
            </div>
            <div style={{ 
              fontSize: '1rem', 
              color: '#b3e5fc',
              fontStyle: 'italic'
            }}>
              "The bass is the heartbeat of the band" 💙
            </div>
          </div>
        )}
      </div>

      {/* Sound Wave Visualization */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        marginTop: '2rem',
        opacity: currentStep >= 2 ? 1 : 0,
        transition: 'opacity 0.5s ease'
      }}>
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            style={{
              width: '4px',
              backgroundColor: '#ff6b9d',
              borderRadius: '2px',
              animation: `soundWave 1s ease-in-out infinite`,
              animationDelay: `${i * 0.1}s`,
              height: currentStep >= 4 ? `${20 + Math.random() * 40}px` : '20px',
              transition: 'height 0.3s ease'
            }}
          />
        ))}
      </div>

      {/* Sparkle Effects */}
      {currentStep >= 3 && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}>
          {Array.from({ length: 15 }, (_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: '2rem',
                animation: `sparkle 2s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            >
              ✨
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes bassWave {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes floatNote {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }

        @keyframes bassGroove {
          0% { transform: rotate(-2deg) scale(1); }
          100% { transform: rotate(2deg) scale(1.05); }
        }

        @keyframes glow {
          0% { text-shadow: 0 0 20px #ff6b9d, 0 0 30px #ff6b9d; }
          100% { text-shadow: 0 0 30px #ff6b9d, 0 0 50px #ff6b9d; }
        }

        @keyframes rainbow {
          0% { color: #ff6b9d; }
          16% { color: #ffa726; }
          32% { color: #ffeb3b; }
          48% { color: #66bb6a; }
          64% { color: #42a5f5; }
          80% { color: #ab47bc; }
          100% { color: #ff6b9d; }
        }

        @keyframes bounce {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-10px); }
        }

        @keyframes fadeInScale {
          0% { 
            opacity: 0; 
            transform: scale(0.8) translateY(20px); 
          }
          100% { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
        }

        @keyframes soundWave {
          0%, 100% { height: 20px; opacity: 0.5; }
          50% { height: 60px; opacity: 1; }
        }

        @keyframes sparkle {
          0%, 100% { 
            opacity: 0; 
            transform: scale(0) rotate(0deg); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1) rotate(180deg); 
          }
        }
      `}</style>
    </div>
  )
}