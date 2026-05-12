from fastapi import FastAPI
from core.database import create_db_and_tables
import models
from routes import records as records_router

app = FastAPI()

app.include_router(records_router.router)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/")
def root():
    return {"message": "Record Store API is running!"}