import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/navBar';
import { PatientHome } from './components/patientHome';
import Login from './components/login'; 
import Register from './components/register';
import PatientRegister from './components/patientAdd';
import PatientProfile from './components/patientProfile';
import MakeAppointment from './components/makeAppointments';
import MyAppointments from './components/myAppointments';
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
                <Route path="/register-patient" element={<PatientRegister />} />
                <Route path="/login" element={<Login />} />

                {/* Protected Routes */}
                <Route
                    path="/dashboard/*"
                    element={isAuthenticated() ? (
                        <div className="flex h-screen">
                            <Navbar/>

                            {/* Main Content Area */}
                            <main className="flex-1 p-4 overflow-auto">
                                <Routes>
                                    <Route path="home" element={<PatientHome />} />
                                    <Route path="home/patient-profile" element={<PatientProfile />} />
                                    <Route path="home/make-appointments" element={ <MakeAppointment/>} />
                                    <Route path="home/patient-history" element={ <PatientHistory/>} />
                                    <Route path="home/my-appointments" element={<MyAppointments/>} />
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
