# BioPortal Backend

A REST API built with FastAPI for the portfolio.

## Tech Stack
- FastAPI
- PostgreSQL (Neon Cloud)
- SQLAlchemy
- JWT Authentication
- bcrypt

## Features
- User registration and login
- JWT protected routes
- Update profile and change password
- Delete account
- Full post CRUD

## API Endpoints
| Method | Endpoint | Auth Required |
|--------|----------|---------------|
| POST | /register | No |
| POST | /login | No |
| GET | /me | Yes |
| PUT | /change-password | Yes |
| PUT | /update-profile | Yes |
| DELETE | /delete-account | Yes |
| POST | /posts | Yes |
| GET | /posts | No |
| GET | /posts/{id} | No |
| PUT | /posts/{id} | Yes |
| DELETE | /posts/{id} | Yes |

## Setup
1. Clone the repo
2. Install dependencies: `pip install -r requirements.txt`
3. Create `.env` file with your `DATABASE_URL` and `SECRET_KEY`
4. Run: `uvicorn main:app --reload`