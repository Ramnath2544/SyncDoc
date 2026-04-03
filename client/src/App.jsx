import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import EditorPage from './pages/EditorPage';
import Topbar from './components/Topbar';
import FooterComponent from './components/Footer'; 
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <BrowserRouter>
      <div className='flex flex-col min-h-screen'>
        <Topbar />

        <main className='flex-grow'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
           <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
            <Route path='/editor/:id' element={<EditorPage />} />
          </Routes>
        </main>

        <FooterComponent />
      </div>
    </BrowserRouter>
  );
}
