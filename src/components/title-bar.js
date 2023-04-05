import React from "react";
import { Toolbar, AppBar, IconButton, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import { LayersClear, RemoveCircle, OpenInBrowser, Menu as MenuIcon, SaveAlt, InsertDriveFile, Help, Texture, CropSquare } from "@mui/icons-material"; 

export function TitleBar(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    let selectedPassing = props.editMode.startsWith('passable');
    let selectedImpassable = props.editMode.startsWith('impassable');
    let selectedDelete = props.editMode.startsWith('delete') ? props.editMode.split('-')[1] : '';

    function handleOpenMenu(event) {
        setAnchorEl(event.currentTarget);
    };

    function handleCloseMenu() {
        setAnchorEl(null);
    };

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Tooltip title="File">
                        <IconButton onClick={(event) => handleOpenMenu(event)}>
                            <MenuIcon />
                        </IconButton>
                    </Tooltip>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={() => handleCloseMenu()}
                    >
                        <MenuItem onClick={() => {
                                handleCloseMenu();
                                props.handleNew();
                            }}>
                            <div style={{minWidth: '150px', display: 'flex', flexDirection: 'row'}}>
                                <InsertDriveFile style={{marginRight: '10px'}}/>
                                <Typography style={{marginLeft: 'auto'}}>New</Typography>
                            </div>
                        </MenuItem>
                        <MenuItem onClick={() => {
                                handleCloseMenu();
                                props.handleSave();
                            }}>
                            <div style={{minWidth: '150px', display: 'flex', flexDirection: 'row'}}>
                                <SaveAlt style={{marginRight: '10px'}}/>
                                <Typography style={{marginLeft: 'auto'}}>Save</Typography>
                            </div>
                        </MenuItem>
                        <MenuItem onClick={() => {
                                handleCloseMenu();
                                props.handleLoad();
                            }}>
                            <div style={{minWidth: '150px', display: 'flex', flexDirection: 'row'}}>
                                <OpenInBrowser style={{marginRight: '10px'}}/>
                                <Typography style={{marginLeft: 'auto'}}>Load</Typography>
                            </div>
                        </MenuItem>
                        <MenuItem onClick={() => {
                                handleCloseMenu();
                                props.handleHelp();
                            }}>
                            <div style={{minWidth: '150px', display: 'flex', flexDirection: 'row'}}>
                                <Help style={{marginRight: '10px'}}/>
                                <Typography style={{marginLeft: 'auto'}}>Help</Typography>
                            </div>
                        </MenuItem>
                    </Menu>
                    <div style={{marginLeft: 'auto'}}>
                        <Tooltip title="Draw Passable">
                            <IconButton onClick={() => props.handlePassingMode('passable')}>
                                <CropSquare color={selectedPassing ? 'primary' : 'inherit'}/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Draw Impassable">
                            <IconButton onClick={() => props.handlePassingMode('impassable')}>
                                <Texture color={selectedImpassable ? 'primary' : 'inherit'}/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Tiles">
                            <IconButton onClick={() => props.handleDeletionMode('tile')}>
                                <LayersClear color={selectedDelete === 'tile' ? 'primary' : 'inherit'}/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Objects">
                            <IconButton onClick={() => props.handleDeletionMode('object')}>
                                <RemoveCircle color={selectedDelete === 'object' ? 'primary' : 'inherit'}/>
                            </IconButton>
                        </Tooltip>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );
}