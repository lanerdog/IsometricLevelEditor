import { Animation } from './animation';
import { LevelObject } from './level-object';
import { Tile } from './tile';

export class Data {
    constructor() {

    }

    load() {
        this.loadTextures();
        this.loadAnimations();
        this.loadTiles();
        this.loadLevelObjects();
    }

    loadTextures() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const textures = document.getElementById('textures');

        this.textures = {};

        for (let i = 0; i < textures.childElementCount; i++) {
            let img = textures.children[i];
            let imgName = img.src.split('\\').pop().split('/').pop().split('.')[0];
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            let imgData = ctx.getImageData(0, 0, img.width, img.height);
            this.textures[imgName] = imgData;
        }
    }

    loadAnimations() {
        this.animations = {};
        this.animations['empty'] = new Animation('empty', this.textures['empty'], 63, 38, 1, 0, false);
        this.animations['test'] = new Animation('test', this.textures['test'], 63, 38, 1, 0, false);
        this.animations['stone'] = new Animation('stone', this.textures['stone'], 63, 38, 1, 0, false);
        this.animations['testobject'] = new Animation('testobject', this.textures['testObject'], 89, 100, 1, 0, false);
        this.animations['testwall'] = new Animation('testwall', this.textures['testWall'], 55, 70, 1, 0, false);
    }

    loadTiles() {
        this.tiles = {};
        this.tiles['empty'] = new Tile("Empty", this.animations['empty'], true);
        this.tiles['test'] = new Tile("Test", this.animations['test'], true);
        this.tiles['stone'] = new Tile("Stone", this.animations['stone'], true);
    }

    loadLevelObjects() {
        this.levelObjects = {};
        this.levelObjects['testobject'] = new LevelObject("TestObject", this.animations['testobject']);
        this.levelObjects['testwall'] = new LevelObject("Wall", this.animations['testwall']);
    }
}