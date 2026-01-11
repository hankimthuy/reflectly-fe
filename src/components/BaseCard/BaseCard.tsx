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
    className?: string;
}

const getActionAreaStyles = (active: boolean | undefined): SxProps<Theme> => ({
  borderRadius: 'inherit',
  backgroundColor: active ? 'var(--c-surface-subtle)' : 'transparent',
  height: 'auto',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    backgroundColor: 'transparent',
  },
});

const cardSx: SxProps<Theme> = {
  backgroundColor: 'var(--c-surface)',
  border: '1px solid var(--c-border)',
  borderRadius: '16px',
  boxShadow: '0 4px 12px var(--c-shadow-light)',
  transition: 'all var(--transition-normal)',
  height: 'auto',
  width: 'auto',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    boxShadow: '0 8px 24px var(--c-shadow-heavy)',
    transform: 'translateY(-3px)',
  },
};

const BaseCard: React.FC<BaseCardProps> = ({ active, onClick, children, className }) => (
    <Card sx={cardSx} className={className}>
        <CardActionArea
            onClick={onClick}
            sx={getActionAreaStyles(active)}>
            <CardContent 
                className="base-card-content"
                sx={{
                    height: 'auto',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                {children}
            </CardContent>
        </CardActionArea>
    </Card>
);

export default BaseCard;