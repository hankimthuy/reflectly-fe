import type {SxProps} from "@mui/system";
import type {Theme} from "@mui/material";

export const getActionAreaStyles = (active: boolean | undefined): SxProps<Theme> => ({
  borderRadius: 'inherit',
  backgroundColor: active ? 'action.selected' : 'transparent',
  '&:hover': {
  backgroundColor: active ? 'action.selected' : 'action.hover',
  },
});

export const cardSx: SxProps<Theme> = {
  border: (theme) => `1px solid ${theme.palette.divider}`,
  borderRadius: '8px'
};
