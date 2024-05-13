import React, { useEffect, useRef, useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useParams } from 'react-router-dom';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase'

export default function Update() {

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
    const { id } = useParams();
    console.log(id);
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    const [selectedDate, setSelectedDate] = useState(null);

    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    const citiesData = {
        Gujarat: ['Surat', 'Vadodara'],
        Maharashtra: ['Nashik', 'Pune'],
    };


    const fileRef = useRef(null);
    const [file, setFile] = useState(undefined);
    // const [imageData, setImageData] = useState([]);
    // console.log(imageData);

    useEffect(() => {
        if (file) {
            handleFileUpload(file);
        }
    }, [file]);

    const handleFileUpload = (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on('state_changed',
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => {
                        setFormData({ ...formData, avatar: downloadURL })
                    })
            }
        );
    };


    const [email, setEmail] = useState('');
    const [isValid, setIsValid] = useState(true);

    const handleEmailChange = (e) => {
        const inputValue = e.target.value;
        setEmail(inputValue);
        setIsValid(validateEmail(inputValue));
    };
    const validateEmail = (email) => {
        // Regular expression for email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    const [emailError, setEmailError] = useState('');
    const handleEmailBlur = () => {
        if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
            setEmailError('Please enter a valid email address');
        } else {
            setEmailError('');
        }
    };

    const [phno, setPhno] = useState('');
    const [phnoError, setPhnoError] = useState('');
    const handlePhnoBlur = () => {
        if (phno.length < 10) {
            setPhnoError("Phone number must be 10 digit ");
        }
        else {
            setPhnoError('');
        }
    };

    const handleNumberChange = (e) => {
        const inputValue = e.target.value;
        if (/^\d{0,10}$/.test(inputValue)) {
            setPhno(inputValue);
        }
    };


    const handleStateChange = (e) => {
        const state = e.target.value;
        setSelectedState(state);
        setSelectedCity('');
    };

    const handleCityChange = (e) => {
        const city = e.target.value;
        setSelectedCity(city);
    };


    const handleDateChange = (date) => {
        setSelectedDate(date);
        setFormData({
            ...formData,
            birthdate: date,
        })
    };

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

    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/user/current_user/${id}`);
                const data = await res.json();
                if (data.status === 201) {
                    const user = data.data
                    console.log(user);
                    setFormData({
                        ...formData,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        email: user.email,
                        mobilenumber: user.mobilenumber,
                        birthdate: user.birthdate,
                        gender: user.gender,
                        state: user.state,
                        city: user.city,
                        playing: user.playing,
                        reading: user.reading,
                        traveling: user.traveling,
                        password: user.password,
                        avatar: user.avatar,
                    })
                }
            } catch (error) {
                console.log(error, " fetching data error in update")
            }
        }

        fetchData();
    }, []);
    const navigate = useNavigate();
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/user/update/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...formData }),
            });
            const data = await res.json();
            console.log(data);
            if (data.status === 201) {
                console.log(data);
                navigate('/');
                return;
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.error(error.message);
        }
    };
    return (
        <div className='p-3 max-w-lg mx-auto'>

            <h1 className='text-3xl text-center font-semibold my-7'>Registration</h1>

            <form onSubmit={handleUpdate}>

                <div className='flex gap-2 flex-1 mt-5'>
                    <input onChange={handleChange} type="text" placeholder='First Name' id='firstname' className='border w-60 p-3 rounded-lg' value={formData.firstname} required />
                    <input onChange={handleChange} type="text" placeholder='Last Name' id='lastname' className='border w-60 p-3 rounded-lg' value={formData.lastname} />
                </div>

                <div className='flex flex-col gap-4 flex-1 mt-5'>
                    <input
                        type="email"
                        value={formData.email || email}
                        onChange={
                            (e) => {
                                handleEmailChange(e),
                                    handleChange(e)
                            }
                        }
                        placeholder="Email"
                        onBlur={handleEmailBlur}
                        className='border p-3 rounded-lg'
                        id="email"
                    />
                </div>

                <div className='flex gap-2 flex-1 mt-5'>
                    <input
                        type="tel"
                        value={formData.mobilenumber || phno}
                        onChange={
                            (e) => {
                                handleNumberChange(e),
                                    handleChange(e)
                            }
                        }
                        maxLength={10}
                        onBlur={handlePhnoBlur}
                        pattern="[0-9]*"
                        placeholder='Mobile Number'
                        className='border p-3 w-60 rounded-lg'
                        id="mobilenumber"
                        required
                    />
                    <DatePicker
                        placeholderText='Birthdate'
                        selected={selectedDate}
                        name='bdate'
                        value={formData.birthdate || selectedDate}
                        onChange={handleDateChange}
                        dateFormat="MM/dd/yyyy"
                        maxDate={maxDate}
                        className="border p-3 w-60 rounded-lg"
                    />
                </div>

                <div className='flex gap-10 mt-4 flex-wrap'>
                    <span className='mx-6 text-slate-600'>Gender: </span>
                    <div className='flex gap-2'>
                        <input onChange={handleChange} checked={formData.gender === 'male'} type="radio" name="gender" id="male" className='w-5' />
                        <span className='text-slate-600'>Male</span>
                    </div>
                    <div className='flex gap-2'>
                        <input onChange={handleChange} checked={formData.gender === 'female'} type="radio" name="gender" id="female" className='w-5' />
                        <span className='text-slate-600'>Female</span>
                    </div>
                    <div className='flex gap-2'>
                        <input onChange={handleChange} checked={formData.gender === 'other'} type="radio" name="gender" id="other" className='w-5' />
                        <span className='text-slate-600'>Other</span>
                    </div>
                </div>

                <div className='flex flex-col gap-4 flex-1 mt-5'>
                    <select
                        className="border p-3 rounded-lg"
                        id='state'
                        value={formData.state || selectedState}
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
                        value={formData.city || selectedCity}
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
                    <input className='p-3 border border-gray-300 rounded w-full' type="file" id='avatar' accept='image/*' ref={fileRef} onChange={(e) => setFile(e.target.files[0])} />
                </div>

                {emailError && <div className="text-red-500 mb-4 mt-2">{emailError}</div>}
                {phnoError && <div className="text-red-500 mb-4 mt-2">{phnoError}</div>}

                <div className='flex flex-col gap-4 flex-1 mt-5'>
                    <button type='submit' className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95'>Update</button>
                </div>

            </form>


        </div>
    )
}
