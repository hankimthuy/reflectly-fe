import * as React from 'react';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import {cardSx, getActionAreaStyles} from "./BaseCard.styles.ts";

interface BaseCardProps {
    active?: boolean;
    onClick?: () => void;
    children: React.ReactNode;
}

const BaseCard: React.FC<BaseCardProps> = ({ active, onClick, children }) => (
    <Card sx={cardSx}>
        <CardActionArea
            onClick={onClick}
            sx={getActionAreaStyles(active)}>
            <CardContent>
                {children}
            </CardContent>
        </CardActionArea>
    </Card>
);

export default BaseCard;