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
    }
    
};

export const details = async (req, res, next) => {
    try {
        const users = await Registration.find();
        res.status(201).json({status: 201, message: "get all data  successfully.", data: users});
      } catch (error) {
        console.log(error.message);
      }
};

export const updateUser = async (req, res, next) => {
        try {
                const id = req.params.id;
                const fid = await Registration.findById(id);
        console.log(typeof fid);
        if (!fid) {
                throw Error('not available');
            }
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password);
        }
        const updateUser = await Registration.findByIdAndUpdate(
            id,
            {
                $set: {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    mobilenumber: req.body.mobilenumber,
                    birthdate: req.body.birthdate,
                    gender: req.body.gender,
                    state: req.body.state,
                    city: req.body.city,
                    playing: req.body.playing,
                    reading: req.body.reading,
                    traveling: req.body.traveling,
                    password: req.body.password,
                    avatar: req.body.avatar,
                },
            },
            { new: true },
        );
        const {password, ...rest} = updateUser._doc
        res.status(201).json({status: 201, message: "update successfully", data : rest}); 

    } catch (error) {
        console.log(error.message);
    }
};


export const getCurrentUser = async (req, res, next) => {
    try {
        console.log(req.params.id);
        const currentUser = await Registration.findById(req.params.id);
        console.log(currentUser);

        res.status(201).json({status: 201, message: "Get current user successfully", data: currentUser})
    } catch (error) {
        console.log(error.message)
    }
}



export const deleteUser = async(req, res, next) => {
    try {
        await Registration.findByIdAndDelete(req.params.id)
        res.status(200).json('User has been deleted');
    } catch (error) {
        console.log(error.message);
    }
};