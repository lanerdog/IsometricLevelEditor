export class Level {
    constructor(tiles) {
        this.tiles = tiles;
    }

    copy() {
        const copy = [];
        for(let x = 0; x < this.tiles.length; x++) {
            copy.push([]);
            for(let y = 0; y < this.tiles[x].length; y++) {
                copy[x].push(this.tiles[x][y].copy());
            }
        }

        return new Level(copy);
    }
}