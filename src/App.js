import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ResetPassword from './components/ResetPassword';
import Home from './components/Home';
import Signup from './components/Signup';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import NotesTakingProvider from './contextProvider/NotesTakingProvider';
import ProtectedRoute from './components/ProtectedRoute';
import UserDashboard from './components/UserDashboard';
import ViewUsers from './components/ViewUsers.js';
import AddOrEditUser from './components/AddOrEditUser';
import ViewNotes from './components/ViewNotes';
import AddOrEditNote from './components/AddOrEditNote';

import ActivateAccount from './components/ActivateAccount';



function App() {
  return (
    <div className="App">
      {/* As the Navbar is given fixed='top', the following breaking lines are required in the app.js. So that it will apply sufficient bottom margin after the Navbar in all the routes. */}
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />

      <BrowserRouter>
        <NotesTakingProvider>
          <Routes>
            {/* "Home" component displays the buttons for signup, login, forgot password */}
            <Route path="/" element={<ProtectedRoute accessBy={"not-authorized"}>< Home /></ProtectedRoute>} />
            

            {/* For registering new user */}
            <Route path="/signup" element={<ProtectedRoute accessBy={"not-authorized"}>< Signup /></ProtectedRoute>} />
            

            {/* For activating the account */}
            <Route path='/activate-account/:activationToken' element={< ActivateAccount />} />


            {/* For login */}
            <Route path="/login" element={<ProtectedRoute accessBy={"not-authorized"}>< Login /></ProtectedRoute>} />
            

            {/* For sending the password reset link through email */}
            <Route path="/forgot-password" element={<ProtectedRoute accessBy={"not-authorized"}>< ForgotPassword /></ProtectedRoute>} />
            

            {/* For resetting the password */}
            <Route path="/reset-password/:resetToken" element={< ResetPassword />} />

            {/* For user dashboard */}
            <Route path="/:userID/userDashboard" element={<ProtectedRoute accessBy={"authorized"}>< UserDashboard /></ProtectedRoute>} />
            
            {/* To view all the users */}
            <Route path="/:operatorID/viewUsers" element={<ProtectedRoute accessBy={"authorized"}>< ViewUsers /></ProtectedRoute>} />

            {/* To add a new user */}
            <Route path="/:operatorID/addOrEditUser" element={<ProtectedRoute accessBy={"authorized"}>< AddOrEditUser /></ProtectedRoute>} />

            {/* For updating an user */}
            <Route path="/:operatorID/addOrEditUser/:userID" element={<ProtectedRoute accessBy={"authorized"}>< AddOrEditUser /></ProtectedRoute>} />

            {/* To view notes and contacts (the confirmed notes are contacts) */}
            <Route path="/:userID/viewNotes" element={<ProtectedRoute accessBy={"authorized"}>< ViewNotes /></ProtectedRoute>} />

            {/* To add a new note */}
            <Route path="/:userID/addOrEditNote" element={<ProtectedRoute accessBy={"authorized"}>< AddOrEditNote /></ProtectedRoute>} />

            {/* For updating a note */}
            <Route path="/:userID/addOrEditNote/:noteID" element={<ProtectedRoute accessBy={"authorized"}>< AddOrEditNote /></ProtectedRoute>} />



          </Routes>
        </NotesTakingProvider>
      </BrowserRouter>
    
    </div>
  );
}

export default App;
