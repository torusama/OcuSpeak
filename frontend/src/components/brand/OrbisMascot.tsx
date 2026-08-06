import { useId } from 'react';
import { cn } from '@/utils/cn';

export type OrbisMood = 'happy' | 'guide' | 'calm' | 'cheer' | 'alert';

type OrbisMascotProps = {
  mood?: OrbisMood;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const sizes = {
  sm: 'h-28 w-28',
  md: 'h-40 w-40',
  lg: 'h-52 w-52'
};

function Face({ mood }: { mood: OrbisMood }) {
  if (mood === 'calm') {
    return (
      <>
        <g className="orbis-eye-blink">
          <path d="M91 109c4-3 9-3 13 0" fill="none" stroke="#26305f" strokeWidth="4" strokeLinecap="round" />
          <path d="M126 109c4-3 9-3 13 0" fill="none" stroke="#26305f" strokeWidth="4" strokeLinecap="round" />
        </g>
        <path d="M108 125c5 3 10 3 15 0" fill="none" stroke="#26305f" strokeWidth="4" strokeLinecap="round" />
      </>
    );
  }

  if (mood === 'cheer') {
    return (
      <>
        <g className="orbis-eye-blink">
          <path d="M89 106c4 5 10 5 14 0" fill="none" stroke="#26305f" strokeWidth="4" strokeLinecap="round" />
          <path d="M127 106c4 5 10 5 14 0" fill="none" stroke="#26305f" strokeWidth="4" strokeLinecap="round" />
        </g>
        <path d="M106 121c5 12 16 12 22 0" fill="#ff9f91" stroke="#26305f" strokeWidth="3.5" strokeLinejoin="round" />
      </>
    );
  }

  if (mood === 'alert') {
    return (
      <>
        <g className="orbis-eye-blink">
          <circle cx="97" cy="109" r="5" fill="#26305f" />
          <circle cx="134" cy="109" r="5" fill="#26305f" />
          <path d="M89 97l12-4M141 93l12 4" fill="none" stroke="#26305f" strokeWidth="4" strokeLinecap="round" />
        </g>
        <path d="M110 126c4-5 10-5 14 0" fill="none" stroke="#26305f" strokeWidth="4" strokeLinecap="round" />
      </>
    );
  }

  if (mood === 'guide') {
    return (
      <>
        <g className="orbis-eye-blink">
          <circle cx="97" cy="109" r="5" fill="#26305f" />
          <path d="M128 106c4 5 10 5 14 0" fill="none" stroke="#26305f" strokeWidth="4" strokeLinecap="round" />
        </g>
        <path d="M108 124c5 5 13 5 18 0" fill="none" stroke="#26305f" strokeWidth="4" strokeLinecap="round" />
      </>
    );
  }

  return (
    <>
      <g className="orbis-eye-blink">
        <circle cx="97" cy="109" r="5" fill="#26305f" />
        <circle cx="134" cy="109" r="5" fill="#26305f" />
      </g>
      <path d="M108 124c5 5 13 5 18 0" fill="none" stroke="#26305f" strokeWidth="4" strokeLinecap="round" />
    </>
  );
}

export function OrbisMascot({ mood = 'happy', size = 'md', className }: OrbisMascotProps) {
  const id = useId().replace(/:/g, '');
  const suit = `orbis-suit-${id}`;
  const helmet = `orbis-helmet-${id}`;
  const visor = `orbis-visor-${id}`;
  const gold = `orbis-gold-${id}`;

  const guide = mood === 'guide';
  const calm = mood === 'calm';
  const cheer = mood === 'cheer';
  const alert = mood === 'alert';

  return (
    <div className={cn('orbis-float relative shrink-0 overflow-visible', sizes[size], className)} role="img" aria-label={`Linh vật Orbis, trạng thái ${mood}`}>
      <svg viewBox="0 0 240 260" className="h-full w-full overflow-visible drop-shadow-[0_18px_30px_rgba(63,77,132,.18)]">
        <defs>
          <linearGradient id={suit} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.62" stopColor="#f3f6fc" />
            <stop offset="1" stopColor="#dce5f3" />
          </linearGradient>
          <linearGradient id={helmet} x1="0" y1="0" x2=".9" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset=".7" stopColor="#eef3fb" />
            <stop offset="1" stopColor="#d5e0ef" />
          </linearGradient>
          <linearGradient id={visor} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fbfdff" />
            <stop offset="1" stopColor="#dce8f8" />
          </linearGradient>
          <linearGradient id={gold} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff2ae" />
            <stop offset=".55" stopColor="#e9c76e" />
            <stop offset="1" stopColor="#b88d43" />
          </linearGradient>
        </defs>

        <ellipse cx="120" cy="238" rx="72" ry="12" fill="#9caad0" opacity=".2" />

        {cheer && (
          <g className="orbis-spark" fill="#ffdf74" stroke="#f0bd44" strokeWidth="2">
            <path d="M37 45l4 9 10 2-8 6 2 10-8-5-9 5 2-10-7-6 10-2z" />
            <path d="M202 63l3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1z" />
          </g>
        )}

        {alert && (
          <g className="orbis-beacon">
            <circle cx="199" cy="58" r="19" fill="#ffd8d4" opacity=".72" />
            <circle cx="199" cy="58" r="10" fill="#d94439" />
            <path d="M199 35v-9M178 44l-7-7M220 44l7-7" stroke="#d94439" strokeWidth="4" strokeLinecap="round" />
          </g>
        )}

        <g className="orbis-body-breathe">
          <path d="M78 150c-4 24-5 50 3 76h78c8-26 7-52 3-76-18-15-66-15-84 0z" fill={`url(#${suit})`} stroke="#c7d3e6" strokeWidth="4" />
          <rect x="88" y="165" width="64" height="42" rx="13" fill="#eef3fb" stroke="#d0daea" strokeWidth="3" />
          <rect x="96" y="173" width="23" height="20" rx="6" fill="#ffffff" stroke="#cdd7e8" strokeWidth="2.5" />
          <circle cx="103" cy="183" r="4" fill="#d95c52" />
          <rect x="126" y="173" width="17" height="12" rx="4" fill="#f4d679" />
          <path d="M126 193h17" stroke="#aab8d2" strokeWidth="3" strokeLinecap="round" />
          <path d="M93 216c-7 4-11 10-12 19h39v-19zM147 216c7 4 11 10 12 19h-39v-19z" fill="#e4eaf5" stroke="#c7d3e6" strokeWidth="4" />
        </g>

        <g>
          {calm ? (
            <>
              <path d="M78 162c12 4 23 13 36 22" fill="none" stroke="#c7d3e6" strokeWidth="27" strokeLinecap="round" />
              <path d="M162 162c-12 4-23 13-36 22" fill="none" stroke="#c7d3e6" strokeWidth="27" strokeLinecap="round" />
              <circle cx="116" cy="186" r="13" fill={`url(#${suit})`} stroke="#c7d3e6" strokeWidth="3" />
              <circle cx="128" cy="186" r="13" fill={`url(#${suit})`} stroke="#c7d3e6" strokeWidth="3" />
            </>
          ) : cheer ? (
            <>
              <g className="orbis-cheer-arm-left">
                <path d="M78 164c-21-12-28-32-19-43 8-10 23-3 33 14" fill={`url(#${suit})`} stroke="#c7d3e6" strokeWidth="4" />
                <ellipse cx="56" cy="116" rx="13" ry="17" fill={`url(#${suit})`} stroke="#c7d3e6" strokeWidth="4" transform="rotate(-20 56 116)" />
              </g>
              <g className="orbis-cheer-arm-right">
                <path d="M162 164c21-12 28-32 19-43-8-10-23-3-33 14" fill={`url(#${suit})`} stroke="#c7d3e6" strokeWidth="4" />
                <ellipse cx="184" cy="116" rx="13" ry="17" fill={`url(#${suit})`} stroke="#c7d3e6" strokeWidth="4" transform="rotate(20 184 116)" />
              </g>
            </>
          ) : (
            <>
              <path d="M78 160c-18 6-29 20-29 36 0 13 9 20 19 15 10-5 17-16 24-29" fill={`url(#${suit})`} stroke="#c7d3e6" strokeWidth="4" />
              <ellipse cx="55" cy="202" rx="14" ry="17" fill={`url(#${suit})`} stroke="#c7d3e6" strokeWidth="4" transform="rotate(24 55 202)" />
              {guide ? (
                <g className="orbis-wave-arm">
                  <path d="M162 160c18-12 24-34 13-43-10-8-25 4-31 23" fill={`url(#${suit})`} stroke="#c7d3e6" strokeWidth="4" />
                  <ellipse cx="179" cy="111" rx="13" ry="17" fill={`url(#${suit})`} stroke="#c7d3e6" strokeWidth="4" transform="rotate(18 179 111)" />
                </g>
              ) : alert ? (
                <>
                  <path d="M162 160c18-10 27-25 24-40-2-11-13-15-23-7-9 7-14 19-19 31" fill={`url(#${suit})`} stroke="#c7d3e6" strokeWidth="4" />
                  <ellipse cx="187" cy="111" rx="14" ry="17" fill={`url(#${suit})`} stroke="#c7d3e6" strokeWidth="4" transform="rotate(12 187 111)" />
                </>
              ) : (
                <>
                  <path d="M162 160c18 6 29 20 29 36 0 13-9 20-19 15-10-5-17-16-24-29" fill={`url(#${suit})`} stroke="#c7d3e6" strokeWidth="4" />
                  <ellipse cx="185" cy="202" rx="14" ry="17" fill={`url(#${suit})`} stroke="#c7d3e6" strokeWidth="4" transform="rotate(-24 185 202)" />
                </>
              )}
            </>
          )}
        </g>

        <circle cx="120" cy="92" r="69" fill={`url(#${helmet})`} stroke="#c7d3e6" strokeWidth="4" />
        <ellipse cx="50" cy="96" rx="13" ry="23" fill={`url(#${gold})`} stroke="#b69250" strokeWidth="3" />
        <ellipse cx="190" cy="96" rx="13" ry="23" fill={`url(#${gold})`} stroke="#b69250" strokeWidth="3" />
        <rect x="72" y="67" width="96" height="80" rx="33" fill={`url(#${visor})`} stroke="#8d9fc4" strokeWidth="4" />
        <path d="M83 80c17-14 57-17 75 2" fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" opacity=".9" />
        <circle cx="87" cy="123" r="7" fill="#ffc9bd" opacity=".92" />
        <circle cx="153" cy="123" r="7" fill="#ffc9bd" opacity=".92" />
        <Face mood={mood} />

        <circle cx="108" cy="35" r="3.5" fill="#26305f" />
        <circle cx="121" cy="35" r="3.5" fill="#26305f" />
        <path d="M106 46c5 4 12 4 17 0" fill="none" stroke="#26305f" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}
