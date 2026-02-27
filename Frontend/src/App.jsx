import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from './Components/Register';

function App() {
  const navbarRouter = createBrowserRouter([
    {
      path: '/',
      element: <Register />
    },
    
  ])

  return (
    <>
      <RouterProvider router={navbarRouter} />
    </>
  );
}

export default App
