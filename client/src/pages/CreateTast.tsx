import Header from "components/Header";
import Footer from "components/Footer";
import { TaskCreate } from "components/Task";

export default function CreateTask(){
    return (
        <>
            <Header />
            <TaskCreate />
            <Footer />
        </>
    )
}