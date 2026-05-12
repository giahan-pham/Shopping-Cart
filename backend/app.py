from fastapi import FastAPI
from core.database import create_db_and_tables
import models

app = FastAPI()

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/")
def root():
    return {"message": "Record Store API is running!"}