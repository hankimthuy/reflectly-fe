import * as React from 'react';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import type {SxProps} from "@mui/system";
import type {Theme} from "@mui/material";

interface BaseCardProps {
    active?: boolean;
    onClick?: () => void;
    children: React.ReactNode;
}

const getActionAreaStyles = (active: boolean | undefined): SxProps<Theme> => ({
  borderRadius: 'inherit',
  backgroundColor: active ? 'action.selected' : 'transparent',
  '&:hover': {
    backgroundColor: active ? 'action.selected' : 'action.hover',
  },
});

const cardSx: SxProps<Theme> = {
  border: (theme) => `1px solid ${theme.palette.divider}`,
  borderRadius: '8px'
};

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