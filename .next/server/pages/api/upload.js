"use strict";(()=>{var e={};e.id=39,e.ids=[39],e.modules={145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},6249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,r){return r in t?t[r]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,r)):"function"==typeof t&&"default"===r?t:void 0}}})},9958:(e,t,r)=>{r.r(t),r.d(t,{config:()=>_,default:()=>S,routeModule:()=>b});var n={};r.r(n),r.d(n,{config:()=>E,default:()=>O});var o=r(1802),a=r(7153),i=r(6249);let s=require("multer");var u=r.n(s);let l=require("googleapis"),c=require("fs");var d=r.n(c);let f=require("path");var p=r.n(f);let m=require("crypto");var P=r.n(m);!function(){var e=Error("Cannot find module 'next-connect'");throw e.code="MODULE_NOT_FOUND",e}();let g=JSON.parse(function(e,t){let r=d().readFileSync(e),n=r.slice(0,16),o=r.slice(16),a=P().createDecipheriv("aes-256-cbc",Buffer.from(t),n),i=a.update(o);return(i=Buffer.concat([i,a.final()])).toString()}(p().join(process.cwd(),"service-account-file.json.enc"),process.env.SERVICE_ACCOUNT_PASSWORD)),h=new l.google.auth.GoogleAuth({credentials:g,scopes:["https://www.googleapis.com/auth/drive.file"]}),v=l.google.drive({version:"v3",auth:h}),y=u()({dest:"uploads/"}),A=Object(function(){var e=Error("Cannot find module 'next-connect'");throw e.code="MODULE_NOT_FOUND",e}())({onError(e,t,r){r.status(501).json({error:`Hata: ${e.message}`})},onNoMatch(e,t){t.status(405).json({error:`Method '${e.method}' Not Allowed`})}});A.use(y.array("files",100)),A.post(async(e,t)=>{try{let r=e.files;if(!r||0===r.length)return t.status(400).send("Dosya yok.");let n=[];for(let e of r){let t={name:e.originalname,parents:["1cQC2kz4JmyqCrf205iBgQkjbKrkWRcd1"]},r={mimeType:e.mimetype,body:d().createReadStream(e.path)},o=await v.files.create({resource:t,media:r,fields:"id"});n.push(o.data.id),d().unlinkSync(e.path)}t.status(200).json({fileIds:n})}catch(e){console.error("Hata:",e),t.status(500).send("Dosya y\xfcklenemedi: "+e.message)}});let E={api:{bodyParser:!1}},O=A,S=(0,i.l)(n,"default"),_=(0,i.l)(n,"config"),b=new o.PagesAPIRouteModule({definition:{kind:a.x.PAGES_API,page:"/api/upload",pathname:"/api/upload",bundlePath:"",filename:""},userland:n})},7153:(e,t)=>{var r;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return r}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(r||(r={}))},1802:(e,t,r)=>{e.exports=r(145)}};var t=require("../../webpack-api-runtime.js");t.C(e);var r=t(t.s=9958);module.exports=r})();