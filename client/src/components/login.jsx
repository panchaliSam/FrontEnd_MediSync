import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Typography,
    Input,
    Checkbox,
    Button,
} from "@material-tailwind/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

export default function Login() {
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false); // State for password visibility
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
        setError(''); // Clear error when user starts typing
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword); // Toggle password visibility
    };

    const loginUser = async (e) => {
        e.preventDefault();

        // Validate input
        if (!loginData.username || !loginData.password) {
            setError('Username and Password are required.');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:8080/CSSE_MediSync/users?action=login`, {
                username: loginData.username,
                password: loginData.password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const { token } = response.data;
            localStorage.setItem('token', token);
            navigate('/dashboard');
        } catch (error) {
            setError(error.response?.data?.error || "Login Unsuccessful!");
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
                MediSync Patient Portal
            </Typography>
            <div className="w-full max-w-sm md:max-w-md lg:max-w-lg"> {/* Media query for responsiveness */}
                <div className="flex flex-col gap-4">
                    <Input
                        label="Username"
                        size="lg"
                        name="username"
                        value={loginData.username}
                        onChange={handleChange}
                    />
                    <div className="relative">
                        <Input
                            label="Password"
                            size="lg"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={loginData.password}
                            onChange={handleChange}
                        />
                        {/* Icon Button inside input */}
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
                    <div className="flex items-center">
                        <Checkbox label="Remember me" />
                    </div>
                    {error && <Typography variant="small" color="red" className="mt-2">{error}</Typography>}
                </div>
                <div className="pt-4">
                    <Button
                        fullWidth
                        onClick={loginUser}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl transition duration-200"
                    >
                        Sign In
                    </Button>
                </div>
                <div className="text-center mt-4">
                    <Typography variant="small" color="gray" className="text-sm">
                        Don't have an account yet? <a href="/register" className="text-blue-600 hover:underline">Create Account</a>
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
