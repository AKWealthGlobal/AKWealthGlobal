import {spawn} from 'node:child_process';
const args=process.argv.slice(2); const p=args.indexOf('--port');
const child=spawn(process.execPath,['node_modules/next/dist/bin/next','dev','--hostname','0.0.0.0','--port',p>=0?args[p+1]:'3000'],{stdio:'inherit'});
process.on('SIGTERM',()=>child.kill('SIGTERM'));
