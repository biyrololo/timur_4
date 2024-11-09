import { Button, Divider, TextField, Typography } from "@mui/material";
import Footer from "components/Footer";
import Header from "components/Header";
import CurrencyRubleIcon from '@mui/icons-material/CurrencyRuble';
import { useEffect, useState } from "react";
import axios from "axios";

type Statistic = {
    profit: number,
    expenses: number,
    clear_profit: number,
    ads: number
}

export default function Finances() {

    const [statistic, setStatistic] = useState<Statistic | null>(null);
    const [value, setValue] = useState('');

    useEffect(() => {
        const cancelToken = axios.CancelToken.source();
        axios.get('/statistic', {cancelToken: cancelToken.token})
        .then(res => {
            setStatistic(res.data)
        })
        .catch(err => {
            console.log(err)
        })
        return () => {
            cancelToken.cancel();
        }
    }, [])

    function update_ads(){
        if(!statistic) return;
        axios.put('/statistic', {ads: parseInt(value)})
        .then(res => {
            setStatistic(prev=> {
                if(!prev) return null;
                return {
                    ...prev,
                    ads: prev.ads + res.data.ads
                }
            })
            setValue('');
        })
        .catch(err => {
            console.log(err)
        })
    }

    return (
        <>
            <Header />
            <main id="task_edit">
                <Typography variant="h3" style={{textAlign: 'center'}}>Финансы</Typography>
                <Divider />
                <br />
                {
                    statistic && (
                        <>
                            <Typography variant="h4" style={{display: 'flex', alignItems: 'center'}} className="finances_text">Расходы: {statistic.expenses}<CurrencyRubleIcon fontSize="large"/></Typography>
                            <Typography variant="h4" style={{display: 'flex', alignItems: 'center'}} className="finances_text">Доходы: {statistic.profit}<CurrencyRubleIcon fontSize="large"/></Typography> 
                            <Typography variant="h4" style={{display: 'flex', alignItems: 'center'}} className="finances_text">Расходы на рекламу: {statistic.ads}<CurrencyRubleIcon fontSize="large"/></Typography>
                            <Typography variant="h4" style={{display: 'flex', alignItems: 'center'}} className="finances_text">Чистая прибыль: {statistic.clear_profit - statistic.ads}<CurrencyRubleIcon fontSize="large"/></Typography>
                            <div>
                                <TextField label='Затраты на рекламу'
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                fullWidth
                                variant="standard"
                                autoComplete="off"
                                inputProps={{style: {fontSize: 30}}}
                                InputLabelProps={{style: {fontSize: 30}}}
                                />
                                <Button variant="contained" onClick={update_ads}
                                sx={
                                    {
                                        width: '100%',
                                        marginTop: '20px'
                                    }
                                }    
                                >
                                    Обновить
                                </Button>
                            </div>
                        </>
                    )
                }
            </main>
            <Footer />
        </>
    )
}