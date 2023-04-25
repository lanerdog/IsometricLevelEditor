import { List, ListItemText, ListItemButton, Tabs, Tab, Box, ListItemAvatar, Paper } from "@mui/material";
import React, { useState } from "react";

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        )}
      </div>
    );
}

export function TileExplorer(props) {
    const [value, setValue] = useState(0);
    let selectedListItem = props.editMode.startsWith('tile') || props.editMode.startsWith('object') ? props.editMode.split('-')[1] : '';

    function handleTabChange(newValue) {
        setValue(newValue);
    }

    return(
        <div>
            <Tabs value={value} onChange={(event, newValue) => handleTabChange(newValue)}>
                <Tab label="Tiles" id="tab-0"/>
                <Tab label="Objects" id="tab-1"/>
            </Tabs>
            <TabPanel value={value} index={0}>
                <List style={{minWidth: '290px', maxHeight:'80vh', overflow: 'auto'}}>
                    {props.data ? 
                        Object.entries(props.data.tiles).map(([key, value]) =>
                            {
                                return <ListItemButton selected={selectedListItem === key} key={key} onClick={() => {props.handleTileSelection(key)}}>
                                    <img style={{width:'30px', height: '30px', marginRight: '5px'}} src={`./rsc/${key}.png`} />
                                    <ListItemText primary={value.name} />
                                </ListItemButton>
                            }
                        ) : null
                    } 
                </List>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <List style={{minWidth: '290px', maxHeight:'80vh', overflow: 'auto'}}>
                    {props.data ?
                        Object.entries(props.data.levelObjects).map(([key, value]) =>
                        {
                            return <ListItemButton selected={selectedListItem === key} key={key} onClick={() => {props.handleObjectSelection(key)}}>
                                <img style={{width:'30px', height: '30px', marginRight: '5px'}} src={`./rsc/${key}.png`} />
                                <ListItemText primary={value.name} />
                            </ListItemButton>
                        }
                    ) : null
                    }
                </List>
            </TabPanel>
        </div>
    );
}