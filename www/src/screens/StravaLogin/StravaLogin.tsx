import React, { useEffect, useState } from 'react';
import useQueryParams from '../../hooks/useQueryParams';
import { useNavigate } from 'react-router-dom';
import { Container, Toast, ToastContainer } from 'react-bootstrap';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './StravaLogin.css';

const StravaLogin = () => {
  const query = useQueryParams();
  const navigate = useNavigate();
  const targetScope = [
    'read',
    'activity:read',
    'activity:read_all',
    'read_all',
  ];

  const [displayScopeError, setDisplayScopeError] = useState(false);

  useEffect(() => {
    const code = query.get('code');
    const scope = query.get('scope');

    if (checkScope(scope) && code) {
      const clientID = process.env.REACT_APP_STRAVA_CLIENT_ID;
      const clientSecret = process.env.REACT_APP_STRAVA_CLIENT_SECRET;

      fetch(
        `https://www.strava.com/api/v3/oauth/token?client_id=${clientID}&client_secret=${clientSecret}&code=${code}&grant_type=authorization_code`,
        {
          method: 'POST',
        }
      )
        .then((res) => res.json())
        .then((result) => {
          sessionStorage.setItem('refreshToken', result.refresh_token);
          sessionStorage.setItem('accessToken', result.access_token);
          sessionStorage.setItem('tokenCreationDate', Date().toString());
          navigate('/');
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      setDisplayScopeError(true);
    }
  }, [query]);

  const checkScope = (scope: string | null) => {
    if (!scope) {
      return false;
    }
    const scopeArray = scope.split(',');
    return (
      scopeArray.length && targetScope.every((v) => scopeArray.includes(v))
    );
  };

  return (
    <>
      <ToastContainer className="p-3 toast-scope" position={'top-center'}>
        <Toast
          show={displayScopeError}
          onClick={() => setDisplayScopeError(false)}
        >
          <Toast.Body>
            <p>
              The scope you authorized is not sufficient for the app to work
            </p>
            <a
              className={'btn btn-primary d-flex justify-content-center'}
              href={'/'}
            >
              Retry
            </a>
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <Container className="p-3">
        <Header />
        <Footer />
      </Container>
    </>
  );
};

export default StravaLogin;
