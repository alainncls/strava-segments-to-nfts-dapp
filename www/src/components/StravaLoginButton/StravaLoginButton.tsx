import React from 'react';
import btnStrava from '../../assets/img/btn_strava.svg';

const StravaLoginButton = () => {
  return (
    <div>
      <a
        href={`https://www.strava.com/oauth/authorize?client_id=${
          import.meta.env.VITE_STRAVA_CLIENT_ID
        }&response_type=code&scope=read,activity:read&redirect_uri=${
          import.meta.env.VITE_OAUTH_URL
        }`}
      >
        <img alt={'Strava connect button'} src={btnStrava} />
      </a>
    </div>
  );
};

export default StravaLoginButton;
