export function inferCategory(article: {
  title?: string;
  url?: string;
  source?: string;
}): string {
  const title = article.title?.toLowerCase() || "";
  const url = article.url?.toLowerCase() || "";
  const source = article.source?.toLowerCase() || "";

  if (
    url.includes("tech") ||
    source.includes("tech") ||
    title.includes("ai") ||
    title.includes("technology") ||
    title.includes("chip")
  ) {
    return "Technology";
  }

  if (
    url.includes("sport") ||
    source.includes("espn") ||
    title.includes("match") ||
    title.includes("league") ||
    title.includes("cricket") ||
    title.includes("football")
  ) {
    return "Sports";
  }

  if (
    source.includes("entertainment") ||
    url.includes("movie") ||
    title.includes("celebrity") ||
    title.includes("hollywood") ||
    title.includes("film")
  ) {
    return "Entertainment";
  }

  if (
    source.includes("finance") ||
    url.includes("business") ||
    title.includes("market") ||
    title.includes("stocks") ||
    source.includes("economics")
  ) {
    return "Business";
  }

  return "General";
}
