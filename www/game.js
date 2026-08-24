let mode='ai', size=3, board=[], current='X', gameOver=false, winningCells=[];

function chooseMode(m){
  mode=m;
  document.querySelectorAll('.big-btn').forEach(b=>b.classList.remove('selected-mode'));
  document.getElementById(m==='ai'?'modeAi':'modeTwo').classList.add('selected-mode');
}
function chooseSize(n){
  size=n;
  document.querySelectorAll('.size').forEach(b=>b.classList.toggle('selected',Number(b.dataset.size)===n));
}
function startGame(){
  document.getElementById('menuScreen').classList.remove('active');
  document.getElementById('gameScreen').classList.add('active');
  document.getElementById('xName').textContent=mode==='ai'?'Kamu':'Player 1';
  document.getElementById('oName').textContent=mode==='ai'?'Komputer':'Player 2';
  restartGame();
}
function restartGame(){
  document.getElementById('resultModal').classList.remove('show');
  board=Array(size*size).fill('');
  current='X'; gameOver=false; winningCells=[];
  renderBoard(); updateStatus();
}
function renderBoard(){
  const el=document.getElementById('board');
  el.style.gridTemplateColumns=`repeat(${size},1fr)`;
  el.innerHTML='';
  const font=Math.max(24,Math.min(64,250/size));
  board.forEach((v,i)=>{
    const c=document.createElement('button');
    c.className='cell'+(v==='X'?' x':v==='O'?' o':'')+(winningCells.includes(i)?' win':'');
    c.style.fontSize=font+'px';
    c.textContent=v;
    c.onclick=()=>move(i);
    el.appendChild(c);
  });
}
function updateStatus(){
  const name=current==='X'?(mode==='ai'?'Giliran Kamu':'Giliran Player 1'):(mode==='ai'?'Giliran Komputer':'Giliran Player 2');
  document.getElementById('status').innerHTML=`${name}: <span class="mark ${current==='X'?'mark-x':'mark-o'}">${current}</span>`;
}
function move(i){
  if(gameOver||board[i]||(mode==='ai'&&current==='O'))return;
  place(i,current);
  if(finishCheck())return;
  current=current==='X'?'O':'X'; updateStatus();
  if(mode==='ai'&&current==='O')setTimeout(computerMove,350);
}
function place(i,p){board[i]=p;renderBoard();}
function emptyCells(){return board.map((v,i)=>v?null:i).filter(i=>i!==null);}
function computerMove(){
  if(gameOver)return;
  const empty=emptyCells(); if(!empty.length)return;
  let pick=findWinningMove('O');
  if(pick===null)pick=findWinningMove('X');
  if(pick===null){
    const center=Math.floor(size/2)*size+Math.floor(size/2);
    if(!board[center])pick=center;
  }
  if(pick===null)pick=empty[Math.floor(Math.random()*empty.length)];
  place(pick,'O');
  if(finishCheck())return;
  current='X'; updateStatus();
}
function findWinningMove(p){
  for(const i of emptyCells()){
    board[i]=p; const result=getWinner(); board[i]='';
    if(result&&result.player===p)return i;
  }
  return null;
}
function getWinner(){
  const lines=[];
  for(let r=0;r<size;r++)lines.push(Array.from({length:size},(_,c)=>r*size+c));
  for(let c=0;c<size;c++)lines.push(Array.from({length:size},(_,r)=>r*size+c));
  lines.push(Array.from({length:size},(_,i)=>i*size+i));
  lines.push(Array.from({length:size},(_,i)=>i*size+(size-1-i)));
  for(const cells of lines){
    const p=board[cells[0]];
    if(p&&cells.every(i=>board[i]===p))return {player:p,cells};
  }
  return null;
}
function finishCheck(){
  const result=getWinner();
  if(result){
    gameOver=true; winningCells=result.cells; renderBoard();
    setTimeout(()=>showResult(result.player),250); return true;
  }
  if(board.every(Boolean)){gameOver=true;setTimeout(showDraw,250);return true;}
  return false;
}
function showResult(w){
  const aiLoss=mode==='ai'&&w==='O';
  const winner=w==='X'?(mode==='ai'?'KAMU':'PLAYER 1'):(mode==='ai'?'KOMPUTER':'PLAYER 2');
  document.getElementById('resultEmoji').textContent=aiLoss?'😭😢':'🥳😊';
  document.getElementById('resultTitle').textContent=aiLoss?'KAMU KALAH!':'MENANG!';
  document.getElementById('resultText').textContent=aiLoss?'Komputer menang. Jangan sedih, coba lagi ya! 😄':`Selamat! ${winner} menang!`;
  document.getElementById('resultModal').classList.add('show');
}
function showDraw(){
  document.getElementById('resultEmoji').textContent='🤝😄';
  document.getElementById('resultTitle').textContent='SERI!';
  document.getElementById('resultText').textContent='Tidak ada yang kalah. Main lagi yuk!';
  document.getElementById('resultModal').classList.add('show');
}
function goMenu(){
  document.getElementById('resultModal').classList.remove('show');
  document.getElementById('gameScreen').classList.remove('active');
  document.getElementById('menuScreen').classList.add('active');
}
