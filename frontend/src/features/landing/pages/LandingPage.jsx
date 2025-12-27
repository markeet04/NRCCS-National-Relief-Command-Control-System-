import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useAuth } from '@app/providers/AuthProvider';


const LandingPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showWelcome, setShowWelcome] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  const handleGetStarted = () => {
    setShowWelcome(false);
  };

  // Login Modal State
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleCitizenPortal = () => {
    navigate('/civilian');
  };

  const handleInternalLogin = () => {
    setShowLoginModal(true);
    setLoginError('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');

    if (!selectedRole) {
      setLoginError('Please select a role');
      return;
    }

    if (!username || !password) {
      setLoginError('Please enter email and password');
      return;
    }

    setIsLoggingIn(true);

    try {
      console.log('[LandingPage] Attempting login...');
      const result = await login({
        email: username,
        password: password,
      });
      console.log('[LandingPage] Login result:', result);

      if (result.success) {
        // Verify role matches
        if (result.user.role !== selectedRole) {
          setLoginError(`You don't have ${selectedRole} access. Your role is: ${result.user.role}`);
          setIsLoggingIn(false);
          return;
        }

        console.log('[LandingPage] Login successful, navigating to:', `/${selectedRole}`);

        // Close modal
        setShowLoginModal(false);

        // Add a small delay to ensure state propagation
        setTimeout(() => {
          navigate(`/${selectedRole}`, { replace: true });
        }, 100);
      } else {
        setLoginError(result.message || 'Invalid credentials. Please try again.');
        setIsLoggingIn(false);
      }
    } catch (error) {
      console.error('[LandingPage] Login error:', error);
      setLoginError('Login failed. Please try again.');
      setIsLoggingIn(false);
    }
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
    setSelectedRole('');
    setUsername('');
    setPassword('');
    setLoginError('');
    setIsLoggingIn(false);
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
                <p style={{ fontSize: '1rem', color: '#64748b', lineHeight: '1.6', marginBottom: '30px' }}>Authorized access for NDMA, PDMA, District, and Super Admin authorities. Command center for disaster coordination.</p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleInternalLogin}
                  style={{ width: '100%', padding: '16px 32px', background: '#006600', color: 'white', border: 'none', borderRadius: '12px', fontSize: '1.1rem', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 102, 0, 0.3)', transition: 'all 0.3s', outline: 'none' }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#005200'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#006600'}
                >
                  <span style={{ display: 'inline-block', pointerEvents: 'none' }}>
                    Internal Login →
                  </span>
                </motion.button>

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
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ width: '100%', padding: '16px 32px', background: 'white', color: '#006600', border: '2px solid #006600', borderRadius: '12px', fontSize: '1.1rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s', outline: 'none' }} onClick={handleCitizenPortal} onMouseOver={(e) => { e.currentTarget.style.background = '#006600'; e.currentTarget.style.color = 'white'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#006600'; }}>
                  <span style={{ display: 'inline-block', pointerEvents: 'none' }}>Visit Citizen Portal →</span>
                </motion.button>
                <motion.div animate={{ opacity: hoveredCard === 'citizen' ? 1 : 0.6 }} style={{ marginTop: '20px', fontSize: '0.875rem', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <svg style={{ width: '16px', height: '16px' }} fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" /></svg>
                  Open to All Citizens
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

      {/* Internal Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleCloseModal}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(8px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <motion.div
              className="login-modal-content"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'white',
                borderRadius: '1rem',
                padding: '1.75rem',
                maxWidth: '26.25rem',
                width: '100%',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)',
                position: 'relative'
              }}
            >
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCloseModal}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '2rem',
                  height: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748b',
                  transition: 'all 0.2s'
                }}
              >
                <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>

              {/* Header */}
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                style={{ textAlign: 'center', marginBottom: '1.25rem' }}
              >
                <div style={{
                  width: '3rem',
                  height: '3rem',
                  background: 'linear-gradient(135deg, #006600 0%, #004400 100%)',
                  borderRadius: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.75rem',
                  boxShadow: '0 4px 12px rgba(0, 102, 0, 0.25)'
                }}>
                  <svg style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h2 style={{ fontSize: '1.375rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.25rem' }}>
                  Internal System Login
                </h2>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
                  Authorized personnel only
                </p>
              </motion.div>

              {/* Login Form */}
              <motion.form
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                onSubmit={handleLoginSubmit}
                style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}
              >
                {/* Role Selection */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.375rem' }}>
                    Select Role
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    {[
                      { value: 'ndma', label: 'NDMA', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                      { value: 'pdma', label: 'PDMA', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
                      { value: 'district', label: 'District', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
                      { value: 'superadmin', label: 'Super Admin', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' }
                    ].map((role) => (
                      <motion.button
                        key={role.value}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedRole(role.value)}
                        style={{
                          padding: '0.625rem',
                          borderRadius: '0.5rem',
                          border: selectedRole === role.value ? '2px solid #006600' : '1.5px solid #e2e8f0',
                          background: selectedRole === role.value ? '#f0fdf4' : 'white',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '0.25rem',
                          transition: 'all 0.2s',
                          color: selectedRole === role.value ? '#006600' : '#64748b',
                          fontWeight: selectedRole === role.value ? '600' : '500',
                          outline: 'none'
                        }}
                      >
                        <svg style={{ width: '1.125rem', height: '1.125rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={role.icon} />
                        </svg>
                        <span style={{ fontSize: '0.6875rem' }}>{role.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.375rem' }}>
                    Email
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }}>
                      <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="admin@nrccs.gov.pk"
                      style={{
                        width: '100%',
                        padding: '0.625rem 0.875rem 0.625rem 2.25rem',
                        borderRadius: '0.5rem',
                        border: '1.5px solid #e2e8f0',
                        fontSize: '0.875rem',
                        outline: 'none',
                        transition: 'all 0.2s',
                        color: '#111',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#006600'}
                      onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.375rem' }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      style={{
                        width: '100%',
                        padding: '0.625rem 2.5rem 0.625rem 0.875rem',
                        borderRadius: '0.5rem',
                        border: '1.5px solid #e2e8f0',
                        fontSize: '0.875rem',
                        outline: 'none',
                        transition: 'all 0.2s',
                        color: '#111',
                        boxSizing: 'border-box'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#006600'}
                      onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.25rem',
                        color: '#9ca3af',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#64748b'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                    >
                      {showPassword ? (
                        <svg style={{ width: '1.125rem', height: '1.125rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg style={{ width: '1.125rem', height: '1.125rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.8125rem',
                  color: '#475569'
                }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{
                      width: '1rem',
                      height: '1rem',
                      accentColor: '#006600',
                      cursor: 'pointer'
                    }}
                  />
                  <span>Remember me</span>
                </label>

                {/* Error Message */}
                <AnimatePresence>
                  {loginError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      style={{
                        padding: '0.5rem 0.75rem',
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '0.375rem',
                        color: '#dc2626',
                        fontSize: '0.8125rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <svg style={{ width: '1rem', height: '1rem', flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      {loginError}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  disabled={isLoggingIn}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    marginTop: '0.25rem',
                    background: isLoggingIn ? '#94a3b8' : '#006600',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    fontSize: '0.9375rem',
                    fontWeight: '600',
                    cursor: isLoggingIn ? 'not-allowed' : 'pointer',
                    boxShadow: '0 2px 8px rgba(0, 102, 0, 0.2)',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    outline: 'none'
                  }}
                >
                  {isLoggingIn ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        style={{
                          width: '1rem',
                          height: '1rem',
                          border: '2px solid white',
                          borderTopColor: 'transparent',
                          borderRadius: '50%'
                        }}
                      />
                      Logging in...
                    </>
                  ) : (
                    <>
                      Login
                      <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </motion.button>
              </motion.form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;
