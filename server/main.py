from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import Depends
from fastapi import HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import FileResponse
from db import get_db
from pydantic import BaseModel
from fastapi import FastAPI, File, UploadFile
import os

from secret import *

from schemas import *

from models import *

security = HTTPBearer(scheme_name='Authorization')

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/tasks")
def get_tasks(pass_token: HTTPAuthorizationCredentials = Depends(security), db=Depends(get_db)):
    user = pass_token.credentials.split(":")
    if(not check_password(name=user[0], password=user[1])):
        raise HTTPException(status_code=401, detail="Unauthorized")
    return TaskModel.get_all(db)

@app.get("/tasks/{task_id}")
def get_task_endpoint(task_id, pass_token: HTTPAuthorizationCredentials = Depends(security), db=Depends(get_db)):
    user = pass_token.credentials.split(":")
    if(not check_password(name=user[0], password=user[1])):
        raise HTTPException(status_code=401, detail="Unauthorized")
    return TaskModel.get_by_task_id(db, task_id)

@app.delete("/tasks/{task_id}")
def delete_task_endpoint(task_id, pass_token: HTTPAuthorizationCredentials = Depends(security), db=Depends(get_db)):
    user = pass_token.credentials.split(":")
    if(not check_password(name=user[0], password=user[1])):
        raise HTTPException(status_code=401, detail="Unauthorized")
    TaskModel.delete(db, task_id)
    notifications = NotificationModel.get_by_task_id(db, task_id)
    for notification in notifications:
        NotificationModel.delete(db, notification['id'])
    return task_id

@app.get("/tasks/{task_id}/comments")
def get_comments_endpoint(task_id, pass_token: HTTPAuthorizationCredentials = Depends(security), db=Depends(get_db)):
    user = pass_token.credentials.split(":")
    if(not check_password(name=user[0], password=user[1])):
        raise HTTPException(status_code=401, detail="Unauthorized")
    user_id = get_id(user[0])
    user_notifications = NotificationModel.get_by_user_id(db, user_id)
    for notification in user_notifications:
        if notification['task_id'] == int(task_id):
            NotificationModel.delete(db, notification['id'])
            break
    return CommentModel.by_task_id(db, task_id)

@app.post("/tasks/{task_id}/comments")
def add_comment_endpoint(task_id, comment: CommentCreateSchema, pass_token: HTTPAuthorizationCredentials = Depends(security), db=Depends(get_db)):
    user = pass_token.credentials.split(":")
    if(not check_password(name=user[0], password=user[1])):
        raise HTTPException(status_code=401, detail="Unauthorized")
    user_id = get_id(user[0])
    other_users = get_id_reverse(user_id)
    for user in other_users:
        print(f'Creating notification for user {user}')
        NotificationModel.create(db, {'task_id': task_id, 'user_id': user})
    _comment = {}
    _comment['author'] = comment.author
    _comment['text'] = comment.text
    _comment['attachment'] = comment.attachment
    c = CommentModel.create(db, int(task_id), _comment)
    return c

@app.post("/tasks")
def create_task_endpoint(task: TaskCreateSchema, pass_token: HTTPAuthorizationCredentials = Depends(security), db=Depends(get_db)):
    user = pass_token.credentials.split(":")
    if(not check_password(name=user[0], password=user[1])):
        raise HTTPException(status_code=401, detail="Unauthorized")
    task.status = 'в поиске'
    task = TaskModel.create_task(db, task)
    return task

@app.put("/tasks/{task_id}")
def edit_task_endpoint(task_id, task: TaskCreateSchema, pass_token: HTTPAuthorizationCredentials = Depends(security), db=Depends(get_db)):
    user = pass_token.credentials.split(":")
    if(not check_password(name=user[0], password=user[1])):
        raise HTTPException(status_code=401, detail="Unauthorized")
    task = TaskModel.edit(db, task_id, task)
    return task

@app.post("/upload/file")
async def upload_file(uploaded_file: UploadFile, pass_token: HTTPAuthorizationCredentials = Depends(security), db=Depends(get_db)):
    user = pass_token.credentials.split(":")
    if(not check_password(name=user[0], password=user[1])):
        raise HTTPException(status_code=401, detail="Unauthorized")
    file = FileModel.create(db)
    id = file['id']
    FileModel.edit(db, {'filename': uploaded_file.filename}, id)
    file_location = f"server/files/{id}/{uploaded_file.filename}"
    # create directory if not exist
    if not os.path.exists(f"server/files/{id}"):
        os.makedirs(f"server/files/{id}")

    with open(file_location, "wb") as file_object:
        file_object.write(uploaded_file.file.read())
    return {"id": id, "filename": uploaded_file.filename}

@app.get('/files/{file_id}')
async def get_file(file_id: str, pass_token: HTTPAuthorizationCredentials = Depends(security), db=Depends(get_db)):
    user = pass_token.credentials.split(":")
    if(not check_password(name=user[0], password=user[1])):
        raise HTTPException(status_code=401, detail="Unauthorized")
    file = FileModel.get_by_id(db, file_id)
    return FileResponse(f"server/files/{file_id}/{file['filename']}")

@app.get('/files/{file_id}/name')
async def get_file_name(file_id: str, pass_token: HTTPAuthorizationCredentials = Depends(security), db=Depends(get_db)):
    user = pass_token.credentials.split(":")
    if(not check_password(name=user[0], password=user[1])):
        raise HTTPException(status_code=401, detail="Unauthorized")
    file = FileModel.get_by_id(db, file_id)
    if file is None:
        raise HTTPException(status_code=404, detail="File not found")
    return {"filename": file['filename']}

@app.post("/attachments")
async def upload_file(uploaded_file: UploadFile, pass_token: HTTPAuthorizationCredentials = Depends(security), db=Depends(get_db)):
    user = pass_token.credentials.split(":")
    if(not check_password(name=user[0], password=user[1])):
        raise HTTPException(status_code=401, detail="Unauthorized")
    file = AttachmentModel.create(db)
    id = file['id']
    file = AttachmentModel.edit(db, {'filename': uploaded_file.filename}, id)
    file_location = f"server/attachments/{id}/{uploaded_file.filename}"
    # create directory if not exist
    if not os.path.exists(f"server/attachments/{id}"):
        os.makedirs(f"server/attachments/{id}")

    with open(file_location, "wb") as file_object:
        file_object.write(uploaded_file.file.read())
    return file

@app.get('/attachments/{file_id}')
async def get_file(file_id: str, db=Depends(get_db)) -> FileResponse:
    try:
        file = AttachmentModel.get(db, file_id)
        return FileResponse(f"server/attachments/{file_id}/{file['filename']}")
    except:
        raise HTTPException(status_code=404, detail="File not found")
    
@app.get('/attachments')
def get_attachments_endpoint(pass_token: HTTPAuthorizationCredentials = Depends(security), db=Depends(get_db)):
    user = pass_token.credentials.split(":")
    if(not check_password(name=user[0], password=user[1])):
        raise HTTPException(status_code=401, detail="Unauthorized")
    return AttachmentModel.get_all(db)
    
@app.get('/attachments/{file_id}/name')
async def get_file_name(file_id: str, pass_token: HTTPAuthorizationCredentials = Depends(security), db=Depends(get_db)):
    user = pass_token.credentials.split(":")
    if(not check_password(name=user[0], password=user[1])):
        raise HTTPException(status_code=401, detail="Unauthorized")
    try:
        file = AttachmentModel.get(db, file_id)
        return {"filename": file['filename']}
    except Exception as e:
        raise HTTPException(status_code=404, detail="File not found")

@app.get('/statistic')
def get_statistic_endpoint(pass_token: HTTPAuthorizationCredentials = Depends(security), db=Depends(get_db)):
    user = pass_token.credentials.split(":")
    if(not check_password(name=user[0], password=user[1])):
        raise HTTPException(status_code=401, detail="Unauthorized")
    others_expenses_all = StatisticModel.get_all(db)
    if(len(others_expenses_all) == 0):
        others_expenses_all = []
        others_expenses_all.append(StatisticModel.create(db, {'name': 'Реклама', 'value': 0}))
        others_expenses_all.append(StatisticModel.create(db, {'name': 'Прочие расходы', 'value': 0}))
    tasks = TaskModel.get_all(db)
    expenses = 0
    profit = 0
    clear_profit = 0
    for task in tasks:
        if task.status == "завершён":
            expenses += task.executor_price
            profit += task.budget
            clear_profit += task.budget - task.executor_price
    others_expenses = StatisticModel.get_all(db)
    return {
        "main": {
            "profit": profit,
            "expenses": expenses,
            "clear_profit": clear_profit,
        },
        "other": others_expenses
    }

@app.put('/statistic/{id}')
def set_statistic_endpoint(id, statistic: StatisticSchema, pass_token: HTTPAuthorizationCredentials = Depends(security), db=Depends(get_db)):
    user = pass_token.credentials.split(":")
    if(not check_password(name=user[0], password=user[1])):
        raise HTTPException(status_code=401, detail="Unauthorized")
    s = StatisticModel.increment(db, statistic, id)
    return s

@app.get('/notifications')
def get_notifications_endpoint(pass_token: HTTPAuthorizationCredentials = Depends(security), db=Depends(get_db)):
    user = pass_token.credentials.split(":")
    if(not check_password(name=user[0], password=user[1])):
        raise HTTPException(status_code=401, detail="Unauthorized")
    user_id = get_id(user[0])
    return NotificationModel.get_by_user_id(db, user_id)

class LoginSchema(BaseModel):
    username: str
    password: str

@app.post('/login')
def login_endpoint(login: LoginSchema, db=Depends(get_db)):
    if check_password(name=login.username, password=login.password):
        user = get_by(login.username, login.password)
        return {"token": f"{login.username}:{login.password}", "username": user['username']}
    raise HTTPException(status_code=401, detail="Invalid username or password")