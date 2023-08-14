import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Folder, Home, File } from "./pages";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/folder" element={<Folder />} />
      <Route path="/file" element={<File />} />
    </Routes>
  </BrowserRouter>
);

export default App;
