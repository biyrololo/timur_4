from sqlalchemy import Column, Integer, String, LargeBinary, ARRAY

from .base import Base


class Comment(Base):
    __tablename__ = "comments"
    id = Column(Integer, primary_key=True)
    task_id = Column(Integer, nullable=False)
    comment = Column(String, nullable=False)

def create_comment(db, task_id, comments):
    comment = Comment(task_id=task_id, comment=comments)
    db.add(comment)
    db.commit()

def comments_by_task_id(db, task_id):
    return db.query(Comment).filter_by(task_id=task_id).all()

def get_comments(db, task_id):
    return db.query(Comment).filter_by(task_id=task_id).all()

def delete_comment(db, task_id):
    db.query(Comment).filter(Comment.task_id == task_id).delete()
    db.commit()