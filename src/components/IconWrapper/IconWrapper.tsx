import React from 'react';
import './IconWrapper.scss';

type IIconWrapperProps = {
    children: React.ReactNode;
    variant: 'primary' | 'secondary' | 'gradient';
    onClick?: () => void;
}

const IconWrapper = ({ children, variant, onClick }: IIconWrapperProps) => {
    return (
        <div className={`icon-wrapper icon-wrapper--${variant}`} onClick={onClick}>
            {children}
        </div>
    );
};

export default IconWrapper;