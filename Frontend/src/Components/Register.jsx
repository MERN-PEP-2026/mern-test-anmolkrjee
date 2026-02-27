import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import R from '../CSS/Register.module.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Register() {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [info, setInfo] = useState("")
    const [isClass, setIsClass] = useState(3)
    const [isDis, setIsDis] = useState(false)
    const [errors, setErrors] = useState({});
    const Navigate = useNavigate()

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const [signupData, setSignupData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });



    const handleLoginChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        });
    };

    const handleSignupChange = (e) => {
        setSignupData({
            ...signupData,
            [e.target.name]: e.target.value
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleChange = () => {
        setIsLogin((prev) => (!prev))
        setInfo("")
        setIsClass(3)
        setIsDis(false)
        setErrors("")
    }

    const loginValidate = () => {
        if (loginData.email.length === 0) {
            setInfo("Email is required")
            setIsClass(1)
            return false
        }
        if (loginData.password.length === 0) {
            setInfo("Password is required")
            setIsClass(1)
            return false
        }
        return true
    }

    const handleLogin = (e) => {
        e.preventDefault()
        setInfo("Input Validating...")
        setIsClass(2)
        setIsDis(true)
        if (loginValidate()) {
            setInfo("User Varifying...")
            setIsClass(2)
            const payload = {
                email: loginData.email,
                password: loginData.password
            }

            axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, payload).then((res) => {
                if (res.status !== 200) {
                    setInfo(res.data.message)
                    setIsClass(1)
                    setIsDis(false)
                } else {
                    setInfo(res.data.message)
                    setIsClass(0)
                    setIsDis(false)
                    localStorage.setItem('taskToken', JSON.stringify(res.data.taskToken))
                    localStorage.setItem('userId', JSON.stringify(res.data.user.User_ID))
                    Navigate('/home')
                }
            }).catch((err) => {
                setIsDis(false)
                setIsClass(1)
                setInfo("Something went wrong")
                console.log(err)
            })
        } else {
            setIsDis(false)
        }
    }

    const signValidate = () => {
        let newErrors = {};
        const alpharegex = /^[a-z A-Z]+$/;
        if (!signupData.name) {
            newErrors.name = "Name is required"
        } else if (!alpharegex.test(signupData.name)) {
            newErrors.name = "Name is not valid"
        }

        if (!signupData.email) {
            newErrors.email = "Email is required"
        } else if (!signupData.email.includes('@')) {
            newErrors.email = "Email is not valid"
        }

        const numregex = /^[0-9]+$/;
        if (!signupData.phone) {
            newErrors.phone = "Phone number is required"
        } else if (!numregex.test(signupData.phone)) {
            newErrors.phone = "Phone number should only contain number"
        }

        if (!signupData.password) {
            newErrors.password = "Password is required"
        } else if (signupData.password.length < 8) {
            newErrors.password = "Password must contain at least 8 digits"
        } else if (!hasLower(signupData.password)) {
            newErrors.password = "Password must contain at least one lower case letter"
        } else if (!hasUpper(signupData.password)) {
            newErrors.password = "Password must contain at least one upper case letter"
        } else if (!hasNumber(signupData.password)) {
            newErrors.password = "Password must contain at least one digit"
        } else if (!hasSpecial(signupData.password)) {
            newErrors.password = "Password must contain at least one special character"
        }

        if (!signupData.confirmPassword) {
            newErrors.cpassword = "Confirm password is required"
        } else if (signupData.confirmPassword !== signupData.password) {
            newErrors.cpassword = "Password did not matched"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0;
    }

    const hasLower = (str) => /[a-z]/.test(str);
    const hasUpper = (str) => /[A-Z]/.test(str);
    const hasNumber = (str) => /\d/.test(str);
    const hasSpecial = (str) => /[!@#$%^&*(),.?":{}|<>]/.test(str);

    const handleSign = (e) => {
        e.preventDefault()
        setInfo("Input Validating...")
        setIsClass(2)
        setIsDis(true)
        if (signValidate()) {
            setInfo("Registering User...")
            setIsClass(2)
            const payload = {
                name: signupData.name,
                email: signupData.email,
                phone: signupData.phone,
                password: signupData.password
            }

            axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, payload).then((res) => {
                if (res.status !== 200) {
                    setInfo(res.data.message)
                    setIsClass(1)
                    setIsDis(false)
                } else {
                    setInfo(res.data.message)
                    setIsClass(0)
                    setIsDis(false)
                }
            }).catch((err) => {
                setIsDis(false)
                setInfo("Something went wrong")
                setIsClass(1)
                console.log(err)
            })
        } else {
            setIsDis(false)
            setIsClass(3)
        }
    }

    useEffect(() => {
        if (localStorage.getItem("taskToken") !== null) {
            Navigate('/home')
        }
    }, [])
    return (
        <div className={R.container}>
            <div className={R.authCard}>
                <div className={R.toggleButtons}>
                    <button
                        type="button" disabled={isDis}
                        className={`${R.toggleButton} ${isLogin ? R.active : ''}`}
                        onClick={handleChange}
                    >
                        Login
                    </button>
                    <button
                        type="button" disabled={isDis}
                        className={`${R.toggleButton} ${!isLogin ? R.active : ''}`}
                        onClick={handleChange}
                    >
                        Sign Up
                    </button>
                </div>

                {isLogin ? (
                    <form className={R.form} onSubmit={handleLogin}>
                        <h2 className={R.title}>Welcome Back</h2>

                        <span className={`${R.in} ${isClass === 0 ? R.succ : isClass === 1 ? R.err : isClass === 2 ? R.info : ""}`}>{info}</span>

                        <div className={R.inputGroup}>
                            <label htmlFor="login-email" className={R.label}>Email</label>
                            <input
                                id="login-email"
                                type="email"
                                name="email"
                                value={loginData.email}
                                onChange={handleLoginChange}
                                className={R.input}
                                required
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className={R.inputGroup}>
                            <label htmlFor="login-password" className={R.label}>Password</label>
                            <div className={R.passwordInput}>
                                <input
                                    id="login-password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={loginData.password}
                                    onChange={handleLoginChange}
                                    className={R.input}
                                    required
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    disabled={isDis}
                                    className={R.eyeButton}
                                    onClick={togglePasswordVisibility}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className={R.submitButton} disabled={isDis}>
                            Login
                        </button>
                    </form>
                ) : (
                    <form className={R.form} onSubmit={handleSign}>
                        <h2 className={R.title}>Create Account</h2>

                        <span className={`${R.in} ${isClass === 0 ? R.succ : isClass === 1 ? R.err : isClass === 2 ? R.info : ""}`}>{info}</span>

                        <div className={R.inputGroup}>
                            <span className={R.serr}>{errors.name}</span>
                            <label htmlFor="signup-name" className={R.label}>Full Name</label>
                            <input
                                id="signup-name"
                                type="text"
                                name="name"
                                value={signupData.name}
                                onChange={handleSignupChange}
                                className={R.input}
                                required
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div className={R.inputGroup}>
                            <span className={R.serr}>{errors.email}</span>
                            <label htmlFor="signup-email" className={R.label}>Email</label>
                            <input
                                id="signup-email"
                                type="email"
                                name="email" required
                                value={signupData.email}
                                onChange={handleSignupChange}
                                className={R.input}
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className={R.inputGroup}>
                            <span className={R.serr}>{errors.phone}</span>
                            <label htmlFor="signup-phone" className={R.label}>Phone</label>
                            <input
                                id="signup-phone"
                                type="tel" required
                                name="phone"
                                value={signupData.phone}
                                onChange={handleSignupChange}
                                className={R.input}
                                placeholder="Enter your phone number"
                            />
                        </div>

                        <div className={R.inputGroup}>
                            <span className={R.serr}>{errors.password}</span>
                            <label htmlFor="signup-password" className={R.label}>Password</label>
                            <div className={R.passwordInput}>
                                <input
                                    id="signup-password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={signupData.password}
                                    onChange={handleSignupChange}
                                    className={R.input} required
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    disabled={isDis}
                                    className={R.eyeButton}
                                    onClick={togglePasswordVisibility}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className={R.inputGroup}>
                            <span className={R.serr}>{errors.cpassword}</span>
                            <label htmlFor="signup-confirm-password" className={R.label}>Confirm Password</label>
                            <div className={R.passwordInput}>
                                <input
                                    id="signup-confirm-password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={signupData.confirmPassword}
                                    onChange={handleSignupChange}
                                    className={R.input} required
                                    placeholder="Confirm your password"
                                />
                                <button
                                    type="button" disabled={isDis}
                                    className={R.eyeButton}
                                    onClick={toggleConfirmPasswordVisibility}
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className={R.submitButton} disabled={isDis}>
                            Sign Up
                        </button>
                    </form>
                )}
            </div>
        </div>

    )
}

export default Register
