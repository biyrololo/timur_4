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
}

type OtherExpense = {
    id: number,
    name: string,
    value: number
}

export default function Finances() {

    const [statistic, setStatistic] = useState<Statistic | null>(null);
    const [other_expenses, setOtherExpenses] = useState<OtherExpense[]>([]);
    const [other_inputs, setOtherInputs] = useState<OtherExpense[]>([]);
    const [other_sum, setOtherSum] = useState(0);

    useEffect(() => {
        const cancelToken = axios.CancelToken.source();
        axios.get('/statistic', {cancelToken: cancelToken.token})
        .then(res => {
            setStatistic(res.data.main);
            setOtherExpenses(res.data.other);
            setOtherInputs(res.data.other.map((other_expense: OtherExpense) => {
                return {
                    ...other_expense,
                    value: 0
                }
            }));
            setOtherSum(res.data.other.reduce((sum: number, other_expense: OtherExpense) => sum + other_expense.value, 0));
        })
        .catch(err => {
            console.log(err)
        })
        return () => {
            cancelToken.cancel();
        }
    }, [])

    function handle_update_other_expense(other_expense: OtherExpense){
        axios.put(`/statistic/${other_expense.id}`, other_expense)
        .then(res => {
            setOtherInputs(prev => {
                return prev.map((other_expense_) => {
                    if (other_expense_.id === res.data.id) {
                        return {
                            ...other_expense_,
                            value: 0
                        }
                    }
                    return other_expense_
                })
            })
            setOtherExpenses(prev => {
                return prev.map((other_expense_) => {
                    if (other_expense_.id === res.data.id) {
                        return res.data
                    }
                    return other_expense_
                })
            })
            setOtherSum(prev => prev + other_expense.value);
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
                            {
                                other_expenses.map((other_expense, index) => (
                                    <Typography variant="h4" style={{display: 'flex', alignItems: 'center'}} className="finances_text" key={other_expense.id}>
                                        {other_expense.name}: {other_expense.value}<CurrencyRubleIcon fontSize="large"/>
                                    </Typography>
                                ))
                            }
                            <Typography variant="h4" style={{display: 'flex', alignItems: 'center'}} className="finances_text">Чистая прибыль: {statistic.clear_profit - other_sum}<CurrencyRubleIcon fontSize="large"/></Typography>
                            {
                                other_inputs.map((other_expense, index) => (
                                    <div key={other_expense.id}>
                                        <TextField label={`Затраты на ${other_expense.name}`}
                                        value={other_expense.value}
                                        onChange={(e) => {
                                            setOtherInputs(
                                                other_inputs.map((other_expense, i) => {
                                                    if (i === index) {
                                                        return {
                                                            ...other_expense,
                                                            value: parseInt(e.target.value || '0')
                                                        }
                                                    }
                                                    return other_expense;
                                                })
                                            )
                                        }}
                                        fullWidth
                                        variant="standard"
                                        autoComplete="off"
                                        inputProps={{style: {fontSize: 30}}}
                                        InputLabelProps={{style: {fontSize: 30}}}
                                        />
                                        <Button variant="contained" onClick={() => handle_update_other_expense(other_expense)}
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
                                ))
                            }
                        </>
                    )
                }
            </main>
            <Footer />
        </>
    )
}