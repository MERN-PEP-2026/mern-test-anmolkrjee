import bcrypt from "bcrypt"
import userData from "../models/UserModel.js"

const Register = async(req, res) => {
    try {
        const { name, email, phone, password } = req.body

        const existingPhone = await userData.findOne({ phone })
        const existingEmail = await userData.findOne({ email })
        
        if (existingEmail) {
            return res.status(210).json({status: false, message: "Email id already exists"})
        }
        if (existingPhone) {
            return res.status(210).json({status: false, message: "Phone number already exists"})
        }

        let User_ID
		let isDuplicate = true
		while (isDuplicate) {
			User_ID = Math.floor(Math.random() * (999999 - 100000 + 1))  + 100000
			isDuplicate = await userData.findOne({ User_ID })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new userData({
			User_ID,
			name,
			phone,
			email,
			password,
		})

        const user = await newUser.save()
        
        if (!user) {
            return res.status(215).json({status: false, message: "Something went wrong"})
        }

        return res.status(200).json({status: true, message: "User registered"})
    } catch (err) {
        console.log(err)
        return res.status(500).json({status: false, message: "Internal Server Error"})
    }
}

export default Register