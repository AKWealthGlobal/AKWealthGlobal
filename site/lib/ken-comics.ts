import episodes from './ken-episodes.json';
import sources from './ken-sources.json';
export const kenComics = episodes.map((episode, i) => ({ ...episode, slug: `ken-${String(i + 1).padStart(2, '0')}`, image: episode.imageFile ? `/media/ken/community/${episode.imageFile}` : `/media/ken/comic-${String(i + 1).padStart(2, '0')}.png` }));
export const kenSources = sources as Record<string, {name: string; url: string}>;
