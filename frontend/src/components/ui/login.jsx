import { useEffect, useState } from 'react'
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import Input from '../shared/Input';
import Button from '../shared/Button';

const Login = () => {

    const [error, setError] = useState("");
    const [userData, setUserData] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();
    const { login } = useAuth();

    // const validate = () => {
    //     const err = {};

    //     if(!userData.email.trim()) err.email = "Email is required.";
    //     if(!userData.password) err.password = "Password is required.";
    //     return err;
    // }

    const handleInputChange = (e) => {
        // Safety check for event and target
        if (!e || !e.target) {
            console.error('Invalid event object in login:', e);
            return;
        }
        
        const { name, value } = e.target;
        
        // Safety check for name property
        if (!name) {
            console.error('Input element missing name attribute in login:', e.target);
            return;
        }
        
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    useEffect(() => {
        if(!error) return;
        const timer = setTimeout(() => setError(""), 4000);
        return () => clearTimeout(timer);
    }, [error]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{

            // const validationErr = validate();
            // if (Object.keys(validationErr).length > 0) {
            //     setError(validationErr);
            //     return;
            // }

            if(!userData.email.trim()) return setError("Email is required.");
            if(!userData.password) return setError("Password is required.");

            const result = await login({
                email: userData.email.trim(),
                password: userData.password
            });

            if(!result.success){
                setError(result.err || "Invalid email or password");
                return;
            }

            const user = result.user;
            navigate("/dashboard");
        } catch(err){
            console.log("Login failed, ", err);
            setError("Login failed. Please try again!");
        }   
    }

  return (
<div className='min-h-screen flex items-center justify-center p-4'>
  <div className='w-full max-w-lg px-8 py-10 border-2 border-[#FD6F00]/30 rounded-md'>
    <h1 className='mb-4 font-bold text-white text-4xl text-center sm:text-left'>
      Login
    </h1>
    {error && (
      <p className='text-red-500 text-sm mb-4'>{error}</p>
    )}
    <form onSubmit={handleSubmit}>
      <Input
        label="Email: "
        name="email"
        value={userData.email}
        placeholder='Enter your email'
        onChange={handleInputChange}
        className='w-full'
      />

      <Input
        label="Password:"
        type='password'
        name="password"
        value={userData.password}
        placeholder='Enter your password'
        onChange={handleInputChange}
        className='w-full mb-3'
      />
      
      <div className='flex flex-col sm:flex-row items-center justify-between gap-4 py-5'>
        <Link 
          to="/verify-email" 
          className='text-blue-700 text-medium font-semibold hover:underline'
        >
          Forgot Password
        </Link>
        <Button className='w-full sm:w-auto'>Login</Button>
      </div>
    </form>
  </div>
</div>
  )
}

export default Login;
