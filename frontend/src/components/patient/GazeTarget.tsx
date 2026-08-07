import { Check } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/utils/cn';
import HoverEngine from "@/services/gaze/HoverEngine";

type GazeState = 'IDLE' | 'FOCUSED' | 'DWELLING' | 'SELECTED' | 'COOLDOWN';

export function GazeTarget({
  children,
  onSelect,
  className,
  dwellMs = 1500,
  disabled = false,
  label
}: {
  children: ReactNode;
  onSelect: () => void;
  className?: string;
  dwellMs?: number;
  disabled?: boolean;
  label: string;
}) {
  const [state, setState] = useState<GazeState>('IDLE');
  const [progress, setProgress] = useState(0);
  const frame = useRef<number | null>(null);
  const cooldown = useRef<number | null>(null);
  const startedAt = useRef(0);
  const dwellActive = useRef(false);
  const completed = useRef(false);

  const clearFrame = () => {
    if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    frame.current = null;
  };

  const enterCooldown = () => {
    setState('COOLDOWN');
    setProgress(0);
    if (cooldown.current !== null) window.clearTimeout(cooldown.current);
    cooldown.current = window.setTimeout(() => {
      completed.current = false;
      setState('IDLE');
    }, 600);
  };

  const completeSelection = () => {
    if (completed.current || disabled || state === 'COOLDOWN') return;
    completed.current = true;
    dwellActive.current = false;
    clearFrame();
    setState('SELECTED');
    setProgress(1);
    onSelect();
    window.setTimeout(enterCooldown, 240);
  };

  const beginDwell = () => {
    if (disabled || dwellActive.current || completed.current || state === 'COOLDOWN') return;
    dwellActive.current = true;
    setState('DWELLING');
    startedAt.current = performance.now();

    const tick = (time: number) => {
      if (!dwellActive.current) return;
      const ratio = Math.min(1, (time - startedAt.current) / dwellMs);
      setProgress(ratio);
      if (ratio >= 1) {
        completeSelection();
        return;
      }
      frame.current = window.requestAnimationFrame(tick);
    };

    frame.current = window.requestAnimationFrame(tick);
  };

  const cancelDwell = (keepFocus = false) => {
    dwellActive.current = false;
    clearFrame();
    if (!completed.current && state !== 'COOLDOWN') {
      setState(keepFocus ? 'FOCUSED' : 'IDLE');
      setProgress(0);
    }
  };

  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
      HoverEngine.setListener((element) => {

          if (!buttonRef.current) return;

          if (element === buttonRef.current) {

              beginDwell();

          } else {

              cancelDwell(false);

          }

      });

  }, []);

  return (
    <button 
      ref={buttonRef}
      type="button"
      aria-label={label}
      aria-disabled={disabled}
      disabled={disabled}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse' || event.pointerType === 'pen') beginDwell();
      }}
      onPointerLeave={() => cancelDwell(false)}
      onPointerDown={(event) => {
        if (event.pointerType === 'touch') completeSelection();
      }}
      onClick={(event) => {
        if (event.detail > 0) completeSelection();
      }}
      onFocus={() => setState((current) => (current === 'IDLE' ? 'FOCUSED' : current))}
      onBlur={() => cancelDwell(false)}
      onKeyDown={(event) => {
        if ((event.key === 'Enter' || event.key === ' ') && !disabled) {
          event.preventDefault();
          completeSelection();
        }
      }}
      className={cn(
        'relative isolate overflow-hidden border-4 border-transparent bg-white text-left outline-none transition-colors disabled:opacity-50',
        state === 'FOCUSED' && 'border-ocu-indigo bg-ocu-indigo/5',
        state === 'DWELLING' && 'border-ocu-indigo bg-[#edf3ff]',
        state === 'SELECTED' && 'border-ocu-green bg-ocu-green/18',
        state === 'COOLDOWN' && 'border-ocu-green/50 bg-ocu-green/10',
        className
      )}
    >
      {children}
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-3 bg-[#e6ebf5]" aria-hidden="true">
        <span className="block h-full bg-ocu-indigo" style={{ width: `${progress * 100}%` }} />
      </span>
      {state === 'SELECTED' && (
        <span className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-ocu-green text-ocu-ink shadow-lg">
          <Check size={24} />
        </span>
      )}
    </button>
  );
}
