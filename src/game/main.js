import { Renderer } from './renderer';
import { Camera } from './camera';
import { Level } from './level';
import { aStar } from './astar';

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

        this.aStarPath = [];

        const tiles = [];
        for(let x = 0; x < 100; x++) {
            tiles.push([]);
            for(let y = 0; y < 100; y++) {
                let tileType = Math.random();
                if (tileType > 0.2) {
                    tiles[x].push(this.data.tiles['test'].copy());
                    if (Math.random() > 0.9) {
                        tiles[x][y].levelObject = this.data.levelObjects['testobject'].copy();
                    }
                } else if (tileType > 0.19) {
                    tiles[x].push(this.data.tiles['empty'].copy());
                } else {
                    tiles[x].push(this.data.tiles['stone'].copy());
                    if (Math.random() > 0.9) {
                        tiles[x][y].levelObject = this.data.levelObjects['testwall'].copy();
                    }
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

        return JSON.stringify(new Level(tiles));
    }

    destringifyAndLoadLevel(json) {
        const parsedLevel = JSON.parse(json);
        for(let x = 0; x < parsedLevel.tiles.length; x++) {
            for(let y = 0; y < parsedLevel.tiles[x].length; y++) {
                parsedLevel.tiles[x][y].activeAnimation = this.data.animations[parsedLevel.tiles[x][y].activeAnimation];
                if (parsedLevel.tiles[x][y].levelObject) {
                    parsedLevel.tiles[x][y].levelObject.activeAnimation = this.data.animations[parsedLevel.tiles[x][y].levelObject.activeAnimation];
                }
            }
        }

        this.level = parsedLevel;
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
        this.renderer.draw(this.ctx, this.camera, this.level, this.mouseX, this.mouseY, this.aStarPath, true);
    }

    placeEdit(editMode) {
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
                this.level.tiles[this.renderer.mouseTileX][this.renderer.mouseTileY] = newTile;
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

    handleMouseDown(editMode) {
        if (editMode !== 'none') {
            this.placeEdit(editMode);
            this.mouseDown = true;
        }
    }

    handleMouseClick() {
        this.camera.x = this.renderer.mouseTileX;
        this.camera.y = this.renderer.mouseTileY;
    }

    handleMouseUp() {
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