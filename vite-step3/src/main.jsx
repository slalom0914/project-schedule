import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import './style.css'
import HomePage from './components/pages/HomePage';
import SchedulePage from './components/pages/SchedulePage';
import LoginPage from './components/auth/LoginPage';
import JoinPage from './components/auth/JoinPage';
import AtCalendarPage from './components/pages/AtCalendarPage';
import { Provider } from 'react-redux';
import store from './redux/store';
const root = createRoot(document.querySelector('#app'));
root.render(
  <>
    <BrowserRouter>
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<HomePage/>}></Route>
          <Route path="/schedule" element={<SchedulePage />}></Route>
          <Route path="/atcalendar" element={<AtCalendarPage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/join" element={<JoinPage />}></Route>
        </Routes>
      </Provider>
    </BrowserRouter>
  </>
);
