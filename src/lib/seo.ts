import type { Metadata } from "next";

const siteName = "Next.js Template";

export function createMetadata(input?: {
  title?: string;
  description?: string;
}): Metadata {
  const title = input?.title ?? siteName;
  const description = input?.description ?? "Next.js application template";

  return {
    title: input?.title ? `${title} · ${siteName}` : siteName,
    description,
    openGraph: {
      title,
      description,
      siteName,
      type: "website",
    },
  };
}
