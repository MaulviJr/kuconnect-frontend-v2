export function getInitials(nameOrFirst, last) {
  if (last === undefined) {
    if (!nameOrFirst) return "";
    const parts = nameOrFirst.trim().split(" ");
    return parts
      .filter(Boolean)
      .slice(0, 2) // only take first 2 words
      .map((word) => word[0].toUpperCase())
      .join("");
  }

  const first = nameOrFirst || "";
  const l = last || "";
  return (first[0] || "").toUpperCase() + (l[0] || "").toUpperCase();
}
