import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Slider, Typography } from '@mui/material';

interface ChooseAcreageModalProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ChooseAcreageModal: React.FC<ChooseAcreageModalProps> = ({ open, setOpen }) => {
    const [acreage, setAcreage] = useState<number[]>([10, 20]);
    const valuetext = (value: number) => {
        return `${value}`;
    };
    const handleChangeAcreage = (event: Event, newValue: number | number[]) => {
        setAcreage(newValue as number[]);
    };

    return <Dialog
        PaperProps={{ sx: { minHeight: 400 } }}
        fullWidth open={open} maxWidth={'md'} onClose={() => { setOpen(false); }}>
        <DialogTitle textAlign={'center'} pb={2} borderBottom={1} borderColor={'grey.500'}>
            Chọn diện tích
        </DialogTitle>
        <DialogContent>
            <Typography textAlign={'center'} mt={2}>{`${acreage[0]} - ${acreage[1]} m`}<sup>2</sup></Typography>
            <Slider
                value={acreage}
                onChange={handleChangeAcreage}
                valueLabelDisplay="auto"
                getAriaValueText={valuetext}
                sx={{ marginTop: 5 }}
                max={90}
                min={0}
            />
        </DialogContent>
        <DialogActions>
            <Button variant='contained'>
                Xác nhận
            </Button>
        </DialogActions>
    </Dialog>;
};

export default ChooseAcreageModal;