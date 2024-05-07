import bcryptjs from 'bcryptjs';
import Registration from '../models/user.model.js';

export const registration = async(req, res, next) => {

    const {
        firstname,
        lastname, 
        email,  
        mobilenumber,
        birthdate,
        gender,
        state,
        city,
        playing,
        reading,
        traveling,
        password,
        avatar,        
    } = req.body;

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new Registration({
        firstname,
        lastname, 
        email,  
        mobilenumber,
        birthdate,
        gender,
        state,
        city,
        playing,
        reading,
        traveling,
        password: hashedPassword,
        avatar,
    });

    try {
        
        const userData = await newUser.save();
        res.status(201).json({status: 200, message: 'User created successfully!', data:userData });
        console.log(req.body);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error' });
    }
    
};