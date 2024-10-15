import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MultiLevelSidebar } from './components/sideNavBar';
import { PatientHome }  from './components/patientHome'

import Login from './components/login'; 
import Register from './components/register'

function App() {
    // Function to check if the user is authenticated
    const isAuthenticated = () => {
        return !!localStorage.getItem('token'); 
    };

    return (
        <BrowserRouter>
            <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} /> {/* Add the Login route */}

                {/* Protected Routes */}
                <Route
                    path="/dashboard/*"
                    element={isAuthenticated() ? (
                        <div className="flex h-screen">
                            {/* Sidebar Component */}
                            <MultiLevelSidebar className="w-64 bg-gray-100" />

                            {/* Main Content Area */}
                            <main className="flex-1 p-4 overflow-auto">
                                <Routes>
                                    <Route
                                        path="home"
                                        element={
                                            <>
                                                <PatientHome />

                                            </>
                                        }
                                    />
                                    <Route
                                        path="customer-segmentation"
                                        element={
                                            <>
                                                {/* <CustomerRecord />
                                                <br />
                                                <CustomerRecordBarChart />
                                                <br/>
                                                <CustomerRecordPieChart /> */}
                                            </>}
                                    />
                                    <Route
                                        path="customer-demand-analysis"
                                        element={
                                        <> 
                                        {/* <SeasonalDemand /> 
                                        <br/>
                                        <SeasonalDemandBarChart />
                                        <br/>
                                        <SeasonalDemandPieChart/> */}
                                        </>}
                                    />
                                    <Route
                                        path="*"
                                        element={<Navigate to="/dashboard/sales-forecasting" />}
                                    />
                                </Routes>
                            </main>
                        </div>
                    ) : (
                        <Navigate to="/login" />
                    )}
                />

                {/* Redirect to login for any unknown paths */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
