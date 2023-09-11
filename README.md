# Segments to NFTs

[![Build](https://github.com/alainncls/strava-segments-to-nfts-dapp/actions/workflows/frontend-tests.yml/badge.svg)](https://github.com/alainncls/strava-segments-to-nfts-dapp/actions/workflows/tests.yml)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=alainncls_strava-segments-to-nfts-dapp&metric=coverage)](https://sonarcloud.io/summary/new_code?id=alainncls_strava-segments-to-nfts-dapp)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=alainncls_strava-segments-to-nfts-dapp&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=alainncls_strava-segments-to-nfts-dapp)

Decentralized application aiming to generate NFTs for Strava activities and segments.

This project started as a centralized application, with
a [backend](https://github.com/alainncls/strava-segments-to-nfts) and
a [webapp](https://github.com/alainncls/strava-segments-to-nfts-webapp), now both deprecated.

## How to use the NFT contract

### 1. Go to `/blockchain`

    cd blockchain

### 2. Add your secret identifiers

1. Copy the `.env.example` file to a `.env` file
2. Fill it with your Infura identifiers for chain access
3. If you want to use Truffle the old way, add you mnemonic
4. If you want to verify your instance of the contract on Etherscan, add your Etherscan API key

### 3. Install dependencies

    npm install

### 4. Compile the contract

    npm run compile

### 5. Deploy the contract

#### Truffle legacy way

    npm run migrate:sepolia

#### With Truffle Dashboard

    npm run dashboard
    npm run migrate dashboard

## How to launch the web app

### 1. Go to `/www`

    cd www

### 2. Add your secret identifiers

1. Copy the `.env` file to a `.env.local` file
2. Fill it with your Strava application identifiers
3. Fill it with your Infura identifiers for chain access
4. Fill it with your Infura identifiers for IPFS access
5. Fill it with the address of the contract you deployed previously

### 3. Install dependencies

    npm install

### 4. Run the app

    npm run start

## How to test

### Run unit tests with watch

    npm run test

### Run unit tests with coverage

    npm run test:coverage

## Technical notes/ideas

This project was originally bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

It is now relying on [Vite](https://vitejs.dev/) for the development tooling and [Vitest](https://vitest.dev/) for the
tests.
