import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from 'react-router-dom';

export default function Registration() {

    //store in mongoDB
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        mobilenumber: '',
        birthdate: '',
        gender: '',
        state: '',
        city: '',
        playing: false,
        reading: false,
        traveling: false,
        password: '',
        avatar: '',
    });

    //city select box start
    const citiesData = {
        Gujarat: ['Surat', 'Vadodara'],
        Maharashtra: ['Nashik', 'Pune'],
    };

    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    const handleStateChange = (e) => {
        const state = e.target.value;
        setSelectedState(state);
        setSelectedCity('');
    };

    const handleCityChange = (e) => {
        const city = e.target.value;
        setSelectedCity(city);
    };
    // end
    const navigate = useNavigate();
    // Birthdate start
    const [selectedDate, setSelectedDate] = useState(null);

    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setFormData({
            ...formData,
            birthdate: date
        })
    };
    //end

    const handleChange = (e) => {
        if (e.target.id === 'male' || e.target.id === 'female' || e.target.id === 'other') {
            setFormData({
                ...formData,
                gender: e.target.id,
            });
        }
        if (e.target.id === 'playing' || e.target.id === 'reading' || e.target.id === 'traveling') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked,
            });
        }

        if (e.target.id === 'firstname' || e.target.id === 'lastname' || e.target.id === 'email' || e.target.id === 'mobilenumber' || e.target.id === 'state' || e.target.id === 'city' || e.target.id === 'password' || e.target.id === 'avatar') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value,
            });
        }

        // if (e.target.name === 'bdate') {
        //     alert("hello birthday")
        //     setFormData({
        //         ...formData,
        //         birthday: e.target.value,
        //     });
        //     console.log(e.target.value);
        // }

    };
    console.log(formData);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/user/reg', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...formData }),
            });
            const data = await res.json();
            console.log(data, " data");
            if (data.status === 200) {
                console.log(data);
                navigate('/')
                return;
            }
            else {
                setError(data.message);
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <div className='p-3 max-w-lg mx-auto'>

            <h1 className='text-3xl text-center font-semibold my-7'>Registration</h1>

            <form onSubmit={handleSubmit}>

                <div className='flex gap-2 flex-1 mt-5'>
                    <input onChange={handleChange} type="text" placeholder='First Name' id='firstname' className='border w-60 p-3 rounded-lg' required />
                    <input onChange={handleChange} type="text" placeholder='Last Name' id='lastname' className='border w-60 p-3 rounded-lg' />
                </div>

                <div className='flex flex-col gap-4 flex-1 mt-5'>
                    <input onChange={handleChange} type="email" placeholder='Email' className='border p-3 rounded-lg' id="email" />
                </div>

                <div className='flex gap-2 flex-1 mt-5'>
                    <input onChange={handleChange} type="number" placeholder='Mobile Number' className='border p-3 w-60 rounded-lg' id="mobilenumber" maxLength='10' minLength='10' />
                    <DatePicker
                        placeholderText='Birthdate'
                        selected={selectedDate}
                        name='bdate'
                        value={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="MM/dd/yyyy"
                        maxDate={maxDate}
                        className="border p-3 w-60 rounded-lg"
                    />
                </div>

                <div className='flex gap-10 mt-4 flex-wrap'>
                    <span className='mx-6 text-slate-600'>Gender: </span>
                    <div className='flex gap-2'>
                        <input onChange={handleChange} type="radio" name="gender" id="male" className='w-5' />
                        <span className='text-slate-600'>Male</span>
                    </div>
                    <div className='flex gap-2'>
                        <input onChange={handleChange} type="radio" name="gender" id="female" className='w-5' />
                        <span className='text-slate-600'>Female</span>
                    </div>
                    <div className='flex gap-2'>
                        <input onChange={handleChange} type="radio" name="gender" id="other" className='w-5' />
                        <span className='text-slate-600'>Other</span>
                    </div>
                </div>

                <div className='flex flex-col gap-4 flex-1 mt-5'>
                    <select
                        className="border p-3 rounded-lg"
                        id='state'
                        value={selectedState}
                        onChange={(event) => {
                            handleStateChange(event);
                            handleChange(event);
                        }}
                    >
                        <option value="">Select State</option>
                        {Object.keys(citiesData).map((state, index) => (
                            <option key={index} value={state}>{state}</option>
                        ))}
                    </select>
                </div>

                <div className='flex flex-col gap-4 flex-1 mt-5'>
                    <select
                        className="border p-3 rounded-lg"
                        id='city'
                        value={selectedCity}
                        onChange={(event) => {
                            handleCityChange(event);
                            handleChange(event);
                        }}
                        disabled={!selectedState}
                    >
                        <option value="">Select City</option>
                        {selectedState && citiesData[selectedState].map((city, index) => (
                            <option key={index} value={city}>{city}</option>
                        ))}
                    </select>
                </div>

                <div className='flex gap-6 flex-wrap mt-5'>
                    <span className='mx-6 text-slate-600'>Hobbies:</span>
                    <div className='flex gap-2 text-slate-600'>
                        <input onChange={handleChange} checked={formData.playing} type='checkbox' id='playing' className='w-5' />
                        <span>Playing</span>
                    </div>
                    <div className='flex gap-2 text-slate-600'>
                        <input onChange={handleChange} checked={formData.reading} type='checkbox' id='reading' className='w-5' />
                        <span>Reading</span>
                    </div>
                    <div className='flex gap-2 text-slate-600'>
                        <input onChange={handleChange} checked={formData.traveling} type='checkbox' id='traveling' className='w-5' />
                        <span>Traveling</span>
                    </div>
                </div>

                <div className='flex flex-col gap-4 flex-1 mt-5'>
                    <input onChange={handleChange} type="password" placeholder='Password' className='border p-3 rounded-lg' id="password" minLength='8' />
                    <input type="password" placeholder='Confirm Password' className='border p-3 rounded-lg' id="confirmpassword" minLength='8' />
                </div>

                <div className="flex gap-4 mt-5">
                    <input onChange={handleChange} className='p-3 border border-gray-300 rounded w-full' type="file" id='avatar' accept='image/*' />
                </div>

                <div className='flex flex-col gap-4 flex-1 mt-5'>
                    <button type='submit' className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95'>Save</button>
                </div>

            </form>


        </div>
    )
}
