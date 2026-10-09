import Image from 'next/image';
import Link from 'next/link';
import comics from '@/lib/added-comics.json';

export type AddedComic = (typeof comics)[number];

export function AddedComicNotes({ notes }: { notes: string[] }) {
  return <ul>{notes.map((note) => {
    const official = note.includes('1925')
      ? { label: '衛福部諮詢服務專線', href: 'https://mohw.gov.tw/CH/cp-23-135-1.html' }
      : note.includes('165')
        ? { label: '警政署反詐騙諮詢專線', href: 'https://safemyhome.npa.gov.tw/ch/app/artwebsite/view?id=1358&module=artwebsite&serno=f1512793-602e-4977-beaa-356fbeba6bd6' }
        : undefined;
    const sourceIndex = note.indexOf('來源：');
    return <li key={note}>{official && sourceIndex >= 0 ? <>{note.slice(0, sourceIndex)}來源：<a href={official.href} target="_blank" rel="noreferrer">{official.label}</a>。</> : note}</li>;
  })}</ul>;
}

export function AddedComicCards({ items }: { items: AddedComic[] }) {
  return <div className="added-comic-grid">
    {items.map((comic, index) => <Link className="added-comic-card" href={`/comics/${comic.slug}/`} key={comic.slug}>
      <Image
        src={`/media/comics/added/${comic.slug}-1.webp`}
        width={502}
        height={502}
        alt={`${comic.title}第一格：${comic.panels[0].alt} 對白：${comic.panels[0].overlay}`}
        sizes="(max-width: 700px) 90vw, 360px"
        loading={index === 0 ? 'eager' : 'lazy'}
      />
      <div className="added-comic-card-copy">
        <span className="tag">{comic.series} · {comic.code} · {comic.audience}</span>
        <h2>{comic.title}</h2>
        <p>{comic.summary}</p>
        <span className="text-link">閱讀漫畫與逐格文字 →</span>
      </div>
    </Link>)}
  </div>;
}

export function AddedComicPanels({ comic }: { comic: AddedComic }) {
  return <section className="added-comic-panels" aria-label={`${comic.title}六格漫畫與逐格對白`}>
    {comic.panels.map((panel, index) => <figure className="added-comic-panel" key={index}>
      <Image
        src={`/media/comics/added/${comic.slug}-${index + 1}.webp`}
        width={502}
        height={502}
        alt={`${panel.alt} 對白：${panel.overlay}`}
        sizes="(max-width: 700px) 94vw, (max-width: 1040px) 46vw, 490px"
        loading={index === 0 ? 'eager' : 'lazy'}
      />
      <figcaption>
        <span className="added-panel-number">第 {index + 1} 格</span>
        <strong className="added-panel-title">{panel.panelTitle}</strong>
        <p>{panel.lines.join('\n')}</p>
      </figcaption>
    </figure>)}
  </section>;
}

export function AddedComicLink({ series }: { series: 'Alice AI 學院' | 'Ken 財商教室' }) {
  const count = comics.filter((comic) => comic.series === series || (series === 'Alice AI 學院' && comic.series === 'Alice 樂齡學堂')).length;
  const label = series === 'Alice AI 學院' ? 'Alice AI 與樂齡漫畫' : 'Ken 財商主題漫畫';
  return <section className="added-comic-callout">
    <div>
      <p className="eyebrow">追加漫畫 · {count} 篇</p>
      <h2>{label}</h2>
      <p>逐格閱讀六格漫畫，也可查看完整文字稿和內容提醒。</p>
    </div>
    <Link className="button primary" href={`/comics/#${series === 'Alice AI 學院' ? 'alice-comics' : 'ken-comics'}`}>瀏覽漫畫</Link>
  </section>;
}

export default comics;
