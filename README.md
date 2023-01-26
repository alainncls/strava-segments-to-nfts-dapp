# Strava Segments to NFTs

[![Build](https://github.com/alainncls/strava-segments-to-nfts-dapp/actions/workflows/tests.yml/badge.svg)](https://github.com/alainncls/strava-segments-to-nfts-dapp/actions/workflows/tests.yml)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=alainncls_strava-segments-to-nfts-dapp&metric=coverage)](https://sonarcloud.io/summary/new_code?id=alainncls_strava-segments-to-nfts-dapp)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=alainncls_strava-segments-to-nfts-dapp&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=alainncls_strava-segments-to-nfts-dapp)

Decentralized application aiming to generate an NFT for each new unique and eligible segment a Strava user runs
through.  
This project started as a centralized application, with
a [backend](https://github.com/alainncls/strava-segments-to-nfts) and
a [webapp](https://github.com/alainncls/strava-segments-to-nfts-webapp), now both deprecated.

## How to launch

### 1. Add secret identifiers

Add a `.env.local` file following the `.env` template, and add your (secret) Strava identifiers + Infura project ID.

### 2. Install dependencies

    npm install

### 3. Run the app

    npm run start

## How to test

### Run unit tests with watch

    npm run test

### Run unit tests with coverage

    npm run test:coverage

## Technical notes/ideas

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).