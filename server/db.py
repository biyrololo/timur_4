from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base

from os import getenv

# DATABASE_URL = getenv("DATABASE_URL")
# DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/postgres"
# sqlite
DATABASE_URL = "sqlite:///./sql_app.db"

engine = create_engine(DATABASE_URL)

Base.metadata.create_all(engine)

# drop all tables
if __name__ == "__main__":
    Base.metadata.drop_all(engine)

SessionLocal = sessionmaker(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()