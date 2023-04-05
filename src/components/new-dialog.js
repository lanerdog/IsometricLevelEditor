import React, { useState } from 'react';
import { Dialog, DialogTitle, TextField, Button } from "@mui/material";

export function NewDialog(props) {
    const [width, setWidth] = useState(1);
    const [height, setHeight] = useState(1);

    function handleWidthChange(newValue) {
        if (newValue < 1) {
            setWidth(1);
        } else if (newValue > 300) {
            setWidth(300);
        } else {
            setWidth(newValue);
        }
    }

    function handleHeightChange(newValue) {
        if (newValue < 1) {
            setHeight(1);
        } else if (newValue > 300) {
            setHeight(300);
        } else {
            setHeight(newValue);
        }
    }

    return(
        <Dialog onClose={() => props.handleCloseNewDialog()} open={props.open}>
            <DialogTitle variant="subtitle1">New Map</DialogTitle>
            <div style={{width: '200px', height: '180px'}}>
                <TextField value={width} onChange={(event) => handleWidthChange(event.target.value)} type="number" label="Width" inputProps={{min: 0, max: 300}} style={{marginLeft:'20px', marginBottom:'10px', width: '80%'}}></TextField>
                <TextField value={height} onChange={(event) => handleHeightChange(event.target.value)} type="number" label="Height" inputProps={{min: 0, max: 300}} style={{marginLeft:'20px', marginBottom:'10px', width: '80%'}}></TextField>
                <div style={{margin: 'auto', width: '30%'}}>
                    <Button onClick={() => props.handleCreateNewMap(width, height)}>OK</Button>
                </div>
            </div>
        </Dialog>
    )
}