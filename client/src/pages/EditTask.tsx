import { useParams } from "react-router-dom";
import Header from "components/Header";
import Footer from "components/Footer";
import {TaskEdit} from "components/Task";

export default function EditTask(){
    const {id} = useParams();

    return (
        <>
            <Header />
            <TaskEdit task_id={id} />
            <Footer />
        </>

    )
}