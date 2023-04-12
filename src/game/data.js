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
        const ctx = canvas.getContext('2d', {willReadFrequently: true});

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

        //tiles
        this.animations['empty'] = new Animation('empty', this.textures['empty'], 63, 38, 1, 0, false);
        this.animations['grass'] = new Animation('grass', this.textures['grass'], 63, 38, 1, 0, false);
        this.animations['grassflowers'] = new Animation('grassflowers', this.textures['grassflowers'], 63, 38, 2, 1000, true);
        this.animations['stone'] = new Animation('stone', this.textures['stone'], 63, 38, 1, 0, false);
        this.animations['water1'] = new Animation('water1', this.textures['water1'], 63, 38, 1, 0, false);
        this.animations['waterbubble'] = new Animation('waterbubble', this.textures['waterbubble'], 63, 38, 4, 1000, true);
        this.animations['sand1'] = new Animation('sand1', this.textures['sand1'], 63, 38, 1, 0, false);
        this.animations['sand2'] = new Animation('sand2', this.textures['sand2'], 63, 38, 1, 0, false);
        this.animations['sand3'] = new Animation('sand3', this.textures['sand3'], 63, 38, 1, 0, false);
        this.animations['sandgrassedge_ne'] = new Animation('sandgrassedge_ne', this.textures['sandgrassedge_ne'], 63, 38, 1, 0, false);
        this.animations['sandgrassedge_nw'] = new Animation('sandgrassedge_nw', this.textures['sandgrassedge_nw'], 63, 38, 1, 0, false);
        this.animations['sandgrassedge_se'] = new Animation('sandgrassedge_se', this.textures['sandgrassedge_se'], 63, 38, 1, 0, false);
        this.animations['sandgrassedge_sw'] = new Animation('sandgrassedge_sw', this.textures['sandgrassedge_sw'], 63, 38, 1, 0, false);
        this.animations['sandwateredge_ne'] = new Animation('sandwateredge_ne', this.textures['sandwateredge_ne'], 63, 38, 2, 2000, true);
        this.animations['sandwateredge_nw'] = new Animation('sandwateredge_nw', this.textures['sandwateredge_nw'], 63, 38, 2, 2000, true);
        this.animations['sandwateredge_se'] = new Animation('sandwateredge_se', this.textures['sandwateredge_se'], 63, 38, 2, 2000, true);
        this.animations['sandwateredge_sw'] = new Animation('sandwateredge_sw', this.textures['sandwateredge_sw'], 63, 38, 2, 2000, true);
        this.animations['sandwatercorner_n'] = new Animation('sandwatercorner_n', this.textures['sandwatercorner_n'], 63, 38, 2, 2000, true);
        this.animations['sandwatercorner_s'] = new Animation('sandwatercorner_s', this.textures['sandwatercorner_s'], 63, 38, 2, 2000, true);
        this.animations['sandwatercorner_e'] = new Animation('sandwatercorner_e', this.textures['sandwatercorner_e'], 63, 38, 2, 2000, true);
        this.animations['sandwatercorner_w'] = new Animation('sandwatercorner_w', this.textures['sandwatercorner_w'], 63, 38, 2, 2000, true);
        this.animations['sandwaterwedge_e'] = new Animation('sandwaterwedge_e', this.textures['sandwaterwedge_e'], 63, 38, 2, 2000, true);
        this.animations['sandwaterwedge_w'] = new Animation('sandwaterwedge_w', this.textures['sandwaterwedge_w'], 63, 38, 2, 2000, true);

        //objects
        this.animations['testobject'] = new Animation('testobject', this.textures['testobject'], 89, 100, 1, 0, false);
        this.animations['testwall'] = new Animation('testwall', this.textures['testwall'], 55, 70, 1, 0, false);
        this.animations['palmtree1'] = new Animation('palmtree1', this.textures['palmtree1'], 67, 157, 1, 0, false);
        this.animations['palmtree2'] = new Animation('palmtree2', this.textures['palmtree2'], 101, 143, 1, 0, false);
        this.animations['bush1'] = new Animation('bush1', this.textures['bush1'], 75, 47, 1, 0, false);
        this.animations['rock1'] = new Animation('rock1', this.textures['rock1'], 49, 55, 1, 0, false);
        this.animations['fern1'] = new Animation('fern1', this.textures['fern1'], 16, 51, 1, 0, false);
        this.animations['fern2'] = new Animation('fern2', this.textures['fern2'], 29, 31, 1, 0, false);
        this.animations['fern3'] = new Animation('fern3', this.textures['fern3'], 36, 51, 1, 0, false);
        this.animations['wave1'] = new Animation('wave1', this.textures['wave1'], 166, 19, 4, 2000, true);
        this.animations['kamehouse'] = new Animation('kamehouse', this.textures['kamehouse'], 192, 202, 1, 0, false);

        Object.keys(this.animations).forEach(key => { this.animations[key].start(); });
    }

    loadTiles() {
        this.tiles = {};
        this.tiles['empty'] = new Tile("Empty", this.animations['empty'], true);
        this.tiles['grass'] = new Tile("Grass", this.animations['grass'], true);
        this.tiles['grassflowers'] = new Tile("GrassFlowers", this.animations['grassflowers'], true);
        this.tiles['stone'] = new Tile("Stone", this.animations['stone'], true);
        this.tiles['water1'] = new Tile("Water1", this.animations['water1'], true);
        this.tiles['waterbubble'] = new Tile("WaterBubble", this.animations['waterbubble'], true);
        this.tiles['sand1'] = new Tile("Sand1", this.animations['sand1'], true);
        this.tiles['sand2'] = new Tile("Sand2", this.animations['sand2'], true);
        this.tiles['sand3'] = new Tile("Sand3", this.animations['sand3'], true);
        this.tiles['sandgrassedge_ne'] = new Tile("SandGrassEdge_NE", this.animations['sandgrassedge_ne'], true);
        this.tiles['sandgrassedge_se'] = new Tile("SandGrassEdge_SE", this.animations['sandgrassedge_se'], true);
        this.tiles['sandgrassedge_nw'] = new Tile("SandGrassEdge_NW", this.animations['sandgrassedge_nw'], true);
        this.tiles['sandgrassedge_sw'] = new Tile("SandGrassEdge_SW", this.animations['sandgrassedge_sw'], true);
        this.tiles['sandwateredge_ne'] = new Tile("SandWaterEdge_NE", this.animations['sandwateredge_ne'], true);
        this.tiles['sandwateredge_se'] = new Tile("SandWaterEdge_SE", this.animations['sandwateredge_se'], true);
        this.tiles['sandwateredge_nw'] = new Tile("SandWaterEdge_NW", this.animations['sandwateredge_nw'], true);
        this.tiles['sandwateredge_sw'] = new Tile("SandWaterEdge_SW", this.animations['sandwateredge_sw'], true);
        this.tiles['sandwatercorner_n'] = new Tile("SandWaterCorner_N", this.animations['sandwatercorner_n'], true);
        this.tiles['sandwatercorner_s'] = new Tile("SandWaterCorner_S", this.animations['sandwatercorner_s'], true);
        this.tiles['sandwatercorner_w'] = new Tile("SandWaterCorner_W", this.animations['sandwatercorner_w'], true);
        this.tiles['sandwatercorner_e'] = new Tile("SandWaterCorner_E", this.animations['sandwatercorner_e'], true);
        this.tiles['sandwaterwedge_w'] = new Tile("SandWaterWedge_W", this.animations['sandwaterwedge_w'], true);
        this.tiles['sandwaterwedge_e'] = new Tile("SandWaterWedge_E", this.animations['sandwaterwedge_e'], true);
    }

    loadLevelObjects() {
        this.levelObjects = {};
        this.levelObjects['testobject'] = new LevelObject("TestObject", this.animations['testobject']);
        this.levelObjects['testwall'] = new LevelObject("TestWall", this.animations['testwall']);
        this.levelObjects['palmtree1'] = new LevelObject("PalmTree1", this.animations['palmtree1']);
        this.levelObjects['palmtree2'] = new LevelObject("PalmTree2", this.animations['palmtree2']);
        this.levelObjects['bush1'] = new LevelObject("Bush1", this.animations['bush1']);
        this.levelObjects['rock1'] = new LevelObject("Rock1", this.animations['rock1']);
        this.levelObjects['wave1'] = new LevelObject("Wave1", this.animations['wave1']);
        this.levelObjects['fern1'] = new LevelObject("Fern1", this.animations['fern1']);
        this.levelObjects['fern2'] = new LevelObject("Fern2", this.animations['fern2']);
        this.levelObjects['fern3'] = new LevelObject("Fern3", this.animations['fern3']);
        this.levelObjects['kamehouse'] = new LevelObject("KameHouse", this.animations['kamehouse']);
    }
}