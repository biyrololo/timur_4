import { Task, StatusType } from "types/Task";
import { useState,useEffect, useRef } from "react";
import axios from "axios";
import { Button, Select, TextField, Typography, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useNavigate } from "react-router-dom";
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {CircularProgress} from "@mui/material";

type Props = {
    task_id: string | undefined
}

export default function TaskEdit(props: Props) {

    const navigate = useNavigate();

    const id = parseInt(props.task_id || "-1");

    const file_input_ref = useRef<HTMLInputElement>(null);

    const [is_file_loaded, setIsFileLoaded] = useState(true);

    const [filename, setFilename] = useState("");

    const [task, setTask] = useState<Task | null>(
        {
            id: -1,
            title: '',
            description: '',
            status: 'поиск исполнителя',
            created_at: '',
            deadline: '',
            accepted_at: '',
            completed_at: '',
            budget: 0,
            executor_price: 0,
            executor_name: '',
            executor_url: '',
            customer_name: '',
            customer_url: '',
            file_id: -1,

        }
    );

    useEffect(() => {
        const cancelToken = axios.CancelToken.source();

        axios.get(`/tasks/${id}`, {cancelToken: cancelToken.token})
        .then(res => {
            setTask(res.data)
            return axios.get(`/files/${res.data.file_id}/name`, {cancelToken: cancelToken.token})
        })
        .then(res => {
            setFilename(res.data.filename)
        })
        .catch(err => {
            console.log(err)
        })

        return () => {
            cancelToken.cancel();
        }
    }, [id])

    function handle_change_file(e: React.ChangeEvent<HTMLInputElement>){
        if(!task) return;
        if(e.target.files){
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('uploaded_file', file);
            axios.post('/upload/file', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(res => {
                if(res.data.filename){
                    setTask(prev => {
                        return {
                            ...prev,
                            file_id: res.data.filename
                        } as Task
                    })
                }
            })
            .catch(err => {
                console.log(err)
            })
        }
    }

    function handle_edit(){
        if(!task) return;
        const _task : Task = {
            ...task
        }
        if(_task.status === 'завершён' && !_task.completed_at){
            _task.completed_at = new Date().toISOString().slice(0, 10);
        }
        axios.put(`/tasks/${task.id}`, _task)
        .then(res => {
            console.log(res)
            navigate(`/`)
        })
        .catch(err => {
            console.log(err)
        })
    }

    if(!task) return null;

    return (
        <main id="task_edit">
            <Typography variant="h2" className="task_edit_title">Редактирование заказа</Typography>

            <TextField
            label="Название"
            variant="outlined"
            value={task.title}
            onChange={e => setTask({...task, title: e.target.value})}
            autoComplete="off"
            />

            <TextField
            label="Описание"
            variant="outlined"
            value={task.description}
            onChange={e => setTask({...task, description: e.target.value})}
            autoComplete="off"
            multiline
            />

            <FormControl>
                <InputLabel>Статус</InputLabel>
                <Select
                label="Статус"
                variant="outlined"
                value={task.status}
                onChange={e => setTask({...task, status: e.target.value as StatusType})}
                autoComplete="off"
                >
                    <MenuItem value="поиск исполнителя">Поиск исполнителя</MenuItem>
                    <MenuItem value="в разработке">В разработке</MenuItem>
                    <MenuItem value="на утверждении заказчика">На утверждении заказчика</MenuItem>
                    <MenuItem value='доработка'>Доработка</MenuItem>
                    <MenuItem value='завершён'>Завершён</MenuItem>
                    <MenuItem value='в поиске'>В поиске</MenuItem>
                </Select>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                label="Дедлайн"
                value={dayjs(task.deadline)}
                onChange={(newValue: Dayjs | null) => {
                    if(!newValue) return;
                    setTask({...task, deadline: newValue.toISOString().slice(0, 10)});
                }}
                />
            </LocalizationProvider>

            
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                label="Создано"
                value={dayjs(task.created_at)}
                onChange={(newValue: Dayjs | null) => {
                    if(!newValue) return;
                    setTask({...task, created_at: newValue.toISOString().slice(0, 10)});
                }}
                />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                label="Принято"
                value={dayjs(task.accepted_at)}
                onChange={(newValue: Dayjs | null) => {
                    if(!newValue) return;
                    setTask({...task, accepted_at: newValue.toISOString().slice(0, 10)});
                }}
                />
            </LocalizationProvider>

            <TextField
            label="Бюджет"
            variant="outlined"
            value={task.budget}
            onChange={e => setTask({...task, budget: parseInt(e.target.value || "0")})}
            autoComplete="off"
            />

            <TextField
            label="Цена исполнителя"
            variant="outlined"
            value={task.executor_price}
            onChange={e => setTask({...task, executor_price: parseInt(e.target.value || "0")})}
            autoComplete="off"
            />

            <TextField
            label="Имя исполнителя"
            variant="outlined"
            value={task.executor_name}
            onChange={e => setTask({...task, executor_name: e.target.value})}
            autoComplete="off"
            />

            <TextField
            label="Ссылка на исполнителя"
            variant="outlined"
            value={task.executor_url}
            onChange={e => setTask({...task, executor_url: e.target.value})}
            autoComplete="off"
            />

            <TextField
            label="Имя заказчика"
            variant="outlined"
            value={task.customer_name}
            onChange={e => setTask({...task, customer_name: e.target.value})}
            autoComplete="off"
            />

            <TextField
            label="Ссылка на заказчика"
            variant="outlined"
            value={task.customer_url}
            onChange={e => setTask({...task, customer_url: e.target.value})}
            autoComplete="off"
            />

            <Button variant="outlined" onClick={()=> file_input_ref.current?.click()} disabled={!is_file_loaded}>
                <input type="file" hidden ref={file_input_ref} onChange={handle_change_file}/>
                <span>{filename ? filename : 'Загрузить файл ТЗ'}</span>
                {!is_file_loaded && <CircularProgress size={24} />}
            </Button>

            <Button variant="contained" onClick={handle_edit} disabled={!is_file_loaded}>
                Сохранить
            </Button>
        </main>
    )
}