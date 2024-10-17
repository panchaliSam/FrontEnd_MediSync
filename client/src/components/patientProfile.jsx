import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Button, Input } from '@material-tailwind/react';
import { PencilIcon } from '@heroicons/react/24/solid';
import placeholderAvatar from '../assets/images/person.png'; // Add your placeholder image path

const PatientProfile = () => {
    const [patient, setPatient] = useState(null);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchPatientDetails = async () => {
            try {
                const response = await axios.get('http://localhost:8080/CSSE_MediSync/patients');
                const patients = response.data;

                const loggedInPatient = patients.find(patient => patient.user_id === parseInt(userId));
                if (loggedInPatient) {
                    setPatient(loggedInPatient);
                    setFormData(loggedInPatient);
                } else {
                    setError('Patient not found for this user.');
                }
            } catch (err) {
                setError('Error fetching patient details. Please try again later.');
            }
        };

        fetchPatientDetails();
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
            await axios.put(`http://localhost:8080/CSSE_MediSync/patients?patient_id=${formData.patient_id}`, formData);
            setPatient(formData);
            setIsEditing(false);
        } catch (err) {
            setError('Error updating patient details. Please try again later.');
        }
    };

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Typography variant="h5" color="red">{error}</Typography>
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Typography variant="h5">Loading patient details...</Typography>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
            {/* <Typography variant="h2" className="text-center text-blue-600 font-bold mb-6">
                Patient Profile
            </Typography> */}
           <div className="flex flex-col items-center mb-6">
            <div className="flex items-center">
                    <img
                        src={placeholderAvatar}
                        alt="Patient Avatar"
                        className="h-32 w-32 rounded-full border-4 border-blue-500 mb-4 shadow-lg"
                    />
                    <Button
                        onClick={handleEditToggle}
                        className="bg-transparent border-none hover:opacity-75 transition-opacity ml-2" // Adjust margin to position next to the avatar
                    >
                        <PencilIcon className="h-5 w-5 text-blue-600" />
                    </Button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row md:space-x-6 w-full">
                <div className="flex flex-col w-full md:w-1/3 mb-6">
                    <Typography className="text-xl font-semibold mb-2 border-b-2 border-blue-500">Personal Details</Typography>
                    <div className="grid grid-cols-2 gap-6 mb-4">
                        {isEditing ? (
                            <>
                                <div>
                                    <label className="block text-gray-700 font-medium" htmlFor="patient_name">Name:</label>
                                    <Input
                                        name="patient_name"
                                        value={formData.patient_name}
                                        onChange={handleChange}
                                        className="border rounded-md p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium" htmlFor="contact_no">Contact No:</label>
                                    <Input
                                        name="contact_no"
                                        value={formData.contact_no}
                                        onChange={handleChange}
                                        className="border rounded-md p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium" htmlFor="age">Age:</label>
                                    <Input
                                        name="age"
                                        type="number"
                                        value={formData.age}
                                        onChange={handleChange}
                                        className="border rounded-md p-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium" htmlFor="dob">Date of Birth:</label>
                                    <Input
                                        name="dob"
                                        type="date"
                                        value={formData.dob}
                                        onChange={handleChange}
                                        className="border rounded-md p-2"
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <label className="block text-gray-700 font-medium">Name:</label>
                                    <div className="border rounded-md p-2 bg-gray-100">
                                        <Typography>{patient.patient_name}</Typography>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium">Contact No:</label>
                                    <div className="border rounded-md p-2 bg-gray-100">
                                        <Typography>{patient.contact_no}</Typography>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium">Age:</label>
                                    <div className="border rounded-md p-2 bg-gray-100">
                                        <Typography>{patient.age}</Typography>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-medium">Date of Birth:</label>
                                    <div className="border rounded-md p-2 bg-gray-100">
                                        <Typography>{patient.dob}</Typography>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex flex-col w-full md:w-1/3 mb-6">
                    <Typography className="text-xl font-semibold mb-2 border-b-2 border-blue-500">Emergency Contact</Typography>
                    {isEditing ? (
                        <>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-1" htmlFor="emergency_contact_no">Emergency Contact No:</label>
                                <Input
                                    name="emergency_contact_no"
                                    value={formData.emergency_contact_no}
                                    onChange={handleChange}
                                    className="border rounded-md p-2"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-1" htmlFor="emergency_relation">Emergency Relation:</label>
                                <Input
                                    name="emergency_relation"
                                    value={formData.emergency_relation}
                                    onChange={handleChange}
                                    className="border rounded-md p-2"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-1">Emergency Contact No:</label>
                                <div className="border rounded-md p-2 bg-gray-100">
                                    <Typography>{patient.emergency_contact_no}</Typography>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-1">Emergency Relation:</label>
                                <div className="border rounded-md p-2 bg-gray-100">
                                    <Typography>{patient.emergency_relation}</Typography>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="flex flex-col w-full md:w-1/3 mb-6">
                    <Typography className="text-xl font-semibold mb-2 border-b-2 border-blue-500">Allergies</Typography>
                    {isEditing ? (
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-1">Allergy:</label>
                            <Input
                                name="allergy"
                                value={formData.allergy}
                                onChange={handleChange}
                                className="border rounded-md p-2"
                            />
                        </div>
                    ) : (
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-1">Allergy:</label>
                            <div className="border rounded-md p-2 bg-gray-100">
                                <Typography>{patient.allergy}</Typography>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {isEditing && (
                <Button onClick={handleUpdate} className="mt-4 bg-blue-500 text-white">
                    Save Changes
                </Button>
            )}
            <Button
                onClick={() => setIsEditing(false)}
                className="mt-4 ml-4 bg-gray-300 text-gray-700"
                disabled={!isEditing}
            >
                Cancel
            </Button>
        </div>
    );
};

export default PatientProfile;
