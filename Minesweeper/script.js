function RandInt(max) {
    //inclusive
    return Math.floor(Math.random()*max+1);
}

function Shuffle(a) {
    for (let i=a.length-1;i>0;i--) {
        let r = RandInt(i);
        let e = a[i];
        a[i] = a[r];
        a[r] = e;
    }
}

const CompassDirections = [
    [0,1],
    [1,1],
    [1,0],
    [1,-1],
    [0,-1],
    [-1,-1],
    [-1,0],
    [-1,1],
]

class Tile {
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
    
}

function LoadBoard(width,height,mineAmmount) {
    let tiles = Array.from(Array(height), () => new Array(width));
    let mines = new Array(width*height).fill(false).fill(true, 0, mineAmmount);
    let flags = mineAmmount;
    Shuffle(mines);

    let board = document.getElementById("board");
    const tileTemplate = document.getElementById("tiletemplate");
    let root = document.querySelector(":root");
    
    board.innerHTML = "";
    root.style.setProperty("--boardWidth",width);
    root.style.setProperty("--boardHeight",height);

    //initialise
    for (let i = 0; i < width*height; i++) {
        let element = tileTemplate.content.firstElementChild.cloneNode(true);
        board.appendChild(element);
        
        let x = i % (width);
        let y = Math.floor(i/width);
        
        let tile = new Tile(element,x,y)
        tiles[y][x] = tile;
    }
    
    tiles.flat().map((element,i)=>{
        element.IsMine = mines[i];
    })
    
    tiles.flat().map((element,i)=>{
        CompassDirections.forEach(vector=>{
            let x = i % (width) + vector[0];
            let y = Math.floor(i/width) + vector[1];
            
            if ((x >= 0 && x < width) && (y >= 0 && y < height)) {
                element.AddNeighbour(tiles[y][x]);
            }
        })
    })

    
    
    
    document.getElementById("menu").style.display = "none";

}

// document.addEventListener("DOMContentLoaded", ()=>{
//     //let cells = document.querySelectorAll(".grid-item");
// });



