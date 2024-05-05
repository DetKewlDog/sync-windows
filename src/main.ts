import './style.css';

type MouseOutEvent = MouseEvent & { toElement: unknown };

let w: number = 0;
let h: number = 0;
let x: number = 0;
let y: number = 0;

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

let img: HTMLImageElement;

const updateView = (newW: number, newH: number, newX: number, newY: number) => {
  if (w !== newW) canvas.width  = newW;
  if (h !== newH) canvas.height = newH;

  [w, h, x, y] = [newW, newH, newX, newY];

  ctx.drawImage(img, 
    x, y,
    w, h,
    0, 0,
    w, h
  );
}

const triggerUpdateView = (updateSize: boolean, updatePos: boolean, ) => {
  const [newW, newH] = updateSize 
    ? [window.innerWidth, window.innerHeight] 
    : [w, h];
  const [newX, newY] = updatePos 
    ? [window.screenX, window.screenY] 
    : [x, y];

  const sizeNotChanged = updateSize && newW === w && newH === h;
  const posNotChanged = updatePos && newX === x && newY === y;

  if (!updatePos && sizeNotChanged) return;
  if (!updateSize && posNotChanged) return;
  if (sizeNotChanged && posNotChanged) return;

  updateView(newW, newH, newX, newY);
}

function startListeningForChanges() {
  triggerUpdateView(true, true);

  window.addEventListener('resize', () => 
    triggerUpdateView(true, false)
  );

  let moveInterval: number;
  window.addEventListener("mouseout", e => { 
    if (!(e as MouseOutEvent).toElement && !e.relatedTarget) {
      moveInterval = setInterval(() => 
        triggerUpdateView(false, true)
      , 0);
    } else {
      clearInterval(moveInterval);
    }
  });
}

function main() {
  const root = document.querySelector<HTMLDivElement>('#app')!;

  canvas = root.querySelector<HTMLCanvasElement>('#canvas')!;
  ctx = canvas.getContext('2d')!;

  img = new Image();
  img.src = '/img.png';

  img.onload = () => startListeningForChanges();
}

window.onload = main;