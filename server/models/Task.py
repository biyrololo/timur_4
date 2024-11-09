from sqlalchemy import Column, Integer, String, LargeBinary

from .base import Base

class Task(Base):
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
    executor_name = Column(String)
    executor_url = Column(String)
    customer_name = Column(String)
    customer_url = Column(String)
    file_id = Column(String)

def get_tasks(db):
    return db.query(Task).all()

def get_task(db, task_id):
    return db.query(Task).filter_by(id=task_id).first()

def edit_task(db, task_id, task):
    task_ = db.query(Task).filter_by(id=task_id).first()
    task_.title = task.title
    task_.description = task.description
    task_.status = task.status
    task_.created_at = task.created_at
    task_.deadline = task.deadline
    task_.accepted_at = task.accepted_at
    task_.budget = task.budget
    task_.executor_price = task.executor_price
    task_.executor_name = task.executor_name
    task_.executor_url = task.executor_url
    task_.customer_name = task.customer_name
    task_.customer_url = task.customer_url
    task_.file_id = task.file_id

    db.commit()

def create_task(db, task):
    task_ = Task(
        title = task.title,
        description = task.description,
        status = task.status,
        created_at = task.created_at,
        deadline = task.deadline,
        accepted_at = task.accepted_at,
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

def delete_task(db, task_id):
    task_ = db.query(Task).filter_by(id=task_id).first()
    db.delete(task_)
    db.commit()