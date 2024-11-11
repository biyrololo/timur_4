from sqlalchemy import Column, Integer, String

from .base import Base

class TaskModel(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(String)
    status = Column(String, nullable=False)
    created_at = Column(String)
    deadline = Column(String)
    accepted_at = Column(String)
    budget = Column(Integer)
    executor_price = Column(Integer)
    completed_at = Column(String)
    executor_name = Column(String)
    executor_url = Column(String)
    customer_name = Column(String)
    customer_url = Column(String)
    file_id = Column(Integer)

    @classmethod
    def get_all(cls, db):
        return db.query(cls).all()

    @classmethod
    def get_by_task_id(cls, db, task_id):
        return db.query(cls).filter_by(id=task_id).first()

    @classmethod
    def edit(cls, db, task_id, task):
        task_ = db.query(cls).filter_by(id=task_id).first()
        task_.title = task.title
        task_.description = task.description
        task_.status = task.status
        task_.created_at = task.created_at
        task_.deadline = task.deadline
        task_.accepted_at = task.accepted_at
        task_.completed_at = task.completed_at
        task_.budget = task.budget
        task_.executor_price = task.executor_price
        task_.executor_name = task.executor_name
        task_.executor_url = task.executor_url
        task_.customer_name = task.customer_name
        task_.customer_url = task.customer_url
        task_.file_id = task.file_id

        db.commit()

        return task_.json()

    @classmethod
    def create_task(cls, db, task):
        task_ = cls(
            title = task.title,
            description = task.description,
            status = task.status,
            created_at = task.created_at,
            deadline = task.deadline,
            accepted_at = task.accepted_at,
            completed_at = task.completed_at,
            budget = task.budget,
            executor_price = task.executor_price,
            executor_name = task.executor_name,
            executor_url = task.executor_url,
            customer_name = task.customer_name,
            customer_url = task.customer_url,
            file_id = task.file_id
        )

        db.add(task_)
        db.commit()

        return task_.json()

    @classmethod
    def add_file(cls, db, task_id, file_id):
        task_ = db.query(cls).filter_by(id=task_id).first()
        task_.file_id = file_id
        db.commit()

    @classmethod
    def delete(cls, db, task_id):
        task_ = db.query(cls).filter_by(id=task_id).first()
        db.delete(task_)
        db.commit()

    def json(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "status": self.status,
            "created_at": self.created_at,
            "deadline": self.deadline,
            "accepted_at": self.accepted_at,
            "completed_at": self.completed_at,
            "budget": self.budget,
            "executor_price": self.executor_price,
            "executor_name": self.executor_name,
            "executor_url": self.executor_url,
            "customer_name": self.customer_name,
            "customer_url": self.customer_url,
            "file_id": self.file_id
        }