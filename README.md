# Segments to NFTs

[![Build](https://github.com/alainncls/strava-segments-to-nfts-dapp/actions/workflows/frontend-tests.yml/badge.svg)](https://github.com/alainncls/strava-segments-to-nfts-dapp/actions/workflows/tests.yml)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=alainncls_strava-segments-to-nfts-dapp&metric=coverage)](https://sonarcloud.io/summary/new_code?id=alainncls_strava-segments-to-nfts-dapp)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=alainncls_strava-segments-to-nfts-dapp&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=alainncls_strava-segments-to-nfts-dapp)

Decentralized application aiming to generate NFTs for Strava activities and segments.

This project started as a centralized application, with a
[backend](https://github.com/alainncls/strava-segments-to-nfts) and a
[webapp](https://github.com/alainncls/strava-segments-to-nfts-webapp), now both deprecated.

## How to use the NFT contract

### 1. Go to `/blockchain`

    cd blockchain

### 2. Add your secret identifiers

1. Copy the `.env.example` file to a `.env` file
2. Fill it with your Infura identifiers for chain access
3. Add your private key to deploy the contract
4. Add your Lineascan and/or Etherscan API key(s) to verify the contract on Lineascan/Etherscan

### 3. Install dependencies

    pnpm install

### 4. Compile the contract

    pnpm run compile

### 5. Deploy the contract

    pnpm run deploy:linea-goerli

## How to launch the web app

### 1. Go to `/www`

    cd www

### 2. Add your secret identifiers

1. Copy the `.env.example` file to a `.env.local` file
2. Fill it with your Strava application identifiers
3. Fill it with your Pinata identifiers for IPFS access

### 3. Install dependencies

    pnpm install

### 4. Run the app

    pnpm run start

## How to test

### Run unit tests with watch

    pnpm run test

### Run unit tests with coverage

    pnpm run test:coverage

## Technical notes/ideas

This project was originally bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

It is now relying on [Vite](https://vitejs.dev/) for the development tooling and [Vitest](https://vitest.dev/) for the
tests.
