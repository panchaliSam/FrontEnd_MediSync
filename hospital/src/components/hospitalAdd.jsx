import React, { useState } from 'react'; // Import useState
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Typography,
    Input,
    Button,
} from "@material-tailwind/react";

export default function HospitalAdd() {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId'); // Get userId from local storage
    const [hospitalData, setHospitalData] = useState({
        hospital_name: '',
        hospital_charge: '',
        userId: userId ? parseInt(userId) : null, // Parse to an integer
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        // Allow only specific characters for hospital name
        if (name === 'hospital_name') {
            newValue = newValue.replace(/[^a-zA-Z.' ]/g, ''); // Allow letters, periods, apostrophes, and spaces
            // Auto-capitalize first letter of each word
            newValue = newValue.replace(/\b\w/g, char => char.toUpperCase());
        }

        // Validate hospital charge to ensure it's not negative
        if (name === 'hospital_charge') {
            newValue = newValue.replace(/[^0-9.]/g, ''); // Allow only digits and decimal points
            if (parseFloat(newValue) < 0) {
                newValue = ''; // Reset if negative
            }
        }

        setHospitalData(prevData => ({ ...prevData, [name]: newValue }));
        setError(''); // Clear error on input change
    };

    const addHospital = async (e) => {
        e.preventDefault();

        const { hospital_name, hospital_charge, userId } = hospitalData;

        // Validate hospital fields
        if (!hospital_name || !hospital_charge) {
            setError('All fields are required.');
            return;
        }

        if (parseFloat(hospital_charge) < 0) {
            setError('Hospital charge must be a non-negative number.');
            return;
        }

        console.log("Adding hospital data:", {
            hospital_name,
            hospital_charge: parseFloat(hospital_charge), // Ensure it's a float
            userId // Include userId
        });

        try {
            const response = await axios.post(`http://localhost:8080/CSSE_MediSync/hospitals?action=create`, {
                hospital_name,
                hospital_charge: parseFloat(hospital_charge), // Pass hospital charge
                user_id: userId // Pass userId
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            alert("Hospital added successfully!"); // Show success message
            navigate('/hospitals'); // Navigate to hospital list page after successful addition
        } catch (error) {
            console.error("Error adding hospital:", error); // Log the full error for debugging
            setError(error.response?.data?.error || "Adding hospital unsuccessful!");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
            <Typography variant="h2" className="text-center text-blue-600 font-bold mb-2">
                MediSync
            </Typography>
            <Typography variant="h5" className="text-center mb-6 text-gray-500 ">
                Hospital Registration
            </Typography>
            <div className="w-full max-w-sm md:max-w-md lg:max-w-lg">
                <div className="flex flex-col gap-4">
                    <Input
                        label="Hospital Name"
                        size="lg"
                        name="hospital_name"
                        value={hospitalData.hospital_name}
                        onChange={handleChange}
                    />
                    <Input
                        label="Hospital Charge"
                        size="lg"
                        name="hospital_charge"
                        type="number"
                        value={hospitalData.hospital_charge}
                        onChange={handleChange}
                    />
                    {error && <Typography variant="small" color="red" className="mt-2">{error}</Typography>}
                </div>
                <div className="pt-4">
                    <Button
                        fullWidth
                        onClick={addHospital}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl transition duration-200"
                    >
                        Add Hospital
                    </Button>
                </div>
            </div>
        </div>
    );
}
