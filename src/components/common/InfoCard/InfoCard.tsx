// src/components/BaseCard.tsx
import React from 'react';
import {IconWrapper, type IconWrapperVariant} from "../IconWrapper/IconWrapper.tsx";

/**
 * @interface InfoCardProps
 * @description Props for the BaseCard component.
 */
interface InfoCardProps {
    icon: React.ElementType; // Use React.ElementType for Material-UI icons
    title: string;
    description: React.ReactNode; // Can be a string or a JSX element
    variant: IconWrapperVariant;  // To apply specific icon wrapper styles (e.g., --secondary, --primary)
}

/**
 * @component BaseCard
 * @description A reusable card component for displaying informational content.
 * @param {InfoCardProps} props The component props.
 * @returns {JSX.Element} The rendered BaseCard component.
 */
const InfoCard: React.FC<InfoCardProps> = ({ icon: Icon, title, description, variant }) => {
    return (
        <article className="info-card">
            <IconWrapper variant={variant}>
                <Icon />
            </IconWrapper>
            <div className="info-card__text">
                <h3 className="info-card__title">{title}</h3>
                <p className="info-card__description">{description}</p>
            </div>
        </article>
    );
};

export default InfoCard;