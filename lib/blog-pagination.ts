export const PAGE_SIZE = 6

export function paginate<T extends { createdAt: Date }>(results: T[]) {
  const hasMore = results.length > PAGE_SIZE
  const trimmed = hasMore ? results.slice(0, PAGE_SIZE) : results
  const nextCursor = hasMore
    ? trimmed[trimmed.length - 1].createdAt.toISOString()
    : null
  return { trimmed, hasMore, nextCursor }
}
