import React from 'react';
import './IconWrapper.scss';

export type IconWrapperVariant = 'primary' | 'secondary' | 'gradient';

/**
 * Interface cho props của InfoCard.
 * I-prefix được sử dụng để phân biệt rõ ràng giữa interface và component.
 */
export interface IIconWrapperProps {
    children: React.ReactNode;
    variant: IconWrapperVariant;
}

/**
 * @component InfoCard
 * @description A reusable wrapper for icons with different styles.
 * @param {IIconWrapperProps} props The component props.
 */
export const IconWrapper: React.FC<IIconWrapperProps> = ({ children, variant }) => {
    return (
        <div className={`icon-wrapper icon-wrapper--${variant}`}>
            {children}
        </div>
    );
};