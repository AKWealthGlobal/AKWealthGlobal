import type { Metadata } from 'next';
import { AddedComicCards } from '@/components/added-comics';
import comics from '@/lib/added-comics.json';

export const metadata: Metadata = {
  title: '追加漫畫｜Alice AI 學院與 Ken 財商教室',
  description: '閱讀 Alice 樂齡與 AI 公民素養漫畫，以及 Ken 財商教育六格故事。',
  alternates: { canonical: '/comics/' },
};

export default function AddedComicsPage() {
  return <div className="wrap section added-comics-page">
    <p className="eyebrow">六格漫畫 · 追加內容</p>
    <h1>Alice 和 Ken 的追加漫畫</h1>
    <p className="lead">用生活故事練習 AI 素養、家庭記憶、風險觀念與查證習慣。</p>
    <nav className="added-series-nav" aria-label="漫畫系列">
      <a href="/comics/">全部漫畫</a>
      <a href="#alice-comics">Alice AI 與樂齡</a>
      <a href="#ken-comics">Ken 財商</a>
    </nav>
    <section id="alice-comics" aria-labelledby="alice-comics-title">
      <h2 id="alice-comics-title">Alice AI 與樂齡</h2>
      <AddedComicCards items={comics.filter((comic) => comic.series === 'Alice AI 學院' || comic.series === 'Alice 樂齡學堂')} />
    </section>
    <section id="ken-comics" aria-labelledby="ken-comics-title">
      <h2 id="ken-comics-title">Ken 財商</h2>
      <AddedComicCards items={comics.filter((comic) => comic.series === 'Ken 財商教室')} />
    </section>
    <p className="added-comics-note">各篇保留逐格文字稿，插畫中的平板、網站和工具畫面均為情節示意。實際產品功能、隱私政策與外部求助資訊請以官方最新內容為準。</p>
  </div>;
}
