import React from 'react';
import axios from 'axios';
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import MainPage from 'pages/MainPage';
import EditTask from 'pages/EditTask';
import CreateTask from 'pages/CreateTast';
import TaskView from 'pages/TaskView';
import Finances from 'pages/Finances';
import { useState } from 'react';
import LoginPage from 'pages/LoginPage';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import './App.css';

function App() {

  // axios.defaults.baseURL = 'http://localhost:8000/';
  axios.defaults.baseURL = 'http://193.200.74.131:8080/';

  const [is_login, setIsLogin] = useState(localStorage.getItem('token') !== null);
  axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

  if(!is_login){
    return <BrowserRouter>
      <Routes>
        <Route path="*" element={<LoginPage on_login={() => setIsLogin(true)}/>}/>
      </Routes>
    </BrowserRouter>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<div>404</div>}/>
        <Route path='/' Component={MainPage} />
        <Route path='/edit/:id' Component={EditTask} />
        <Route path='/create' Component={CreateTask} />
        <Route path='/task/:id' Component={TaskView} />
        <Route path='/finance' Component={Finances} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
