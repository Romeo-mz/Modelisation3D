
class Gui {
    constructor() {
        this.gui = new dat.GUI();
        this.gui.add(this, 'reset')
    }

    reset() {
        console.log('reset')
        window.location.reload();
    }

    addFolder(name) {
        return this.gui.addFolder(name)
    }

    addColor(object, property) {
        return this.gui.addColor(object, property)
    }

    add(object, property) {
        return this.gui.add(object, property)
    }

}

window.Gui = Gui;