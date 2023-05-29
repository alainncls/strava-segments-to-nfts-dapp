import React from 'react';
import poweredByStrava from '../../assets/img/powered-by-strava.svg';
import { Container, Nav, Navbar } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-secondary text-center text-white text-lg-start fixed-bottom">
      <Navbar collapseOnSelect fixed={'bottom'} expand={'lg'} bg={'dark'}>
        <Container>
          <Navbar.Collapse aria-controls={'responsive-navbar-nav'}>
            <Nav className="me-auto">
              <Nav.Item>
                <strong>Segments to NFTs</strong> built and designed with
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
              </Nav.Item>
            </Nav>
            <Nav>
              <Nav.Item>
                <img
                  alt={'Powered by Strava logo'}
                  src={poweredByStrava}
                  height={24}
                />
              </Nav.Item>
              <Nav.Item>
                <a
                  className="ms-3"
                  href="https://github.com/alainncls/strava-segments-to-nfts-dapp"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="bi bi-github text-white"></i>
                </a>
              </Nav.Item>
              <Nav.Item>
                <a
                  className="ms-3"
                  href="https://twitter.com/Alain_Ncls"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="bi bi-twitter text-white"></i>
                </a>
              </Nav.Item>
              <Nav.Item>
                <a
                  className="ms-3"
                  href="https://www.linkedin.com/in/alainnicolas/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="bi bi-linkedin text-white"></i>
                </a>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </footer>
  );
};

export default Footer;
