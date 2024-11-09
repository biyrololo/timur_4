from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Depends
from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from fastapi.responses import FileResponse
from db import get_db
from pydantic import BaseModel
from fastapi import FastAPI, File, UploadFile

from models import *

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Task(BaseModel):
    id: int
    title: str
    description: str
    status: str
    created_at: str
    deadline: str
    accepted_at: str
    budget: int
    executor_price: int
    executor_name: str
    executor_url: str
    customer_name: str
    customer_url: str
    file_id: str

@app.get("/tasks")
def get_tasks_endpoint(db=Depends(get_db)):
    return get_tasks(db)

@app.get("/tasks/{task_id}")
def get_task_endpoint(task_id, db=Depends(get_db)):
    return get_task(db, task_id)

@app.delete("/tasks/{task_id}")
def delete_task_endpoint(task_id, db=Depends(get_db)):
    delete_task(db, task_id)
    return task_id

@app.get("/tasks/{task_id}/comments")
def get_comments_endpoint(task_id, db=Depends(get_db)):
    return get_comments(db, task_id)

class Comment(BaseModel):
    comment: str

@app.post("/tasks/{task_id}/comments")
def add_comment_endpoint(task_id, comment: Comment, db=Depends(get_db)):
    create_comment(db, task_id, comment.comment)
    return comment.comment

@app.post("/tasks")
def create_task_endpoint(task: Task, db=Depends(get_db)):
    del task.id
    task.status = 'в поиске'
    create_task(db, task)
    return task

@app.put("/tasks/{task_id}")
def edit_task_endpoint(task_id, task: Task, db=Depends(get_db)):
    edit_task(db, task_id, task)
    return task

@app.post("/upload/file")
async def upload_file(uploaded_file: UploadFile):
    file_location = f"files/{uploaded_file.filename}"
    with open(file_location, "wb") as file_object:
        file_object.write(uploaded_file.file.read())
    return {"filename": uploaded_file.filename}

@app.get('/files/{file_id}')
async def get_file(file_id: str):
    return FileResponse(f"files/{file_id}")

@app.get('/statistic')
def get_statistic_endpoint(db=Depends(get_db)):
    tasks = get_tasks(db)
    expenses = 0
    profit = 0
    clear_profit = 0
    for task in tasks:
        if task.status == "завершён":
            expenses += task.executor_price
            profit += task.budget
            clear_profit += task.budget - task.executor_price
    ads = get_statistic(db)
    if ads:
        ads = ads.ads
    else:
        ads = 0
    return {
        "profit": profit,
        "expenses": expenses,
        "clear_profit": clear_profit,
        "ads": ads
    }

class Statistic(BaseModel):
    ads: int

@app.put('/statistic')
def set_statistic_endpoint(ads: Statistic, db=Depends(get_db)):
    set_statistic(db, ads.ads)
    return ads