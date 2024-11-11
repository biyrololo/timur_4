import axios from 'axios';
import './MainPage.css'
import { useState, useEffect } from 'react'
import Header from 'components/Header';
import Footer from 'components/Footer';
import { Button, Divider, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Task } from 'types';
import { TaskCard } from 'components/Task';

type Notification = {
    id: number;
    task_id: number;
    user_id: number;   
}

export default function MainPage(){

    const [notifications, set_notifications] = useState<Notification[]>([]);

    useEffect(() => {
        const cancalToken = axios.CancelToken.source();

        axios.get('/notifications', {cancelToken: cancalToken.token})
        .then(res => {
            set_notifications(res.data)
        })
        .catch(err => {
            console.log(err)
        })

        return () => {
            cancalToken.cancel()
        }
    }, [])

    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        const cancalToken = axios.CancelToken.source();

        axios.get('/tasks', {cancelToken: cancalToken.token})
        .then(res => {
            setTasks(res.data)
        })
        .catch(err => {
            console.log(err)
        })

        return () => {
            cancalToken.cancel()
        }
    }, [])

    function handle_delete(id: number){
        axios.delete(`/tasks/${id}`)
        .then(res => {
            setTasks(tasks.filter(task => task.id !== id))
        })
        .catch(err => {
            console.log(err)
        })
    }

    return (
        <>
            <Header />
            <main>
                <section id='nav'>
                    <Typography variant='h1' style={{textAlign: 'center'}} component={'div'} className='title'>
                        Список заказов
                    </Typography>
                    <div className='nav_buttons'>
                        <Link to={'/create'} className='link'>
                            <Button variant='contained' style={{width: '170px'}}>
                                Добавить заказ
                            </Button>
                        </Link>
                        <Divider orientation="vertical" flexItem />
                        <Link to={'/finance'} className='link'>
                            <Button variant='contained' style={{width: '170px'}}>
                                Финасы
                            </Button>
                        </Link>
                    </div>
                </section>
                <section id='tasks'>
                    {
                        tasks.map(task => {
                            return (
                                <TaskCard key={task.id} {...task} handleDelete={handle_delete} notification={notifications.find(el => el.task_id === task.id) !== undefined}/>
                            )
                        })
                    }
                </section>
            </main>
            <Footer />
        </>
    )
}