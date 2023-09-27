import React from "react";

import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { FileSystem, Home } from "./pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/fs",
    element: <FileSystem />,
  },
]);

const App = () => <RouterProvider router={router} />;

export default App;
