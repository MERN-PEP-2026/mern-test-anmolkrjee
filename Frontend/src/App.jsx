import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from './Components/Register';
import TaskDashboard from './Components/TaskDashboard';

function App() {
  const navbarRouter = createBrowserRouter([
    {
      path: '/',
      element: <Register />
    },
    {
      path: '/home',
      element: <TaskDashboard />
    }
  ])

  return (
    <>
      <RouterProvider router={navbarRouter} />
    </>
  );
}

export default App
