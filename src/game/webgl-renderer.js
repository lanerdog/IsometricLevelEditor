import { TILE_WIDTH, TILE_HEIGHT, TILE_HEIGHT_OFFSET_RATIO, hexToRgbOffset } from './constants';
import { Sprite, Text } from 'pixi.js';

export class WebGLRenderer {
    constructor(webglApp, data) {
        this.mouseTileX = 0;
        this.mouseTileY = 0;
        this.lastDrawTime = 0;

        this.canvasWidth = webglApp.view.width;
        this.canvasHeight = webglApp.view.height;

        this.webglContext = webglApp.stage;  

        this.debugText = new Text('', {
            fontFamily: 'MS Gothic Bold',
            fontSize: 18,
            fill: '0xFFFFFF'
        });
        this.debugText.x = 5;
        this.debugText.y = 5;
    }

    componentToHex(c) {
        let hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    rgbToHex(r, g, b) {
        return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }

    draw(camera, level, mouseX, mouseY, aStarPath = [], drawNonPassables = false, drawLightSources = false, drawObjects = true) {
        const startX = Math.floor(camera.x) - camera.zoom;
        const startY = Math.floor(camera.y) - camera.zoom;
        const startOffsetX = camera.x - Math.floor(camera.x);
        const startOffsetY = camera.y - Math.floor(camera.y);
        const tileWidth = this.canvasWidth / camera.zoom;
        const tileHeight = this.canvasHeight / camera.zoom;

        this.mouseTileX = 0;
        this.mouseTileY = 0;

        let extraCameraSpace = Math.ceil(camera.zoom / 10 * 2.6);

        let ambientRgb = hexToRgbOffset(level.ambientLight);

        this.objectsToDraw = [];

        for(let x = startX + camera.zoom * 2 + 5; x > startX - extraCameraSpace; x--) {
            for (let y = startY - 5; y < startY + camera.zoom * 2 + extraCameraSpace; y++) {
                if (x > -1 && x < level.tiles.length && y > -1 && y < level.tiles[x].length) {
                    //reposition to line up for isometric
                    let tileX = Math.floor((x - startOffsetX - startX - camera.zoom) * tileWidth/2 + (y - startY - startOffsetY ) * tileWidth/2);
                    let tileY = Math.floor((y - startY - startOffsetY) * (tileHeight - (TILE_HEIGHT_OFFSET_RATIO * tileHeight))/2 - (x - startOffsetX - startX  - camera.zoom) * (tileHeight - (TILE_HEIGHT_OFFSET_RATIO * tileHeight))/2);
                    let tileBottomX = tileX + tileWidth;
                    let tileBottomY = tileY + tileHeight;

                    //only draw if it's in viewport, check by looking at each tile corner and verifying that at least one of them is in the viewport
                    if ((tileX > -1 && tileX < this.canvasWidth && tileY > -1 && tileY < this.canvasHeight) || 
                        (tileBottomX > -1 && tileBottomX < this.canvasWidth && tileBottomY > -1 && tileBottomY < this.canvasHeight) || 
                        (tileBottomX > -1 && tileBottomX < this.canvasWidth && tileY > -1 && tileY < this.canvasHeight) || 
                        (tileX > -1 && tileX < this.canvasWidth && tileBottomY > -1 && tileBottomY < this.canvasHeight)) {
                        
                        let isAStarPath = aStarPath.find((item) => item.x === x && item.y === y) !== undefined;
                        let isMouseInside = this.drawTile(
                            level.tiles[x][y], 
                            tileX, 
                            tileY, 
                            tileWidth, tileHeight, 
                            mouseX, mouseY, 
                            isAStarPath, 
                            drawNonPassables,
                            drawLightSources,
                            ambientRgb);
                        if (isMouseInside) {
                            this.mouseTileX = x;
                            this.mouseTileY = y;
                        }
                        
                        if (drawObjects && level.tiles[x][y].levelObject) {
                            this.drawGameObject(level.tiles[x][y], level.tiles[x][y].levelObject, tileX, tileY, tileWidth, tileHeight, mouseX, mouseY, drawLightSources, ambientRgb);
                        }
                        
                        if (level.tiles[x][y].actor) {
                            this.drawGameObject(
                                level.tiles[x][y], 
                                level.tiles[x][y].actor, 
                                tileX, tileY, 
                                tileWidth, tileHeight, 
                                mouseX, mouseY, 
                                drawLightSources,
                                ambientRgb, 
                                true);
                        }
                    } 
                }
            } 
        }

        for(let o = 0; o < this.objectsToDraw.length; o++) {
            this.webglContext.addChild(this.objectsToDraw[o]);
        }
        
        this.debugText.text = `x: ${mouseX}, y: ${mouseY}, tile: ${level.tiles[this.mouseTileX][this.mouseTileY].name}`;
        if (level.tiles[this.mouseTileX][this.mouseTileY].levelObject) {
            this.debugText.text += `, object: ${level.tiles[this.mouseTileX][this.mouseTileY].levelObject.name}`
        }
        this.webglContext.addChild(this.debugText);
    }

    drawTile(tile, tileX, tileY, tileWidth, tileHeight, mouseX, mouseY, isAStarPath, drawNonPassables, drawLightSources, ambientRgb) {
        const tileSprite = tile.activeAnimation.webglSprite;

        tileSprite.x = tileX;
        tileSprite.y = tileY;
        tileSprite.width = tileWidth;
        tileSprite.height = tileHeight;

        if (drawLightSources) {
            tileSprite.tint = this.rgbToHex(
                Math.floor(ambientRgb.r + (255 - ambientRgb.r) * (1 - tile.lightCoefficient)), 
                Math.floor(ambientRgb.g + (255 - ambientRgb.g) * (1 - tile.lightCoefficient)), 
                Math.floor(ambientRgb.b + (255 - ambientRgb.b) * (1 - tile.lightCoefficient)));
        } else if (isAStarPath) {
            tileSprite.tint = "#031CFC"
        } else if (drawNonPassables) {
            tileSprite.tint = "#F50525"
        } else {
            tileSprite.tint = "0xFFFFFF"
        }

        this.webglContext.addChild(tileSprite);

        return this.isMouseInsideTile(mouseX, mouseY, tileX, tileY, tileWidth, tileHeight);
    }

    isMouseInsideTile(mouseX, mouseY, tileX, tileY, tileWidth, tileHeight) {
        if ((tileX <= mouseX) && (mouseX <= (tileX + tileWidth)) && (tileY <= mouseY) && (mouseY <= (tileY + tileHeight))) {
            //turn tile into polygon points
            const top = tileY - TILE_HEIGHT_OFFSET_RATIO * tileHeight;
            const bottom = tileY + tileHeight;
            const middleY = top + (bottom - top) / 2;
            const length = tileX + tileWidth;
            const middleX = tileX + tileWidth / 2;
            const tilePoints = [[tileX, middleY], [middleX, top], [length, middleY], [middleX, bottom]]
            //polygon raycast     
            var inside = false;
            for (var i = 0, j = tilePoints.length - 1; i < tilePoints.length; j = i++) {
                var xi = tilePoints[i][0], yi = tilePoints[i][1];
                var xj = tilePoints[j][0], yj = tilePoints[j][1];
                
                var intersect = ((yi > mouseY) != (yj > mouseY))
                    && (mouseX < (xj - xi) * (mouseY - yi) / (yj - yi) + xi);
                if (intersect){
                    inside = !inside;
                } 
            }
            
            return inside;
        }
    }

    drawGameObject(tile, object, tileX, tileY, tileWidth, tileHeight, mouseX, mouseY, drawLightSources, ambientRgb, isActor = false) {
        const objectSprite = object.activeAnimation.webglSprite;
        //get scaled width/height
        let zoomWidth = Math.floor(objectSprite.texture.width * tileWidth / TILE_WIDTH);
        let zoomHeight = Math.floor(objectSprite.texture.height * tileHeight / TILE_HEIGHT); 

        let startX = 0;
        let startY = 0;

        if (isActor) {
            startX = Math.floor(tileX + tileWidth/2 - zoomWidth/2 + (object.offsetX - object.tileX) * tileWidth);
            startY = Math.floor(tileY + tileHeight/2 - zoomHeight + (object.offsetY - object.tileY) * tileHeight);
        } else {
            startX = Math.floor(tileX + tileWidth/2 - zoomWidth/2);
            startY = Math.floor(tileY + tileHeight - zoomHeight);
        }

        objectSprite.x = startX;
        objectSprite.y = startY;
        objectSprite.width = zoomWidth;
        objectSprite.height = zoomHeight;

        if (drawLightSources) {
            objectSprite.tint = this.rgbToHex(
                Math.floor(ambientRgb.r + (255 - ambientRgb.r) * (1 - tile.lightCoefficient)), 
                Math.floor(ambientRgb.g + (255 - ambientRgb.g) * (1 - tile.lightCoefficient)), 
                Math.floor(ambientRgb.b + (255 - ambientRgb.b) * (1 - tile.lightCoefficient)));
        } else {
            objectSprite.tint = "0xFFFFFF"
        }

        this.objectsToDraw.push(objectSprite);
    }
}