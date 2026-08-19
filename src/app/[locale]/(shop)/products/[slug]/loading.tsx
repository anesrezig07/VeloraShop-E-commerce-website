export default function ProductDetailLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 lg:px-6">
      <div className="premium-skeleton mb-6 h-4 w-64" />
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
        <div className="premium-skeleton aspect-square w-full rounded-2xl" />
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="premium-skeleton h-4 w-24" />
            <div className="premium-skeleton h-8 w-3/4" />
            <div className="premium-skeleton h-8 w-40" />
          </div>
          <div className="premium-skeleton h-10 w-full" />
          <div className="premium-skeleton h-10 w-full" />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="premium-skeleton h-28" />
            <div className="premium-skeleton h-28" />
          </div>
        </div>
      </div>
      <div className="premium-skeleton mt-16 h-6 w-48" />
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className="premium-skeleton aspect-[3/4]" />
        ))}
      </div>
    </div>
  );
}