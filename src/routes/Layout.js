import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router"

import Main from '../views/Main'
import Movie from "../views/Movie";

const Layout = () =>
  <div className="container-fluid mt-3 mb-3">
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/movie/:id" element={<Movie />} />
      </Routes>
  </div>

export default Layout
