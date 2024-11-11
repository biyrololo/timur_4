from sqlalchemy import Column, Integer, String

from .base import Base

class FileModel(Base):
    __tablename__ = "files"
    id = Column(Integer, primary_key=True)
    filename = Column(String, nullable=False)

    @classmethod
    def create(cls, db):
        f = cls(filename="")
        db.add(f)
        db.commit()

        return f.json()

    @classmethod
    def get(cls, db):
        return db.query(cls).all()
    
    @classmethod
    def get_by_id(cls, db, id):
        return db.query(cls).filter_by(id=id).first().json()
    
    @classmethod
    def edit(cls, db, file, id):
        file_ = db.query(cls).filter_by(id=id).first()
        file_.filename = file['filename']
        db.commit()

        return file_.json()

    def json(self) -> dict[str, str | int]:
        return {
            "id": self.id,
            "filename": self.filename
        }