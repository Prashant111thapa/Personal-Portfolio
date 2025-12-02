import React from "react";

const Button = ({
  children,
  variant = "default",
  size = "default",
  onClick,
  disabled = false,
  className = "",
  ...props
}) => {
  // Shared base styles for all buttons
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    whitespace-nowrap rounded-lg font-medium
    transition-all duration-300 ease-in-out
    focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FD6F00]
    disabled:pointer-events-none disabled:opacity-50
    group
  `;

  // Variant-specific styles
  const variantStyles = {
    default: `
      bg-[#FD6F00] text-white 
      shadow-lg shadow-[#FD6F00]/20
      hover:bg-[#FD6F00]/90 hover:shadow-[#FD6F00]/40
      cursor-pointer
    `,
    primary: `
      border-2 border-[#FD6F00]/40 bg-[#121212] text-[#FD6F00]
      shadow-md shadow-[#FD6F00]/10
      hover:bg-[#FD6F00]/10 hover:text-white hover:shadow-[#FD6F00]/40
      cursor-pointer
    `,
    outline: `
      border border-[#FD6F00] text-[#FD6F00]
      hover:bg-[#FD6F00] hover:text-white
      shadow-sm hover:shadow-[#FD6F00]/30
      cursor-pointer
    `,
    ghost: `
      bg-transparent text-[#FD6F00]
      hover:bg-[#FD6F00]/10 hover:shadow-[#FD6F00]/20
      cursor-pointer
    `,
  };

  // Size-specific styles
  const sizeStyles = {
    default: "px-6 py-3 text-base",
    sm: "px-3 py-1.5 text-sm",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`
        ${baseStyles}
        ${variantStyles[variant] || variantStyles.default}
        ${sizeStyles[size] || sizeStyles.default}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
    // <Button
    //   onClick={() => console.log("Go to projects")}
    //   className="px-9 py-6 text-base"
    // >
    //   View Projects
    //   <ArrowRight
    //     className="ml-2 transition-transform group-hover:translate-x-1"
    //     size={20}
    //   />
    // </Button> 