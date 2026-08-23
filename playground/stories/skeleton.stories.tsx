import { Skeleton } from "@/registry/grana/ui/skeleton";
import { Label, Row, Story } from "@/playground/lib/story";

export default function SkeletonStories() {
  return (
    <div>
      <Story title="Shapes" note="shaped by className: a line, an avatar, a block">
        <Row className="gap-6">
          <div className="grid gap-2">
            <Skeleton className="h-3 w-48" />
            <Label>text line</Label>
          </div>
          <div className="grid gap-2">
            <Skeleton className="size-6 rounded-full" />
            <Label>avatar</Label>
          </div>
          <div className="grid gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Label>chip</Label>
          </div>
          <div className="grid gap-2">
            <Skeleton className="h-16 w-40 rounded-md" />
            <Label>card</Label>
          </div>
        </Row>
      </Story>

      <Story title="A loading row" note="the table-row shape while data arrives">
        <div className="max-w-[640px] divide-y divide-border rounded-md border border-border bg-card">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <Skeleton className="size-6 rounded-full" />
              <Skeleton className="h-3 flex-1" style={{ maxWidth: `${260 - i * 50}px` }} />
              <Skeleton className="ml-auto h-5 w-16 rounded-full" />
              <Skeleton className="h-3 w-8" />
            </div>
          ))}
        </div>
      </Story>

      <Story title="A loading card">
        <div className="grid max-w-[360px] gap-3 rounded-md border border-border bg-card p-4">
          <Skeleton className="h-2.5 w-16" />
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      </Story>
    </div>
  );
}
