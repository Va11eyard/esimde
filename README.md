# Esimde Project

This project contains a modern web stack:
- **Frontend:** React + TypeScript + Vite
- **Backend:** Go (Standard Library + Minimal dependencies)

## Project Structure
- `/frontend` - React application
- `/backend` - Go REST API

## How to run

### Frontend
```bash
cd frontend
npm install
npm run dev
```
(Runs on http://localhost:5173 by default)

### Backend
```bash
cd backend
go run cmd/api/main.go
```
(Runs on http://localhost:8080 by default)
