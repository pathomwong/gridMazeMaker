// Select color input
// Select size input

// When size is submitted by the user, call makeGrid()
let col = 0;
let row = 0;
let maze =[];
let goal;

let userPos = {'row':1,'col':1};
//cache element
const pixelCanvas = $('#pixelCanvas');
const sizePicker = $('#sizePicker');
const inputHeight = $('#inputHeight');
const inputWidth = $('#inputWidth');
const sloveMaze = $('#sloveMaze');

function makeGrid(row,col) {
// Your code goes here!
  pixelCanvas.empty();
  pixelCanvas.append(('<tr>'+('<td></td>').repeat(col)+'</tr>').repeat(row));
}

function initMaze(row,col){
   for(let i=0;i<row;i++){
     maze[i] =[];
     for(let j=0;j<col;j++){
       if(i === 0 || i === (row-1) || j === 0 || j === (col-1)){
         maze[i][j] = 0;
       }else{
         maze[i][j] = -1;
       }
     }
   }
   $('tr').css('background-color', 'black');
   //console.log(maze);
}

function mazeGenerator(sRow, sCol){
  let c = {'row': sRow,'col': sCol};//c=current

  let stack = [];
  let nList = []; //n = neighbour

  maze[c.row][c.col] = 1;//Make the initial cell the current cell and mark it as visited
  setPath(c.row,c.col);
  $("#pixelCanvas tr:eq("+c.row+") td:eq("+c.col+")").css('background-color',  '#f47442');
  //console.log(maze[c.row-1][c.col]);

  do{
    if(maze[(c.row-1)][c.col] === -1){
      if( maze[c.row-2][c.col] != 1 &&  maze[c.row-1][c.col-1] != 1 && maze[c.row-1][c.col+1] != 1)
        nList.push({'row':c.row-1,'col':c.col});
    }
    if(maze[c.row][c.col-1] === -1){
      if( maze[c.row][c.col-2] != 1 &&  maze[c.row-1][c.col-1] != 1 && maze[c.row+1][c.col-1] != 1)
        nList.push({'row':c.row,'col':c.col-1});
    }
    if(maze[c.row+1][c.col] === -1){
      if( maze[c.row+2][c.col] != 1 &&  maze[c.row+1][c.col-1] != 1 && maze[c.row+1][c.col+1] != 1)
        nList.push({'row':c.row+1,'col':c.col});
    }
    if(maze[c.row][c.col+1] === -1){
      if( maze[c.row][c.col+2] != 1 &&  maze[c.row-1][c.col+1] != 1 && maze[c.row+1][c.col+1] != 1)
        nList.push({'row':c.row,'col':c.col+1});
    }

    if(nList.length > 0){//If the current cell has any neighbours which have not been visited
      let n = nList[Math.floor(Math.random()*nList.length)];//Choose randomly one of the unvisited neighbours
      nList.length = 0;
      stack.push(c);
      c = n;//Make the chosen cell the current cell and mark it as visited
      setPath(c.row,c.col);
    }else{
      c = stack.pop();
    }
    if(!c){
      break;
    }
  }while(stack.length > 0 || stack != undefined);

}



function setPath(row,col){
  maze[row][col] =1;
  $("#pixelCanvas tr:eq("+row+") td:eq("+col+")").css('background-color',  '#fff');
}

function mazeSolver(sP,eP){
  let stack=[];
  let solution = [];
  let c = sP;//c=current
  maze[sP.row][sP.col] = 2;
  let wayNum = 0;
  do{
    if(JSON.stringify(c) == JSON.stringify(eP)){
      break;
    }
    if(maze[c.row-1][c.col] === 1)
        wayNum++;
    if(maze[c.row][c.col-1] === 1)
        wayNum++;
    if(maze[c.row+1][c.col] === 1)
        wayNum++;
    if(maze[c.row][c.col+1] === 1)
        wayNum++;

    if(wayNum > 1){
      stack.push(c);
    }
    //console.log(stack);
    if(maze[c.row-1][c.col] === 1){
      setSolution((c.row-1),c.col);
      c = {'row':c.row-1,'col':c.col};
      solution.push(c);
    }else if(maze[c.row][c.col-1] === 1){
      setSolution(c.row,(c.col-1));
      c = {'row':c.row,'col':c.col-1};
      solution.push(c);
    }else if(maze[c.row+1][c.col] === 1){
      setSolution((c.row+1),c.col);
      c = {'row':c.row+1,'col':c.col};
      solution.push(c);
    }else if(maze[c.row][c.col+1] === 1){
      setSolution(c.row,(c.col+1));
      c = {'row':c.row,'col':c.col+1};
      solution.push(c);
    }else{
      c = stack.pop();
      let index = solution.findIndex(function( obj ) {
                          return obj.row == c.row && obj.col == c.col;
                        });
      solution.length=index+1;
    }

    wayNum = 0;

    if(!c){
      break;
    }
  }while(stack.length > 0 || stack != undefined);

  for(let i=0;i<solution.length;i++){
      $("#pixelCanvas tr:eq("+solution[i].row+") td:eq("+solution[i].col+")").css('background-color',  '#f4e542');
  }
}

function setSolution(row,col){
  maze[row][col] = 2;
  //$("#pixelCanvas tr:eq("+row+") td:eq("+col+")").css('background-color',  '#4286f4');
}

function defineGoal(){
  for(let i=row-1;i > row-5;i--){
    for(let j=col-1;j > col-5;j--){
      if(maze[i][j] == 1){
        $("#pixelCanvas tr:eq("+i+") td:eq("+j+")").css('background-color',  '#25ea02');
        return {'row':i,'col':j}
      }
    }
  }
  return {'row':1,'col':1}
}

$(document).keydown(function(e) {
  if(JSON.stringify(userPos) != JSON.stringify(goal)){
    //e.preventDefault();
    var key_code=e.which||e.keyCode;
    switch(key_code){
      case 37: //left arrow key
        moveLeft();
        break;
      case 38: //Up arrow key
        moveUp();
        break;
      case 39: //right arrow key
        moveRight();
        break;
      case 40: //down arrow key
        moveDown();
        break;
    }
    if(JSON.stringify(userPos) == JSON.stringify(goal)){
        $( "#dialog" ).dialog();
    }
  }
});

function moveRight(){
  if(maze[userPos.row][userPos.col+1] == 1){
    $("#pixelCanvas tr:eq("+userPos.row+") td:eq("+userPos.col+")").css('background-color',  '#ffffff');
    $("#pixelCanvas tr:eq("+userPos.row+") td:eq("+(userPos.col+1)+")").css('background-color',  '#f47442');
    userPos.col = userPos.col+1;
  }
}

function moveLeft(){
  if(maze[userPos.row][userPos.col-1] == 1){
    $("#pixelCanvas tr:eq("+userPos.row+") td:eq("+userPos.col+")").css('background-color',  '#ffffff');
    $("#pixelCanvas tr:eq("+userPos.row+") td:eq("+(userPos.col-1)+")").css('background-color',  '#f47442');
    userPos.col = userPos.col-1;
  }
}

function moveDown(){
  if(maze[userPos.row+1][userPos.col] == 1){
    $("#pixelCanvas tr:eq("+userPos.row+") td:eq("+userPos.col+")").css('background-color',  '#ffffff');
    $("#pixelCanvas tr:eq("+(userPos.row+1)+") td:eq("+userPos.col+")").css('background-color',  '#f47442');
    userPos.row = userPos.row+1;
  }
}

function moveUp(){
  if(maze[userPos.row-1][userPos.col] == 1){
    $("#pixelCanvas tr:eq("+userPos.row+") td:eq("+userPos.col+")").css('background-color',  '#ffffff');
    $("#pixelCanvas tr:eq("+(userPos.row-1)+") td:eq("+userPos.col+")").css('background-color',  '#f47442');
    userPos.row = userPos.row-1;
  }
}

sizePicker.submit(function(event){
  event.preventDefault();
  //console.clear();
  col = inputWidth.val();
  row = inputHeight.val();
  makeGrid(row,col);
  initMaze(row,col);
  mazeGenerator(1, 1);
  goal = defineGoal();
  userPos = {'row':1,'col':1};
});

sloveMaze.click(function(){
  mazeSolver({'row':1,'col':1},goal);
  $("#pixelCanvas tr:eq("+goal.row+") td:eq("+goal.col+")").css('background-color',  '#25ea02');
});
