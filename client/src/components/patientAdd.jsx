import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Typography,
    Input,
    Button,
} from "@material-tailwind/react";

export default function PatientAdd() {
    const navigate = useNavigate();
    const [patientData, setPatientData] = useState({
        patient_name: '',  // Changed to match the backend naming
        age: '',
        dob: '',
        contact_no: '',   // Changed to match the backend naming
        emergency_contact_no: '', // Changed to match the backend naming
        emergency_relation: '', // Changed to match the backend naming
        allergy: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setPatientData({ ...patientData, [e.target.name]: e.target.value });
        setError(''); // Clear error on input change
    };

    const addPatient = async (e) => {
        e.preventDefault();
    
        const { patient_name, age, dob, contact_no, emergency_contact_no, emergency_relation, allergy } = patientData;
    
        if (!patient_name || !age || !dob || !contact_no || !emergency_contact_no || !emergency_relation || !allergy) {
            setError('All fields are required.');
            return;
        }
    
        if (age <= 0) {
            setError('Age must be a positive number.');
            return;
        }
    
        console.log("Adding patient data:", {
            patient_name,
            age: parseInt(age),
            dob,
            contact_no,
            emergency_contact_no,
            emergency_relation,
            allergy
        });
    
        try {
            const response = await axios.post(`http://localhost:8080/CSSE_MediSync/patients?action=create`, {
                patient_name,
                age: parseInt(age),
                dob,
                contact_no,
                emergency_contact_no,
                emergency_relation,
                allergy
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            alert("Patient added successfully!"); // Show success message
            navigate('/patients'); // Navigate to patient list page after successful addition
        } catch (error) {
            console.error("Error adding patient:", error); // Log the full error for debugging
            setError(error.response?.data?.error || "Adding patient unsuccessful!");
        }
    };
    

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
            <Typography variant="h2" className="text-center text-blue-600 font-bold mb-2">
                MediSync
            </Typography>
            <Typography variant="h5" className="text-center mb-6 text-gray-500 ">
                Patient Registration
            </Typography>
            <div className="w-full max-w-sm md:max-w-md lg:max-w-lg">
                <div className="flex flex-col gap-4">
                    <Input
                        label="Patient Name"
                        size="lg"
                        name="patient_name" // Changed to match backend
                        value={patientData.patient_name}
                        onChange={handleChange}
                    />
                    <Input
                        label="Age"
                        size="lg"
                        name="age"
                        type="number"
                        value={patientData.age}
                        onChange={handleChange}
                    />
                    <Input
                        label="Date of Birth"
                        size="lg"
                        name="dob"
                        type="date"
                        value={patientData.dob}
                        onChange={handleChange}
                    />
                    <Input
                        label="Contact Number"
                        size="lg"
                        name="contact_no" // Changed to match backend
                        value={patientData.contact_no}
                        onChange={handleChange}
                    />
                    <Input
                        label="Emergency Contact Number"
                        size="lg"
                        name="emergency_contact_no" // Changed to match backend
                        value={patientData.emergency_contact_no}
                        onChange={handleChange}
                    />
                    <Input
                        label="Emergency Relation"
                        size="lg"
                        name="emergency_relation" // Changed to match backend
                        value={patientData.emergency_relation}
                        onChange={handleChange}
                    />
                    <Input
                        label="Allergy"
                        size="lg"
                        name="allergy"
                        value={patientData.allergy}
                        onChange={handleChange}
                    />
                    {error && <Typography variant="small" color="red" className="mt-2">{error}</Typography>}
                </div>
                <div className="pt-4">
                    <Button
                        fullWidth
                        onClick={addPatient}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl transition duration-200"
                    >
                        Add Patient
                    </Button>
                </div>
            </div>
        </div>
    );
}
