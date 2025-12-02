import React from 'react'

const Input = ({
    type='text',
    onChange,
    value,
    name,
    label,
    className='',
    required,
    placeholder='',
    ...props
}) => {

  return (
    <div className={`flex flex-col items-start justify-start `}>
      <label className='text-white font-medium mb-1 p-1'>{label}</label>
      <input 
        type={type || "text"}
        value={value}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`p-4 rounded-md bg-[#1e1e1e] text-white border
            border-[#FD6F00]/30 focus:outline-none focus:ring-2 focus:ring-[#FD6F00] ${className}`}
        {...props}
        />
    </div>
  );
}

export default Input;
