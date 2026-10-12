// Build a deployable Deno folder without changing the website's TypeScript imports.
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const target=path.join(root,'supabase','.deploy','ak-city-room');
fs.mkdirSync(path.join(target,'shared'),{recursive:true});
for(const file of ['room-server.ts','room-protocol.ts','urban-game.ts','urban-quiz.ts']){
  let content=fs.readFileSync(path.join(root,'lib',file),'utf8');
  content=content.replace(/from (['"])(\.\/(?:urban-game|urban-quiz|room-protocol))\1/g,(_,quote,module)=>`from ${quote}${module}.ts${quote}`);
  fs.writeFileSync(path.join(target,'shared',file),content);
}
let entry=fs.readFileSync(path.join(root,'supabase/functions/ak-city-room/index.ts'),'utf8');
entry=entry.replace("'../../../lib/room-server.ts'","'./shared/room-server.ts'");
fs.writeFileSync(path.join(target,'index.ts'),entry);
fs.writeFileSync(path.join(target,'deno.json'),JSON.stringify({compilerOptions:{strict:true}},null,2));
console.log('Packaged Supabase function in '+target);
