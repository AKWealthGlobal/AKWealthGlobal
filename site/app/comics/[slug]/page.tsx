import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/ui';
import { AddedComicNotes, AddedComicPanels } from '@/components/added-comics';
import comics from '@/lib/added-comics.json';

export function generateStaticParams() {
  return comics.map((comic) => ({ slug: comic.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const comic = comics.find((item) => item.slug === slug);
  if (!comic) return {};
  return {
    title: `${comic.title}｜${comic.series}`,
    description: comic.summary,
    alternates: { canonical: `/comics/${comic.slug}/` },
    openGraph: { title: comic.title, description: comic.summary, images: [`/media/comics/added/${comic.slug}-1.webp`] },
  };
}

export default async function AddedComicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const comic = comics.find((item) => item.slug === slug);
  if (!comic) notFound();
  const sibling = comics.filter((item) => item.series === comic.series || (comic.series === 'Alice 樂齡學堂' && item.series === 'Alice AI 學院'));
  const next = sibling[(sibling.indexOf(comic) + 1) % sibling.length];
  return <div className="wrap detail-wrap added-comic-detail">
    <Breadcrumb label={comic.title} parent="/comics/" parentLabel="追加漫畫" />
    <header className="article-header">
      <span className="tag">{comic.series} · {comic.code} · {comic.audience}</span>
      <h1>{comic.title}</h1>
      <p>{comic.summary}</p>
      <p className="meta">六格漫畫 · 逐格文字稿</p>
    </header>
    <div className="added-comic-source-note"><strong>內容來源：</strong>{comic.source}</div>
    <AddedComicPanels comic={comic} />
    <section className="added-comic-notes" aria-labelledby="comic-notes-title">
      <h2 id="comic-notes-title">閱讀提醒</h2>
      <AddedComicNotes notes={comic.notes} />
    </section>
    {comic.sourceNotes.length > 0 && <section className="added-comic-notes" aria-labelledby="comic-source-notes-title">
      <h2 id="comic-source-notes-title">校稿補充｜{comic.sourceNotes[0].label}</h2>
      <ul>{comic.sourceNotes.map((note) => <li key={note.label}>{note.text}</li>)}</ul>
    </section>}
    <nav className="added-comic-next" aria-label="漫畫導覽">
      <Link className="text-link" href="/comics/">查看全部追加漫畫 →</Link>
      {next && next.slug !== comic.slug && <Link className="button primary" href={`/comics/${next.slug}/`}>下一篇：{next.title}</Link>}
    </nav>
  </div>;
}
