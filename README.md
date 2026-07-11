# Pokedex Favorites App

A full-stack Pokedex application that lets users browse Pokemon, view details, and save favorites backed by Supabase.

## Highlights

- React and Vite frontend with routed pages for home, Pokemon listing, favorites, and detail views
- Express API that fetches Pokemon data from PokeAPI
- Supabase persistence for favorite Pokemon
- Environment-based API configuration for local development and deployment

## Tech Stack

- Frontend: React, Vite, React Router
- Backend: Node.js, Express, Supabase
- External APIs: PokeAPI

## Project Structure

```text
todolist/
  back_end/      Express API and Supabase client
  front_end/     React/Vite user interface
```

## Getting Started

### Backend

```bash
cd back_end
npm install
cp .env.example .env
npm start
```

Set the Supabase values in `back_end/.env` before starting the API.

### Frontend

```bash
cd front_end
npm install
cp .env.example .env
npm run dev
```

The frontend defaults to `http://localhost:3001` for the API. Override it with `VITE_API_BASE_URL` when deploying or using a different backend port.

## API Overview

- `GET /api/pokemon` - list Pokemon cards
- `GET /api/pokemon/:id` - fetch Pokemon details and stats
- `GET /api/pokemon/favorites` - list saved favorites
- `POST /api/pokemon/favorites` - save a Pokemon favorite
- `DELETE /api/pokemon/favorites/:pokemonId` - remove a favorite

## Environment Variables

Backend:

- `SUPABASE_URL`
- `SUPABASE_KEY`
- `PORT` optional, defaults to `3001`

Frontend:

- `VITE_API_BASE_URL` optional, defaults to `http://localhost:3001`

