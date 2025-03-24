import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MultiLevelSidebar } from './components/sideNavBar';
import { HospitalHome } from './components/hospitalHome';
import {Statistics} from './components/statistics';
import Login from './components/login'; 
import Register from './components/register';
import HospitalRegister from './components/hospitalAdd';
import PatientProfile from './components/hospitalProfile';
import MakeAppointment from './components/makeAppointments';
import HospitalDoctors from './components/hospitalDoctors';
import PatientHistory from './components/patientHistory'

function App() {
    const isAuthenticated = () => {
        return !!localStorage.getItem('token'); 
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/register" element={<Register />} />
                <Route path="/register-patient" element={<HospitalRegister />} />
                <Route path="/login" element={<Login />} />

                {/* Protected Routes */}
                <Route
                    path="/dashboard/*"
                    element={isAuthenticated() ? (
                        <div className="flex h-screen">
                            <MultiLevelSidebar/>

                            {/* Main Content Area */}
                            <main className="flex-1 p-4 overflow-auto">
                                <Routes>
                                    <Route path="home" element={<HospitalHome />} />
                                    <Route path="home/profile" element={<PatientProfile />} />
                                    <Route path="home/appointments" element={ <MakeAppointment/>} />
                                    <Route path="home/patient-history" element={ <PatientHistory/>} />
                                    <Route path="home/doctors" element={<HospitalDoctors/>} />
                                    <Route path="home/statistics" element={<Statistics/>} />
                                    <Route path="*" element={<Navigate to="/dashboard/home" />} />
                                </Routes>
                            </main>
                        </div>
                    ) : (
                        <Navigate to="/login" />
                    )}
                />

                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
