from pydantic import BaseModel

class CommentSchema(BaseModel):
    id: int
    task_id: int
    author: str
    text: str
    attachment: int

class CommentCreateSchema(BaseModel):
    author: str
    text: str
    attachment: int