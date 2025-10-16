import React from 'react';
import './IconWrapper.scss';

type IIconWrapperProps = {
    children: React.ReactNode;
    variant: 'primary' | 'secondary' | 'gradient';
}

const IconWrapper = ({ children, variant }: IIconWrapperProps) => {
    return (
        <div className={`icon-wrapper icon-wrapper--${variant}`}>
            {children}
        </div>
    );
};

export default IconWrapper;