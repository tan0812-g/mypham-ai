import db from './src/config/database.js';
import {mkdir, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const all=[];
for(const host of ['ohlolly.com','www.100percentpure.com','sokoglam.com']) for(let page=1;page<=3;page++){
 const r=await fetch(`https://${host}/products.json?limit=250&page=${page}`); if(!r.ok) throw Error(host);
 const {products}=await r.json(); all.push(...products.map(p=>({...p,host}))); if(products.length<250) break;
}
const rules={1:p=>/toner|serum|cleanser|essence|face cream/i.test(p.title),2:p=>/lipstick|lip gloss|mascara|blush|eye shadow|eyeshadow|foundation|eye liner|eyeliner/i.test(p.title),3:p=>/sunscreen|sun cream|sun stick|spf/i.test(p.title),4:p=>/shampoo|conditioner/i.test(p.title)&&!/dog|set|duo|&/i.test(p.title),5:p=>p.host==='www.100percentpure.com'&&/body cream|body scrub|shower gel|hand cream|body lotion/i.test(p.title)};
const [rows]=await db.query('SELECT * FROM san_pham ORDER BY maDanhMuc,maSanPham');
const stamp=Date.now(); const dir=`uploads/products/retailer-${stamp}`; await mkdir(dir,{recursive:true});
await writeFile(`${dir}/backup.json`,JSON.stringify(rows,null,2));
const seen=new Set(),names=new Set(),plan=[];
for(const [cat,rule] of Object.entries(rules)){
 const targets=rows.filter(r=>Number(r.maDanhMuc)===Number(cat));
 const candidates=all.filter(p=>rule(p)&&p.images?.length&&!/set|trio|kit|bundle|sample/i.test(p.title));
 let n=0;
 for(const p of candidates){
  if(n>=targets.length) break; if(names.has(p.title.toLowerCase())) continue;
  const buffers=[];
  for(const im of p.images.slice(0,2)){const u=new URL(im.src);u.searchParams.set('width','900');const r=await fetch(u);if(!r.ok) break;buffers.push(Buffer.from(await r.arrayBuffer()));}
  if(!buffers.length) continue;
  const hash=createHash('sha256').update(buffers[0]).digest('hex');if(seen.has(hash))continue;
  seen.add(hash);names.add(p.title.toLowerCase());const row=targets[n++];
  const paths=[];for(let i=0;i<buffers.length;i++){const path=`${dir}/${row.maSanPham}-${i}.jpg`;await writeFile(path,buffers[i]);paths.push('/'+path);}
  plan.push({id:row.maSanPham,category:Number(cat),name:p.title,image:paths[0],hover:paths[1]||paths[0],source:`https://${p.host}/products/${p.handle}`,hash});
 }
 console.log('Category',cat,n,'/',targets.length);if(n!==targets.length)throw Error('Insufficient distinct products; database unchanged');
}
await writeFile(`${dir}/sources.json`,JSON.stringify(plan,null,2));
const c=await db.getConnection();try{await c.beginTransaction();for(const p of plan)await c.query('UPDATE san_pham SET tenSanPham=?,anhDaiDien=?,anhHover=?,thanhPhan=?,congDung=?,cachSuDung=? WHERE maSanPham=?',[p.name,p.image,p.hover,'Xem thành phần trên bao bì sản phẩm.',p.name,'Sử dụng theo hướng dẫn trên bao bì.',p.id]);await c.commit();}catch(e){await c.rollback();throw e;}finally{c.release();await db.end();}
console.log('Updated',plan.length,'distinct original images. Sources:',dir);
