export class Tile {
    constructor(name, animation, passable, levelObject = undefined) {
        this.name = name;
        this.activeAnimation = animation;
        this.passable = passable;
        this.levelObject = levelObject;
    }

    copy() {
        return new Tile(this.name, this.activeAnimation, this.passable, this.levelObject?.copy());
    }
}