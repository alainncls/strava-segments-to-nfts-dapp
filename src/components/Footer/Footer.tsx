import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-secondary text-center text-white text-lg-start fixed-bottom">
      <div className="text-center p-3">
        <strong>Strava Segments to NFTs</strong> built and designed with
        <span className="text-danger"> ♥</span> by{' '}
        <a
          href="https://alainnicolas.fr"
          target="_blank"
          rel="noreferrer"
          className="text-white"
        >
          Alain Nicolas
        </a>
      </div>
    </footer>
  );
};

export default Footer;
