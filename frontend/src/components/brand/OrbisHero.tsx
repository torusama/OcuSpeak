export function OrbisHero() {
  return (
    <section className="relative min-h-screen overflow-hidden rounded-[34px]">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260331_151551_992053d1-3d3e-4b8c-abac-45f22158f411.mp4"
          type="video/mp4"
        />
      </video>
      <div className="absolute inset-0 bg-[#010828]/45" />

      <div className="relative z-10 mx-auto max-w-[1831px] px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24">
        <div className="mb-12 flex flex-col items-start justify-between gap-8 lg:mb-16 lg:flex-row lg:gap-12 md:mb-20">
          <h2
            className="relative text-[32px] font-normal uppercase leading-[1.05] text-[#EFF4FF] sm:text-[48px] sm:leading-[1] md:text-[60px] md:leading-[1]"
            style={{ fontFamily: 'Anton, sans-serif' }}
          >
            Hello!
            <br />
            I&apos;m orbis
            <span
              className="absolute bottom-[-20px] right-[-8px] -rotate-1 text-[36px] font-normal leading-[0.79] opacity-90 sm:bottom-[-30px] sm:text-[52px] md:bottom-[-40px] md:text-[68px]"
              style={{ fontFamily: 'Condiment, cursive', color: '#6FFF00', letterSpacing: '0.03em', mixBlendMode: 'exclusion' }}
            >
              Orbis
            </span>
          </h2>

          <p className="max-w-[266px] font-mono text-[14px] uppercase leading-relaxed text-[#EFF4FF] sm:text-[15px] md:text-[16px]">
            A digital object fixed beyond time and place. An exploration of distance, form, and silence in space.
          </p>
        </div>

        <div className="flex items-start justify-between gap-8">
          <div className="flex max-w-[335px] flex-col gap-5">
            <p className="font-mono text-[14px] uppercase leading-relaxed text-[#010828] opacity-10 lg:text-[#EFF4FF] sm:text-[15px] md:text-[16px]">
              A digital object fixed beyond time and place. An exploration of distance, form, and silence in space.
            </p>
            <p className="font-mono text-[14px] uppercase leading-relaxed text-[#010828] opacity-10 lg:text-[#EFF4FF] sm:text-[15px] md:text-[16px]">
              A digital object fixed beyond time and place. An exploration of distance, form, and silence in space.
            </p>
          </div>

          <div className="hidden max-w-[335px] flex-col gap-5 lg:flex">
            <p className="font-mono text-[14px] uppercase leading-relaxed text-[#EFF4FF] opacity-10 sm:text-[15px] md:text-[16px]">
              A digital object fixed beyond time and place. An exploration of distance, form, and silence in space.
            </p>
            <p className="font-mono text-[14px] uppercase leading-relaxed text-[#EFF4FF] opacity-10 sm:text-[15px] md:text-[16px]">
              A digital object fixed beyond time and place. An exploration of distance, form, and silence in space.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
