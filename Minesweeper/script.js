import Tile from "./Tile.mjs";

function RandInt(max) {
    //inclusive
    return Math.floor(Math.random()*max+1);
}

function Shuffle(a) {
    for (let i=a.length-1;i>0;i--) {
        let r = RandInt(i);
        [a[i],a[r]] = [a[r],a[i]]
    }
}

function WrapIndex(index,width) {
    let x = index % (width);
    let y = Math.floor(index/width);
    return [x,y];
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
        
        let [x,y] = WrapIndex(i,width)
        
        let tile = new Tile(element,x,y)
        element.addEventListener('contextmenu', event => event.preventDefault());
        element.addEventListener("mousedown", tile.onClick.bind(tile));
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

document.getElementById("playbutton").addEventListener("click",()=>{
    LoadBoard(parseInt(document.getElementById("width").value),parseInt(document.getElementById("height").value),parseInt(document.getElementById("mines").value))
})



