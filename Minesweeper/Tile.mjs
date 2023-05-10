export default class Tile {
    #heat = 0;
    #isRevealed = false;
    #isFlagged = false;
    #isMine = false;
    #neighbours = [];

    constructor(element,x,y) {
        this.element = element;
        this.x = x;
        this.y = y;
        element.addEventListener('contextmenu', event => event.preventDefault());
        element.addEventListener("mousedown", this.onClick.bind(this));
    }

    get Neighbours() {return this.#neighbours}
    AddNeighbour(tile) {
        this.#neighbours.push(tile)
        if (tile.IsMine) {
            this.#heat++;
            this.element.innerHTML++;
        }
    }

    get IsRevealed() {return this.#isRevealed;}
    set IsRevealed(value) {
        this.#isRevealed = value;
        value ? this.element.classList.add("Revealed"): this.element.classList.remove("Revealed");
    }

    get IsFlagged() {return this.#isFlagged;}
    set IsFlagged(value) {
        this.#isFlagged = value;
        value ? this.element.classList.add("Flagged"): this.element.classList.remove("Flagged");
    }
    
    get IsMine() {return this.#isMine;}
    set IsMine(value) {
        this.#isMine = value;
        value ? this.element.classList.add("Mine"): this.element.classList.remove("Mine");
    }

    clearZeroTiles() {
        if (this.#isFlagged) {return;}

        if (this.#heat != 0 || this.#isRevealed) {
            this.IsRevealed = true;
            return;
        }
        
        this.IsRevealed = true;

        this.#neighbours.forEach(neighbour =>{
            neighbour.clearZeroTiles();
            // setTimeout(neighbour.clearZeroTiles.bind(neighbour),100)
        })
        
    }

    onClick(ev) {
        // ev.shiftKey to detect for shift :)
        switch(ev.button) {
            case 0: //left mouse
                if (this.#isFlagged || this.#isRevealed) {
                    break;
                }
                this.clearZeroTiles()
                break;
            case 2: //right mouse
                if (this.#isRevealed) {
                    break;
                }
                
                this.IsFlagged = !this.#isFlagged;
                break;
        }
        
    }
    
};