import React from 'react'
import './styles/dashboard.scss'
import SideBar from '../components/SideBar'
import Profile from '../components/Profile'
import Overview from '../components/Overview'
import EditProfile from '../components/EditProfile'
import History from '../components/History'

const DashBoard = () => {

  return (
   <main className='dash-board'> 
    <SideBar />
   </main>
  )
}

export default DashBoard