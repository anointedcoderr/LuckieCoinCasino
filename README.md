# LuckieCoinCasino

Your Resort Casino Club Experience.

LuckieCoinCasino is the private casino club for resort guests. Guests join the club, receive bonus LuckieCoin from their resort bookings, buy more LuckieCoin through the resort in world process, play slots, blackjack, baccarat, and poker tournaments, climb the leaderboard, and cash out through the resort team.

This repository holds a responsive frontend for the club, with a polished interface, realistic seeded data, and management preview screens. It is built to feel like part of the guest booking and resort experience, and it is ready to grow into a full platform.

## Currency

The platform uses LuckieCoin, shown as LC, as the in club currency. Players do not pay through a payment gateway in this version. Guests buy in through the resort in world process, a casino agent verifies the payment, and management credits the player balance from the admin panel. Winnings are cashed out through the resort team.

## Features

Guest and public

- Home page that introduces the resort casino club
- Games lobby with slots, tables, and poker tournaments
- Slots parlour with play, demo, minimum LC, popularity, and mobile ready details
- Poker room with tournament buy in, prize pool, seats, and start times
- Leaderboard across overall, poker, slots, blackjack, baccarat, weekly, and monthly views

Player

- Sign in and join the club
- Player dashboard with balance, bonus LC, stats, activity, and quick actions
- LC wallet with credited and deducted history, pending cashout, and a cashout request flow

Management

- Club overview with members, LC in circulation, cashouts, and activity
- Credit LuckieCoin to a member after an in world payment is verified
- Review cashout requests and mark them approved, paid, or rejected
- Manage games, open or close tournaments, and add new slot games

## Tech stack

- React 19 with Vite
- React Router 6
- Tailwind CSS 3
- GSAP for scroll motion
- Recharts for data views
- Lucide for icons

## Getting started

```
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

To create a production build:

```
npm run build
npm run preview
```

## Project structure

```
src/
  data/          seeded club data and site configuration
  context/       session, club data store, and notifications
  lib/           formatting, storage, and motion helpers
  components/    layout, reusable interface, and home sections
  pages/         public, auth, player, and management pages
```

## Notes

- This version uses seeded data held in memory for the session. There is no payment processing and no live casino engine yet.
- Game launch containers are prepared so purchased HTML5 games can be installed later.
- Routes and components are organized for clean growth into a full platform.

## Credit

Built by Anointed Coder

anointedcoder@gmail.com
