from pydantic import BaseModel

class TaskSchema(BaseModel):
    id: int
    title: str
    description: str
    status: str
    created_at: str
    deadline: str
    accepted_at: str
    completed_at: str
    budget: int
    executor_price: int
    executor_name: str
    executor_url: str
    customer_name: str
    customer_url: str
    file_id: int

class TaskCreateSchema(BaseModel):
    title: str
    description: str
    status: str
    created_at: str
    deadline: str
    accepted_at: str
    completed_at: str
    budget: int
    executor_price: int
    executor_name: str
    executor_url: str
    customer_name: str
    customer_url: str
    file_id: int