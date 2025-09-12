import Link from "next/link";
import { GradientButton } from "./gradient-button";

interface TryFreeButtonProps {
  text?: string;
}

export function TryFreeButton({ text = "Try RebuildCV for Free" }: TryFreeButtonProps) {
  return (
    <GradientButton asChild>
      <Link href="/sign-up" className="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
        {text}
      </Link>
    </GradientButton>
  );
} 