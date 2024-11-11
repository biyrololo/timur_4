from .base import Base

from sqlalchemy import Column, Integer, String

class NotificationModel(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True)
    task_id = Column(Integer, nullable=False)
    user_id = Column(Integer, nullable=False)

    @classmethod
    def create(cls, db, notification):
        notification = cls(task_id=notification['task_id'], user_id=notification['user_id'])
        db.add(notification)
        db.commit()

        return notification.json()
    
    @classmethod
    def delete(cls, db, id):
        db.query(cls).filter(cls.id == id).delete()
        db.commit()

    @classmethod
    def get_by_user_id(cls, db, user_id):
        res = db.query(cls).filter_by(user_id=user_id).all()
        return [r.json() for r in res]

    def json(self):
        return {
            "id": self.id,
            "task_id": self.task_id,
            "user_id": self.user_id
        }

    @classmethod
    def get_by_task_id(cls, db, task_id):
        res = db.query(cls).filter_by(task_id=task_id).all()
        return [r.json() for r in res]
    
    @classmethod
    def get_all(cls, db):
        return [r.json() for r in db.query(cls).all()]