import React from 'react';
import { Dialog, DialogTitle, Typography } from "@mui/material";

export function HelpDialog(props) {

    return (
        <Dialog open={props.open} onClose={() => props.handleCloseHelp()}>
            <DialogTitle variant="subtitle1">Help/About</DialogTitle>
            <div style={{margin: '20px'}}>
                <div style={{marginBottom: '20px'}}>
                    <Typography>Controls:</Typography>
                    <Typography>W, A, S, D to move camera</Typography>
                    <Typography>Mouse Wheel to zoom camera</Typography>
                    <Typography>Mouse Down to delete or draw</Typography>
                </div>
                <img src='../rsc/logo.png' />
                <div style={{margin: 'auto', width: '20%'}}>
                    <a style={{marginRight: '10px'}} href="https://fortron.itch.io" target="_blank" rel="noopener noreferrer">Itch</a>
                    <a href="https://github.com/HeapOverfl0w" target="_blank" rel="noopener noreferrer">Github</a>
                </div>
            </div>
        </Dialog>
    );
}