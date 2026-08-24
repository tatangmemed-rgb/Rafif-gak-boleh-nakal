let mode='ai', size=3, board=[], current='X', gameOver=false;

function chooseMode(m){
  mode=m;
  document.querySelectorAll('.big-btn').forEach(b=>b.style.outline='none');
  event.currentTarget.style.outline='3px solid #f39c12';
}
function chooseSize(n){
  size=n;
  document.querySelectorAll('.size').forEach(b=>b.classList.toggle('selected',b.textContent.includes(n+' × '+n)));
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
  current='X'; gameOver=false;
  renderBoard(); updateStatus();
}
function renderBoard(){
  const el=document.getElementById('board');
  el.style.gridTemplateColumns=`repeat(${size},1fr)`;
  el.innerHTML='';
  const font=Math.max(22,Math.min(54,270/size));
  board.forEach((v,i)=>{
    const c=document.createElement('button');
    c.className='cell '+(v==='X'?'x':v==='O'?'o':'');
    c.style.fontSize=font+'px';
    c.textContent=v==='X'?'❌':v==='O'?'⭕':'';
    c.onclick=()=>move(i);
    el.appendChild(c);
  });
}
function updateStatus(){
  const who=current==='X'?(mode==='ai'?'Giliran Kamu: ❌':'Giliran Player 1: ❌'):(mode==='ai'?'Giliran Komputer: ⭕':'Giliran Player 2: ⭕');
  document.getElementById('status').textContent=who;
}
function move(i){
  if(gameOver||board[i]|| (mode==='ai'&&current==='O'))return;
  place(i,current);
  if(!finishCheck()){
    current=current==='X'?'O':'X'; updateStatus();
    if(mode==='ai'&&current==='O')setTimeout(computerMove,380);
  }
}
function place(i,p){board[i]=p;renderBoard();}
function computerMove(){
  if(gameOver)return;
  const empty=board.map((v,i)=>v?null:i).filter(v=>v!==null);
  if(!empty.length)return;
  // Coba menang, lalu blokir lawan.
  let pick=findWinningMove('O');
  if(pick===null)pick=findWinningMove('X');
  if(pick===null)pick=empty[Math.floor(Math.random()*empty.length)];
  place(pick,'O');
  if(!finishCheck()){current='X';updateStatus();}
}
function findWinningMove(p){
  const empty=board.map((v,i)=>v?null:i).filter(v=>v!==null);
  for(const i of empty){board[i]=p;const w=getWinner();board[i]='';if(w===p)return i;}
  return null;
}
function getWinner(){
  const dirs=[[0,1],[1,0],[1,1],[1,-1]];
  // Untuk semua ukuran, kemenangan bila memenuhi satu baris penuh sebesar ukuran papan.
  for(let r=0;r<size;r++)for(let c=0;c<size;c++){
    const p=board[r*size+c]; if(!p)continue;
    for(const [dr,dc] of dirs){
      let ok=true, cells=[];
      for(let k=0;k<size;k++){
        const rr=r+dr*k,cc=c+dc*k;
        if(rr<0||rr>=size||cc<0||cc>=size||board[rr*size+cc]!==p){ok=false;break;}
        cells.push(rr*size+cc);
      }
      if(ok)return p;
    }
  }
  return null;
}
function finishCheck(){
  const winner=getWinner();
  if(winner){gameOver=true;showResult(winner);return true;}
  if(board.every(Boolean)){gameOver=true;showDraw();return true;}
  return false;
}
function showResult(w){
  const aiWin=mode==='ai'&&w==='O';
  const title=aiWin?'KAMU KALAH 😭':'MENANG! 🥳';
  document.getElementById('resultEmoji').textContent=aiWin?'😭😢':'🥳😊';
  document.getElementById('resultTitle').textContent=title;
  document.getElementById('resultText').textContent=aiWin?'Jangan sedih, coba lagi ya! 😄':(mode==='ai'?'Hebat! Kamu berhasil mengalahkan komputer! 😄':'Selamat! '+(w==='X'?'Player 1':'Player 2')+' menang! 😊');
  document.getElementById('resultModal').classList.add('show');
}
function showDraw(){
  document.getElementById('resultEmoji').textContent='🤝😄';
  document.getElementById('resultTitle').textContent='SERI!';
  document.getElementById('resultText').textContent='Hebat! Tidak ada yang kalah.';
  document.getElementById('resultModal').classList.add('show');
}
function goMenu(){
  document.getElementById('resultModal').classList.remove('show');
  document.getElementById('gameScreen').classList.remove('active');
  document.getElementById('menuScreen').classList.add('active');
}
