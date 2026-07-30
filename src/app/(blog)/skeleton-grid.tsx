export default function SkeletonGrid({
  showFeatured = false,
}: {
  showFeatured?: boolean;
}) {
  return (
    <div aria-label="Carregando artigos" aria-busy="true">
      {showFeatured ? (
        <div className="mb-16 grid animate-pulse overflow-hidden rounded-[1.75rem] border border-[#dfe2d9] bg-[#eeefe9] lg:grid-cols-2">
          <div className="min-h-72 bg-[#dfe3d9] lg:min-h-[430px]" />
          <div className="space-y-5 p-8 lg:p-11">
            <div className="h-3 w-40 rounded bg-primary/10" />
            <div className="h-10 w-full rounded bg-primary/10" />
            <div className="h-10 w-4/5 rounded bg-primary/10" />
            <div className="h-4 w-full rounded bg-primary/10" />
            <div className="h-4 w-2/3 rounded bg-primary/10" />
          </div>
        </div>
      ) : null}

      <div className="grid gap-x-7 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="aspect-[16/10] rounded-2xl bg-[#dfe3d9]" />
            <div className="mt-5 h-3 w-28 rounded bg-primary/10" />
            <div className="mt-4 h-7 w-full rounded bg-primary/10" />
            <div className="mt-2 h-7 w-4/5 rounded bg-primary/10" />
            <div className="mt-4 h-4 w-full rounded bg-primary/10" />
            <div className="mt-2 h-4 w-2/3 rounded bg-primary/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
