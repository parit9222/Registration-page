import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema({
    firstname: {
        type: String, 
        required: true,
        unique: true,
    },
    lastname: {
        type: String, 
        required: false,
    },
    email: {
        type: String, 
        required: true,
        unique: true,
    },
    mobilenumber: {
        type: Number, 
        required: true,
    },
    birthdate: {
        type: String, 
        // required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    playing: {
        type: Boolean,
        required: true,
    },
    reading: {
        type: Boolean,
        required: true,
    },
    traveling: {
        type: Boolean,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "https://static.vecteezy.com/system/resources/thumbnails/011/675/374/small/man-avatar-image-for-profile-png.png",
    },
}, {timestamps: true});

const registration = mongoose.model('Registration', registrationSchema);

export default registration;