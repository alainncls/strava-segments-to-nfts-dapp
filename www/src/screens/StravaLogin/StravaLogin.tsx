import React, { useEffect, useState } from "react";
import useQueryParams from "../../hooks/useQueryParams";
import { useNavigate } from "react-router-dom";
import { Container, Toast, ToastContainer } from "react-bootstrap";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./StravaLogin.css";

const StravaLogin = () => {
  const query = useQueryParams();
  const navigate = useNavigate();
  const targetScope = ["read", "activity:read"];

  const [displayScopeError, setDisplayScopeError] = useState(false);

  useEffect(() => {
    const code = query.get("code");
    const scope = query.get("scope");

    if (checkScope(scope) && code) {
      fetch(`https://strava.alainnicolas.fr/.netlify/functions/api?code=${code}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((result) => {
          //console.log("result", result);
          console.log("result.token", result.token);
          sessionStorage.setItem("refreshToken", result.token.refresh_token);
          sessionStorage.setItem("accessToken", result.token.access_token);
          sessionStorage.setItem("tokenExpirationDate", result.token.expires_at + result.token.expires_in);
          navigate("/");
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
    const scopeArray = scope.split(",");
    return scopeArray.length && targetScope.every((v) => scopeArray.includes(v));
  };

  return (
    <>
      <ToastContainer className="p-3 toast-scope" position={"top-center"}>
        <Toast show={displayScopeError} onClick={() => setDisplayScopeError(false)}>
          <Toast.Body>
            <p>The scope you authorized is not sufficient for the app to work</p>
            <a className={"btn btn-primary d-flex justify-content-center"} href={"/"}>
              Retry
            </a>
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <Container className="p-3">
        <Header hideButtons />
        <Footer />
      </Container>
    </>
  );
};

export default StravaLogin;
