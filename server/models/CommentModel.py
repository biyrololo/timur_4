from sqlalchemy import Column, Integer, String, LargeBinary, ARRAY

from .base import Base

class CommentModel(Base):
    __tablename__ = "comments"
    id = Column(Integer, primary_key=True)
    task_id = Column(Integer, nullable=False)
    author = Column(String, nullable=False)
    text = Column(String, nullable=True)
    attachment = Column(Integer, nullable=True)

    @classmethod
    def create(cls, db, task_id, comment):
        comment = cls(task_id=task_id, author=comment['author'], text=comment.get('text'), attachment=comment.get('attachment'))
        db.add(comment)
        db.commit()

        return comment.json()

    @classmethod
    def by_task_id(cls, db, task_id):
        return db.query(cls).filter_by(task_id=task_id).all()

    @classmethod
    def get(cls, db, task_id):
        return db.query(cls).filter_by(task_id=task_id).all()

    @classmethod
    def delete(cls, db, id):
        db.query(cls).filter(cls.id == id).delete()
        db.commit()

    def json(self):
        return {
            "id": self.id,
            "task_id": self.task_id,
            "author": self.author,
            "text": self.text,
            "attachment": self.attachment
        }
    