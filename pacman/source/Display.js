/**
 * The Game Display
 */
class Display {
    
    /**
     * The Game Display constructor
     * @param {function} callback
     */
    constructor(callback) {
        this.container = document.querySelector("#container");
        this.display   = "mainScreen";
        this.callback  = callback;
    }

    /**
     * Gets the Game Display
     * @return {string}
     */
    get() {
        return this.display;
    }

    /**
     * Sets the Game Display
     * @param {string} display
     * @return {Display}
     */
    set(display) {
        this.display = display;
        return this;
    }

    /**
     * Adds the class to the design to show the Display
     */
    show() {
        this.container.className = this.display;
        this.callback();
    }

}