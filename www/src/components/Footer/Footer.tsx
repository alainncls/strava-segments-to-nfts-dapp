import React from 'react';
import poweredByStrava from '../../assets/img/api_logo_pwrdBy_strava_horiz_white.svg';
import { Col, Row } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-secondary text-center text-white text-lg-start fixed-bottom">
      <Row>
        <Col className="col-7 offset-3 p-3">
          <strong>Strava Segments to NFTs</strong> built and designed with
          <span className="text-danger"> ♥</span> by{' '}
          <a
            href="https://alainnicolas.fr"
            target="_blank"
            referrerPolicy="no-referrer-when-downgrade"
            rel="external noreferrer"
            className="text-white"
          >
            Alain Nicolas
          </a>
        </Col>
        <Col className="col-2 p-3">
          <img
            alt={'Powered by Strava logo'}
            src={poweredByStrava}
            height={24}
          />
        </Col>
      </Row>
    </footer>
  );
};

export default Footer;
