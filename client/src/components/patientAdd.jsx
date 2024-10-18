import React, { useState, useEffect } from 'react'; // Import useEffect
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
        patient_name: '',
        age: '',
        dob: '',
        contact_no: '',
        emergency_contact_no: '',
        emergency_relation: '',
        allergy: '',
        userId: null, // Initialize userId here
    });
    const [error, setError] = useState('');

    // Effect to get user ID from local storage
    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            setPatientData(prevData => ({ ...prevData, userId })); // Set userId in patientData state
        } else {
            alert("No user ID found! Please register first.");
            navigate('/register'); // Redirect if no user ID is found
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Handle auto-capitalization and validation
        let newValue = value;

        // Allow only specific characters
        if (name === 'patient_name' || name === 'emergency_relation' || name === 'allergy') {
            newValue = newValue.replace(/[^a-zA-Z.' ]/g, ''); // Allow letters, periods, apostrophes, and spaces
            // Auto-capitalize first letter of each word
            newValue = newValue.replace(/\b\w/g, char => char.toUpperCase());
        }

        // Validate contact number inputs
        if (name === 'contact_no' || name === 'emergency_contact_no') {
            newValue = newValue.replace(/[^0-9]/g, ''); // Allow only digits
            if (newValue.length > 10) {
                newValue = newValue.slice(0, 10); // Limit to 10 digits
            }
        }

        setPatientData(prevData => ({ ...prevData, [name]: newValue }));

        // Calculate age when DOB changes
        if (name === 'dob') {
            const dobDate = new Date(value);
            const today = new Date();
            const calculatedAge = today.getFullYear() - dobDate.getFullYear();
            const monthDifference = today.getMonth() - dobDate.getMonth();
            if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dobDate.getDate())) {
                setPatientData(prevData => ({ ...prevData, age: calculatedAge - 1 })); // Adjust age if necessary
            } else {
                setPatientData(prevData => ({ ...prevData, age: calculatedAge }));
            }
        }

        setError(''); // Clear error on input change
    };

    const addPatient = async (e) => {
        e.preventDefault();

        const { patient_name, age, dob, contact_no, emergency_contact_no, emergency_relation, allergy, userId } = patientData;

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
            allergy,
            userId // Include userId in the logged output
        });

        try {
            const response = await axios.post(`http://localhost:8080/CSSE_MediSync/patients?action=create`, {
                patient_name,
                age: parseInt(age),
                dob,
                contact_no,
                emergency_contact_no,
                emergency_relation,
                allergy,
                user_id: userId // Pass userId when adding a patient
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
                        name="patient_name"
                        value={patientData.patient_name}
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
                        label="Age"
                        size="lg"
                        name="age"
                        type="number"
                        value={patientData.age}
                        readOnly // Make age input read-only since it is calculated automatically
                    />
                    <Input
                        label="Contact Number"
                        size="lg"
                        name="contact_no"
                        value={patientData.contact_no}
                        onChange={handleChange}
                    />
                    <Input
                        label="Emergency Contact Number"
                        size="lg"
                        name="emergency_contact_no"
                        value={patientData.emergency_contact_no}
                        onChange={handleChange}
                    />
                    <Input
                        label="Emergency Relation"
                        size="lg"
                        name="emergency_relation"
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
