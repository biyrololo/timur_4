import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';

type Props = {
    task_id: number
}

export default function Comments(props: Props){

    const [comments, setComments] = useState<string[]>([]);

    const comment_ref = useRef<HTMLInputElement>(null);
    const [username, setUsername] = useState<string>('');

    const addComment = (comment: string, username: string) => {
        if(!props.task_id) return;
        if(!username || !comment) return;
        axios.post(`/tasks/${props.task_id}/comments`, {comment: `${username}:::${comment}`})
        .then(res => {
            setComments(prev => {
                return [
                    ...prev,
                    `${username}:::${comment}`
                ]
            })
            comment_ref.current!.value = '';
            comment_ref.current!.blur();
        })
        .catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        const cancelToken = axios.CancelToken.source();
        axios.get(`/tasks/${props.task_id}/comments`, {cancelToken: cancelToken.token})
        .then(res => {
            setComments(res.data.map((i: any)=> i.comment))
        })
        .catch(err => {
            console.log(err)
        })
        return () => {
            cancelToken.cancel();
        }
    }, [])

    return (
        <div id="comments_container">
            <section id='comments'>
                <Typography variant="h4" style={{fontWeight: 'bold'}}>Комментарии</Typography>
                {comments.map((comment, index) => {

                    const name = comment.split(':::')[0];
                    const text = comment.split(':::')[1];

                    return (
                        <div key={index}>
                            <Typography variant="body1" className="username" style={{fontWeight: 'bold'}}>{name}</Typography>
                            <Typography variant="body2">{text}</Typography>
                        </div>
                    )
                })}
            </section>
            <section id='comment_input'>
                <FormControl>
                    <InputLabel id="demo-simple-select-label">Имя</InputLabel>
                    <Select label="Имя" value={username} onChange={(e) => setUsername(e.target.value)}>
                        <MenuItem value='Тимур'>Тимур</MenuItem>
                        <MenuItem value='Алексей'>Алексей</MenuItem>
                    </Select>
                </FormControl>
                <TextField label="Комментарий" 
                inputRef={comment_ref} 
                className="comment_input" 
                autoComplete="off"
                multiline
                />
                <Button onClick={() => addComment(comment_ref.current?.value || "", username || "")}
                className="send_button"  
                variant="contained"  
                style={
                    {
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: '10px'
                    }
                }
                >
                    Отправить
                    <SendIcon/>
                </Button>
            </section>
        </div>
    )
}