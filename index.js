const GRID_WIDTH = 18, GRID_HEIGHT = 18;
let isFinished = true, isStartSelected = false, isEndSelected = false, isReady = true;
let graph = [], start, end;
function initialize(){
    for(let i=0; i<GRID_HEIGHT; i++){
        let temp = [];
        for(let j=0; j<GRID_WIDTH; j++){
            temp[j] = {label: Infinity, prev: null};
            let tile = document.createElement("div");
            tile.classList.add("tile");
            tile.onclick = select;
            tile.id = j.toString() + "-" + i.toString();
            document.getElementById("board").appendChild(tile);
        }
        graph.push(temp);
    }
    document.getElementById("text").innerText = "Select a cell to add the source.";
}
function select(e){
    const cell = e.srcElement.id;
    if(!cell)
        return;
    const mid = cell.indexOf("-"), fst = Number(cell.slice(0, mid)), snd = Number(cell.slice(mid+1, cell.length));
    if(!isStartSelected){
        start = [fst, snd];
        graph[start[0]][start[1]].label = 0;
        getById(start[0], start[1]).style.backgroundColor = "green";
        isStartSelected = true;
        document.getElementById("text").innerText = "Select a cell to add the destination.";
        document.getElementById("randomize").innerText = "Generate random destination";
    }else if(!isEndSelected){
        end = [fst, snd];
        getById(end[0], end[1]).style.backgroundColor = "red";
        isEndSelected = true;
        document.getElementById("text").innerText = "Select a cell to add a wall.";
        document.getElementById("randomize").innerText = "Generate random walls";
    }else{
        if(!isFinished || !isReady)
            return;
        const wall = [fst, snd];
        if((wall[0] == start[0] && wall[1] == start[1]) || (wall[0] == end[0] && wall[1] == end[1]))
            return;
        getById(wall[0], wall[1]).style.backgroundColor = (getById(wall[0], wall[1]).style.backgroundColor == "darkgray")?getById(wall[0], wall[1]).style.backgroundColor = "white": getById(wall[0], wall[1]).style.backgroundColor = "darkgray";
    }
}
function reload(){
    if(!isFinished)
        return;
    for(let i=0; i<GRID_HEIGHT; i++){
        for(let j=0; j<GRID_WIDTH; j++){
            graph[i][j].label = Infinity;
            graph[i][j].prev = null;
            getById(i, j).style.backgroundColor = "white";
        }
    }
    isStartSelected = false;
    isEndSelected = false;
    document.getElementById("text").innerText = "Select a cell to add the source.";
    document.getElementById("randomize").innerText = "Generate random source";
    isReady = true;
}
function randomize(){
    if(!isStartSelected){
        start = [generate(), generate()];
        graph[start[0]][start[1]].label = 0;
        getById(start[0], start[1]).style.backgroundColor = "green";
        isStartSelected = true;
        document.getElementById("randomize").innerText = "Generate random destination";
    }else if(!isEndSelected){
        end = [generate(), generate()];
        getById(end[0], end[1]).style.backgroundColor = "red";
        isEndSelected = true;
        document.getElementById("randomize").innerText = "Generate random walls";
    }else{
        if(!isFinished || !isReady)
            return;
        for(let i=0; i<GRID_HEIGHT; i++){
            for(let j=0; j<GRID_WIDTH; j++){
                if((j == start[0] && i == start[1]) || (j == end[0] && i == end[1]))
                    continue;
                if(Math.floor(Math.random()*3) == 0)
                    getById(j, i).style.backgroundColor = "darkgray";
                else
                    getById(j, i).style.backgroundColor = "white";
            }
        }
    }
}
function generate(){
    return Math.floor(Math.random()*GRID_WIDTH);
}
function spt(type){
    if(!isFinished || !isStartSelected || !isEndSelected || !isReady)
        return;
    isReady = false;
    isFinished = false;
    document.getElementById("text").innerText = "Looking for the path...";
    if(type == "bidirectionalDijkstra"){
        const steps = bidirectionalDijkstra();
        let result = true;
        if(steps[steps.length-1] == -1){
            result = false;
            steps.pop();
        }
        document.getElementById("text").innerText = "Looking for the path...";
        animateDijkstra(steps, result);
    }else if(type == "dijkstra"){
        const steps = dijkstra();
        const found = steps.length?steps.pop():[-1, -1];
        const result = start[0] == found[0] && start[1] == found[1];
        animateDijkstra(steps, result);
    }else if(type == "sptStack"){
        const steps = sptStack();
        const found = steps.length?steps.pop():[-1, -1];
        const result = start[0] == found[0] && start[1] == found[1];
        animateSPTStack(steps, result);
    }
}
function getById(x, y){
    return document.getElementById(x+"-"+y);
}
window.onload = function(){
    initialize();
}