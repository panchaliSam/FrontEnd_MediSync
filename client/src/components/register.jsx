import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Typography,
    Input,
    Button,
} from "@material-tailwind/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

export default function Register() {
    const navigate = useNavigate();
    const [registerData, setRegisterData] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false); // Toggle for password visibility
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value });
        setError(''); // Clear error on input change
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword); // Toggle password visibility
    };

    const registerUser = async (e) => {
        e.preventDefault();

        if (!registerData.username || !registerData.password || !registerData.confirmPassword) {
            setError('All fields are required.');
            return;
        }

        if (registerData.password !== registerData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            // Send data to the server as JSON in the request body
            const response = await axios.post(`http://localhost:8080/CSSE_MediSync/users?action=register`, {
                username: registerData.username,
                password: registerData.password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            alert("Registration successful! Please enter patient details."); 
            navigate('/register-patient'); 
        } catch (error) {
            setError(error.response?.data?.error || "Registration Unsuccessful!");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
            <Typography variant="h2" className="text-center text-blue-600 font-bold mb-2">
                MediSync
            </Typography>
            <Typography variant="h5" className="text-center mb-4">
                WELCOME!!
            </Typography>
            <Typography variant="small" className="text-center text-gray-500 mb-6">
                MediSync Patient Portal - Create your account
            </Typography>
            <div className="w-full max-w-sm md:max-w-md lg:max-w-lg"> {/* Media query for responsiveness */}
                <div className="flex flex-col gap-4">
                    <Input
                        label="Username"
                        size="lg"
                        name="username"
                        value={registerData.username}
                        onChange={handleChange}
                    />
                    <div className="relative">
                        <Input
                            label="Password"
                            size="lg"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={registerData.password}
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? (
                                <EyeSlashIcon className="h-5 w-5" />
                            ) : (
                                <EyeIcon className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                    <div className="relative">
                        <Input
                            label="Confirm Password"
                            size="lg"
                            name="confirmPassword"
                            type={showPassword ? 'text' : 'password'}
                            value={registerData.confirmPassword}
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? (
                                <EyeSlashIcon className="h-5 w-5" />
                            ) : (
                                <EyeIcon className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                    {error && <Typography variant="small" color="red" className="mt-2">{error}</Typography>}
                </div>
                <div className="pt-4">
                    <Button
                        fullWidth
                        onClick={registerUser}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl transition duration-200"
                    >
                        Create Account
                    </Button>
                </div>
                <div className="text-center mt-4">
                    <Typography variant="small" color="gray" className="text-sm">
                        Already have an account? <a href="/login" className="text-blue-600 hover:underline">Sign In</a>
                    </Typography>
                </div>
            </div>

            {/* Custom media query for smaller devices */}
            <style jsx>{`
                @media (max-width: 640px) {
                    .max-w-sm {
                        width: 90%;
                    }
                }

                @media (max-width: 480px) {
                    .max-w-sm {
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
}
