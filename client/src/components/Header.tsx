import { Typography } from '@mui/material'
import './Header.css'
import { useNavigate } from 'react-router-dom'

export default function Header() {

    const navigate = useNavigate()

    return (
        <header onClick={() => navigate('/')}>
            <div>
                <img src="/fidelis.jpg" 
                alt="" />
                <Typography variant="h4" style={{fontWeight: 'bold'}}>FideliS</Typography>
            </div>
            <div>
                <Typography variant="h4" style={{fontWeight: 'bold'}}>Itralit</Typography>
                <img src="/itralit.jpg" 
                alt="" />
            </div>
        </header>
    )
}