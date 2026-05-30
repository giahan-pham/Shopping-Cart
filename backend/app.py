from pathlib import Path
from core.config import ADMIN_PASSWORD, ADMIN_USERNAME
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from sqlmodel import Session, select

from core.database import create_db_and_tables, engine
from core.security import get_password_hash
from models import User, Cart
from routes import records as records_router
from routes import auth as auth_router
from routes import cart as cart_router
from routes import admin as admin_router
from fastapi.middleware.cors import CORSMiddleware

#since user shouldnt be able to register as admin, 
# we will create an admin user with a default password when the application starts.
def seed_admin_user():
    admin_username = ADMIN_USERNAME
    admin_password = ADMIN_PASSWORD

    with Session(engine) as session:
        existing_admin = session.exec(
            select(User).where(User.username == admin_username)
        ).first()

        if existing_admin:
            print(f"Admin user '{admin_username}' already exists")
            return

        admin_user = User(
            username=admin_username,
            password_hash=get_password_hash(admin_password),
            role="admin"
        )

        session.add(admin_user)
        session.commit()
        session.refresh(admin_user)

        admin_cart = Cart(user_id=admin_user.id)
        session.add(admin_cart)
        session.commit()

        print(f"Admin user created: username='{admin_username}', password='{admin_password}'")

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    seed_admin_user()
    print("Database tables created.")
    yield
    print("Application shutdown.")

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "media" / "static"
RECORDS_STATIC_DIR = STATIC_DIR / "records"

RECORDS_STATIC_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(title="Record Store API", lifespan=lifespan)
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

#CORS configuration
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,  # Allows cookies and authentication headers in cross-origin requests
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers for different API endpoints
app.include_router(records_router.router)
app.include_router(auth_router.router)
app.include_router(cart_router.router)
app.include_router(admin_router.router)


@app.get("/")
def root():
    return {"message": "Record Store API is running!"}