import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import './style.css'
import HomePage from './components/pages/HomePage';
import SchedulePage from './components/pages/SchedulePage';

const root = createRoot(document.querySelector('#app'));
root.render(
  <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage/>}></Route>
        <Route path="/schedule" element={<SchedulePage />}></Route>
      </Routes>
    </BrowserRouter>
  </>
);
