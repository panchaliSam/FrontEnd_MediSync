import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Input,
    Button
} from "@material-tailwind/react";

export default function Register() {
    const navigate = useNavigate();
    const [registerData, setRegisterData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value });
        setError(''); // Clear error on change
    };

    const registerUser = async (e) => {
    e.preventDefault();

    if (!registerData.username || !registerData.password) {
        setError('Username and Password are required.');
        return;
    }

    try {
        // Send data as JSON in the request body
        const response = await axios.post(`http://localhost:8080/CSSE_MediSync/users`, {
            username: registerData.username,
            password: registerData.password
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Response:', response);
        alert("Registration successful! Please log in."); // Show success message
        navigate('/login'); // Navigate to login page after successful registration
    } catch (error) {
        console.error('Error details:', error.response?.data || error.message);
        setError(error.response?.data?.error || "Registration Unsuccessful!");
    }
};

    return (
        <div className="flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(../images/registerwallpaper.png)` }}>
            <Card className="w-96">
                <CardHeader
                    variant="gradient"
                    color="gray"
                    className="mb-4 grid h-28 place-items-center"
                >
                    <Typography variant="h3" color="white">
                        Sign Up
                    </Typography>
                </CardHeader>
                <CardBody className="flex flex-col gap-4">
                    <Input
                        label="Username"
                        size="lg"
                        name="username"
                        value={registerData.username}
                        onChange={handleChange}
                    />
                    <Input
                        label="Password"
                        size="lg"
                        name="password"
                        type="password"
                        value={registerData.password}
                        onChange={handleChange}
                    />
                    {error && <Typography variant="small" color="red" className="mt-2">{error}</Typography>}
                </CardBody>
                <CardFooter className="pt-0">
                    <Button variant="gradient" fullWidth onClick={registerUser}>
                        Sign Up
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
