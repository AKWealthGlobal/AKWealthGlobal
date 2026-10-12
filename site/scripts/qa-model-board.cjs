const assert=require('node:assert/strict'),fs=require('node:fs');
const {chromium}=require('C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true,args:['--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']});try{
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.__akAudioCount=0;const Base=window.AudioContext;window.AudioContext=class extends Base{constructor(...args){super(...args);window.__akAudioCount++;}};window.__akSpeech='';window.speechSynthesis.speak=u=>{window.__akSpeech=u.text;u.onend?.();};});
 fs.mkdirSync('docs/preview',{recursive:true});
 for(const width of [1440,390,320]){await page.setViewportSize({width,height:900});await page.goto('http://127.0.0.1:3188/kids/');await page.getByRole('button',{name:'棋盤向左旋轉'}).waitFor({timeout:30000});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${width}`);await page.screenshot({path:`docs/preview/animal-model-${width}.png`,fullPage:true});}
 assert.equal(await page.evaluate(()=>window.__akAudioCount),0);await page.getByRole('button',{name:'音效：關閉',exact:true}).click();assert.equal(await page.evaluate(()=>window.__akAudioCount),1);await page.getByRole('button',{name:'音效：開啟',exact:true}).click();await page.getByRole('button',{name:'家長朗讀',exact:true}).click();assert((await page.evaluate(()=>window.__akSpeech)).includes('AK 動物都市'));
 await page.setViewportSize({width:1440,height:1800});await page.getByRole('button',{name:'開始城市冒險'}).click();await page.getByRole('button',{name:'棋盤向左旋轉'}).waitFor();await page.getByRole('button',{name:'擲骰子，出發'}).click();await page.getByText('棋子正在逐格前進…').waitFor();assert.equal(await page.locator('.family-choices button:enabled').count(),0);await page.getByText('棋子正在逐格前進…').waitFor({state:'hidden'});
 let turns=1;
 while(await page.getByRole('button',{name:'重新選擇模式',exact:true}).count()===0){
  const roll=page.getByRole('button',{name:'擲骰子，出發'});if(await roll.count()){await roll.click();turns++;}
  const rest=page.getByRole('button',{name:'先休息，這次不花錢',exact:true});if(await rest.count())await rest.click();
  const next=page.getByRole('button',{name:/換下一位家人|結算這一輪|結算最後一輪/});if(await next.count())await next.click();assert(turns<=12);
 }
 assert.equal(turns,12);await page.getByRole('button',{name:'重新選擇模式',exact:true}).click();
 await page.emulateMedia({reducedMotion:'reduce'});await page.getByRole('button',{name:'開始城市冒險'}).click();await page.getByRole('button',{name:'棋盤向左旋轉'}).waitFor();await page.getByRole('button',{name:'擲骰子，出發'}).click();await page.getByRole('button',{name:'先休息，這次不花錢',exact:true}).waitFor();assert.equal(await page.getByText('棋子正在逐格前進…').count(),0);
 const fallback=await browser.newPage();await fallback.route('**/models/*.glb',r=>r.abort());await fallback.goto('http://127.0.0.1:3188/kids/');await fallback.getByText('目前使用文字棋盤，可以繼續完成所有遊戲操作。').waitFor();await fallback.getByRole('button',{name:'開始城市冒險'}).click();await fallback.getByRole('button',{name:'擲骰子，出發'}).click();await fallback.getByRole('button',{name:'先休息，這次不花錢',exact:true}).click();await fallback.getByRole('button',{name:'換下一位家人'}).click();
 const built=await browser.newPage();await built.goto('http://127.0.0.1:3188/kids/');await built.getByRole('button',{name:'開始城市冒險'}).click();await built.getByRole('button',{name:'棋盤向左旋轉'}).waitFor();await built.getByRole('button',{name:'擲骰子，出發'}).click();await built.getByRole('button',{name:/建設「飲水坡道」/}).click();await built.getByText('4.').count();await built.getByText('5. 飲水坡道 ✓ 已建設').waitFor({state:'attached'});
 assert.deepEqual(errors,[]);console.log('PASS: GLB load, 1440/390/320 no overflow, movement lock, full 12-turn game, reduced motion, failed-model fallback, construction marker, no page errors');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
