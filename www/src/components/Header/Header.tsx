import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { ConnectKitButton } from 'connectkit';
import StravaLoginButton from '../StravaLoginButton/StravaLoginButton';

interface IProps {
  isStravaConnected?: boolean;
  hideButtons?: boolean;
}

const Header = (props: IProps) => {
  const { isStravaConnected, hideButtons } = props;

  return (
    <header>
      <Navbar
        collapseOnSelect
        fixed={'top'}
        expand={'lg'}
        bg={'light'}
        variant={'light'}
      >
        <Container>
          <Navbar.Toggle aria-controls={'responsive-navbar-nav'} />
          <Navbar.Collapse aria-controls={'responsive-navbar-nav'}>
            <Nav className="me-auto">
              <Nav.Link href={'/'}>Home</Nav.Link>
              <Nav.Link href={'/about'}>About</Nav.Link>
            </Nav>
            {!hideButtons && (
              <Nav className={'d-flex align-items-center'}>
                {!isStravaConnected && <StravaLoginButton />}
                <ConnectKitButton />
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="p-5 mt-5 mb-3 text-center bg-light">
        <h1 className="mb-3">Segments to NFTs</h1>
        <h4 className="mb-3">
          {"Mint NFTs for the Strava segments you've gone through"}
        </h4>
      </div>
    </header>
  );
};

export default Header;
