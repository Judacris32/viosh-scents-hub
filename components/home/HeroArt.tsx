/** Soft lighting layer used behind dark heroes: satin glow, gold haze, a thin gold ring. Pure CSS/SVG. */
export function HeroBotanicals({ subtle = false }: { subtle?: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ opacity: subtle ? 0.6 : 1 }}>
      <div className="absolute -right-32 -top-32 h-[36rem] w-[36rem] rounded-full bg-plum/50 blur-[110px]" />
      <div className="absolute -bottom-48 -left-40 h-[40rem] w-[40rem] rounded-full bg-berry/30 blur-[120px]" />
      <div className="absolute bottom-0 left-1/2 h-72 w-[50rem] -translate-x-1/2 rounded-full bg-gold/15 blur-[100px]" />
      <svg className="absolute -right-20 top-1/2 hidden h-[44rem] w-[44rem] -translate-y-1/2 md:block" viewBox="0 0 200 200" fill="none" aria-hidden="true">
        <circle cx="100" cy="100" r="86" stroke="#D4B06A" strokeOpacity="0.22" strokeWidth="0.6" />
        <circle cx="100" cy="100" r="64" stroke="#D4B06A" strokeOpacity="0.14" strokeWidth="0.6" />
      </svg>
      <svg className="absolute -left-24 top-16 h-[30rem] w-[30rem]" viewBox="0 0 200 200" fill="none" aria-hidden="true">
        <circle cx="100" cy="100" r="90" stroke="#F7EDE3" strokeOpacity="0.08" strokeWidth="0.5" />
      </svg>
    </div>
  );
}
