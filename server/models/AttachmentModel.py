from sqlalchemy import Column, Integer, String

from .base import Base

class AttachmentModel(Base):
    __tablename__ = "attachments"
    id = Column(Integer, primary_key=True)
    filename = Column(String, nullable=False)

    @classmethod
    def create(cls, db):
        attachment_ = AttachmentModel(filename="")
        db.add(attachment_)
        db.commit()
        return attachment_.json()
    
    def json(self) -> dict[str, str | int]:
        return {
            "id": self.id,
            "filename": self.filename
        }
    
    @classmethod
    def delete(cls, db, id):
        db.query(cls).filter(cls.id == id).delete()
        db.commit()

    @classmethod
    def get(cls, db, id):
        obj = db.query(cls).filter(cls.id == id).first()
        print(obj)
        if not obj:
            raise Exception(f"Attachment with id {id} not found")
        else:
            return obj.json()
        
    @classmethod
    def edit(cls, db, attachment, id):
        attachment_ = db.query(cls).filter_by(id=id).first()
        attachment_.filename = attachment['filename']
        db.commit()
        return attachment_.json()
    
    @classmethod
    def get_all(cls, db):
        res = db.query(cls).all()
        return [r.json() for r in res]