import { useProfile } from "../../context/ProfileContext";

const Footer = () => {
    const { profile } = useProfile();
  return (
    <footer className='text-[#B0B0B0] tracking-tight font-medium text-center p-4 mt-4'>
        © 2025 {profile?.name}. All rights reserved.
    </footer>
  )
}

export default Footer;
