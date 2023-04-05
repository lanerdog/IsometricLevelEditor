export class LevelObject {
    constructor(name, animation) {
        this.name = name;
        this.activeAnimation = animation;
    }

    copy() {
        return new LevelObject(this.name, this.activeAnimation);
    }
}