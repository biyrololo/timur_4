import { Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";

type Props = {
    on_login: () => void
}

export default function LoginPage({on_login}: Props){

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [is_error, setIsError] = useState(false);

    function handle_login(){
        axios.post('/login', {username, password})
        .then(res => {
            const token = res.data.token;
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('token', token);
            localStorage.setItem('username', res.data.username);
            on_login();
        })
        .catch(err => {
            setIsError(true);
        })
    }

    return (
        <main>
            <section className="responsive_container">
                <Typography variant="h4">Вход</Typography>
                <TextField 
                label="Логин" 
                onChange={e => setUsername(e.target.value)} 
                value={username}
                error={is_error}
                autoComplete="username"
                helperText={is_error ? 'Неверный логин или пароль' : ''}
                />
                <TextField 
                label="Пароль" 
                onChange={e => setPassword(e.target.value)} 
                value={password}
                error={is_error}
                autoComplete="password"
                type="password"
                helperText={is_error ? 'Неверный логин или пароль' : ''}
                />
                <Button onClick={handle_login}>Войти</Button>
            </section>
        </main>
    )
}