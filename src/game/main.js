import { Renderer } from './renderer';
import { Camera } from './camera';
import { Level } from './level';
import { aStar } from './astar';
import { Tile } from './tile';
import { LevelObject } from './level-object';

export class Main {
    constructor(ctx, data) {
        this.ctx = ctx;
        this.data = data;

        this.renderer = new Renderer();
        this.camera = new Camera();
        this.camera.x = 25;
        this.camera.y = 25;

        this.cameraMoveX = 0;
        this.cameraMoveY = 0;

        this.mouseX = 0;
        this.mouseY = 0;

        this.drawObjects = true;

        this.aStarPath = [];

        const tiles = [];
        for(let x = 0; x < 100; x++) {
            tiles.push([]);
            for(let y = 0; y < 100; y++) {
                let tileType = Math.random();
                if (tileType > 0.2) {
                    tiles[x].push(this.data.tiles['grass'].copy());
                    if (Math.random() > 0.9) {
                        tiles[x][y].levelObject = this.data.levelObjects['testobject'].copy();
                    }
                } else if (tileType > 0.19) {
                    tiles[x].push(this.data.tiles['empty'].copy());
                } else {
                    tiles[x].push(this.data.tiles['stone'].copy());
                }                
            }
        }
        this.level = new Level(tiles);
    }

    createNewLevel(width, height) {
        const tiles = [];
        for(let x = 0; x < width; x++) {
            tiles.push([]);
            for(let y = 0; y < height; y++) {
                tiles[x].push(this.data.tiles['empty'].copy());
            }
        }
        this.level = new Level(tiles);
        this.level.ambientLight = "#FFFFFF";
        this.camera.x = 0;
        this.camera.y = 0;
        this.clearAStar();
    }

    stringifyLevel() {
        const tiles = [];
        for(let x = 0; x < this.level.tiles.length; x++) {
            tiles.push([]);
            for(let y = 0; y < this.level.tiles[x].length; y++) {
                let tileCopy = this.level.tiles[x][y].copy();
                tileCopy.activeAnimation = tileCopy.activeAnimation.name;
                if (tileCopy.levelObject) {
                    tileCopy.levelObject.activeAnimation = tileCopy.levelObject.activeAnimation.name;
                }
                tiles[x].push(tileCopy);
            }
        }

        const returnValue = new Level(tiles);
        returnValue.ambientLight = this.level.ambientLight;

        return JSON.stringify(returnValue);
    }

    destringifyAndLoadLevel(json) {
        const parsedLevel = JSON.parse(json);
        for(let x = 0; x < parsedLevel.tiles.length; x++) {
            for(let y = 0; y < parsedLevel.tiles[x].length; y++) {
                parsedLevel.tiles[x][y].activeAnimation = this.data.animations[parsedLevel.tiles[x][y].activeAnimation];
                if (parsedLevel.tiles[x][y].levelObject) {
                    parsedLevel.tiles[x][y].levelObject.activeAnimation = this.data.animations[parsedLevel.tiles[x][y].levelObject.activeAnimation];
                    Object.setPrototypeOf(parsedLevel.tiles[x][y].levelObject, LevelObject.prototype);
                }

                Object.setPrototypeOf(parsedLevel.tiles[x][y], Tile.prototype);
            }
        }

        this.level = Object.setPrototypeOf(parsedLevel, Level.prototype);
        this.camera.x = 0;
        this.camera.y = 0;
        this.clearAStar();
    }

    clearAStar() {
        this.aStarStartX = undefined;
        this.aStarStartY = undefined;
        this.aStarEndX = undefined;
        this.aStarEndY = undefined;
        this.aStarPath = [];
    }

    start() {
        this.updateInterval = setInterval(this.update.bind(this), 1000/30);
    }
    
    update() {
        this.camera.x += this.cameraMoveX;
        this.camera.y += this.cameraMoveY;
        this.renderer.draw(this.ctx, this.camera, this.level, this.mouseX, this.mouseY, this.aStarPath, true, true, this.drawObjects);
    }

    placeEdit(editMode, fill = false) {
        let mouseTile = this.level.tiles[this.renderer.mouseTileX][this.renderer.mouseTileY];
        if (editMode.startsWith('object')) {
            let objectName = editMode.split('-')[1].toLowerCase();
            if (mouseTile && (!mouseTile.levelObject || mouseTile.levelObject.name.toLowerCase() !== objectName)) {
                mouseTile.levelObject = this.data.levelObjects[objectName].copy();
            }
        } else if (editMode.startsWith('tile')) {
            let tileName = editMode.split('-')[1].toLowerCase();
            if (!mouseTile || mouseTile.name.toLowerCase() !== tileName){
                let newTile = this.data.tiles[tileName].copy();
                newTile.passable = mouseTile?.passable ?? false;
                if (!fill) {
                    this.level.tiles[this.renderer.mouseTileX][this.renderer.mouseTileY] = newTile;
                    this.level.tiles[this.renderer.mouseTileX][this.renderer.mouseTileY].lightCoefficient = mouseTile.lightCoefficient;
                } else {
                    this.fillTile(this.renderer.mouseTileX, this.renderer.mouseTileY, mouseTile, newTile);
                }                
            }
        } else if (editMode === 'delete-tile') {
            this.level.tiles[this.renderer.mouseTileX][this.renderer.mouseTileY] = this.data.tiles['empty'].copy();
        } else if (editMode === 'delete-object') {
            if (mouseTile) {
                mouseTile.levelObject = undefined;
            }
        } else if (editMode === 'passable') {
            if (mouseTile && !mouseTile.passable) {
                mouseTile.passable = true;
                this.aStarPath = [{x: this.aStarStartX, y: this.aStarStartY}, {x: this.aStarEndX, y: this.aStarEndY}];
            }
        } else if (editMode === 'impassable') {
            if (mouseTile && mouseTile.passable) {
                mouseTile.passable = false;
                this.aStarPath = [{x: this.aStarStartX, y: this.aStarStartY}, {x: this.aStarEndX, y: this.aStarEndY}];
            }
        } else if (editMode === 'start') {
            if (mouseTile && mouseTile.passable) {
                this.aStarStartX = this.renderer.mouseTileX;
                this.aStarStartY = this.renderer.mouseTileY;
                this.aStarPath = [{x: this.aStarStartX, y: this.aStarStartY}, {x: this.aStarEndX, y: this.aStarEndY}];
            }
        } else if (editMode === 'end') {
            if (mouseTile && mouseTile.passable) {
                this.aStarEndX = this.renderer.mouseTileX;
                this.aStarEndY = this.renderer.mouseTileY;
                this.aStarPath = [{x: this.aStarStartX, y: this.aStarStartY}, {x: this.aStarEndX, y: this.aStarEndY}];
            }
        } 
    }

    placeLight() {
        let mouseTile = this.level.tiles[this.renderer.mouseTileX][this.renderer.mouseTileY];
        //first set origin to 0
        if (mouseTile) {
            if (mouseTile.lightCoefficient === 0) {
                mouseTile.lightCoefficient = 1;
            } else {
                mouseTile.lightCoefficient = 0;
            }                

            this.recalculateLightCoefficients();
        }
    }

    recalculateLightCoefficients() {
        //set all tiles to 1 for those that are not set to 0 first
        for (let x = 0; x < this.level.tiles.length; x++) {
            for (let y = 0; y < this.level.tiles[x].length; y++){
                if (this.level.tiles[x][y].lightCoefficient > 0) {
                    this.level.tiles[x][y].lightCoefficient = 1;
                }
            }
        }

        for (let x = 0; x < this.level.tiles.length; x++) {
            for (let y = 0; y < this.level.tiles[x].length; y++){
                if (this.level.tiles[x][y].lightCoefficient === 0) {
                    let startX = x - 5;
                    let startY = y - 5;
                    let endX = startX + 10;
                    let endY = startY + 10;
                    for (let lx = startX; lx < endX; lx++) {
                        for (let ly = startY; ly < endY; ly++) {
                            if (lx > -1 && lx < this.level.tiles.length && ly > -1 && ly < this.level.tiles[lx].length && this.level.tiles[lx][ly].lightCoefficient !== 0) {
                                let distanceFromOrigin = Math.sqrt(Math.pow(lx - x, 2) + Math.pow(ly - y, 2));
                                if (distanceFromOrigin <= 5) {
                                    let newLightCoefficient = this.level.tiles[lx][ly].lightCoefficient - (1 - distanceFromOrigin / 5 + 0.2);

                                    if (newLightCoefficient > 1) {
                                        newLightCoefficient = 1;
                                    } else if (newLightCoefficient < 0.01) {
                                        newLightCoefficient = 0.01;
                                    }
                                    this.level.tiles[lx][ly].lightCoefficient = newLightCoefficient;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    fillTile(x, y, currentTile, newTile) {
        if (x > -1 && x < this.level.tiles.length &&
            y > -1 && y < this.level.tiles[0].length &&
            currentTile.name === this.level.tiles[x][y].name) {
                let currentLightCoefficient = this.level.tiles[x][y].lightCoefficient;
                this.level.tiles[x][y] = newTile;
                this.level.tiles[x][y].lightCoefficient = currentLightCoefficient;

                this.fillTile(x+1, y, currentTile, newTile.copy());
                this.fillTile(x-1, y, currentTile, newTile.copy());
                this.fillTile(x, y+1, currentTile, newTile.copy());
                this.fillTile(x, y-1, currentTile, newTile.copy());
            }
    }

    calculateAStar() {
        if (this.aStarEndX !== undefined && this.aStarEndY !== undefined && 
            this.aStarStartX !== undefined && this.aStarStartY !== undefined) {
                this.aStarPath = aStar({x: this.aStarStartX, y: this.aStarStartY}, {x: this.aStarEndX, y: this.aStarEndY}, this.level.tiles);
            }
    }
    
    handleMouseMove(mouseX, mouseY, editMode) {
        this.mouseX = Math.floor(mouseX);
        this.mouseY = Math.floor(mouseY);

        if (this.mouseDown) {
            this.placeEdit(editMode);
        }
    }

    handleMouseWheel(deltaY) {
        let delta = 1;
        if (deltaY < 0) {
            delta = -1;
        }

        this.camera.zoom += delta;
    }

    handleMouseDown(editMode, fill = false) {
        if (editMode !== 'none') {
            this.level = this.level.copy();
            this.placeEdit(editMode, fill);
            this.mouseDown = true;
        }
    }

    handleMouseClick() {
        this.camera.x = this.renderer.mouseTileX;
        this.camera.y = this.renderer.mouseTileY;
    }

    handleMouseUp(editMode, fill) {
        if (editMode.startsWith('tile') && fill) {
            this.placeEdit(editMode, fill);
        } else if (editMode === 'light') {
            this.placeLight();
        }
        this.mouseDown = false;
    }

    handleKeyDown(key) {
        if (key === 'a') {
            this.cameraMoveX = -1;
            this.cameraMoveY = -1;
        } else if (key === 'w') {
            this.cameraMoveY = -2;
            this.cameraMoveX = 2;
        } else if (key === 's') {
            this.cameraMoveY = 2;
            this.cameraMoveX = -2;
        } else if (key === 'd') {
            this.cameraMoveX = 1;
            this.cameraMoveY = 1;
        }
    }

    handleKeyUp() {
        this.cameraMoveX = 0;
        this.cameraMoveY = 0;
    }
}