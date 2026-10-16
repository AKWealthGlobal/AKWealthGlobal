'use client';
import {useEffect, useMemo, useState} from 'react';
import Link from 'next/link';
import entries from '@/lib/prompt-examples.json';
import {classifyPrompt, STYLES, THEME_GROUPS, THEMES} from '@/lib/prompt-taxonomy';
const ALL='全部';
const classified=entries.map(e=>({...e,...classifyPrompt(e)}));
const countBy=(key:'theme'|'style')=>classified.reduce<Record<string,number>>((acc,e)=>{acc[e[key]]=(acc[e[key]]||0)+1;return acc},{});
const themeCounts=countBy('theme'),styleCounts=countBy('style');
export default function ExamplePromptLibrary(){const [query,setQuery]=useState(''),[theme,setTheme]=useState(ALL),[subtheme,setSubtheme]=useState(ALL),[style,setStyle]=useState(ALL),[model,setModel]=useState(ALL);
useEffect(()=>{const params=new URLSearchParams(window.location.search);const t=params.get('theme'),s=params.get('style');if(t&&(THEMES as readonly string[]).includes(t)){setTheme(t);const sub=params.get('sub');if(sub)setSubtheme(sub);}if(s&&(STYLES as readonly string[]).includes(s))setStyle(s);},[]);
const inTheme=useMemo(()=>classified.filter(e=>theme===ALL||e.theme===theme),[theme]);
const subthemes=useMemo(()=>{const counts=new Map<string,number>();for(const e of inTheme)counts.set(e.subtheme,(counts.get(e.subtheme)||0)+1);return [...counts]},[inTheme]);
const words=query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
const ordered=useMemo(()=>[...classified].sort((a,b)=>Number(b.slug.startsWith('alice-pestle-'))-Number(a.slug.startsWith('alice-pestle-'))||Number(b.subcategory==='早安圖')-Number(a.subcategory==='早安圖')),[classified]);
const results=ordered.filter(e=>(subtheme===ALL||e.subtheme===subtheme)&&(style===ALL||e.style===style)&&(model===ALL||e.model===model)&&words.every(word=>[e.title,e.theme,e.subtheme,e.style,e.prompt,e.description,...e.tags].join(' ').toLocaleLowerCase().includes(word)));
const filtered=query||theme!==ALL||subtheme!==ALL||style!==ALL||model!==ALL;
return <>
  <section className="example-filters" aria-label="搜尋與篩選提示詞"><label>搜尋主題、風格或用途<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="例如：古風、穿搭、海報、9:16"/></label><div className="example-filter-row"><label>主題<select value={theme} onChange={e=>{setTheme(e.target.value);setSubtheme(ALL)}}><option value={ALL}>全部主題</option>{THEME_GROUPS.map(g=><optgroup key={g.label} label={g.label}>{g.themes.map(t=><option key={t} value={t}>{t}（{themeCounts[t]||0}）</option>)}</optgroup>)}</select></label><label>細分類<select value={subtheme} onChange={e=>setSubtheme(e.target.value)} disabled={theme===ALL}><option value={ALL}>{theme===ALL?'先選主題':'全部細分類'}</option>{theme!==ALL&&subthemes.map(([s,n])=><option key={s} value={s}>{s}（{n}）</option>)}</select></label><label>風格<select value={style} onChange={e=>setStyle(e.target.value)}><option value={ALL}>全部風格</option>{STYLES.map(s=><option key={s} value={s}>{s}（{styleCounts[s]||0}）</option>)}</select></label><label>模型<select value={model} onChange={e=>setModel(e.target.value)}><option value={ALL}>全部模型</option><option>GPT Image 2</option><option>Nano Banana Pro</option></select></label></div><p role="status">找到 {results.length} / {entries.length} 組提示詞</p>{filtered&&<button type="button" onClick={()=>{setQuery('');setTheme(ALL);setSubtheme(ALL);setStyle(ALL);setModel(ALL)}}>清除篩選</button>}</section>
  <div className="example-grid">{results.map(e=><article key={e.slug} className="example-card"><Link href={`/prompts/${e.slug}/`}><img src={e.image} alt={`${e.title}的示範圖片`} loading="lazy"/><div className="example-card-body"><p className="example-category">{e.theme} / {e.subtheme}</p><h2>{e.title}</h2><p>{e.description}</p><div className="example-tags"><span>{e.style}</span><span>{e.model}</span><span>{e.requiresReference?'需準備參考照片':'文字即可開始'}</span>{'maslow' in e&&<><span>Maslow：{e.maslow}</span><span>PESTLE：{e.pestle}</span></>}</div><span className="example-read">查看示範與複製提示詞 →</span></div></Link></article>)}</div>{results.length===0&&<div className="reader-surface"><h2>沒有符合的提示詞</h2><p>請試試較短的關鍵字，或清除主題、風格與模型篩選。</p></div>}
</>}
