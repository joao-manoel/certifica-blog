export default function SkeletonGrid() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-48 w-full rounded-xl bg-muted/50 mb-4" />
          <div className="h-5 w-3/4 rounded bg-muted/50 mb-2" />
          <div className="h-4 w-full rounded bg-muted/50 mb-2" />
          <div className="h-4 w-2/3 rounded bg-muted/50" />
        </div>
      ))}
    </div>
  );
}
