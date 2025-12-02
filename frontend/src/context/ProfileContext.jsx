import React, { createContext, useContext, useEffect, useState } from 'react'
import AuthService from '../services/AuthServices';

const profileContext = createContext(null);
export const useProfile = () => useContext(profileContext);

const ProfifleProvider = ({ children }) => {

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);

    const loadProfile = async () => {
        setLoading(true);
        try {
            const result = await AuthService.getAllProfile();
            if(result.success){
                const profileData = result.data.profiles[0];
                setProfile(profileData);
            } else {
                setProfile(null);
            }
        } catch(err) {
            setProfile(null)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadProfile();
    }, []);

    if(loading){
        return (
            <div className='min-h-screen flex flex-col items-center justify-center'>
                <div className='rounded-full animate-spin w-12 h-12 border-3 border-[#FD6F00]/70'></div>
                <div className="text-white text-lg">Loading...</div>
            </div>
        )
    }

  return (
    <profileContext.Provider value={{ profile }}>
        {children}
    </profileContext.Provider>
  );
}

export default ProfifleProvider;