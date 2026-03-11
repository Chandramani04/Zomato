import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import UserRegister from '../pages/auth/UserRegister'
import UserLogin from '../pages/auth/UserLogin'
import FoodPartnerRegister from '../pages/auth/FoodPartnerRegister'
import FoodPartnerLogin from '../pages/auth/FoodPartnerLogin'
import Register from './Register'
import Home from './Home'
import CreateFood from '../pages/food-partner/CreateFood'
import Profile from '../pages/food-partner/Profile'
import Saved from './Saved'
import Checkout from '../pages/Checkout'
import ProtectedRoute from '../components/ProtectedRoute'
import PublicRoute from '../components/PublicRoute'


const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                {/* Public / Auth Routes */}
                <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                <Route path="/user/register" element={<PublicRoute><UserRegister /></PublicRoute>} />
                <Route path="/user/login" element={<PublicRoute><UserLogin /></PublicRoute>} />
                <Route path="/food-partner/register" element={<PublicRoute><FoodPartnerRegister /></PublicRoute>} />
                <Route path="/food-partner/login" element={<PublicRoute><FoodPartnerLogin /></PublicRoute>} />

                {/* Protected Routes */}
                <Route path="/" element={<ProtectedRoute allowedRoles={['user']}><Home /></ProtectedRoute>} />
                <Route path="/saved" element={<ProtectedRoute allowedRoles={['user']}><Saved /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute allowedRoles={['user']}><Checkout /></ProtectedRoute>} />

                {/* Partner Protected Routes */}
                <Route path="/food-partner/:id" element={<ProtectedRoute allowedRoles={['partner', 'user']}><Profile /></ProtectedRoute>} />
                <Route path="/create-food" element={<ProtectedRoute allowedRoles={['partner']}><CreateFood /></ProtectedRoute>} />
            </Routes>
        </Router>
        /*
1. Home page should only be accessible if the user is logged in.
2. If not logged in , redirect to /register
3. after user login/register , redirect to /
4. after food partner login/register , redirect to food partner profile 

        */
    )
}

export default AppRoutes