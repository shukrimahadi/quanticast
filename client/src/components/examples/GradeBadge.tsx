import GradeBadge from '../GradeBadge';

export default function GradeBadgeExample() {
  return (
    <div className="p-4 bg-background flex gap-4 items-center">
      <GradeBadge grade="A+" size="lg" />
      <GradeBadge grade="A" size="md" />
      <GradeBadge grade="B" size="md" />
      <GradeBadge grade="C" size="sm" />
    </div>
  );
}
