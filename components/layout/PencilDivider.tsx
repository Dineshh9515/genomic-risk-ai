export default function PencilDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full py-3 ${className}`}>
      <svg
        width="100%"
        height="6"
        viewBox="0 0 800 6"
        preserveAspectRatio="none"
        className="opacity-30"
      >
        <defs>
          <filter id="pencil-line-filter">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.02 0.06"
              numOctaves="3"
              result="turbulence"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale="2"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
        <path
          d="M 0 3 Q 100 0, 200 3 T 400 3 T 600 3 T 800 3"
          stroke="#00D9FF"
          strokeWidth="1.5"
          fill="none"
          filter="url(#pencil-line-filter)"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
