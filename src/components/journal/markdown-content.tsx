import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Locale } from "@/lib/types";

interface MarkdownContentProps {
  content: string;
  locale: Locale;
}

/**
 * Renders journal post body Markdown (long-form guides, comparison tables)
 * with brand-matched styling and locale-aware internal links: write
 * `[Oud Al Malaki](/product/oud-al-malaki)` or `[Oud perfumes](/shop?scentFamily=oud)`
 * in content without a locale prefix — it's added automatically here to
 * match whichever locale the post is being read in, so the EN and AR copies
 * of a post never need separately-prefixed links.
 */
export function MarkdownContent({ content, locale }: MarkdownContentProps) {
  return (
    <div className="space-y-4 text-base leading-relaxed text-ink-700">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h2 className="mt-10 font-serif font-arabicDisplay text-2xl text-ink-900 first:mt-0">
              {children}
            </h2>
          ),
          h2: ({ children }) => (
            <h2 className="mt-10 font-serif font-arabicDisplay text-2xl text-ink-900 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-8 font-serif font-arabicDisplay text-xl text-ink-900">
              {children}
            </h3>
          ),
          p: ({ children }) => <p>{children}</p>,
          ul: ({ children }) => (
            <ul className="list-disc space-y-1 ps-5">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal space-y-1 ps-5">{children}</ol>
          ),
          li: ({ children }) => <li>{children}</li>,
          strong: ({ children }) => (
            <strong className="font-semibold text-ink-900">{children}</strong>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-s-2 border-sand-300 ps-4 italic text-ink-400">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => {
            const isRelative = href?.startsWith("/");
            const alreadyLocalized = /^\/(en|ar)(\/|$)/.test(href ?? "");
            const resolvedHref =
              isRelative && !alreadyLocalized ? `/${locale}${href}` : href;
            const isExternal = /^https?:\/\//.test(href ?? "");

            return (
              <a
                href={resolvedHref}
                className="font-medium text-oud-600 underline decoration-oud-500/40 underline-offset-2 hover:decoration-oud-500"
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
              >
                {children}
              </a>
            );
          },
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="border-b border-ink-900/15 text-start">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 text-start font-semibold text-ink-900">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-ink-900/5 px-3 py-2 align-top">{children}</td>
          ),
          hr: () => <hr className="border-ink-900/10" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
