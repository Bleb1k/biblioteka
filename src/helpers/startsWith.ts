export default function startsWith(filter: Map<string, unknown>) {
  return Object.fromEntries(
    Object.entries(filter).map(([key, value]) => [key, { $regex: '^' + value }])
  )
}
