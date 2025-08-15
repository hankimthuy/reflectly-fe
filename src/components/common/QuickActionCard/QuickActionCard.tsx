// src/components/QuickActionCard.tsx
import React from 'react';
import {IconWrapper, type IconWrapperVariant} from "../IconWrapper/IconWrapper.tsx";

/**
 * @interface QuickActionCardProps
 * @description Props for the QuickActionCard component.
 */
interface QuickActionCardProps {
    icon: React.ElementType; // Use React.ElementType for Material-UI icons
    title: string;
    description: string;
    variant: IconWrapperVariant; // To apply specific icon wrapper styles (e.g., --secondary, --primary)
}

/**
 * @component QuickActionCard
 * @description A reusable card component for quick actions like mood checks or gratitude.
 * @param {QuickActionCardProps} props The component props.
 * @returns {JSX.Element} The rendered QuickActionCard component.
 */
const QuickActionCard: React.FC<QuickActionCardProps> = ({ icon: Icon, title, description, variant }) => {
    return (
        <article className="quick-action-card">
            <IconWrapper variant={variant}>
                <Icon />
            </IconWrapper>
            <div className="quick-action-card__text">
                <h3 className="quick-action-card__title">{title}</h3>
                <p className="quick-action-card__description">{description}</p>
            </div>
        </article>
    );
};

export default QuickActionCard;