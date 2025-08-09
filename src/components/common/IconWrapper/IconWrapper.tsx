import React from 'react';
import './icon-wrapper.scss';

// Sử dụng Union Type cho prop 'variant' để giới hạn giá trị đầu vào.
// Điều này giúp loại bỏ lỗi chính tả và đảm bảo tính nhất quán.
type IconWrapperVariant = 'primary' | 'secondary' | 'gradient';

/**
 * Interface cho props của IconWrapper.
 * I-prefix được sử dụng để phân biệt rõ ràng giữa interface và component.
 */
interface IIconWrapperProps {
    children: React.ReactNode;
    variant: IconWrapperVariant;
}

/**
 * @component IconWrapper
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