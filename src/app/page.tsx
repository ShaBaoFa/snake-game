import SnakeGame from "@/components/SnakeGame";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0b0f14] text-white">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[120px]" />
          <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-amber-400/15 blur-[140px]" />
          <div className="absolute bottom-0 left-12 h-72 w-72 rounded-full bg-emerald-400/10 blur-[120px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),transparent_55%)]" />
        </div>

        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-12 lg:py-16">
          <header className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.4em] text-cyan-200/70">
              <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1">Live Build</span>
              <span>Arcade Lab</span>
            </div>
            <div>
              <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                霓虹贪吃蛇控制室
              </h1>
              <p className="mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
                在冷光赛道上精准转向，收集能量晶体，建立自己的高速节奏。
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-slate-300">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">即时响应</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">单局冲榜</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">霓虹视差</span>
            </div>
          </header>

          <SnakeGame />

          <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm text-slate-400">
            <span>方向键操控，Space 开始/暂停</span>
            <span>Made for GitHub Pages</span>
          </footer>
        </div>
      </div>
    </main>
  );
}
