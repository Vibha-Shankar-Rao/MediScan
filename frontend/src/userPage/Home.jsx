import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "./home.css";
import mediScanLogo from "../assets/logo.svg"; // Logo file
// Import the background image
import "../assets/backgroundmediscan.png"; // This ensures the build system includes it

function Home() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isParallax, setIsParallax] = useState(false);
  const featuresRef = useRef(null);
  const testimonialRef = useRef(null);

  useEffect(() => {
    // Page load animation
    setIsLoaded(true);
    
    // Create floating particles
    createParticles();
    
    // Add parallax effect
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const x = (window.innerWidth / 2 - clientX) / 50;
      const y = (window.innerHeight / 2 - clientY) / 50;
      
      setIsParallax(true);
      
      document.documentElement.style.setProperty('--mouse-x', `${x}px`);
      document.documentElement.style.setProperty('--mouse-y', `${y}px`);
    };
    
    // Add scroll reveal effect
    const handleScroll = () => {
      const reveals = document.querySelectorAll('.reveal');
      
      reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
          element.classList.add('active');
        }
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    // Initial check for elements in view
    handleScroll();
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Create floating particles function
  const createParticles = () => {
    const container = document.createElement('div');
    container.className = 'particles-container';
    document.querySelector('.home-container').appendChild(container);
    
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random size between 5px and 25px
      const size = Math.random() * 20 + 5;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Random start and end positions
      const xStart = Math.random() * 100;
      const yStart = Math.random() * 100;
      const xEnd = xStart + (Math.random() * 20 - 10);
      const yEnd = yStart - Math.random() * 50;
      
      // Set custom properties for animation
      particle.style.setProperty('--x-start', `${xStart}vw`);
      particle.style.setProperty('--y-start', `${yStart}vh`);
      particle.style.setProperty('--x-end', `${xEnd}vw`);
      particle.style.setProperty('--y-end', `${yEnd}vh`);
      
      // Random animation duration and opacity
      const duration = Math.random() * 20 + 10;
      const opacity = Math.random() * 0.3 + 0.1;
      
      particle.style.setProperty('--particle-duration', `${duration}s`);
      particle.style.setProperty('--particle-opacity', opacity);
      
      // Random delay
      particle.style.animationDelay = `${Math.random() * 20}s`;
      
      // Append to container
      container.appendChild(particle);
    }
  };

  const goToQRPage = () => {
    navigate("/qr");
  };

  const goToScanPage = () => {
    navigate("/scan");
  };

  const goToProductionLogin = () => {
    navigate("/production-login");
  };

  return (
    <div className={`home-container ${isLoaded ? 'loaded' : ''} ${isParallax ? 'parallax-effect' : ''}`}>
      <div className="production-login">
        <button onClick={goToProductionLogin} className="login-button">
          Production Login
        </button>
      </div>

      <div className="main-content">
        <div className="logo-container">
          <img src={mediScanLogo} alt="MediScan Logo" className="logo" />
          <h1 className="app-title">MediScan</h1>
          <p className="tagline">Innovative medicine verification at your fingertips</p>
        </div>

        <div className="scan-options">
          <button onClick={goToScanPage} className="scan-button qr-button">
            <i className="icon qr-icon"></i>
            <span className="button-text">Scan QR Code</span>
          </button>
          <button onClick={goToQRPage} className="scan-button device-button">
            <i className="icon device-icon"></i>
            <span className="button-text">Upload from Device</span>
          </button>
        </div>
      </div>

      {/* New Features Section */}
      <div ref={featuresRef} className="features-section reveal">
        <h2>Why Choose MediScan</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-shield-alt"></i>
              🛡️
            </div>
            <h3 className="feature-title">Enhanced Security</h3>
            <p className="feature-text">
              Advanced verification systems ensure that all medications are genuine and safe for consumption.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-bolt"></i>
              ⚡
            </div>
            <h3 className="feature-title">Instant Results</h3>
            <p className="feature-text">
              Get verification results in seconds, helping you make informed decisions about your medication.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-database"></i>
              🗄️
            </div>
            <h3 className="feature-title">Comprehensive Database</h3>
            <p className="feature-text">
              Access detailed information about medications, including usage, side effects, and authenticity.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-hospital"></i>
              🏥
            </div>
            <h3 className="feature-title">Healthcare Integration</h3>
            <p className="feature-text">
              Seamlessly integrates with healthcare systems, providing a complete medication management solution.
            </p>
          </div>
        </div>
      </div>

      {/* New Testimonial Section */}
      <div ref={testimonialRef} className="testimonial-section reveal">
        <h2>What Our Users Say</h2>
        <div className="testimonial-card">
          <p className="testimonial-text">
            "MediScan has completely transformed how I verify my prescriptions. The quick scan feature gives me peace of mind knowing my medications are authentic. Highly recommended for anyone concerned about medication safety!"
          </p>
          <div className="testimonial-author">Dr. Sarah Johnson, Pharmacist</div>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div className="about-section">
            <h2>About MediScan</h2>
            <p>
              MediScan is a cutting-edge application designed to verify medication authenticity 
              through QR code scanning. Our mission is to enhance patient safety by providing 
              a reliable tool for medication verification and ensuring that every patient has 
              access to genuine pharmaceuticals.
            </p>
          </div>
          <div className="footer-links">
            <div className="link-column">
              <h3>Services</h3>
              <ul>
                <li><a href="#">QR Verification</a></li>
                <li><a href="#">Medication Database</a></li>
                <li><a href="#">Healthcare Integration</a></li>
                <li><a href="#">Batch Scanning</a></li>
              </ul>
            </div>
            <div className="link-column">
              <h3>Resources</h3>
              <ul>
                <li><a href="#">User Guide</a></li>
                <li><a href="#">FAQ</a></li>
                <li><a href="#">Support</a></li>
                <li><a href="#">API Documentation</a></li>
              </ul>
            </div>
            <div className="link-column">
              <h3>Company</h3>
              <ul>
                <li><a href="#">About Us</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="social-links">
          <a href="#" className="social-icon">
            <i className="fab fa-facebook-f">f</i>
          </a>
          <a href="#" className="social-icon">
            <i className="fab fa-twitter">t</i>
          </a>
          <a href="#" className="social-icon">
            <i className="fab fa-linkedin-in">in</i>
          </a>
          <a href="#" className="social-icon">
            <i className="fab fa-instagram">ig</i>
          </a>
        </div>
        
        <div className="copyright">
          <p>&copy; 2025 MediScan. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;