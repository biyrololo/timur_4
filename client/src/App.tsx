import React from 'react';
import './App.css';
import axios from 'axios';
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import MainPage from 'pages/MainPage';
import EditTask from 'pages/EditTask';
import CreateTask from 'pages/CreateTast';
import TaskView from 'pages/TaskView';
import Finances from 'pages/Finances';

function App() {

  axios.defaults.baseURL = 'http://localhost:8000/';

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
