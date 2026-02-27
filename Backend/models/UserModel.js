import mongoose from 'mongoose'

const userDataSchema = new mongoose.Schema({
    User_ID: {
        type: Number
    },
    name: {
        type: String
    },
    phone: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    }
}, { timestamps: true })

const userData = mongoose.model("userData", userDataSchema)

export default userData