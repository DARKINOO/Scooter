import React from 'react'
import { Routes } from 'react-router-dom'
import { Route } from 'react-router-dom'
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/UserSignup'
import Captainsignup from './pages/Captainsignup'
import CaptainLogin from './pages/CaptainLogin'
import Start from './pages/Start'
import Home from './pages/Home'
import UserProtectWrapper from './pages/UserProtectWrapper'
import UserLogout from './pages/UserLogout'
import CaptainHome from './pages/CaptainHome'
import CaptainProtectWrapper from './pages/CaptainProtectWrapper'
import Riding from './pages/Riding'
import CaptainRiding from './pages/CaptainRiding'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Start/>} />
        <Route path='/login' element={<UserLogin />} />
        <Route path='/signup' element={<UserSignup />} />
        <Route path='/riding' element={<Riding />} />
        <Route path='/captain-riding' element={<CaptainRiding />} />
        <Route path='/captain-signup' element={<Captainsignup />} />
        <Route path='/captain-login' element={<CaptainLogin />} />
        <Route path='/home' element={
          // <UserProtectWrapper>
            <Home />
          // </UserProtectWrapper>
          } />
          <Route path='/user/logout' element={
          <UserProtectWrapper>
            <UserLogout />
          </UserProtectWrapper>} />
          <Route path='/captain-home' element={
            //  <CaptainProtectWrapper>
              <CaptainHome />
            //  </CaptainProtectWrapper>
            }
          />
           <Route path='/captain/logout' element={
             <CaptainProtectWrapper>
              <CaptainHome />
             </CaptainProtectWrapper>
            }
          />
          
      </Routes>
    </div>
  )
}

export default App