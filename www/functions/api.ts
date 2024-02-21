import fetch from "node-fetch";

const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;

export async function handler(event: {
  queryStringParameters: { code: string; method: string; token: { refresh_token: string } };
  body: string;
  httpMethod: string;
}) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (event.httpMethod == "OPTIONS") {
    return {
      statusCode: 204,
      headers,
      body: "",
    };
  }

  let params = event.queryStringParameters;
  let jsonBody;

  if (!STRAVA_CLIENT_ID) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Strava client ID not set",
      }),
    };
  }

  if (!STRAVA_CLIENT_SECRET) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Strava client secret not set",
      }),
    };
  }

  if (event.body) {
    try {
      jsonBody = JSON.parse(event.body);
    } catch (err) {
      console.error(`ERROR PARSING "${event.body}"`);
      throw err;
    }
  }

  params = {
    ...params,
    ...jsonBody,
  };

  if (params.code) {
    const token = await getToken(params.code);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        token,
      }),
    };
  }

  if (params.method === "refresh") {
    const token = await refreshToken(params.token);
    return {
      statusCode: 200,
      headers,
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
