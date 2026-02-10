const SkeletonCard = () => (
  <div className="bg-card p-6 rounded-xl border border-border">
    <div className="flex justify-between items-start mb-4">
      <div className="space-y-2 flex-1 pr-4">
        <div className="h-6 w-3/4 skeleton-shimmer rounded" />
        <div className="h-4 w-1/2 skeleton-shimmer rounded opacity-60" />
      </div>
      <div className="w-10 h-10 skeleton-shimmer rounded-lg" />
    </div>
    <div className="space-y-2 mb-6">
      <div className="h-3 w-full skeleton-shimmer rounded" />
      <div className="h-3 w-5/6 skeleton-shimmer rounded" />
    </div>
    <div className="flex gap-2">
      <div className="h-6 w-16 skeleton-shimmer rounded" />
      <div className="h-6 w-16 skeleton-shimmer rounded" />
    </div>
  </div>
);

export default SkeletonCard;
