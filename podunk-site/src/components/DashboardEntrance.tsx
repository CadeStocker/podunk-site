'use client'

import { useState, useEffect } from 'react'

interface DashboardEntranceProps {
  children: React.ReactNode
  isAuthenticated: boolean
}

export default function DashboardEntrance({ children, isAuthenticated }: DashboardEntranceProps) {
  const [showEntrance, setShowEntrance] = useState(false)
  const [entranceComplete, setEntranceComplete] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (isAuthenticated && !entranceComplete) {
      setShowEntrance(true)
      
      // Animation sequence
      const steps = [
        { delay: 500, step: 1 }, // Security scanning
        { delay: 1500, step: 2 }, // Access granted
        { delay: 2500, step: 3 }, // Door opening
        { delay: 3500, step: 4 }, // Reveal dashboard
      ]

      steps.forEach(({ delay, step }) => {
        setTimeout(() => setCurrentStep(step), delay)
      })

      // Complete entrance after all steps
      setTimeout(() => {
        setEntranceComplete(true)
        setShowEntrance(false)
      }, 4000)
    }
  }, [isAuthenticated, entranceComplete])

  if (!isAuthenticated) {
    return <>{children}</>
  }

  if (showEntrance && !entranceComplete) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0a0a0a 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        overflow: 'hidden'
      }}>
        {/* Animated Background Grid */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridMove 3s ease-in-out',
          opacity: currentStep >= 1 ? 1 : 0,
          transition: 'opacity 0.5s ease'
        }} />

        {/* Security Scanner Effect */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '4px',
          background: 'linear-gradient(90deg, transparent, #00ffff, transparent)',
          animation: currentStep >= 1 ? 'scanLine 2s ease-in-out' : 'none',
          opacity: currentStep >= 1 && currentStep < 3 ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }} />

        {/* Central Interface */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          color: '#00ffff',
          textAlign: 'center',
          fontFamily: 'monospace',
          fontSize: '1.2rem',
          textShadow: '0 0 10px #00ffff'
        }}>
          
          {/* Logo/Icon */}
          <div style={{
            fontSize: '4rem',
            marginBottom: '2rem',
            opacity: currentStep >= 1 ? 1 : 0,
            transform: currentStep >= 1 ? 'scale(1)' : 'scale(0.5)',
            transition: 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
          }}>
            🕶️
          </div>

          {/* Status Messages */}
          <div style={{
            height: '3rem',
            display: 'flex',
            alignItems: 'center',
            fontSize: '1.1rem',
            letterSpacing: '2px'
          }}>
            {currentStep === 0 && (
              <div style={{ animation: 'fadeIn 0.5s ease' }}>
                INITIALIZING SECURE CONNECTION...
              </div>
            )}
            {currentStep === 1 && (
              <div style={{ animation: 'fadeIn 0.5s ease' }}>
                <span style={{ color: '#ffff00' }}>⚠️ SCANNING BIOMETRICS...</span>
              </div>
            )}
            {currentStep === 2 && (
              <div style={{ animation: 'fadeIn 0.5s ease' }}>
                <span style={{ color: '#00ff00' }}>✅ ACCESS GRANTED</span>
              </div>
            )}
            {currentStep === 3 && (
              <div style={{ animation: 'fadeIn 0.5s ease' }}>
                <span style={{ color: '#00ff00' }}>🚪 ENTERING SECURE AREA...</span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div style={{
            width: '300px',
            height: '3px',
            backgroundColor: 'rgba(0, 255, 255, 0.2)',
            marginTop: '2rem',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              backgroundColor: '#00ffff',
              width: `${(currentStep / 4) * 100}%`,
              transition: 'width 0.8s ease',
              boxShadow: '0 0 10px #00ffff'
            }} />
          </div>

          {/* Hexagonal Elements */}
          <div style={{
            position: 'absolute',
            top: '20%',
            right: '10%',
            fontSize: '2rem',
            opacity: currentStep >= 2 ? 1 : 0,
            animation: currentStep >= 2 ? 'float 3s ease-in-out infinite' : 'none'
          }}>
            ⬡
          </div>
          <div style={{
            position: 'absolute',
            bottom: '30%',
            left: '15%',
            fontSize: '1.5rem',
            opacity: currentStep >= 2 ? 1 : 0,
            animation: currentStep >= 2 ? 'float 3s ease-in-out infinite 1s' : 'none'
          }}>
            ⬢
          </div>
        </div>

        {/* Door Opening Effect */}
        {currentStep >= 3 && (
          <>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '50%',
              height: '100%',
              backgroundColor: '#0a0a0a',
              borderRight: '2px solid #00ffff',
              animation: 'doorLeft 1s ease-in-out forwards',
              zIndex: 1
            }} />
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '50%',
              height: '100%',
              backgroundColor: '#0a0a0a',
              borderLeft: '2px solid #00ffff',
              animation: 'doorRight 1s ease-in-out forwards',
              zIndex: 1
            }} />
          </>
        )}

        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes gridMove {
            0% { transform: translate(0, 0); }
            50% { transform: translate(-25px, -25px); }
            100% { transform: translate(0, 0); }
          }

          @keyframes scanLine {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100vw); }
          }

          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }

          @keyframes doorLeft {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
          }

          @keyframes doorRight {
            0% { transform: translateX(0); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    )
  }

  // Show dashboard with entrance effect if just completed
  if (entranceComplete) {
    return (
      <div style={{
        animation: 'dashboardReveal 0.8s ease-out',
        opacity: 1
      }}>
        {children}
        <style jsx>{`
          @keyframes dashboardReveal {
            0% { 
              opacity: 0; 
              transform: scale(0.95) translateY(20px);
              filter: blur(5px);
            }
            100% { 
              opacity: 1; 
              transform: scale(1) translateY(0);
              filter: blur(0px);
            }
          }
        `}</style>
      </div>
    )
  }

  return <>{children}</>
}