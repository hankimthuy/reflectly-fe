import * as React from 'react';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';

interface BaseCardProps {
    /** Indicates if the card is active and should show active styles. */
    active?: boolean;
    /** Called when the card is clicked. */
    onClick?: () => void;
    /** Content to render inside the card. */
    children: React.ReactNode;
}

const BaseCard: React.FC<BaseCardProps> = ({ active, onClick, children }) => (
    <Card>
        <CardActionArea
            onClick={onClick}
            sx={{
                height: '100%',
                backgroundColor: active ? 'action.selected' : undefined,
                '&:hover': {
                    backgroundColor: active ? 'action.selectedHover' : 'action.hover',
                },
            }}
        >
            <CardContent sx={{ height: '100%' }}>
                {children}
            </CardContent>
        </CardActionArea>
    </Card>
);

export default BaseCard;