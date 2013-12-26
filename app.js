var s = Snap('#s');
var thePath = s.path("M 100,100 L 125,50 L 150,100 Z").attr({stroke:'#f00','stroke-width':10,'stroke-linecap':'round', 'stroke-linejoin':'round','fill-opacity':0});

// next step to be able to add curves!!!!

// will need helper function to update various types of paths

pathObj = function(path){
    // add more cases later
    var pathObject = {};
    switch(path[0]){
        case 'M':
            pathObject.type = "M";
            pathObject.x = path[1];
            pathObject.y = path[2];
            break;
        case 'L':
            pathObject.type = "L";
            pathObject.x = path[1];
            pathObject.y = path[2];
            break;
        case 'C': 
            pathObject.type = "C";
            pathObject.x1 = path[1];
            pathObject.y1 = path[2];
            pathObject.x2 = path[3];
            pathObject.y2 = path[4];
            pathObject.x = path[5];
            pathObject.y = path[6];
            break;
        case 'Z':
            // hope this doesn't fuck up shit too much
            pathObject.type = "Z";
            path.x = NaN;
            path.y = NaN;
            break;
    }
    return pathObject;
}

getClosestPointInfo = function(mouseX, mouseY, paths){  
    var smallestDistance = 0,
        smallestIndex = 0;
        
    for(var i=0;i<paths.length;i++){
        // will have to think about curve formats and shit, but only 
        // think about lines for now
        var thePath = pathObj(paths[i]);
        var dx = Math.abs(mouseX - thePath.x);
        var dy = Math.abs(mouseY - thePath.y);
        var length =  dx + dy;
         
        if(i==0){
            smallestDistance = length;
            smallestIndex = i;
        }
        
        if(length < smallestDistance){
            smallestDistance = length;
            smallestIndex = i;
        }
    }
    
    return {index : smallestIndex, length: smallestDistance};
}

onmove = function(dx,dy,x,y){    
    // move the point or curve the line
    if(this.thePointInfo.length < this.accuracy){
        // need to move this into its own nice function
        switch(this.pathArray[this.thePointInfo.index][0]){
            case 'M':
            case 'L':
                this.pathArray[this.thePointInfo.index][1] = x;
                this.pathArray[this.thePointInfo.index][2] = y;
                break;  
            case 'C':
                this.pathArray[this.thePointInfo.index][5] = x;
                this.pathArray[this.thePointInfo.index][6] = y;
                break;                
        }
    }else{
        // convert the line we are dragging to cubic
        // need a more reliable way of converting the line we are dragging into cubic - point no worky
        var newCubic = Snap.path.toCubic(this.pathArray[this.thePointInfo.index]);
        
        newCubic[0][1] = x;
        newCubic[0][2] = y;
        newCubic[0][3] = x;
        newCubic[0][4] = y;
        this.pathArray[this.thePointInfo.index] = newCubic[0];
    }
    
    this.attr({path:this.pathArray});
}

onstart = function(x,y,e){
    this.pathString = this.attr('path');
    this.pathArray = Snap.parsePathString(this.pathString);
    this.thePointInfo = getClosestPointInfo(x, y, this.pathArray);
    this.accuracy = 30;
}

onend = function(x,y){
    //debugger;
}   

thePath.drag(onmove, onstart, null);