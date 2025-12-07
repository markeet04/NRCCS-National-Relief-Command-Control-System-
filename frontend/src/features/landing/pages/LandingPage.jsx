import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';


const LandingPage = () => {
  const navigate = useNavigate();
  const [showWelcome, setShowWelcome] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  const handleGetStarted = () => {
    setShowWelcome(false);
  };

  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminError, setAdminError] = useState('');

  const handleCitizenPortal = () => {
    navigate('/civilian');
  };

  const handleSuperAdminLogin = (e) => {
    e.preventDefault();
    // Simple demo: username: admin, password: admin123
    if (adminUser === 'admin' && adminPass === 'admin123') {
      setShowAdminLogin(false);
      setAdminError('');
      navigate('/superadmin');
    } else {
      setAdminError('Invalid credentials');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e8f5e9 50%, #f1f5f9 100%)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Welcome Screen Overlay */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #020617 100%)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Decorative elements */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.08, 0.05] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: 'absolute',
                top: '-100px',
                right: '-100px',
                width: '400px',
                height: '400px',
                background: 'rgba(0, 102, 0, 0.15)',
                borderRadius: '50%',
                filter: 'blur(80px)'
              }}
            />
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.03, 0.06, 0.03] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              style={{
                position: 'absolute',
                bottom: '-100px',
                left: '-100px',
                width: '350px',
                height: '350px',
                background: 'rgba(100, 200, 100, 0.08)',
                borderRadius: '50%',
                filter: 'blur(80px)'
              }}
            />

            {/* Geometric Shapes */}
            <motion.div
              animate={{ rotate: [0, 360], y: [0, -20, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              style={{
                position: 'absolute',
                top: '15%',
                left: '8%',
                width: '100px',
                height: '100px',
                border: '2px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '20px',
                transform: 'rotate(45deg)'
              }}
            />
            <motion.div
              animate={{ rotate: [0, -360], scale: [1, 1.2, 1] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: 'absolute',
                top: '60%',
                right: '12%',
                width: '80px',
                height: '80px',
                border: '2px solid rgba(16, 185, 129, 0.15)',
                borderRadius: '50%'
              }}
            />
            <motion.div
              animate={{ y: [0, 30, 0], rotate: [0, 180, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              style={{
                position: 'absolute',
                bottom: '20%',
                right: '20%',
                width: '60px',
                height: '60px',
                border: '2px solid rgba(100, 200, 100, 0.2)',
                clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)'
              }}
            />
            <motion.div
              animate={{ x: [0, 20, 0], rotate: [0, 90, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: 'absolute',
                top: '30%',
                right: '15%',
                width: '70px',
                height: '70px',
                border: '2px solid rgba(16, 185, 129, 0.18)',
                borderRadius: '15px'
              }}
            />
            <motion.div
              animate={{ rotate: [0, 180, 360], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              style={{
                position: 'absolute',
                bottom: '35%',
                left: '15%',
                width: '90px',
                height: '90px',
                border: '3px solid rgba(16, 185, 129, 0.12)',
                borderRadius: '50%',
                borderStyle: 'dashed'
              }}
            />
            <motion.div
              animate={{ y: [0, -25, 0], x: [0, 15, 0] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              style={{
                position: 'absolute',
                top: '70%',
                left: '10%',
                width: '50px',
                height: '50px',
                background: 'rgba(16, 185, 129, 0.08)',
                borderRadius: '10px',
                transform: 'rotate(30deg)'
              }}
            />

            {/* Welcome Content */}
            <div style={{ textAlign: 'center', padding: '40px', maxWidth: '800px', position: 'relative', zIndex: 1 }}>
              {/* Logo/Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                style={{
                  width: '120px',
                  height: '120px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 40px',
                  border: '2px solid rgba(0, 102, 0, 0.3)',
                  boxShadow: '0 20px 60px rgba(0, 102, 0, 0.2)'
                }}
              >
                <svg style={{ width: '60px', height: '60px', color: '#10b981' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </motion.div>

              {/* Welcome Title */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <h1 style={{
                  fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                  fontWeight: '800',
                  color: 'white',
                  marginBottom: '20px',
                  lineHeight: '1.1',
                  textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                }}>
                  Welcome to NRCCS
                </h1>
              </motion.div>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                style={{
                  fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
                  color: 'rgba(255, 255, 255, 0.9)',
                  lineHeight: '1.6',
                  marginBottom: '50px',
                  fontWeight: '300',
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
                }}
              >
                National Relief Command & Control System
                <span style={{ display: 'block', marginTop: '15px', fontSize: '1rem', opacity: 0.8 }}>
                  Your gateway to disaster management and emergency response
                </span>
              </motion.p>

              {/* Get Started Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                whileHover={{ scale: 1.05, boxShadow: '0 20px 60px rgba(16, 185, 129, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                style={{
                  padding: '18px 50px',
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  color: '#1e293b',
                  background: 'white',
                  border: 'none',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <motion.span
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}
                >
                  Get Started
                  <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </motion.span>
              </motion.button>

              {/* Scroll indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, delay: 1.5, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  marginTop: '60px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.9rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
              
               
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Animated background */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.08, 0.05] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: 'absolute', top: '-200px', right: '-200px', width: '500px', height: '500px', background: 'rgba(0, 102, 0, 0.05)', borderRadius: '50%', filter: 'blur(80px)', zIndex: 0 }} 
      />
      <motion.div 
        animate={{ scale: [1, 1.15, 1], opacity: [0.03, 0.06, 0.03] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        style={{ position: 'absolute', bottom: '-150px', left: '-150px', width: '400px', height: '400px', background: 'rgba(0, 102, 0, 0.03)', borderRadius: '50%', filter: 'blur(80px)', zIndex: 0 }} 
      />
      
      {/* Floating shapes */}
      <motion.div animate={{ y: [0, -30, 0], rotate: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} style={{ position: 'absolute', top: '20%', left: '10%', width: '60px', height: '60px', border: '2px solid rgba(0, 102, 0, 0.1)', borderRadius: '12px', zIndex: 0 }} />
      <motion.div animate={{ y: [0, 40, 0], rotate: [0, -15, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} style={{ position: 'absolute', bottom: '30%', right: '8%', width: '80px', height: '80px', border: '2px solid rgba(0, 102, 0, 0.08)', borderRadius: '50%', zIndex: 0 }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Hero */}
        <motion.div style={{ opacity }} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }}>
          <div style={{ textAlign: 'center', padding: '80px 20px 60px', maxWidth: '900px', margin: '0 auto' }}>
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '800', color: '#1e293b', marginBottom: '20px', lineHeight: '1.2' }}>
              National Relief Command
              <motion.span initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.5 }} style={{ display: 'block', color: '#006600', marginTop: '10px' }}>
                & Control System
              </motion.span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.7 }} style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: '#475569', lineHeight: '1.6', maxWidth: '700px', margin: '0 auto' }}>
              Unified platform for real-time flood alerts, rescue coordination, and national disaster management across Pakistan.
            </motion.p>
            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.9 }} style={{ width: '80px', height: '4px', background: 'linear-gradient(90deg, transparent, #006600, transparent)', margin: '40px auto 0', borderRadius: '2px' }} />
          </div>
        </motion.div>

        {/* Cards */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 450px))', gap: '30px', maxWidth: '1000px', width: '100%', padding: '0 20px' }}>
            {/* Card 1 */}
            <motion.div
              initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 1.1 }}
              whileHover={{ y: -12, boxShadow: '0 30px 60px -15px rgba(0, 102, 0, 0.35)' }}
              onHoverStart={() => setHoveredCard('internal')} onHoverEnd={() => setHoveredCard(null)}
              style={{ background: 'white', borderRadius: '24px', padding: '50px 40px', textAlign: 'center', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(0, 0, 0, 0.05)', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
            >
              <motion.div animate={{ opacity: hoveredCard === 'internal' ? 0.03 : 0 }} transition={{ duration: 0.3 }} style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #006600 0%, #004400 100%)', zIndex: 0 }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <motion.div animate={{ scale: hoveredCard === 'internal' ? 1.1 : 1, rotate: hoveredCard === 'internal' ? 5 : 0 }} transition={{ duration: 0.3 }} style={{ width: '80px', height: '80px', background: '#006600', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px', boxShadow: '0 10px 25px rgba(0, 102, 0, 0.3)' }}>
                  <motion.svg animate={{ scale: hoveredCard === 'internal' ? [1, 1.2, 1] : 1 }} transition={{ duration: 0.5 }} style={{ width: '40px', height: '40px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </motion.svg>
                </motion.div>
                <motion.h3 animate={{ color: hoveredCard === 'internal' ? '#006600' : '#1e293b' }} style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '15px', transition: 'color 0.3s' }}>Internal System Login</motion.h3>
                <p style={{ fontSize: '1rem', color: '#64748b', lineHeight: '1.6', marginBottom: '30px' }}>Authorized access for NDMA, PDMA, and district authorities. Command center for disaster coordination.</p>
                
                {/* Login Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                  <motion.button 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/ndma')}
                    style={{ width: '100%', padding: '14px 24px', background: '#006600', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 102, 0, 0.3)' }} 
                    onMouseOver={(e) => e.target.style.background = '#005200'} 
                    onMouseOut={(e) => e.target.style.background = '#006600'}
                  >
                    Login as NDMA
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/pdma')}
                    style={{ width: '100%', padding: '14px 24px', background: '#006600', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 102, 0, 0.3)' }} 
                    onMouseOver={(e) => e.target.style.background = '#005200'} 
                    onMouseOut={(e) => e.target.style.background = '#006600'}
                  >
                    Login as PDMA
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/district')}
                    style={{ width: '100%', padding: '14px 24px', background: '#006600', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 102, 0, 0.3)' }} 
                    onMouseOver={(e) => e.target.style.background = '#005200'} 
                    onMouseOut={(e) => e.target.style.background = '#006600'}
                  >
                    Login as District
                  </motion.button>
                </div>
                
                <motion.div animate={{ opacity: hoveredCard === 'internal' ? 1 : 0.6 }} style={{ marginTop: '20px', fontSize: '0.875rem', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <svg style={{ width: '16px', height: '16px' }} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                  Secure Access Required
                </motion.div>
              </div>
            </motion.div>

            {/* Card 2: Citizen Portal */}
            <motion.div
              initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 1.3 }}
              whileHover={{ y: -12, boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.2)' }}
              onHoverStart={() => setHoveredCard('citizen')} onHoverEnd={() => setHoveredCard(null)}
              style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)', borderRadius: '24px', padding: '50px 40px', textAlign: 'center', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)', border: '2px solid #e2e8f0', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
            >
              <motion.div animate={{ opacity: hoveredCard === 'citizen' ? 0.02 : 0 }} transition={{ duration: 0.3 }} style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #006600 0%, #00aa00 100%)', zIndex: 0 }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <motion.div animate={{ scale: hoveredCard === 'citizen' ? 1.1 : 1, rotate: hoveredCard === 'citizen' ? -5 : 0 }} transition={{ duration: 0.3 }} style={{ width: '80px', height: '80px', background: '#f1f5f9', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px', boxShadow: '0 5px 20px rgba(0, 0, 0, 0.08)' }}>
                  <motion.svg animate={{ scale: hoveredCard === 'citizen' ? [1, 1.2, 1] : 1 }} transition={{ duration: 0.5 }} style={{ width: '40px', height: '40px', color: '#006600' }} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </motion.svg>
                </motion.div>
                <motion.h3 animate={{ color: hoveredCard === 'citizen' ? '#006600' : '#1e293b' }} style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '15px', transition: 'color 0.3s' }}>Citizen Portal</motion.h3>
                <p style={{ fontSize: '1rem', color: '#64748b', lineHeight: '1.6', marginBottom: '30px' }}>Public access for citizens to view real-time alerts, safety information, and emergency resources.</p>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ width: '100%', padding: '16px 32px', background: 'white', color: '#006600', border: '2px solid #006600', borderRadius: '12px', fontSize: '1.1rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s' }} onClick={handleCitizenPortal} onMouseOver={(e) => { e.target.style.background = '#006600'; e.target.style.color = 'white'; }} onMouseOut={(e) => { e.target.style.background = 'white'; e.target.style.color = '#006600'; }}>
                  <motion.span animate={{ x: hoveredCard === 'citizen' ? [0, 3, 0] : 0 }} transition={{ duration: 0.5 }} style={{ display: 'inline-block' }}>Visit Citizen Portal →</motion.span>
                </motion.button>
                <motion.div animate={{ opacity: hoveredCard === 'citizen' ? 1 : 0.6 }} style={{ marginTop: '20px', fontSize: '0.875rem', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <svg style={{ width: '16px', height: '16px' }} fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" /></svg>
                  Open to All Citizens
                </motion.div>
              </div>
            </motion.div>

            {/* Card 3: Super Admin Portal */}
            <motion.div
              initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 1.5 }}
              whileHover={{ y: -12, boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.2)' }}
              onHoverStart={() => setHoveredCard('superadmin')} onHoverEnd={() => setHoveredCard(null)}
              style={{ background: 'linear-gradient(135deg, #fff0f6 0%, #f8fafc 100%)', borderRadius: '24px', padding: '50px 40px', textAlign: 'center', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)', border: '2px solid #e2e8f0', cursor: 'pointer', position: 'relative', overflow: 'hidden', marginTop: '32px' }}
            >
              <motion.div animate={{ opacity: hoveredCard === 'superadmin' ? 0.02 : 0 }} transition={{ duration: 0.3 }} style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #b80000 0%, #ff4d4f 100%)', zIndex: 0 }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <motion.div animate={{ scale: hoveredCard === 'superadmin' ? 1.1 : 1, rotate: hoveredCard === 'superadmin' ? -5 : 0 }} transition={{ duration: 0.3 }} style={{ width: '80px', height: '80px', background: '#fff1f0', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px', boxShadow: '0 5px 20px rgba(0, 0, 0, 0.08)' }}>
                  <motion.svg animate={{ scale: hoveredCard === 'superadmin' ? [1, 1.2, 1] : 1 }} transition={{ duration: 0.5 }} style={{ width: '40px', height: '40px', color: '#b80000' }} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a2 2 0 012 2v2h2a2 2 0 012 2v2h-2v2h2v2a2 2 0 01-2 2h-2v2a2 2 0 01-2 2H8a2 2 0 01-2-2v-2H4a2 2 0 01-2-2v-2h2v-2H2V8a2 2 0 012-2h2V4a2 2 0 012-2h2zm0 2H8v2H6v2H4v2h2v2H4v2h2v2h2v2h2v-2h2v-2h2v-2h-2v-2h2V8h-2V6h-2V4z" />
                  </motion.svg>
                </motion.div>
                <motion.h3 animate={{ color: hoveredCard === 'superadmin' ? '#b80000' : '#1e293b' }} style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '15px', transition: 'color 0.3s' }}>Super Admin Portal</motion.h3>
                <p style={{ fontSize: '1rem', color: '#64748b', lineHeight: '1.6', marginBottom: '30px' }}>System-wide management, user control, and audit logs.</p>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ width: '100%', padding: '16px 32px', background: 'white', color: '#b80000', border: '2px solid #b80000', borderRadius: '12px', fontSize: '1.1rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s' }} onClick={() => setShowAdminLogin(true)} onMouseOver={(e) => { e.target.style.background = '#b80000'; e.target.style.color = 'white'; }} onMouseOut={(e) => { e.target.style.background = 'white'; e.target.style.color = '#b80000'; }}>
                  <motion.span animate={{ x: hoveredCard === 'superadmin' ? [0, 3, 0] : 0 }} transition={{ duration: 0.5 }} style={{ display: 'inline-block' }}>Super Admin Login →</motion.span>
                </motion.button>
                <motion.div animate={{ opacity: hoveredCard === 'superadmin' ? 1 : 0.6 }} style={{ marginTop: '20px', fontSize: '0.875rem', color: '#b80000', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <svg style={{ width: '16px', height: '16px' }} fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a2 2 0 012 2v2h2a2 2 0 012 2v2h-2v2h2v2a2 2 0 01-2 2h-2v2a2 2 0 01-2 2H8a2 2 0 01-2-2v-2H4a2 2 0 01-2-2v-2h2v-2H2V8a2 2 0 012-2h2V4a2 2 0 012-2h2z" /></svg>
                  Super Admin Only
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.footer initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.5 }} style={{ textAlign: 'center', padding: '30px 20px', color: '#64748b', fontSize: '0.875rem' }}>
          <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
            <p style={{ fontWeight: '600', marginBottom: '5px' }}>NRCCS © 2025</p>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>National Disaster Management Prototype</p>
          </motion.div>
        </motion.footer>
      </div>
    {/* Super Admin Login Modal */}
    <AnimatePresence>
      {showAdminLogin && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} style={{ background: 'white', borderRadius: '16px', padding: '32px 24px', minWidth: '320px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}>
            <h2 style={{ marginBottom: '18px', color: '#b80000', fontWeight: 700 }}>Super Admin Login</h2>
            <form onSubmit={handleSuperAdminLogin}>
              <input type="text" placeholder="Username" value={adminUser} onChange={e => setAdminUser(e.target.value)} style={{ width: '100%', marginBottom: '12px', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }} autoFocus />
              <input type="password" placeholder="Password" value={adminPass} onChange={e => setAdminPass(e.target.value)} style={{ width: '100%', marginBottom: '12px', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              {adminError && <div style={{ color: '#b80000', marginBottom: '10px', fontSize: '0.95em' }}>{adminError}</div>}
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button type="submit" style={{ flex: 1, background: '#b80000', color: 'white', border: 'none', borderRadius: '8px', padding: '10px', fontWeight: 600, cursor: 'pointer' }}>Login</button>
                <button type="button" style={{ flex: 1, background: '#f1f5f9', color: '#b80000', border: 'none', borderRadius: '8px', padding: '10px', fontWeight: 600, cursor: 'pointer' }} onClick={() => setShowAdminLogin(false)}>Cancel</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </div>
  );
};

export default LandingPage;
