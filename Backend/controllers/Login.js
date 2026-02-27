import jwt from 'jsonwebtoken'
import userData from '../models/UserModel.js'

const secretCode = process.env.ACCESS_TOKEN

const Login = async(req, res) => {
    try {
        const { email, password } = req.body

        const user = await userData.findOne({ email })
        if (!user) {
            return res.status(215).json({status: false, message: "User does not exist"})
        }
        if (user.password !== password) {
            return res.status(215).json({status: false, message: "Password is incorrect"})
        }

        const taskToken = jwt.sign({ id: user._id, email: user.email}, secretCode)

        return res.status(200).json({status: true, message: "Login Successful", taskToken : taskToken, user: user})
    } catch (err) {
        console.log(err)
        return res.status(500).json({status: false, message: "Internal server error"})
    }
}

export default Login