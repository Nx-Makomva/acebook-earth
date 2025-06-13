import React from "react";
import PropTypes from "prop-types";
import '@testing-library/jest-dom';


const Button = ({ 
    variant = "default", 
    onClick, 
    children, 
    disabled, 
    type = "button", 
    ariaLabel, 
}) => {
    const baseStyle = 
        "px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
//styling the padding, corners, hover/focus and disabled and the variant prop styles
    const variants = {
        confirm: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-400",
        cancel: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-400",
        default: "bg-gray-300 text-black hover:bg-gray-400 focus:ring-gray-400",
    };

    const finalStyle = `${baseStyle} ${variants[variant] || variants.default}`;
//combines the base style with the variant ones

    return (
        <button 
            type={type}
            onClick={onClick} 
            className={finalStyle} 
            disabled={disabled}
            aria-label={ariaLabel}
        >
            {/* applies all the syling */}

            {children} 
            {/* shows the text content (children) we pass in */}
        </button>
    );
};

Button.propTypes = {
    variant: PropTypes.oneOf(["confirm", "cancel", "default"]), //style type-confirm, cancel or default
    onClick: PropTypes.func, // it must be a function
    children: PropTypes.node.isRequired, //text inside the button - log out and Confirm Post
    disabled: PropTypes.bool, //bool for is button disabled or not (true/false)
    type: PropTypes.string,
    ariaLabel: PropTypes.string,
};

//default values just incase we decide not to pass any props.
// Button.defaultProps = {
//     variant: "default",
//     onClick: () => {},
//     disabled: false,
// };

export default Button;