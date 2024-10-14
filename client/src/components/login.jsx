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
    Checkbox,
    Button
} from "@material-tailwind/react";

export default function Login() {
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
        setError(''); // Clear error on change
    };

    const loginUser = async (e) => {
        e.preventDefault();

        if (!loginData.username || !loginData.password) {
            setError('Username and Password are required.');
            return;
        }

        try {
            console.log('Sending request with data:', loginData);
            const response = await axios.post("", {
                userName: loginData.username,
                password: loginData.password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('Response:', response);
            const { token } = response.data;

            localStorage.setItem('token', token);
            navigate('/dashboard'); // Navigate to /dashboard after successful login
        } catch (error) {
            console.error('Error details:', error.response?.data || error.message);
            setError(error.response?.data?.message || "Login Unsuccessful!");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(../images/loginwallpaper.png)` }}>
            <Card className="w-96">
                <CardHeader
                    variant="gradient"
                    color="gray"
                    className="mb-4 grid h-28 place-items-center"
                >
                    <Typography variant="h3" color="white">
                        Sign In
                    </Typography>
                </CardHeader>
                <CardBody className="flex flex-col gap-4">
                    <Input
                        label="Username"
                        size="lg"
                        name="username"
                        value={loginData.username}
                        onChange={handleChange}
                    />
                    <Input
                        label="Password"
                        size="lg"
                        name="password"
                        type="password"
                        value={loginData.password}
                        onChange={handleChange}
                    />
                    <div className="-ml-2.5">
                        <Checkbox label="Remember Me" />
                    </div>
                    {error && <Typography variant="small" color="red" className="mt-2">{error}</Typography>}
                </CardBody>
                <CardFooter className="pt-0">
                    <Button variant="gradient" fullWidth onClick={loginUser}>
                        Sign In
                    </Button>
                    {/* <Typography variant="small" className="mt-6 flex justify-center">
                        Don&apos;t have an account?
                        <Typography
                            as="a"
                            href="#signup"
                            variant="small"
                            color="blue-gray"
                            className="ml-1 font-bold"
                        >
                            Sign up
                        </Typography>
                    </Typography> */}
                </CardFooter>
            </Card>
        </div>
    );
}
