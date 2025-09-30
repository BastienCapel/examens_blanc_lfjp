interface HomeHeroProps {
  subtitle: string;
  title: string;
  description: string;
}

export default function HomeHero({ subtitle, title, description }: HomeHeroProps) {
  return (
    <div className="max-w-4xl space-y-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
        {subtitle}
      </p>
      <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">{title}</h1>
      <p className="text-lg leading-relaxed text-slate-600 sm:text-xl">{description}</p>
    </div>
  );
}
