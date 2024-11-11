import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import './Comments.css';
import CloseIcon from '@mui/icons-material/Close';

type Props = {
    task_id: number
}

type Comment = {
    id: number;
    author: string;
    text: string;
    attachment: number
}

type Attachment = {
    id: number;
    filename: string
}

export default function Comments(props: Props){

    const file_input_ref = useRef<HTMLInputElement>(null);

    const [user_file, setUserFile] = useState<File | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [attachments, setAttachments] = useState<Attachment[]>([]);

    const comment_ref = useRef<HTMLInputElement>(null);
    // const [username, setUsername] = useState<string>('');
    const username = localStorage.getItem('username') || '';

    const addComment = (comment: string, username: string) => {
        if(!props.task_id) return;
        if(!username || !comment) return;
        if(!user_file) {
            axios.post(`/tasks/${props.task_id}/comments`, {
                author: username,
                text: comment,
                attachment: -1
            })
            .then(res => {
                // console.log(res.data)
                setComments(prev => {
                    return [
                        ...prev,
                        res.data
                    ]
                })
                comment_ref.current!.value = '';
                comment_ref.current!.blur();
                setUserFile(null);
            })
            .catch(err => {
                console.log(err)
            })

            return;
        }
        add_attachment(user_file, (id) => {
            axios.post(`/tasks/${props.task_id}/comments`, {
                author: username,
                text: comment,
                attachment: id
            })
            .then(res => {
                // console.log(res.data)
                setComments(prev => {
                    return [
                        ...prev,
                        res.data
                    ]
                })
                comment_ref.current!.value = '';
                comment_ref.current!.blur();
                setUserFile(null);
            })
            .catch(err => {
                console.log(err)
            })
        })
        
    }
    
    function add_attachment(file: File, onUpload = (id: number) => {}) {
        const formData = new FormData();
        formData.append('uploaded_file', file);
        axios.post('/attachments', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(res => {
            // console.log(res.data)
            setAttachments(prev => {
                return [
                    ...prev,
                    res.data
                ]
            })
            onUpload(res.data.id);
        })
        .catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        const cancelToken = axios.CancelToken.source();
        axios.get(`/tasks/${props.task_id}/comments`, {cancelToken: cancelToken.token})
        .then(res => {
            setComments(res.data);
            for(let i = 0; i < res.data.length; i++){
                let _id = res.data[i].attachment;
                if(_id === -1) continue;
                axios.get(`/attachments/${_id}/name`, {cancelToken: cancelToken.token})
                .then(res => {
                    setAttachments(prev => {
                        return [
                            ...prev,
                            {
                                ...res.data,
                                id: _id
                            }
                        ]
                    })
                })
                .catch(err => {
                    console.log(err)
                })
            }
        })
        .catch(err => {
            console.log(err)
        })
        return () => {
            cancelToken.cancel();
        }
    }, [])

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if(!e.target.files) return;
        const files = e.target.files;
        if(files.length === 0) return;
        if(files[0]){
            setUserFile(files[0]);
        }
    }

    return (
        <div id="comments_container">
            <section id='comments'>
                <Typography variant="h4" style={{fontWeight: 'bold'}}>Комментарии</Typography>
                {comments.map((comment, index) => {

                    const {author, text} = comment;

                    const filename = attachments.find(attachment => attachment.id === comment.attachment)?.filename;

                    let is_image = false;
                    if(filename){
                        is_image = filename.endsWith('.png') || filename.endsWith('.jpg') || filename.endsWith('.jpeg');
                    }

                    let AttachmentEl = <a 
                    className="attachment"
                    href={`${axios.defaults.baseURL}attachments/${comment.attachment}`}
                    download={filename}
                    target="_blank"
                    ><FileOpenIcon/>{filename}</a>

                    if(is_image){
                        AttachmentEl = <img src={`${axios.defaults.baseURL}attachments/${comment.attachment}`} alt="" className="attachment"/>
                    }

                    return (
                        <div key={index} className="comment_message">
                            <Typography variant="body1" className="username" style={{fontWeight: 'bold'}}>{author}</Typography>
                            {filename && (
                                AttachmentEl
                            )}
                            <Typography variant="body2">{text}</Typography>
                        </div>
                    )
                })}
            </section>
            <section id='comment_input'>
                <FormControl>
                    <InputLabel id="demo-simple-select-label">Имя</InputLabel>
                    <Select label="Имя" value={username} disabled>
                        <MenuItem value={username}>{username}</MenuItem>
                    </Select>
                </FormControl>
                <TextField label="Комментарий" 
                inputRef={comment_ref} 
                className="comment_input" 
                autoComplete="off"
                multiline
                />
                <div id="user_files">
                    {
                        user_file && (
                            <div>
                                <IconButton
                                size="small"
                                style={
                                    {
                                        position: 'absolute',
                                        right: '-15px',
                                        top: '-15px',
                                        background: 'rgba(255, 255, 255, 0.5)'
                                    }
                                }
                                onClick={() => {
                                    setUserFile(null);
                                }}
                                >
                                    <CloseIcon fontSize="small"
                                    />
                                </IconButton>
                                <Typography variant="body2">{user_file.name}</Typography>
                            </div>
                        )
                    }
                </div>
                <div
                style={
                    {
                        display: 'flex',
                        gap: '10px'
                }}
                >
                    <input type="file" ref={file_input_ref} onChange={handleFileChange} className="file_input"
                    hidden
                    />
                    <Button onClick={() => file_input_ref.current?.click()} variant="contained">
                        <AttachFileIcon/>
                    </Button>
                    <Button onClick={() => addComment(comment_ref.current?.value || "", username || "")}
                    className="send_button"  
                    variant="contained"  
                    style={
                        {
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: '10px',
                            flexGrow: 1
                        }
                    }
                    >
                        Отправить
                        <SendIcon/>
                    </Button>
                </div>
            </section>
        </div>
    )
}