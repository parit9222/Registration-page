import React, { useEffect, useRef, useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase'
import swal from 'sweetalert';
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

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
        // hobbies: [],
        playing: false,
        reading: false,
        traveling: false,
        password: '',
        avatar: '',
    });
    console.log(formData);



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
        const formattedDate = format(date, 'dd-MM-yyyy');
        setSelectedDate(date);
        setFormData({
            ...formData,
            birthdate: formattedDate,
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
                // hobbies: [e.target.id],
            });
        }

        if (e.target.id === 'firstname' || e.target.id === 'lastname' || e.target.id === 'email' || e.target.id === 'mobilenumber' || e.target.id === 'state' || e.target.id === 'city' || e.target.id === 'password') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value,
            });
        }
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
            toast('Please enter a valid email address');
        } else {
            toast('');
        }
    };




    const [phno, setPhno] = useState('');
    const [phnoError, setPhnoError] = useState('');
    const handlePhnoBlur = () => {
        if (phno.length < 10) {
            toast("Phone number must be 10 digit ");
        }
        else {
            toast('');
        }
    };

    const handleNumberChange = (e) => {
        const inputValue = e.target.value;
        if (/^\d{0,10}$/.test(inputValue)) { // Regex to allow only 10 digits
            setPhno(inputValue);
        }
    };

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handlePassChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };


    const [error, setError] = useState('');
    const validateForm = () => {
        if (formData.firstname === '' || formData.email === '' || formData.mobilenumber === '' || formData.state === '' || formData.city === '' || formData.password === '' || formData.avatar === '') {
            toast('Please fill in all required fields.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (password !== confirmPassword) {
            toast('Passwords do not match');
            return;
        } else {
            toast('');
        }

        try {
            const res = await fetch('/api/user/reg', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...formData }),
            });
            const data = await res.json();
            console.log("Request body:", JSON.stringify({ ...formData }));
            if (data) {
                swal({
                    title: "Success",
                    text: "Data created successfully!",
                    icon: "success",
                }).then(() => {
                    navigate('/');
                });
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
                    <input onChange={handleChange} type="text" placeholder='First Name' id='firstname' className='border w-60 p-3 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500' />
                    <input onChange={handleChange} type="text" placeholder='Last Name' id='lastname' className='border w-60 p-3 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500' />
                </div>

                <div className='flex flex-col gap-4 flex-1 mt-5'>
                    <input
                        type="email"
                        value={email}
                        onChange={
                            (e) => {
                                handleEmailChange(e),
                                    handleChange(e)
                            }
                        }
                        placeholder="Email"
                        className='border p-3 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500'
                        id="email"
                        onBlur={handleEmailBlur}
                    />
                </div>

                <div className='flex gap-2 flex-1 mt-5'>

                    <input
                        type="tel"
                        value={phno}
                        onChange={
                            (e) => {
                                handleNumberChange(e),
                                    handleChange(e)
                            }
                        }
                        onBlur={handlePhnoBlur}
                        maxLength={10}
                        pattern="[0-9]*"
                        placeholder='Mobile Number'
                        className='border p-3 w-60 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500'
                        id="mobilenumber"
                    />

                    <DatePicker
                        placeholderText='Birthdate'
                        selected={selectedDate}
                        value={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="MM/dd/yyyy"
                        maxDate={maxDate}
                        className="border p-3 w-60 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                        required
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
                        className="border p-3 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
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
                        className="border p-3 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
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
                    <input
                        onChange={(e) => {
                            handlePassChange(e),
                            handleChange(e)
                        }}
                        type="password"
                        placeholder='Password'
                        className='border p-3 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500'
                        id="password"
                        minLength='8'
                        value={password}
                    />
                    <input
                        onChange={handleConfirmPasswordChange}
                        type="password"
                        placeholder='Confirm Password'
                        className='border p-3 rounded-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500'
                        id="confirmpassword"
                        minLength='8'
                        value={confirmPassword}
                    />
                </div>

                {/* <div className='flex flex-col gap-4 flex-1 mt-5'>
                    <input onChange={(e) => {
                        handleChange(e),
                            (e) => setPassword(e.target.value)
                    }
                    } type="password" placeholder='Password' className='border p-3 rounded-lg' id="password" minLength='8' />
                    <input onChange={(e) => setConfirmPassword(e.target.value)} type="password" placeholder='Confirm Password' className='border p-3 rounded-lg' id="confirmpassword" minLength='8' />
                </div> */}

                <div className="flex gap-4 mt-5">
                    <input className='p-3 border border-gray-300 rounded w-full focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500' type="file" id='avatar' accept='image/*' ref={fileRef} onChange={(e) => setFile(e.target.files[0])} />
                </div>

                {error && <div className="text-red-500 mb-4 mt-2">{error}</div>}
                {emailError && <div className="text-red-500 mb-4 mt-2">{emailError}</div>}
                {phnoError && <div className="text-red-500 mb-4 mt-2">{phnoError}</div>}
                {errorMessage && <p className="text-red-500 mb-4 mt-2">{errorMessage}</p>}


                <div className='flex flex-col gap-4 flex-1 mt-5'>
                    <button type='submit' className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95'>Submit</button>
                </div>

                {/* <div className="flex gap-4 mt-5">
                    <input ref={fileRef} onChange={
                        (event) => {
                            handleChange(event),
                                (event) => setFile(event.target.files[0])
                        }
                    } className='p-3 border border-gray-300 rounded w-full' type="file" id='avatar' accept='image/*' />
                </div>

                <div className='flex flex-col gap-4 flex-1 mt-5'>
                    <button type='submit' className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95'>Save</button>
                </div> */}

            </form>
            <ToastContainer/>
            
        </div>
    )
}
