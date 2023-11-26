function dijkstra(){
    const steps = [];
    let queue = [start];
    while(queue.length > 0){
        queue.sort(compare); //for the nature of the struct, its not necessary, but the idea of dijkstra is to sort
        let current = queue.shift();
        steps.push([current[0], current[1], "lightblue"]);
        relax(current, queue, steps);
        if(current[0] == end[0] && current[1] == end[1]){
            break;
        }
    }
    emptyQueue(queue, steps);
    reconstruct(end, steps);
    return steps;
}
function isInside(next, cond){
    return next[0] >= 0 && next[0] < cond && next[1] >= 0 && next[1] <cond;
}
function bellman(next, current){
    return graph[next[0]][next[1]].label > graph[current[0]][current[1]].label+1;
}
function isWall(x, y){
    return getById(x,y).style.backgroundColor == "darkgray";
}
function reconstruct(x, steps){
    if(x == null)
        return;
    steps.push([x[0], x[1], "yellow"]);
    x = graph[x[0]][x[1]].prev;
    reconstruct(x, steps);
}
function compare(x, y){
    return graph[x[0]][x[1]].label - graph[y[0]][y[1]].label;
}
function sptStack(){
    const steps = [];
    let queue = [start];
    while(queue.length > 0){
        let current = queue.pop();
        steps.push([current[0], current[1], "lightblue"]);
        relax(current, queue, steps);
    }
    reconstruct(end, steps);
    steps.shift();
    return steps;
}
function animateSPTStack(steps, result){
    if(steps.length==0){
        isFinished = true;
        if(result)
            document.getElementById("text").innerText = "Found!";
        else
            document.getElementById("text").innerText = "The destination is unreachable.";
        return;
    }
    let tmp = steps.shift();
    while((steps.length > 1 && getById(tmp[0],tmp[1]).style.backgroundColor == tmp[2]) || (getById(tmp[0],tmp[1]).style.backgroundColor == "lightblue" && tmp[2] == "blue"))
        tmp = steps.shift();
    if(tmp[0] != end[0] || tmp[1] != end[1])
        getById(tmp[0],tmp[1]).style.backgroundColor = tmp[2];
    setTimeout(() => {
        animateSPTStack(steps, result);
    }, 1);
}
function bidirectionalDijkstra(){
    const steps = [];
    let queueStart = [start], queueEnd = [end];
    let mid;
    graph[end[0]][end[1]].label = 0;
    while(queueStart.length > 0 && queueEnd.length > 0){
        queueStart.sort(compare);
        queueEnd.sort(compare);
        let currentStart = queueStart.shift();
        steps.push([currentStart[0], currentStart[1], "lightblue"]);
        mid = relax(currentStart, queueStart, steps, "blue", queueEnd);
        if(mid){
            break;
        }
        let currentEnd = queueEnd.shift();
        steps.push([currentEnd[0], currentEnd[1], "lightpink"]);
        mid = relax(currentEnd, queueEnd, steps, "orange", queueStart);
        if(mid){
            break;
        }
    }
    emptyQueue(queueStart, steps, "lightblue");
    emptyQueue(queueEnd, steps, "lightpink");
    if(mid)
        reconstructFrom(mid, steps);
    else{
        reconstruct(start, steps);
        reconstruct(end, steps);
        steps.push(-1);
    }
    return steps;
}
function relax(current, queue, steps, color, enemy = []){
    let right = [current[0]+1, current[1]];
    let left = [current[0]-1, current[1]];
    let up = [current[0], current[1]+1];
    let down = [current[0], current[1]-1];
    let directions = [right, left, up, down];
    let newLabel = graph[current[0]][current[1]].label+1;
    for(let i=0; i<4; i++){
        if(find(enemy, directions[i])){
            return [directions[i], current];
        }
        doRelax(directions[i], current, newLabel, queue, steps, GRID_WIDTH, color);
    }
}
function find(enemy, direction){
    for(let i of enemy){
        if(i[0] == direction[0] && i[1] == direction[1])
            return true;
    }
    return false
}
function doRelax(next, current, newLabel, queue, steps, cond, color = "blue"){
    if(isInside(next, cond) && bellman(next, current) && !isWall(next[0], next[1])){
        graph[next[0]][next[1]].label = newLabel;
        graph[next[0]][next[1]].prev = current;
        steps.push([...next, color]);
        queue.push(next);
    }
}
function emptyQueue(q, steps, color = "lightblue"){
    if(q.length == 0)
        return;
    let x = q.shift();
    steps.push([x[0], x[1], color]);
    emptyQueue(q, steps, color);
}
function reconstructFrom(mid, steps){
    reconstruct(mid[0], steps);
    reconstruct(mid[1], steps);
}
function animateDijkstra(steps, result){
    if(steps.length==0){
        isFinished = true;
        if(result)
            document.getElementById("text").innerText = "Found!";
        else
            document.getElementById("text").innerText = "The destination is unreachable.";
        return;
    }
    let tmp = steps.shift();
    if((tmp[0] != end[0] || tmp[1] != end[1]) && (tmp[0] != start[0] || tmp[1] != start[1]))
        getById(tmp[0],tmp[1]).style.backgroundColor = tmp[2];
    setTimeout(() => {
        animateDijkstra(steps, result);
    }, 5);
}
function compare(x, y){
    return graph[x[0]][x[1]].label - graph[y[0]][y[1]].label;
}