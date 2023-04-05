import { TILE_WIDTH, TILE_HEIGHT, TILE_HEIGHT_OFFSET_RATIO } from './constants';

export class Renderer {
    constructor() {
        this.mouseTileX = 0;
        this.mouseTileY = 0;
    }

    draw(ctx, camera, level, mouseX, mouseY) {
        //ctx.fillRect(0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = "#48657D";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this.screenBuffer = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        const startX = camera.x - camera.zoom;
        const startY = camera.y - camera.zoom;
        const tileWidth = ctx.canvas.width / camera.zoom;
        const tileHeight = ctx.canvas.height / camera.zoom;

        let tileText = "";

        for(let x = startX + camera.zoom * 2 + 5; x > startX - 11; x--) {
            for (let y = startY - 5; y < startY + camera.zoom * 2 + 10; y++) {
                if (x > -1 && x < level.tiles.length && y > -1 && y < level.tiles[x].length) {
                    //reposition to line up for isometric
                    let tileX = (x - startX - camera.zoom) * tileWidth/2 + (y - startY ) * tileWidth/2;
                    let tileY = (y - startY) * (tileHeight - (TILE_HEIGHT_OFFSET_RATIO * tileHeight))/2 - (x - startX  - camera.zoom) * (tileHeight - (TILE_HEIGHT_OFFSET_RATIO * tileHeight))/2;
                    let tileBottomX = tileX + tileWidth;
                    let tileBottomY = tileY + tileHeight;

                    //only draw if it's in viewport, check by looking at each tile corner and verifying that at least one of them is in the viewport
                    if ((tileX > -1 && tileX < ctx.canvas.width && tileY > -1 && tileY < ctx.canvas.height) || 
                        (tileBottomX > -1 && tileBottomX < ctx.canvas.width && tileBottomY > -1 && tileBottomY < ctx.canvas.height) || 
                        (tileBottomX > -1 && tileBottomX < ctx.canvas.width && tileY > -1 && tileY < ctx.canvas.height) || 
                        (tileX > -1 && tileX < ctx.canvas.width && tileBottomY > -1 && tileBottomY < ctx.canvas.height)) {
                        if(level.tiles[x][y]) {
                            let isMouseInside = this.drawTile(ctx, level.tiles[x][y], Math.floor(tileX), Math.floor(tileY), tileWidth, tileHeight, mouseX, mouseY);
                            if (isMouseInside) {
                                this.mouseTileX = x;
                                this.mouseTileY = y;
                                tileText = `X: ${x} , Y: ${y}, Zoom: ${camera.zoom}`;
                            }
                        }
                        
                        if (level.tiles[x][y]?.levelObject) {
                            this.drawGameObject(ctx, level.tiles[x][y].levelObject, tileX, tileY, tileWidth, tileHeight);
                        } 
                    } 
                }
            }
        }
        
        ctx.putImageData(this.screenBuffer, 0, 0);
        ctx.fillStyle = "white";
        ctx.fillText(tileText, 20, 20);
    }

    drawTile(ctx, tile, tileX, tileY, tileWidth, tileHeight, mouseX, mouseY) {
        const frameBuffer = tile.activeAnimation.getFrameBuffer();
        let isMouseInside = false;

        for (let x = tileX; x < tileX + tileWidth; x++) {
            for (let y = tileY; y < tileY + tileHeight; y++) {
                if (x > -1 && x < ctx.canvas.width &&
                    y > -1 && y < ctx.canvas.height) {
                        let xTextureSample = Math.floor(((x - tileX) / tileWidth) * TILE_WIDTH);
                        let yTextureSample = Math.floor(((y - tileY) / tileHeight) * TILE_HEIGHT);
                        let textureSample = 4 * (yTextureSample * TILE_WIDTH + xTextureSample);
                        let bufferSample = 4 * (y * this.screenBuffer.width + x);
                        let textureBuffer = frameBuffer.data;
                        if (textureBuffer[textureSample + 3] === 255 && textureBuffer[textureSample] !== undefined) {
                            if (!isMouseInside && (4 * (mouseY * this.screenBuffer.width + mouseX)) === bufferSample) {
                                isMouseInside = true;
                            }
                            this.screenBuffer.data[bufferSample] = textureBuffer[textureSample];
                            this.screenBuffer.data[bufferSample + 1] = textureBuffer[textureSample + 1];
                            this.screenBuffer.data[bufferSample + 2] = textureBuffer[textureSample + 2];
                            this.screenBuffer.data[bufferSample + 3] = 255;
                        }
                        
                    }
            }
        }

        return isMouseInside;
    }

    drawGameObject(ctx, levelObject, tileX, tileY, tileWidth, tileHeight) {
        const frameBuffer = levelObject.activeAnimation.getFrameBuffer();
        //get scaled width/height
        let zoomWidth = Math.floor(frameBuffer.width * tileWidth / TILE_WIDTH);
        let zoomHeight = Math.floor(frameBuffer.width * tileHeight / TILE_HEIGHT); 

        let startX = Math.floor(tileX + tileWidth/2 - zoomWidth/2);
        let startY = Math.floor(tileY + tileHeight - zoomHeight);

        for (let x = startX; x < startX + zoomWidth; x++) {
            for (let y = startY; y < startY + zoomHeight; y++) {
                if (x > -1 && x < ctx.canvas.width &&
                    y > -1 && y < ctx.canvas.width) {
                        let xTextureSample = Math.floor(((x - startX) / zoomWidth) * frameBuffer.width);
                        let yTextureSample = Math.floor(((y - startY) / zoomHeight) * frameBuffer.height);
                        let textureSample = 4 * (yTextureSample * frameBuffer.width + xTextureSample);
                        let bufferSample = 4 * (y * this.screenBuffer.width + x);
                        let textureBuffer = frameBuffer.data;
                        if (textureBuffer[textureSample + 3] === 255 && textureBuffer[textureSample] !== undefined) {
                            this.screenBuffer.data[bufferSample] = textureBuffer[textureSample];
                            this.screenBuffer.data[bufferSample + 1] = textureBuffer[textureSample + 1];
                            this.screenBuffer.data[bufferSample + 2] = textureBuffer[textureSample + 2];
                            this.screenBuffer.data[bufferSample + 3] = 255;
                        }
                    }
            }
        }
    }
}