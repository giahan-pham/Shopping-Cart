from fastapi import FastAPI
from contextlib import asynccontextmanager
from sqlmodel import Session, select

from core.database import create_db_and_tables, engine
from core.security import get_password_hash
from models import User, Cart
from routes import records as records_router
from routes import auth as auth_router


def seed_admin_user():
    with Session(engine) as session:
        existing_admin = session.exec(
            select(User).where(User.username == "admin")
        ).first()

        if existing_admin:
            print("Admin user already exists")
            return

        admin_user = User(
            username="admin",
            password_hash=get_password_hash("admin"),
            role="admin"
        )

        session.add(admin_user)
        session.commit()
        session.refresh(admin_user)

        admin_cart = Cart(user_id=admin_user.id)
        session.add(admin_cart)
        session.commit()

        print("Admin user created: username='admin', password='admin'")


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    seed_admin_user()
    print("Database tables created.")
    yield
    print("Application shutdown.")


app = FastAPI(title="Record Store API", lifespan=lifespan)

app.include_router(records_router.router)
app.include_router(auth_router.router)


@app.get("/")
def root():
    return {"message": "Record Store API is running!"}