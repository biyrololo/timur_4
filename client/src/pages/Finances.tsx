import { Button, Checkbox, Divider, FormControlLabel, IconButton, TextField, Typography } from "@mui/material";
import Footer from "components/Footer";
import Header from "components/Header";
import CurrencyRubleIcon from '@mui/icons-material/CurrencyRuble';
import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { Close } from "@mui/icons-material";
import {addDays} from 'date-fns';
import { DateRange } from 'react-date-range';
import ru from 'date-fns/locale/ru';
import dayjs from "dayjs";
import { Task } from 'types';

type Statistic = {
    profit: number,
    expenses: number,
    clear_profit: number,
}

type OtherExpense = {
    id: number,
    name: string,
    value: number;
    date: string;
}

type DateRangeT = {
    startDate: Date,
    endDate: Date,
    key: 'selection'
}

export default function Finances() {

    const new_expense_name_ref = useRef<HTMLInputElement>(null);
    const new_expense_value_ref = useRef<HTMLInputElement>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    useEffect(() => {
        const cancalToken = axios.CancelToken.source();

        axios.get('/tasks', {cancelToken: cancalToken.token})
        .then(res => {
            setTasks(res.data)
        })
        .catch(err => {
            console.log(err)
        })

        return () => {
            cancalToken.cancel()
        }
    }, [])

    const [statistic, setStatistic] = useState<Statistic | null>(null);
    const [other_expenses, setOtherExpenses] = useState<OtherExpense[]>([]);

    const [dates, setDates] = useState<DateRangeT[]>([
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 7),
            key: 'selection'
          }
    ])

    const [all_range, set_all_range] = useState(true);


    useEffect(() => {
        const cancelToken = axios.CancelToken.source();
        axios.get('/statistic', {cancelToken: cancelToken.token})
        .then(res => {
            setStatistic(res.data.main);
            setOtherExpenses(res.data.other);
        })
        .catch(err => {
            console.log(err)
        })
        return () => {
            cancelToken.cancel();
        }
    }, [])

    function handle_create(){
        if(!new_expense_name_ref || !new_expense_value_ref) return;
        if(!new_expense_name_ref.current || !new_expense_value_ref.current) return;
        if(!new_expense_name_ref.current.value || !new_expense_value_ref.current.value) return;

        

        axios.post('/statistic', {
            name: new_expense_name_ref.current.value,
            value: parseInt(new_expense_value_ref.current.value),
            date: new Date().toISOString().slice(0, 10)
        })
        .then(
            res => {
                setOtherExpenses(prev => [...prev, res.data])
            }
        )
        .catch(console.log)
    }

    function handle_delete(id: number, value: number){
        axios.delete(`/statistic/${id}`)
        .then(
            () => {
                setOtherExpenses(prev => prev.filter(i => i.id !== id));
            }
        )
        .catch(console.log)
    }

    const other_sum = useMemo(() => {
        if(all_range || !(dates[0].endDate && dates[0].startDate)){
            return other_expenses.reduce((sum: number, t: OtherExpense) => sum + t.value, 0);
        } 

        let s = 0;

        const start_date = dayjs(dates[0].startDate);
        const end_date = dayjs(dates[0].endDate);

        for(let i of other_expenses){
            const d = dayjs(i.date);
            if(
                (start_date.isBefore(d) || start_date.isSame(d)) &&
                (d.isBefore(end_date) || d.isSame(end_date))
            ) {
                s+=i.value;
            }
        }

        return s;

    }, [other_expenses, dates[0], all_range])

    const visible_other_expenses = useMemo(()=>{
        if(all_range || !(dates[0].endDate && dates[0].startDate)){
             return other_expenses;
        }
        const start_date = dayjs(dates[0].startDate);
        const end_date = dayjs(dates[0].endDate);

        return other_expenses.filter((i) => {
            const d = dayjs(i.date); 
            return (start_date.isBefore(d) || start_date.isSame(d)) &&
            (d.isBefore(end_date) || d.isSame(end_date));
        })

        
    }, [other_expenses, dates[0], all_range])

    useEffect(()=>{
        setStatistic((prev) => {
            const new_value = {
                profit: 0,
                expenses: 0,
                clear_profit: 0,
            }
            if(all_range || !(dates[0].endDate && dates[0].startDate)){
                for(let i of tasks){
                    if(i.status === 'завершён'){
                        new_value.expenses += i.executor_price;
                        new_value.profit += i.budget;
                        new_value.clear_profit += i.budget - i.executor_price
                    }
                }
            }
            else{
                const start_date = dayjs(dates[0].startDate);
                const end_date = dayjs(dates[0].endDate);
                for(let i of tasks){
                    const d = dayjs(i.completed_at);
                    if(i.status === 'завершён' && (start_date.isBefore(d) || start_date.isSame(d)) &&
                    (d.isBefore(end_date) || d.isSame(end_date))){
                        new_value.expenses += i.executor_price;
                        new_value.profit += i.budget;
                        new_value.clear_profit += i.budget - i.executor_price
                    }
                }
            }
            return new_value;
        })
    }, [dates[0], all_range, tasks])

    return (
        <>
            <Header />
            <main id="task_edit">
                <Typography variant="h3" style={{textAlign: 'center'}}>Финансы</Typography>
                <Divider />
                <div 
                style={{width: '100%', display: 'flex', 'justifyContent': 'center'}}
                >
                    <DateRange
                    onChange={(item: any) => setDates([item.selection as DateRangeT])}
                    moveRangeOnFirstSelection={false}
                    months={2}
                    ranges={dates}
                    direction={window.innerWidth < 600 ? 'vertical' : 'horizontal'}
                    preventSnapRefocus={true}

                    calendarFocus="backwards"
                    locale={ru}
                    />
                </div>
                <FormControlLabel control={<Checkbox checked={all_range} onChange={(e) => set_all_range(e.target.checked)} />} label="Все время" />

                <br />
                {
                    statistic && (
                        <>
                            <Typography variant="h4" style={{display: 'flex', alignItems: 'center'}} className="finances_text">Расходы: {statistic.expenses}<CurrencyRubleIcon fontSize="large"/></Typography>
                            <Typography variant="h4" style={{display: 'flex', alignItems: 'center'}} className="finances_text">Доходы: {statistic.profit}<CurrencyRubleIcon fontSize="large"/></Typography> 
                            {
                                visible_other_expenses.map((other_expense, index) => (
                                    <Typography variant="h4" style={{display: 'flex', alignItems: 'center', position: 'relative'}} className="finances_text" key={other_expense.id}>
                                        {other_expense.name}: {other_expense.value}<CurrencyRubleIcon fontSize="large"/>
                                        <IconButton
                                        style={
                                            {
                                                position: 'absolute',
                                                right: '10px',
                                                top: '10px',
                                                background: 'rgba(255,255,255,.1)'
                                            }
                                        }
                                        onClick={()=>{handle_delete(other_expense.id, other_expense.value)}}
                                        >
                                            <Close />
                                        </IconButton>
                                    </Typography>
                                ))
                            }
                            <Typography variant="h4" style={{display: 'flex', alignItems: 'center'}} className="finances_text">Чистая прибыль: {statistic.clear_profit - other_sum}<CurrencyRubleIcon fontSize="large"/></Typography>
                            
                            <div>
                                <TextField label={`Новая трата`}
                                inputRef={new_expense_name_ref}
                                fullWidth
                                variant="standard"
                                autoComplete="off"
                                inputProps={{style: {fontSize: 30}}}
                                InputLabelProps={{style: {fontSize: 30}}}
                                />
                                <TextField label={`Значение`}
                                inputRef={new_expense_value_ref}
                                fullWidth
                                variant="standard"
                                autoComplete="off"
                                inputProps={{style: {fontSize: 30}}}
                                InputLabelProps={{style: {fontSize: 30}}}
                                />
                                <Button variant="contained" onClick={handle_create}
                                sx={
                                    {
                                        width: '100%',
                                        marginTop: '20px'
                                    }
                                }    
                                >
                                    Создать
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