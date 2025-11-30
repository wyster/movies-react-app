import React from 'react'
import {BrowserRouter, Routes, Route, NavLink} from "react-router"

import Main from '../views/Main'
import Movie from "../views/Movie";

const Layout = () =>
  <div className="container-fluid mt-3 mb-3">
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        <li className="breadcrumb-item"><NavLink to="/">Home</NavLink></li>
      </ol>
    </nav>
    <Routes>
      <Route path="/" element={<Main/>}/>
      <Route path="/movie/:id" element={<Movie/>}/>
    </Routes>
  </div>

export default Layout
