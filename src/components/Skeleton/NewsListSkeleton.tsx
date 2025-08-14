import { NewsItemSkeleton } from './NewsItemSkeleton';

interface NewsListSkeletonProps {
  count?: number;
}

export const NewsListSkeleton = ({ count = 5 }: NewsListSkeletonProps) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {Array.from({ length: count }).map((_, index) => (
        <NewsItemSkeleton key={index} />
      ))}
    </div>
  );
};
