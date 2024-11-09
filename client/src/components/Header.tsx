import { Typography } from '@mui/material'
import './Header.css'

export default function Header() {
    return (
        <header>
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