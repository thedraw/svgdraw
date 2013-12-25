var s = Snap('#s');
var thePath = s.path("M 100,100 L 125,50 L 150,100 Z").attr({stroke:'#f00','stroke-width':10,'stroke-linecap':'round', 'stroke-linejoin':'round','fill-opacity':0});

// next step to be able to add curves!!!!

getClosestPointIndex = function(mouseX, mouseY, paths){  
    var smallestDistance = 0,
        smallestIndex = 0,
        accuracy = 30;
        
    for(var i=0;i<paths.length;i++){
        // will have to think about curve formats and shit, but only 
        // think about lines for now
        
        var dx = Math.abs(mouseX - paths[i][1]);
        var dy = Math.abs(mouseY - paths[i][2]);
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
    
    if(smallestDistance < accuracy){
        return smallestIndex;
    }else{
        return -1;
    }
}

onmove = function(dx,dy,x,y){    
    if(this.thePointIndex >= 0){
        this.pathArray[this.thePointIndex][1] = x;
        this.pathArray[this.thePointIndex][2] = y;
        this.attr({path:this.pathArray});
    }
}

onstart = function(x,y,e){
    this.pathString = this.attr('path');
    this.pathArray = Snap.parsePathString(this.pathString);
    this.thePointIndex = getClosestPointIndex(x, y, this.pathArray);
}

onend = function(x,y){
    //debugger;
}   

thePath.drag(onmove, onstart, null);