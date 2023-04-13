import React from "react";
import { Toolbar, AppBar, IconButton, Menu, MenuItem, Tooltip, Typography, FormControlLabel, Checkbox, Divider, TextField } from "@mui/material";
import { LayersClear, RemoveCircle, OpenInBrowser, Menu as MenuIcon, SaveAlt, InsertDriveFile, Help, Texture, CropSquare, Star, SportsScore, Route, Undo, Lightbulb } from "@mui/icons-material"; 

export function TitleBar(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    let selectedAStarStart = props.editMode.startsWith('start');
    let selectedAStarEnd = props.editMode.startsWith('end');
    let selectedPassing = props.editMode.startsWith('passable');
    let selectedImpassable = props.editMode.startsWith('impassable');
    let selectedTile = props.editMode.startsWith('tile');
    let selectedLight = props.editMode.startsWith('light');
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
                    <Tooltip title="Place A* Start">
                        <IconButton onClick={() => props.handleEditMode('start')}>
                            <Star color={selectedAStarStart ? 'primary' : 'inherit'}/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Place A* End">
                        <IconButton onClick={() => props.handleEditMode('end')}>
                            <SportsScore color={selectedAStarEnd ? 'primary' : 'inherit'}/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Calculate A* Path">
                        <IconButton onClick={() => props.handleAStarCalc()}>
                            <Route />
                        </IconButton>
                    </Tooltip>
                    <Divider orientation="vertical" variant="middle" flexItem style={{marginLeft: 20, marginRight: 20}}></Divider>
                    <Tooltip title="Undo">
                        <IconButton disabled={!props.canUndo} onClick={() => props.handleUndo()}>
                            <Undo />
                        </IconButton>
                    </Tooltip>
                    <div style={{marginLeft: 'auto'}}>
                        <Tooltip title="Draw Light">
                            <IconButton onClick={() => props.handleEditMode('light')}>
                                <Lightbulb color={selectedLight ? 'primary' : 'inherit'}/>
                            </IconButton>
                        </Tooltip>
                        <TextField 
                            value={props.ambientColor} 
                            onChange={(event) => props.handleAmbientColorChange(event.target.value)} 
                            label="Ambient Light" 
                            style={{width: '120px', height: '30px', marginRight: 10, marginLeft: 10}}
                            inputProps={{style: {padding: 10}}}
                        />
                        <FormControlLabel disabled={!selectedTile} control={<Checkbox checked={props.fill} onChange={() => props.handleFillChange()}/>} label="Fill" />
                        <FormControlLabel control={<Checkbox checked={props.drawObjects} onChange={() => props.handleDrawObjectsChange()}/>} label="Draw Objects" />
                        <Tooltip title="Draw Passable">
                            <IconButton onClick={() => props.handleEditMode('passable')}>
                                <CropSquare color={selectedPassing ? 'primary' : 'inherit'}/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Draw Impassable">
                            <IconButton onClick={() => props.handleEditMode('impassable')}>
                                <Texture color={selectedImpassable ? 'primary' : 'inherit'}/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Objects">
                            <IconButton onClick={() => props.handleEditMode('delete-object')}>
                                <RemoveCircle color={selectedDelete === 'object' ? 'primary' : 'inherit'}/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Tiles">
                            <IconButton onClick={() => props.handleEditMode('delete-tile')}>
                                <LayersClear color={selectedDelete === 'tile' ? 'primary' : 'inherit'}/>
                            </IconButton>
                        </Tooltip>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );
}