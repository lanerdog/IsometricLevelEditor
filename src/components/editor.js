import React, {useRef, useEffect, useState} from "react";
import { Data } from '../game/data';
import { Main } from '../game/main';
import { TitleBar } from './title-bar';
import { TileExplorer } from './tile-explorer';
import { NewDialog } from "./new-dialog";
import { HelpDialog } from "./help-dialog";

function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

export function Editor() {
    const canvasRef = useRef();
    const inputFile = useRef();
    const [data, setData] = useState(undefined);
    const [main, setMain] = useState(undefined);
    const [editMode, setEditMode] = useState('none');
    const [newDialogOpen, setNewDialogOpen] = useState(false);
    const [helpDialogOpen, setHelpDialogOpen] = useState(false);
    const [drawObjects, setDrawObjects] = useState(true);
    const [fill, setFill] = useState(false);
    const [undoBackups, setUndoBackups] = useState([]);
    const [canUndo, setCanUndo] = useState(false);
    let mainCreated = false;

    useEffect(() => {
        const ctx = canvasRef.current.getContext('2d');
        if (!mainCreated) {
            let newData = new Data();
            newData.load();
            let newMain = new Main(ctx, newData);
            newMain.start();
            setData(newData);
            setMain(newMain);
            setUndoBackups([newMain.level.copy()]);
            mainCreated = true;
        }
    }, []);

    function handleEditMode(mode) {
        if (editMode !== mode) {
            setEditMode(mode);
            setFill(false);
        }
    }

    function handleTileSelection(tileName) {
        let setTo = `tile-${tileName}`;
        if (editMode !== setTo) {
            setEditMode(setTo);
        }
    }

    function handleAStarCalc() {
        main?.calculateAStar();
    }

    function handleObjectSelection(objectName) {
        let setTo = `object-${objectName}`;
        if (editMode !== setTo) {
            setEditMode(setTo);
            setFill(false);
        }
    }

    function handleDrawObjectsChange() {
        main.drawObjects = !drawObjects;
        setDrawObjects(!drawObjects);
    }

    function handleFillChange() {
        setFill(!fill);
    }

    function handleHelp() {
        setHelpDialogOpen(true);
    }

    function handleCloseHelp() {
        setHelpDialogOpen(false);
    }

    function handleNew() {
        setNewDialogOpen(true);
    }

    function handleCloseNewDialog() {
        setNewDialogOpen(false);
    }

    function handleCreateNewMap(width, height) {
        main?.createNewLevel(width, height);
        setNewDialogOpen(false);
        setUndoBackups([main.level.copy()]);
        setCanUndo(false);
    }

    function handleLoad() {
        inputFile.current.click();
    }

    function handleInputFileChanged(file) {
        let reader = new FileReader();
        reader.onload = function(event) {
            main?.destringifyAndLoadLevel(event.target.result);
        }
        reader.readAsText(file);
    }
    
    function handleSave() {
        //make copy of level and add in animation names instead of image data
        if (main) {
            download(main.stringifyLevel(), "level.json", 'text/plain');
        }
    }

    function addUndo() {
        if (editMode !== 'start' && editMode !== 'end') {
            undoBackups.push(main.level.copy());
            if (undoBackups.length > 6) {
                undoBackups.shift();
            }
            setUndoBackups(undoBackups);
            setCanUndo(undoBackups.length > 1);
        }        
    }

    function handleUndo() {
        if (undoBackups.length > 1) {
            main.level = undoBackups[undoBackups.length - 2];
            undoBackups.pop();
            setUndoBackups(undoBackups);
            setCanUndo(undoBackups.length > 1);
            main.clearAStar();
        }
    }

    return (
        <div tabIndex="0"
            onKeyDown={(event) => {
                main?.handleKeyDown(event.key);
            }}
            onKeyUp={() => {
                main?.handleKeyUp();
            }}
        >
            <TitleBar 
                handleEditMode={handleEditMode} 
                handleAStarCalc={handleAStarCalc} 
                handleDrawObjectsChange={handleDrawObjectsChange} 
                handleFillChange={handleFillChange}
                handleNew={handleNew} 
                handleLoad={handleLoad} 
                handleSave={handleSave} 
                handleHelp={handleHelp} 
                handleUndo={handleUndo}
                canUndo={canUndo}
                editMode={editMode} 
                drawObjects={drawObjects}
                fill={fill}/>
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <canvas style={{minWidth: '82%', maxHeight: '92vh', border:'2px', borderColor:'white'}}
                    id='scene' ref={canvasRef}
                    width='640' height='400'
                    onWheel={(event) => {
                        main?.handleMouseWheel(event.deltaY);
                    }}
                    onMouseMove={(event) => {
                        let rect = canvasRef.current.getBoundingClientRect();
                        let x = event.clientX - rect.left;
                        let y = event.clientY - rect.top;
                        main?.handleMouseMove(
                            x / canvasRef.current.clientWidth * canvasRef.current.width, 
                            y / canvasRef.current.clientHeight * canvasRef.current.height, 
                            editMode);
                    }}
                    onMouseDown={(event) => {
                        if (event.button === 0 && !fill) {
                            main?.handleMouseDown(editMode);
                        } 
                    }}
                    onMouseUp={(event) => {
                        if (event.button === 0) {
                            main?.handleMouseUp(editMode, fill);
                            addUndo();
                        } else if (event.button === 1) {
                            main?.handleMouseClick();
                        }
                    }}
                ></canvas> 
                <TileExplorer data={data} handleTileSelection={handleTileSelection} handleObjectSelection={handleObjectSelection} editMode={editMode}/>
                <NewDialog open={newDialogOpen} handleCloseNewDialog={handleCloseNewDialog} handleCreateNewMap={handleCreateNewMap}/>
                <HelpDialog open={helpDialogOpen} handleCloseHelp={handleCloseHelp}/>
            </div>
            <input type='file' id='file' ref={inputFile} style={{display: 'none'}} onChange={(event) => handleInputFileChanged(event.target.files[0])}/>
        </div>
    )
}