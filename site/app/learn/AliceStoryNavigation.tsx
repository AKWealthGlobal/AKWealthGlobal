import Link from 'next/link';
import topics from '@/lib/alice-topics.json';

const publishedTopics = topics.filter((topic) => topic.href);

export function AliceBackToTopics() {
  return <Link className="ken-back" href="/learn/">回全部主題 →</Link>;
}

export function AliceStoryNavigation({href}:{href:string}) {
  const index = publishedTopics.findIndex((topic) => topic.href === href);
  const previous = index > 0 ? publishedTopics[index - 1] : null;
  const next = index >= 0 && index < publishedTopics.length - 1 ? publishedTopics[index + 1] : null;

  return <nav className="ken-age-nav alice-story-nav" aria-label="漫畫篇章導覽">
    {previous
      ? <Link href={previous.href!} aria-label={`上一篇：${previous.title}`}>← 上一篇</Link>
      : <span className="disabled" aria-disabled="true">← 上一篇</span>}
    <Link href="/learn/">全部故事</Link>
    {next
      ? <Link href={next.href!} aria-label={`下一篇：${next.title}`}>下一篇 →</Link>
      : <span className="disabled" aria-disabled="true">下一篇 →</span>}
  </nav>;
}
