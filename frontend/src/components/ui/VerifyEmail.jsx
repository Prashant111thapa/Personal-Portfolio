import { useState } from 'react';
import Input from '../shared/Input';
import Button from '../shared/Button';
import AuthService from '../../services/AuthServices';
import { isValidEmail } from '../../utils/validation';
import {toast} from 'react-toastify'
import { useNavigate } from 'react-router-dom';

const VerifyEmail = () => {

    // const [email, setEmail] = useState(null);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
      email: "",
      code: "",
      newPassword: "",
      confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [view, setView] = useState("find-account");

    const handleInputChange = (e) => {
      // Safety check for event and target
      if (!e || !e.target) {
        console.error('Invalid event object in VerifyEmail:', e);
        return;
      }
      
      const { name, value } = e.target;
      
      // Safety check for name property
      if (!name) {
        console.error('Input element missing name attribute in VerifyEmail:', e.target);
        return;
      }
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));

      if(errors[name]){
        setErrors(prev => ({
          ...prev,
          [name]: ""
        }));
      }
    }

  const verifyAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let newError = {};
      if(!formData.email) {
        newError.email = "Email is required";
        setErrors(newError);
        return;
      }

      const validateEmail = isValidEmail(formData.email);
      if(!validateEmail){
        newError.email = "Please provide a valid email";
        setErrors(newError);
        return;
      }

      const user = await AuthService.getUserByEmail(formData.email);
      if(!user.success) {
        newError.email = "User not found!";
        toast.error("User not found.");
        setErrors(newError);
        return;
      }

      const result = await AuthService.requestPasswordReset(formData.email);
      if(result.success) {
        setView("verify-code");
      } else {
        return toast.error("Failed to send verification code.");
      }

    } catch(err) {
      console.error("Error verifying account", err);
      toast.error("User not found.");
    } finally {
      setLoading(false);
    }
  }

  const verifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);

    let newError = {};
    if(!formData.code) {
      newError.code = "Verfication code is required.";
      setErrors(newError);
      return;
    }

    try {
      const result = await AuthService.verifyResetCode(formData.code);
      if(result.success){
        setView("reset-password");
      } else {
        return toast.error("Please enter a valid code.");
      }
    } catch(err) {
      console.log("Error verifying code", err);
      toast.error("Invalid or expired code");
    } finally {
      setLoading(false);
    }
  }

  const updatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    let newErrors = {};
    if(!formData.newPassword){
      newErrors.newPassword = "New password is required";
      setErrors(newErrors);
      setLoading(false);
      return;
    } 

    if(!formData.confirmPassword){
      newErrors.confirmPassword = "Confirm password is required";
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{6,}$/;
    if(formData.newPassword && !passwordRegex.test(formData.newPassword)){
      newErrors.newPassword = "Password must be 6 characters long and have atleast one lowercase and one uppercase letter";
      setErrors(newErrors);
      setLoading(false);
      return;
    }
    
    if(formData.newPassword !== formData.confirmPassword){
      setLoading(false);
      return toast.error("Password doesn't match");
    }

    try {
      const result = await AuthService.resetPassword(formData.code, formData.newPassword);
      if(result.success){
        toast.success("Password reset successfull.");
        setFormData({
          email: "",
          code: "",
          newPassword: ""
        });
        navigate("/");
      } else {
        toast.error("Failed to reset password.");
      }
    } catch(err) {
      console.error("Error changing password", err);
      toast.error(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

    const ChangeView = (view) => {
        switch(view) {

          case "verify-code":
              return (
                <div className='py-6 px-8 h-90 w-130 space-y-5 rounded-xl border border-[#FD6F00]/30 hover:border-[#FD6F00]/60 hover:border-2 transition-all duration-300'>
                  <h2 className='font-bold text-2xl '>Verify Reset Code</h2>
                  <p>Please enter the code sent to your email.</p>
                  <form onSubmit={verifyCode}>
                    <div className='mb-3'>
                      <Input
                        name="code"
                        label="Reset Code"
                        value={formData.code}
                        type='number'
                        placeholder='Enter 6 digit code'
                        onChange={(e) => handleInputChange(e)}
                        className={`w-full ${errors.code ? "border-red-500" : ""}`}
                      />
                      {errors.code ? <span className='text-sm text-red-500'>{errors.code}</span> : ""}
                    </div>

                    <Button
                      disabled={loading}
                    >
                      Verify Code
                    </Button>
                  </form>
                </div>
              );
          
          case "reset-password":
            return (
              <div className='py-6 px-8 h-120 w-130 space-y-5 rounded-xl border border-[#FD6F00]/30 hover:border-[#FD6F00]/60 hover:border-2 transition-all duration-300'>
                <h2 className='font-bold text-2xl '>Change Password</h2>
                <p>Please make sure to write a strong password</p>
                <form onSubmit={updatePassword}>
                  <Input 
                    label="New Password"
                    name="newPassword"
                    type='password'
                    placeholder='Enter new password'
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange(e)}
                    className={`w-full ${errors.newPassword ? "border-red-500" : ""}`}
                  />
                  {errors.newPassword ? <span className='text-sm text-red-500'>{errors.newPassword}</span> : "" }

                  <Input 
                    label="Confirm Password"
                    name="confirmPassword"
                    type='password'
                    placeholder='Confrim password'
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange(e)}
                    className={`w-full mb-3 ${errors.confirmPassword ? "border-red-500" : ""}`}
                  />
                  {errors.confirmPassword ? <span className='text-sm text-red-500'>{errors.confirmPassword}</span> : "" }

                  <Button
                    disabled={loading}
                  >
                    Reset Password
                  </Button>
                </form>
              </div>
            );
          default: 
              return (
                <div className='py-6 px-8 h-90 w-130 space-y-5 rounded-xl border border-[#FD6F00]/30 hover:border-[#FD6F00]/60 hover:border-2 transition-all duration-300'>
                  <h2 className='font-bold text-2xl '>Find Your Account</h2>
                  <p>Please enter your email address.</p>
                  <form onSubmit={verifyAccount}>
                    <div className='mb-4'>
                      <Input
                        name="email"
                        label="Email"
                        value={formData.email}
                        onChange={(e) => handleInputChange(e)}
                        className={`w-full ${errors.email ? "border-red-500" : ""}`}
                      />
                      {errors.email ? <span className='text-sm text-red-500'>{errors.email}</span> : ""}
                    </div>

                    <Button
                      disabled={loading}
                    >
                      Send Code
                    </Button>
                  </form>
                </div>
              );
        }
    }

  return (
    <div className='min-h-screen text-white flex items-center justify-center '>
      {/*  Find Your Account please enter your email address */}
      <div>
        {ChangeView(view)}
      </div>

    </div>
  )
}

export default VerifyEmail;
