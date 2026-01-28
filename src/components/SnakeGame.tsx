'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const GAME_SPEED = 100;

interface Position {
  x: number;
  y: number;
}

const SnakeGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Position>({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const generateFood = useCallback((): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection({ x: 1, y: 0 });
    setGameOver(false);
    setScore(0);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (gameOver) return;
    setIsPlaying(prev => !prev);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || !isPlaying) return;

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };
      
      head.x += direction.x;
      head.y += direction.y;

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        setIsPlaying(false);
        return currentSnake;
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        setIsPlaying(false);
        return currentSnake;
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 10);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPlaying, generateFood]);

  // Game loop
  useEffect(() => {
    const gameInterval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameInterval);
  }, [moveSnake]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPlaying(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameOver]);

  // Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, GRID_SIZE * CELL_SIZE);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(GRID_SIZE * CELL_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw snake
    ctx.fillStyle = '#4ade80';
    snake.forEach((segment, index) => {
      if (index === 0) {
        ctx.fillStyle = '#22c55e';
      } else {
        ctx.fillStyle = '#4ade80';
      }
      ctx.fillRect(segment.x * CELL_SIZE + 1, segment.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
    });

    // Draw food
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(food.x * CELL_SIZE + 1, food.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
  }, [snake, food]);

  const statusLabel = gameOver ? 'GAME OVER' : isPlaying ? 'RUNNING' : 'READY';
  const statusStyle = gameOver
    ? 'border-rose-500/40 bg-rose-500/10 text-rose-200'
    : isPlaying
      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
      : 'border-sky-500/40 bg-sky-500/10 text-sky-200';
  const level = Math.floor(score / 50) + 1;
  const speed = Math.round(1000 / GAME_SPEED);

  return (
    <section className="w-full">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="relative">
          <div className="absolute -inset-6 rounded-[36px] bg-gradient-to-tr from-cyan-500/20 via-transparent to-fuchsia-500/20 blur-3xl" />
          <div className="relative rounded-[28px] border border-white/10 bg-slate-950/60 p-6 shadow-[0_20px_80px_-30px_rgba(56,189,248,0.7)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-cyan-200/70">Neon Arcade</p>
                <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">贪吃蛇 · 霓虹回路</h2>
                <p className="mt-2 text-sm text-slate-300">吞下能量晶体，别让尾部触碰墙壁。</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold tracking-[0.3em] ${statusStyle}`}>
                  {statusLabel}
                </span>
                <div className="text-right">
                  <div className="text-xs uppercase tracking-[0.3em] text-slate-400">Score</div>
                  <div className="text-2xl font-semibold text-white">{score}</div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <div className="rounded-[22px] border border-cyan-500/30 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 shadow-[0_0_40px_rgba(34,211,238,0.15)]">
                <canvas
                  ref={canvasRef}
                  width={GRID_SIZE * CELL_SIZE}
                  height={GRID_SIZE * CELL_SIZE}
                  className="rounded-2xl border border-white/10 bg-[#0b0d10]"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={gameOver ? resetGame : togglePlay}
                  className="rounded-full bg-cyan-500 px-6 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                >
                  {gameOver ? '重新开始' : isPlaying ? '暂停' : '开始'}
                </button>
                <button
                  onClick={resetGame}
                  className="rounded-full border border-white/20 px-5 py-2 text-sm text-white/80 transition hover:border-white/40 hover:text-white"
                >
                  重置
                </button>
              </div>
              <div className="text-sm text-slate-400">
                {gameOver ? '点击重新开始，刷新你的节奏。' : isPlaying ? '稳住节奏，保持轨迹。' : '准备好后按空格或点击开始。'}
              </div>
            </div>
          </div>
        </div>

        <aside className="rounded-[28px] border border-white/10 bg-slate-950/50 p-6 shadow-[0_25px_70px_-35px_rgba(244,114,182,0.6)]">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.35em] text-fuchsia-200/70">Command Deck</p>
            <span className="text-xs text-slate-400">{speed} ticks/s</span>
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-white">掌控光轨</h2>
          <p className="mt-2 text-sm text-slate-300">
            用短促转向保持流线，连击得分会让你的蛇体在霓虹里更亮。
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3">
              <p className="text-xs text-slate-400">等级</p>
              <p className="text-lg font-semibold text-white">{level}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3">
              <p className="text-xs text-slate-400">能量</p>
              <p className="text-lg font-semibold text-white">{score}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3">
              <p className="text-xs text-slate-400">轨迹</p>
              <p className="text-lg font-semibold text-white">{snake.length}</p>
            </div>
          </div>

          <div className="mt-6 space-y-4 text-sm text-slate-200">
            <div className="flex items-center justify-between">
              <span>移动</span>
              <div className="flex items-center gap-1 font-mono">
                <kbd className="rounded-lg border border-white/20 bg-white/5 px-2 py-1">↑</kbd>
                <kbd className="rounded-lg border border-white/20 bg-white/5 px-2 py-1">↓</kbd>
                <kbd className="rounded-lg border border-white/20 bg-white/5 px-2 py-1">←</kbd>
                <kbd className="rounded-lg border border-white/20 bg-white/5 px-2 py-1">→</kbd>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>开始/暂停</span>
              <kbd className="rounded-lg border border-white/20 bg-white/5 px-3 py-1 font-mono">Space</kbd>
            </div>
            <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-4 text-slate-300">
              小技巧：提前 1 格转弯，能稳定通过狭窄的蛇身通道。
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default SnakeGame;
