export default function Loading() {
  return (
    <main
      className="page-loader"
      aria-label="Loading OneStep Dream Property"
      role="status"
    >
      {/* ODP Text Logo */}
      <div className="flex flex-col items-center">
        <span className="text-[25px] font-black leading-none tracking-[-0.12em] text-[#0874d1] lg:text-[32px]">
          odp
        </span>

        {/* Animated Loading Dots */}
        <div
          className="mt-5 flex items-center justify-center gap-2"
          aria-hidden="true"
        >
          {[0, 1, 2].map((dot) => (
            <span
              key={dot}
              className="size-2 rounded-full bg-[#0874d1] animate-bounce"
              style={{
                animationDelay: `${dot * 160}ms`,
                animationDuration: "800ms",
              }}
            />
          ))}
        </div>
      </div>

      {/* Loading Message */}
      {/* <p className="loader-wordmark mt-4">
        <span>Loading your next move</span>
      </p> */}
    </main>
  );
}
