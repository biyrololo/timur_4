import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Task } from "types/Task";
import Header from "components/Header";
import Footer from "components/Footer";
import { TaskCard } from "components/Task";
import Comments from "components/Comments/Comments";
import { useNavigate } from "react-router-dom";

export default function TaskView(){
    const {id} = useParams();

    const navigate = useNavigate();

    const [task, setTask] = useState<Task | null>(null);

    useEffect(() => {
        axios.get(`/tasks/${id}`)
        .then(res => {
            setTask(res.data)
        })
        .catch(err => {
            console.log(err)
        })
    }, [])

    function handle_delete(id: number){
        axios.delete(`/tasks/${id}`)
        .then(res => {
            navigate(`/`)
        })
        .catch(err => {
            console.log(err)
        })
    }

    if(!task) return <div>Загрузка...</div>

    return (
        <>
            <Header />
            <main id="task_view">
                <TaskCard {...task} view={true} handleDelete={()=>{}}/>
                <Comments task_id={task.id} />
            </main>
            <Footer />
        </>
    )
}