import fetch from "node-fetch";

const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID;

export async function handler(event: { queryStringParameters: any; body: string }) {
  let params = event.queryStringParameters;
  let jsonBody;

  if (event.body) {
    try {
      jsonBody = JSON.parse(event.body);
    } catch (err) {
      console.log(`ERROR PARSING "${event.body}"`);
      throw err;
    }
  }

  params = {
    ...params,
    ...jsonBody,
  };

  if (params.code) {
    // exchange code for token
    let token = await getToken(params.code);
    return {
      statusCode: 200,
      body: JSON.stringify({
        token,
      }),
    };
  }

  if (params.method === "refresh") {
    let token = await refreshToken(params.token);
    return {
      statusCode: 200,
      body: JSON.stringify({
        token,
      }),
    };
  }
}

async function refreshToken(oldToken: { refresh_token: string }) {
  const body = JSON.stringify({
    client_id: STRAVA_CLIENT_ID,
    client_secret: STRAVA_CLIENT_SECRET,
    grant_type: "refresh_token",
    refresh_token: oldToken.refresh_token,
  });

  const response = await fetch("https://www.strava.com/api/v3/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });

  return await response.json();
}

async function getToken(code: string) {
  const body = JSON.stringify({
    client_id: STRAVA_CLIENT_ID,
    client_secret: STRAVA_CLIENT_SECRET,
    code,
    grant_type: "authorization_code",
  });

  const response = await fetch("https://www.strava.com/api/v3/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });

  return await response.json();
}
