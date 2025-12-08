import { cn } from '@/lib/utils';

interface GradeBadgeProps {
  grade: "A+" | "A" | "B" | "C" | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function GradeBadge({ grade, size = 'md', className }: GradeBadgeProps) {
  const getGradeStyles = () => {
    switch (grade) {
      case 'A+':
        return 'bg-fin-bull/20 text-fin-bull border-fin-bull/30';
      case 'A':
        return 'bg-fin-bull/15 text-fin-bull border-fin-bull/25';
      case 'B':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'C':
        return 'bg-fin-bear/20 text-fin-bear border-fin-bear/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const sizeStyles = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-xl',
    lg: 'w-20 h-20 text-3xl',
  };

  return (
    <div
      className={cn(
        'rounded-md border flex items-center justify-center font-mono font-bold animate-fade-in',
        getGradeStyles(),
        sizeStyles[size],
        className
      )}
      data-testid={`grade-badge-${grade}`}
    >
      {grade}
    </div>
  );
}
