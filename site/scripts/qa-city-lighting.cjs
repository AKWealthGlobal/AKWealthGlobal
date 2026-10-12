const assert = require('node:assert/strict');
const { chromium } = require('C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base = process.env.CITY_QA_URL || 'http://127.0.0.1:3191';

(async () => {
  const browser = await chromium.launch({channel:'msedge',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try {
    const page = await browser.newPage({viewport:{width:1440,height:1100},reducedMotion:'reduce'});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const previewOnly404 = [];
    page.on('console', msg => {
      if(msg.type()!=='error')return;
      const url=msg.location().url;
      // The minimal local file server does not implement Next's segment-prefetch rewrite.
      if(/404/.test(msg.text()) && (/\/favicon\.ico$/.test(url) || (base.includes('127.0.0.1') && /__next\..+\.txt\?_rsc=/.test(url)))) {previewOnly404.push(url);return;}
      errors.push(msg.text()+' @ '+url);
    });
    page.on('response', response => {if(response.status()>=400 && /models\/|_next\//.test(response.url()))errors.push(`${response.status()} ${response.url()}`);});
    await page.goto(base+'/kids/');
    await page.getByRole('button',{name:'互動 3D 模型',exact:true}).click();
    await page.getByRole('button',{name:'回到全景',exact:true}).waitFor({timeout:60000});
    const viewport = page.locator('.city-model-viewport');
    const stats = await viewport.evaluate(el=>({...el.dataset}));
    assert.equal(stats.lighting,'detailed');
    assert(Number(stats.boardMeshes)<40,JSON.stringify(stats));
    await viewport.screenshot({path:'C:/Users/user/Desktop/3D亲子财商游戏/Game_Studio_Desktop.png'});
    await page.getByRole('button',{name:'細緻光影',exact:true}).click();
    assert.equal(await viewport.getAttribute('data-lighting'),'balanced');
    await viewport.screenshot({path:'C:/Users/user/Desktop/3D亲子财商游戏/Game_Studio_Balanced.png'});
    const balancedStats = await viewport.evaluate(el=>({...el.dataset}));
    await page.getByRole('button',{name:'流暢模式',exact:true}).click();
    assert.equal(await viewport.getAttribute('data-lighting'),'detailed');
    // Mode switching must release/recreate AO buffers while preserving camera/game.
    for(let i=0;i<2;i++){
      await page.getByRole('button',{name:'細緻光影',exact:true}).click();
      await page.getByRole('button',{name:'流暢模式',exact:true}).click();
    }
    for(const width of [320,390]) {
      await page.setViewportSize({width,height:900});
      await page.reload();
      await page.getByRole('button',{name:'互動 3D 模型',exact:true}).click();
      await page.getByRole('button',{name:'回到全景',exact:true}).waitFor({timeout:60000});
      assert.equal(await viewport.getAttribute('data-lighting'),'balanced');
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      await page.locator('.family-scene').screenshot({path:`C:/Users/user/Desktop/3D亲子财商游戏/Game_Studio_Mobile_${width}.png`});
      await page.getByRole('button',{name:'流暢模式',exact:true}).click();
      assert.equal(await viewport.getAttribute('data-lighting'),'detailed');
    }
    // A view change during movement must unlock choices, even when the RAF is cancelled.
    await page.emulateMedia({reducedMotion:'no-preference'});
    await page.getByRole('button',{name:'開始城市冒險',exact:true}).click();
    await page.getByRole('button',{name:'回到全景',exact:true}).waitFor({timeout:60000});
    await page.getByRole('button',{name:'擲骰子，出發'}).click();
    await page.getByRole('button',{name:'精細城市主視覺',exact:true}).click();
    await page.waitForFunction(()=>document.querySelector('.family-choices')?.getAttribute('aria-busy')==='false');
    await page.getByRole('button',{name:/先休息/}).click();
    await page.getByRole('button',{name:/換下一位家人/}).click();
    await page.getByRole('button',{name:'互動 3D 模型',exact:true}).click();
    await page.getByRole('button',{name:'回到全景',exact:true}).waitFor({timeout:60000});
    await page.locator('canvas').evaluate(canvas=>canvas.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());
    await page.getByText('目前使用文字棋盤，可以繼續完成所有遊戲操作。',{exact:true}).waitFor();
    await page.getByRole('button',{name:'擲骰子，出發'}).click();
    assert.equal(await page.locator('.family-choices').getAttribute('aria-busy'),'false');
    await page.getByRole('button',{name:/先休息/}).click();
    assert.deepEqual(errors,[]);
    console.log(JSON.stringify({result:'PASS',base,desktop:stats,balanced:balancedStats,mobileWidths:[320,390],previewOnly404:previewOnly404.length,checked:'model loads, shader errors, AO switching, mobile defaults, overflow, view-switch unlock, lost-context text gameplay'},null,2));
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
