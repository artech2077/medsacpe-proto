import type { ReactNode } from "react";

type AiMobileTopRailProps = {
  center?: ReactNode;
  centerClassName?: string;
  className?: string;
  contentClassName?: string;
  left?: ReactNode;
  leftClassName?: string;
  railClassName?: string;
  right?: ReactNode;
  rightClassName?: string;
};

export function AiMobileTopRail({
  center,
  centerClassName,
  className,
  contentClassName,
  left,
  leftClassName,
  railClassName,
  right,
  rightClassName,
}: AiMobileTopRailProps) {
  return (
    <div className={className ?? "relative z-20 md:hidden"}>
      <div
        className={
          railClassName ??
          "bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(255,255,255,1)_72%,rgba(255,255,255,0)_100%)] px-5 pb-4 pt-3"
        }
      >
        <div
          className={
            contentClassName ?? "relative flex min-h-[28px] items-start justify-between gap-3"
          }
        >
          {left ? <div className={leftClassName ?? "relative z-10"}>{left}</div> : null}
          {center ? (
            <div
              className={
                centerClassName ?? "absolute inset-x-0 top-0 flex justify-center"
              }
            >
              {center}
            </div>
          ) : null}
          {right ? (
            <div className={rightClassName ?? "relative z-10 ml-auto flex items-center gap-4"}>
              {right}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
