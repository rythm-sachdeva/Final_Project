import './App.css'
import Navbar from './components/Navbar'
import { Routes,Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import { Toaster } from 'react-hot-toast'
import { useSettingsStore } from './store/useSettingsStore'
import AuthWrapper from './components/AuthWrapper'

function App() {

  //@ts-ignore
  const { theme } = useSettingsStore();


  return (
    <div className='' data-theme={theme}>
     <Navbar/>
     <div className='md:pt-7'>
     <Routes>
       <Route path="/" element={<AuthWrapper><HomePage/></AuthWrapper>} />
       <Route path="/login" element={<LoginPage/>}/>
       <Route path="/signup" element={<SignupPage/>} /> 
       <Route path="/settings" element={<SettingsPage/>} />
       <Route path="/profile" element={<AuthWrapper><ProfilePage/></AuthWrapper>} />
     </Routes>
     </div>
    <Toaster/>
    </div>
  )
}

export default App
