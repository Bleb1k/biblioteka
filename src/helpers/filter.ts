export function applyFilter(filter: Map<string, unknown>) {
  let newFilter = Object.fromEntries(
    Object.entries(filter)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => {
        let a =
          key === 'token' ? [key, `${value}`] : [key, { $regex: `^${value}` }]
        return a
      })
  )

  return newFilter
}
