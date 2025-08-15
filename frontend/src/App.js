import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Tasks from './pages/Tasks';
import AttendanceLog from './components/AttendanceLog';
import AdminAttendance from './components/AdminAttendance';
import AdminUsers from './components/AdminUsers';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/tasks" element={<Tasks />} />
         <Route path="/attendance" element={<AttendanceLog />} />
                 <Route path="/admin/attendance" element={<AdminAttendance />} />
                 <Route path="/admin/users" element={<AdminUsers />} />




      </Routes>
    </Router>
  );
}

export default App;
