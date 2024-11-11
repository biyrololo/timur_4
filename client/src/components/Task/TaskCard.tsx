import { Button, Card, CardActions, CardContent, Divider, Typography } from "@mui/material";
import { Task } from "types";
import EventBusyIcon from '@mui/icons-material/EventBusy';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import TimelineIcon from '@mui/icons-material/Timeline';
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import NotificationsIcon from '@mui/icons-material/Notifications';

const CardDataRow = styled(Typography)(
    {
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
    }
)

type Props = Task & {
    handleDelete: (id: number) => void;
    view?: boolean;
    notification?: boolean
}

export default function TaskCard(task: Props) {
    
    const [fileName, setFileName] = useState('');

    useEffect(() => {
        if(!task.view) return;
        const cancelToken = axios.CancelToken.source();
        axios.get(`/files/${task.file_id}/name`, {cancelToken: cancelToken.token})
        .then(res => {
            setFileName(res.data.filename)
        })
        .catch(err => {
            console.log(err)
        })
        return () => {
            cancelToken.cancel();
        }
    })

    function downloadFile() {
        const url = `/files/${task.file_id}`;

        axios.get(url, { responseType: 'blob' })
            .then((response) => {
                const blob = new Blob([response.data], { type: response.headers['content-type'] });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = fileName;
                link.click();
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return (
        <Card className="task_card">
            {
                task.notification && (
                    <section className="notification">
                        <NotificationsIcon style={{fontSize: '60px', color: '#444dfa'}}/>
                    </section>
                )
            }
            <CardContent style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                <CardDataRow gutterBottom variant="h4">
                    {task.title}
                </CardDataRow>
                {
                    !task.view &&
                    <CardDataRow variant="body2" color="text.secondary" style={{maxWidth: '100%', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', display: 'block'}}>
                        {task.description}
                    </CardDataRow>
                }
                <Divider />
                <CardDataRow variant="body2" color="text.secondary">
                    Заказчик <a href={task.customer_url || 'в поиске'} target="_blank" className="link">{task.customer_name || 'в поиске'}</a>
                </CardDataRow>
                <CardDataRow variant="body2" color="text.secondary">
                    Исполнитель <a href={task.executor_url || 'в поиске'} target="_blank" className="link">{task.executor_name || 'в поиске'}</a>
                </CardDataRow>
                <CardDataRow variant="body2" color="text.secondary">
                    Бюджет: {task.budget} ₽
                </CardDataRow>
                <CardDataRow variant="body2" color="text.secondary">
                    Оплата исполнителю: {task.executor_price} ₽
                </CardDataRow>
                <CardDataRow variant="body2" color="text.secondary">
                    <TimelineIcon/> Статус: <span style={{color: '#0092CC'}}>{task.status} {task.status === 'завершён' && `(${task.completed_at})`}</span>
                </CardDataRow>
                <CardDataRow variant="body2" color="text.secondary">
                    <CalendarMonthIcon /> Создан: {task.created_at}
                </CardDataRow>
                <CardDataRow variant="body2" color="text.secondary">
                    <EventAvailableIcon /> Принят: {task.accepted_at}
                </CardDataRow>
                <CardDataRow variant="body2" color="text.secondary">
                    <EventBusyIcon /> Дедлайн: {task.deadline}
                </CardDataRow>
                {
                    task.view && 
                    <>
                    <CardDataRow variant="body2" color="text.secondary">
                        {task.description}
                    </CardDataRow>
                    <Button size="small" variant="contained" color="primary" onClick={downloadFile}>Скачать файл {fileName}</Button>
                    </>
                }
            </CardContent>
            <CardActions className="task_card_actions">
                {
                    !task.view &&
                    <Button size="small" variant="contained" color="primary"><Link to={`/task/${task.id}`} style={{color: 'white', textDecoration: 'none'}}>Подробнее</Link></Button>
                }
                <Button size="small" variant="contained" color="warning"><Link to={`/edit/${task.id}`} style={{color: 'white', textDecoration: 'none'}}>Редактировать</Link></Button>
                <Button size="small" variant="contained" color="error" onClick={() => task.handleDelete(task.id)}>Удалить</Button>
            </CardActions>
        </Card>
    )
}