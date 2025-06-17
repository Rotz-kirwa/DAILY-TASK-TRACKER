import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-company">
          <p>© {currentYear} AlgoKings Tech</p>
        </div>
        <div className="footer-contact">
          <p>
            <i className="fab fa-whatsapp whatsapp-icon"></i>
            WhatsApp: <a href="https://wa.me/254791260817">0791260817</a>
          </p>
          <p>
            <i className="fab fa-linkedin linkedin-icon"></i>
            <a href="https://www.linkedin.com/feed/">LinkedIn</a>
          </p>
          <p>
            <i className="fab fa-github github-icon"></i>
            <a href="https://github.com/">GitHub</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;