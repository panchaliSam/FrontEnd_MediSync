import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Button, Input } from '@material-tailwind/react';
import { PencilIcon } from '@heroicons/react/24/solid';
import placeholderAvatar from '../assets/images/person.png'; // Add your placeholder image path

const HospitalProfile = () => {
    const [hospital, setHospital] = useState(null);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchHospitalDetails = async () => {
            try {
                const response = await axios.get('http://localhost:8080/CSSE_MediSync/hospitals');
                const hospitals = response.data;

                const loggedInHospital = hospitals.find(hospital => hospital.user_id === parseInt(userId));
                if (loggedInHospital) {
                    setHospital(loggedInHospital);
                    setFormData(loggedInHospital); // Initialize formData with hospital details
                } else {
                    setError('Hospital not found for this user.');
                }
            } catch (err) {
                setError('Error fetching hospital details. Please try again later.');
            }
        };

        fetchHospitalDetails();
    }, [userId]);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:8080/CSSE_MediSync/hospitals?hospital_id=${formData.hospital_id}`, formData);
            setHospital(formData);
            setIsEditing(false);
        } catch (err) {
            setError('Error updating hospital details. Please try again later.');
        }
    };

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Typography variant="h5" color="red">{error}</Typography>
            </div>
        );
    }

    if (!hospital) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Typography variant="h5">Loading hospital details...</Typography>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="flex flex-col items-center mb-6">
                <img
                    src={placeholderAvatar}
                    alt="Hospital Avatar"
                    className="h-32 w-32 rounded-full border-4 border-blue-500 mb-4 shadow-lg"
                />
                <Button
                    onClick={handleEditToggle}
                    className="bg-transparent border-none hover:opacity-75 transition-opacity ml-2"
                >
                    <PencilIcon className="h-5 w-5 text-blue-600" />
                </Button>
            </div>

            <div className="flex flex-col w-full md:w-1/2 mb-6">
                <Typography className="text-xl font-semibold mb-2 border-b-2 border-blue-500">Hospital Details</Typography>
                <div className="grid grid-cols-1 gap-6 mb-4">
                    <div>
                        <label className="block text-gray-700 font-medium">Hospital Name:</label>
                        {isEditing ? (
                            <Input
                                name="hospital_name"
                                value={formData.hospital_name}
                                onChange={handleChange}
                                className="border rounded-md p-2"
                            />
                        ) : (
                            <div className="border rounded-md p-2 bg-gray-100">
                                <Typography>{hospital.hospital_name}</Typography>
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium">Hospital Charge:</label>
                        {isEditing ? (
                            <Input
                                name="hospital_charge"
                                type="number"
                                value={formData.hospital_charge}
                                onChange={handleChange}
                                className="border rounded-md p-2"
                            />
                        ) : (
                            <div className="border rounded-md p-2 bg-gray-100">
                                <Typography>{hospital.hospital_charge}</Typography>
                            </div>
                        )}
                    </div>
                </div>
                {isEditing && (
                    <Button onClick={handleUpdate} className="mt-4 bg-blue-500 text-white">
                        Save Changes
                    </Button>
                )}
                {isEditing && (
                    <Button
                        onClick={() => setIsEditing(false)}
                        className="mt-4 ml-4 bg-gray-300 text-gray-700"
                    >
                        Cancel
                    </Button>
                )}
            </div>
        </div>
    );
};

export default HospitalProfile;
