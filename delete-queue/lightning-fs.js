// https://cdn.jsdelivr.net/npm/@isomorphic-git/lightning-fs@4.6.0/dist/lightning-fs.min.js
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.LightningFS=e():t.LightningFS=e()}(self,function(){return function(t){var e={};function i(n){if(e[n])return e[n].exports;var s=e[n]={i:n,l:!1,exports:{}};return t[n].call(s.exports,s,s.exports,i),s.l=!0,s.exports}return i.m=t,i.c=e,i.d=function(t,e,n){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var s in t)i.d(n,s,function(e){return t[e]}.bind(null,s));return n},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=3)}([function(t,e){function i(t){if(0===t.length)return".";let e=s(t);return e=e.reduce(r,[]),n(...e)}function n(...t){if(0===t.length)return"";let e=t.join("/");return e=e.replace(/\/{2,}/g,"/")}function s(t){if(0===t.length)return[];if("/"===t)return["/"];let e=t.split("/");return""===e[e.length-1]&&e.pop(),"/"===t[0]?e[0]="/":"."!==e[0]&&e.unshift("."),e}function r(t,e){if(0===t.length)return t.push(e),t;if("."===e)return t;if(".."===e){if(1===t.length){if("/"===t[0])throw new Error("Unable to normalize path - traverses above root directory");if("."===t[0])return t.push(e),t}return".."===t[t.length-1]?(t.push(".."),t):(t.pop(),t)}return t.push(e),t}t.exports={join:n,normalize:i,split:s,basename:function(t){if("/"===t)throw new Error(`Cannot get basename of "${t}"`);const e=t.lastIndexOf("/");return-1===e?t:t.slice(e+1)},dirname:function(t){const e=t.lastIndexOf("/");if(-1===e)throw new Error(`Cannot get dirname of "${t}"`);return 0===e?"/":t.slice(0,e)},resolve:function(...t){let e="";for(let s of t)e=s.startsWith("/")?s:i(n(e,s));return e}}},function(t,e){function i(t){return class extends Error{constructor(...e){super(...e),this.code=t,this.message?this.message=t+": "+this.message:this.message=t}}}const n=i("EEXIST"),s=i("ENOENT"),r=i("ENOTDIR"),o=i("ENOTEMPTY"),a=i("ETIMEDOUT");t.exports={EEXIST:n,ENOENT:s,ENOTDIR:r,ENOTEMPTY:o,ETIMEDOUT:a}},function(t,e,i){"use strict";i.r(e),i.d(e,"Store",function(){return n}),i.d(e,"get",function(){return o}),i.d(e,"set",function(){return a}),i.d(e,"update",function(){return h}),i.d(e,"del",function(){return c}),i.d(e,"clear",function(){return l}),i.d(e,"keys",function(){return u}),i.d(e,"close",function(){return d});class n{constructor(t="keyval-store",e="keyval"){this.storeName=e,this._dbName=t,this._storeName=e,this._init()}_init(){this._dbp||(this._dbp=new Promise((t,e)=>{const i=indexedDB.open(this._dbName);i.onerror=(()=>e(i.error)),i.onsuccess=(()=>t(i.result)),i.onupgradeneeded=(()=>{i.result.createObjectStore(this._storeName)})}))}_withIDBStore(t,e){return this._init(),this._dbp.then(i=>new Promise((n,s)=>{const r=i.transaction(this.storeName,t);r.oncomplete=(()=>n()),r.onabort=r.onerror=(()=>s(r.error)),e(r.objectStore(this.storeName))}))}_close(){return this._init(),this._dbp.then(t=>{t.close(),this._dbp=void 0})}}let s;function r(){return s||(s=new n),s}function o(t,e=r()){let i;return e._withIDBStore("readwrite",e=>{i=e.get(t)}).then(()=>i.result)}function a(t,e,i=r()){return i._withIDBStore("readwrite",i=>{i.put(e,t)})}function h(t,e,i=r()){return i._withIDBStore("readwrite",i=>{const n=i.get(t);n.onsuccess=(()=>{i.put(e(n.result),t)})})}function c(t,e=r()){return e._withIDBStore("readwrite",e=>{e.delete(t)})}function l(t=r()){return t._withIDBStore("readwrite",t=>{t.clear()})}function u(t=r()){const e=[];return t._withIDBStore("readwrite",t=>{(t.openKeyCursor||t.openCursor).call(t).onsuccess=function(){this.result&&(e.push(this.result.key),this.result.continue())}}).then(()=>e)}function d(t=r()){return t._close()}},function(t,e,i){const n=i(4),s=i(5);function r(t,e){"function"==typeof t&&(e=t);return[(...t)=>e(null,...t),e=n(e)]}t.exports=class{constructor(...t){this.promises=new s(...t),this.init=this.init.bind(this),this.readFile=this.readFile.bind(this),this.writeFile=this.writeFile.bind(this),this.unlink=this.unlink.bind(this),this.readdir=this.readdir.bind(this),this.mkdir=this.mkdir.bind(this),this.rmdir=this.rmdir.bind(this),this.rename=this.rename.bind(this),this.stat=this.stat.bind(this),this.lstat=this.lstat.bind(this),this.readlink=this.readlink.bind(this),this.symlink=this.symlink.bind(this),this.backFile=this.backFile.bind(this),this.du=this.du.bind(this),this.flush=this.flush.bind(this)}init(t,e){return this.promises.init(t,e)}readFile(t,e,i){const[n,s]=r(e,i);this.promises.readFile(t,e).then(n).catch(s)}writeFile(t,e,i,n){const[s,o]=r(i,n);this.promises.writeFile(t,e,i).then(s).catch(o)}unlink(t,e,i){const[n,s]=r(e,i);this.promises.unlink(t,e).then(n).catch(s)}readdir(t,e,i){const[n,s]=r(e,i);this.promises.readdir(t,e).then(n).catch(s)}mkdir(t,e,i){const[n,s]=r(e,i);this.promises.mkdir(t,e).then(n).catch(s)}rmdir(t,e,i){const[n,s]=r(e,i);this.promises.rmdir(t,e).then(n).catch(s)}rename(t,e,i){const[n,s]=r(i);this.promises.rename(t,e).then(n).catch(s)}stat(t,e,i){const[n,s]=r(e,i);this.promises.stat(t).then(n).catch(s)}lstat(t,e,i){const[n,s]=r(e,i);this.promises.lstat(t).then(n).catch(s)}readlink(t,e,i){const[n,s]=r(e,i);this.promises.readlink(t).then(n).catch(s)}symlink(t,e,i){const[n,s]=r(i);this.promises.symlink(t,e).then(n).catch(s)}backFile(t,e,i){const[n,s]=r(e,i);this.promises.backFile(t,e).then(n).catch(s)}du(t,e){const[i,n]=r(e);this.promises.du(t).then(i).catch(n)}flush(t){const[e,i]=r(t);this.promises.flush().then(e).catch(i)}}},function(t,e){t.exports=function(t){var e,i;if("function"!=typeof t)throw new Error("expected a function but got "+t);return function(){return e?i:(e=!0,i=t.apply(this,arguments))}}},function(t,e,i){const n=i(6),s=i(16),r=i(0);function o(t,e,...i){return void 0!==e&&"function"!=typeof e||(e={}),"string"==typeof e&&(e={encoding:e}),[t=r.normalize(t),e,...i]}function a(t,e,i,...n){return void 0!==i&&"function"!=typeof i||(i={}),"string"==typeof i&&(i={encoding:i}),[t=r.normalize(t),e,i,...n]}function h(t,e,...i){return[r.normalize(t),r.normalize(e),...i]}t.exports=class{constructor(t,e={}){this.init=this.init.bind(this),this.readFile=this._wrap(this.readFile,o,!1),this.writeFile=this._wrap(this.writeFile,a,!0),this.unlink=this._wrap(this.unlink,o,!0),this.readdir=this._wrap(this.readdir,o,!1),this.mkdir=this._wrap(this.mkdir,o,!0),this.rmdir=this._wrap(this.rmdir,o,!0),this.rename=this._wrap(this.rename,h,!0),this.stat=this._wrap(this.stat,o,!1),this.lstat=this._wrap(this.lstat,o,!1),this.readlink=this._wrap(this.readlink,o,!1),this.symlink=this._wrap(this.symlink,h,!0),this.backFile=this._wrap(this.backFile,o,!0),this.du=this._wrap(this.du,o,!1),this._deactivationPromise=null,this._deactivationTimeout=null,this._activationPromise=null,this._operations=new Set,t&&this.init(t,e)}async init(...t){return this._initPromiseResolve&&await this._initPromise,this._initPromise=this._init(...t),this._initPromise}async _init(t,e={}){await this._gracefulShutdown(),this._activationPromise&&await this._deactivate(),this._backend&&this._backend.destroy&&await this._backend.destroy(),this._backend=e.backend||new n,this._backend.init&&await this._backend.init(t,e),this._initPromiseResolve&&(this._initPromiseResolve(),this._initPromiseResolve=null),e.defer||this.stat("/")}async _gracefulShutdown(){this._operations.size>0&&(this._isShuttingDown=!0,await new Promise(t=>this._gracefulShutdownResolve=t),this._isShuttingDown=!1,this._gracefulShutdownResolve=null)}_wrap(t,e,i){return async(...n)=>{n=e(...n);let s={name:t.name,args:n};this._operations.add(s);try{return await this._activate(),await t.apply(this,n)}finally{this._operations.delete(s),i&&this._backend.saveSuperblock(),0===this._operations.size&&(this._deactivationTimeout||clearTimeout(this._deactivationTimeout),this._deactivationTimeout=setTimeout(this._deactivate.bind(this),500))}}}async _activate(){this._initPromise||console.warn(new Error(`Attempted to use LightningFS ${this._name} before it was initialized.`)),await this._initPromise,this._deactivationTimeout&&(clearTimeout(this._deactivationTimeout),this._deactivationTimeout=null),this._deactivationPromise&&await this._deactivationPromise,this._deactivationPromise=null,this._activationPromise||(this._activationPromise=this._backend.activate?this._backend.activate():Promise.resolve()),await this._activationPromise}async _deactivate(){return this._activationPromise&&await this._activationPromise,this._deactivationPromise||(this._deactivationPromise=this._backend.deactivate?this._backend.deactivate():Promise.resolve()),this._activationPromise=null,this._gracefulShutdownResolve&&this._gracefulShutdownResolve(),this._deactivationPromise}async readFile(t,e){return this._backend.readFile(t,e)}async writeFile(t,e,i){return await this._backend.writeFile(t,e,i),null}async unlink(t,e){return await this._backend.unlink(t,e),null}async readdir(t,e){return this._backend.readdir(t,e)}async mkdir(t,e){return await this._backend.mkdir(t,e),null}async rmdir(t,e){return await this._backend.rmdir(t,e),null}async rename(t,e){return await this._backend.rename(t,e),null}async stat(t,e){const i=await this._backend.stat(t,e);return new s(i)}async lstat(t,e){const i=await this._backend.lstat(t,e);return new s(i)}async readlink(t,e){return this._backend.readlink(t,e)}async symlink(t,e){return await this._backend.symlink(t,e),null}async backFile(t,e){return await this._backend.backFile(t,e),null}async du(t){return this._backend.du(t)}async flush(){return this._backend.flush()}}},function(t,e,i){const{encode:n,decode:s}=i(7),r=i(10),o=i(11),{ENOENT:a,ENOTEMPTY:h,ETIMEDOUT:c}=i(1),l=i(12),u=i(13),d=i(14),_=i(15),p=i(0);t.exports=class{constructor(){this.saveSuperblock=r(()=>{this.flush()},500)}async init(t,{wipe:e,url:i,urlauto:n,fileDbName:s=t,db:r=null,fileStoreName:a=t+"_files",lockDbName:h=t+"_lock",lockStoreName:c=t+"_lock"}={}){this._name=t,this._idb=r||new l(s,a),this._mutex=navigator.locks?new _(t):new d(h,c),this._cache=new o(t),this._opts={wipe:e,url:i},this._needsWipe=!!e,i&&(this._http=new u(i),this._urlauto=!!n)}async activate(){if(this._cache.activated)return;this._needsWipe&&(this._needsWipe=!1,await this._idb.wipe(),await this._mutex.release({force:!0})),await this._mutex.has()||await this._mutex.wait();const t=await this._idb.loadSuperblock();if(t)this._cache.activate(t);else if(this._http){const t=await this._http.loadSuperblock();this._cache.activate(t),await this._saveSuperblock()}else this._cache.activate();if(!await this._mutex.has())throw new c}async deactivate(){await this._mutex.has()&&await this._saveSuperblock(),this._cache.deactivate();try{await this._mutex.release()}catch(t){console.log(t)}await this._idb.close()}async _saveSuperblock(){this._cache.activated&&(this._lastSavedAt=Date.now(),await this._idb.saveSuperblock(this._cache._root))}_writeStat(t,e,i){let n=p.split(p.dirname(t)),s=n.shift();for(let t of n){s=p.join(s,t);try{this._cache.mkdir(s,{mode:511})}catch(t){}}return this._cache.writeStat(t,e,i)}async readFile(t,e){const{encoding:i}=e;if(i&&"utf8"!==i)throw new Error('Only "utf8" encoding is supported in readFile');let n=null,r=null;try{r=this._cache.stat(t),n=await this._idb.readFile(r.ino)}catch(t){if(!this._urlauto)throw t}if(!n&&this._http){let e=this._cache.lstat(t);for(;"symlink"===e.type;)t=p.resolve(p.dirname(t),e.target),e=this._cache.lstat(t);n=await this._http.readFile(t)}if(n&&(r&&r.size==n.byteLength||(r=await this._writeStat(t,n.byteLength,{mode:r?r.mode:438}),this.saveSuperblock()),"utf8"===i?n=s(n):n.toString=(()=>s(n))),!r)throw new a(t);return n}async writeFile(t,e,i){const{mode:s,encoding:r="utf8"}=i;if("string"==typeof e){if("utf8"!==r)throw new Error('Only "utf8" encoding is supported in writeFile');e=n(e)}const o=await this._cache.writeStat(t,e.byteLength,{mode:s});await this._idb.writeFile(o.ino,e)}async unlink(t,e){const i=this._cache.lstat(t);this._cache.unlink(t),"symlink"!==i.type&&await this._idb.unlink(i.ino)}readdir(t,e){return this._cache.readdir(t)}mkdir(t,e){const{mode:i=511}=e;this._cache.mkdir(t,{mode:i})}rmdir(t,e){if("/"===t)throw new h;this._cache.rmdir(t)}rename(t,e){this._cache.rename(t,e)}stat(t,e){return this._cache.stat(t)}lstat(t,e){return this._cache.lstat(t)}readlink(t,e){return this._cache.readlink(t)}symlink(t,e){this._cache.symlink(t,e)}async backFile(t,e){let i=await this._http.sizeFile(t);await this._writeStat(t,i,e)}du(t){return this._cache.du(t)}flush(){return this._saveSuperblock()}}},function(t,e,i){i(8),t.exports={encode:t=>(new TextEncoder).encode(t),decode:t=>(new TextDecoder).decode(t)}},function(t,e,i){(function(t){!function(t){function e(t){if("utf-8"!==(t=void 0===t?"utf-8":t))throw new RangeError("Failed to construct 'TextEncoder': The encoding label provided ('"+t+"') is invalid.")}function i(t,e){if(e=void 0===e?{fatal:!1}:e,"utf-8"!==(t=void 0===t?"utf-8":t))throw new RangeError("Failed to construct 'TextDecoder': The encoding label provided ('"+t+"') is invalid.");if(e.fatal)throw Error("Failed to construct 'TextDecoder': the 'fatal' option is unsupported.")}if(t.TextEncoder&&t.TextDecoder)return!1;Object.defineProperty(e.prototype,"encoding",{value:"utf-8"}),e.prototype.encode=function(t,e){if((e=void 0===e?{stream:!1}:e).stream)throw Error("Failed to encode: the 'stream' option is unsupported.");e=0;for(var i=t.length,n=0,s=Math.max(32,i+(i>>1)+7),r=new Uint8Array(s>>3<<3);e<i;){var o=t.charCodeAt(e++);if(55296<=o&&56319>=o){if(e<i){var a=t.charCodeAt(e);56320==(64512&a)&&(++e,o=((1023&o)<<10)+(1023&a)+65536)}if(55296<=o&&56319>=o)continue}if(n+4>r.length&&(s+=8,s=(s*=1+e/t.length*2)>>3<<3,(a=new Uint8Array(s)).set(r),r=a),0==(4294967168&o))r[n++]=o;else{if(0==(4294965248&o))r[n++]=o>>6&31|192;else if(0==(4294901760&o))r[n++]=o>>12&15|224,r[n++]=o>>6&63|128;else{if(0!=(4292870144&o))continue;r[n++]=o>>18&7|240,r[n++]=o>>12&63|128,r[n++]=o>>6&63|128}r[n++]=63&o|128}}return r.slice(0,n)},Object.defineProperty(i.prototype,"encoding",{value:"utf-8"}),Object.defineProperty(i.prototype,"fatal",{value:!1}),Object.defineProperty(i.prototype,"ignoreBOM",{value:!1}),i.prototype.decode=function(t,e){if((e=void 0===e?{stream:!1}:e).stream)throw Error("Failed to decode: the 'stream' option is unsupported.");e=0;for(var i=(t=new Uint8Array(t)).length,n=[];e<i;){var s=t[e++];if(0===s)break;if(0==(128&s))n.push(s);else if(192==(224&s)){var r=63&t[e++];n.push((31&s)<<6|r)}else if(224==(240&s)){r=63&t[e++];var o=63&t[e++];n.push((31&s)<<12|r<<6|o)}else if(240==(248&s)){65535<(s=(7&s)<<18|(r=63&t[e++])<<12|(o=63&t[e++])<<6|63&t[e++])&&(s-=65536,n.push(s>>>10&1023|55296),s=56320|1023&s),n.push(s)}}return String.fromCharCode.apply(null,n)},t.TextEncoder=e,t.TextDecoder=i}("undefined"!=typeof window?window:void 0!==t?t:this)}).call(this,i(9))},function(t,e){var i;i=function(){return this}();try{i=i||new Function("return this")()}catch(t){"object"==typeof window&&(i=window)}t.exports=i},function(t,e){t.exports=function(t,e,i){var n;return function(){if(!e)return t.apply(this,arguments);var s=this,r=arguments,o=i&&!n;return clearTimeout(n),n=setTimeout(function(){if(n=null,!o)return t.apply(s,r)},e),o?t.apply(this,arguments):void 0}}},function(t,e,i){const n=i(0),{EEXIST:s,ENOENT:r,ENOTDIR:o,ENOTEMPTY:a}=i(1),h=0;t.exports=class{constructor(){}_makeRoot(t=new Map){return t.set(h,{mode:511,type:"dir",size:0,ino:0,mtimeMs:Date.now()}),t}activate(t=null){this._root=null===t?new Map([["/",this._makeRoot()]]):"string"==typeof t?new Map([["/",this._makeRoot(this.parse(t))]]):t}get activated(){return!!this._root}deactivate(){this._root=void 0}size(){return this._countInodes(this._root.get("/"))-1}_countInodes(t){let e=1;for(let[i,n]of t)i!==h&&(e+=this._countInodes(n));return e}autoinc(){return this._maxInode(this._root.get("/"))+1}_maxInode(t){let e=t.get(h).ino;for(let[i,n]of t)i!==h&&(e=Math.max(e,this._maxInode(n)));return e}print(t=this._root.get("/")){let e="";const i=(t,n)=>{for(let[s,r]of t){if(0===s)continue;let t=r.get(h),o=t.mode.toString(8);e+=`${"\t".repeat(n)}${s}\t${o}`,"file"===t.type?e+=`\t${t.size}\t${t.mtimeMs}\n`:(e+="\n",i(r,n+1))}};return i(t,0),e}parse(t){let e=0;function i(t){const i=++e,n=1===t.length?"dir":"file";let[s,r,o]=t;return s=parseInt(s,8),r=r?parseInt(r):0,o=o?parseInt(o):Date.now(),new Map([[h,{mode:s,type:n,size:r,mtimeMs:o,ino:i}]])}let n=t.trim().split("\n"),s=this._makeRoot(),r=[{indent:-1,node:s},{indent:0,node:null}];for(let t of n){let e=t.match(/^\t*/)[0].length;t=t.slice(e);let[n,...s]=t.split("\t"),o=i(s);if(e<=r[r.length-1].indent)for(;e<=r[r.length-1].indent;)r.pop();r.push({indent:e,node:o}),r[r.length-2].node.set(n,o)}return s}_lookup(t,e=!0){let i=this._root,s="/",o=n.split(t);for(let a=0;a<o.length;++a){let c=o[a];if(!(i=i.get(c)))throw new r(t);if(e||a<o.length-1){const t=i.get(h);if("symlink"===t.type){let e=n.resolve(s,t.target);i=this._lookup(e)}s=s?n.join(s,c):c}}return i}mkdir(t,{mode:e}){if("/"===t)throw new s;let i=this._lookup(n.dirname(t)),r=n.basename(t);if(i.has(r))throw new s;let o=new Map,a={mode:e,type:"dir",size:0,mtimeMs:Date.now(),ino:this.autoinc()};o.set(h,a),i.set(r,o)}rmdir(t){let e=this._lookup(t);if("dir"!==e.get(h).type)throw new o;if(e.size>1)throw new a;let i=this._lookup(n.dirname(t)),s=n.basename(t);i.delete(s)}readdir(t){let e=this._lookup(t);if("dir"!==e.get(h).type)throw new o;return[...e.keys()].filter(t=>"string"==typeof t)}writeStat(t,e,{mode:i}){let s;try{let e=this.stat(t);null==i&&(i=e.mode),s=e.ino}catch(t){}null==i&&(i=438),null==s&&(s=this.autoinc());let r=this._lookup(n.dirname(t)),o=n.basename(t),a={mode:i,type:"file",size:e,mtimeMs:Date.now(),ino:s},c=new Map;return c.set(h,a),r.set(o,c),a}unlink(t){let e=this._lookup(n.dirname(t)),i=n.basename(t);e.delete(i)}rename(t,e){let i=n.basename(e),s=this._lookup(t);this._lookup(n.dirname(e)).set(i,s),this.unlink(t)}stat(t){return this._lookup(t).get(h)}lstat(t){return this._lookup(t,!1).get(h)}readlink(t){return this._lookup(t,!1).get(h).target}symlink(t,e){let i,s;try{let t=this.stat(e);null===s&&(s=t.mode),i=t.ino}catch(t){}null==s&&(s=40960),null==i&&(i=this.autoinc());let r=this._lookup(n.dirname(e)),o=n.basename(e),a={mode:s,type:"symlink",target:t,size:0,mtimeMs:Date.now(),ino:i},c=new Map;return c.set(h,a),r.set(o,c),a}_du(t){let e=0;for(const[i,n]of t.entries())e+=i===h?n.size:this._du(n);return e}du(t){let e=this._lookup(t);return this._du(e)}}},function(t,e,i){const n=i(2);t.exports=class{constructor(t,e){this._database=t,this._storename=e,this._store=new n.Store(this._database,this._storename)}saveSuperblock(t){return n.set("!root",t,this._store)}loadSuperblock(){return n.get("!root",this._store)}readFile(t){return n.get(t,this._store)}writeFile(t,e){return n.set(t,e,this._store)}unlink(t){return n.del(t,this._store)}wipe(){return n.clear(this._store)}close(){return n.close(this._store)}}},function(t,e){t.exports=class{constructor(t){this._url=t}loadSuperblock(){return fetch(this._url+"/.superblock.txt").then(t=>t.ok?t.text():null)}async readFile(t){const e=await fetch(this._url+t);if(200===e.status)return e.arrayBuffer();throw new Error("ENOENT")}async sizeFile(t){const e=await fetch(this._url+t,{method:"HEAD"});if(200===e.status)return e.headers.get("content-length");throw new Error("ENOENT")}}},function(t,e,i){const n=i(2),s=t=>new Promise(e=>setTimeout(e,t));t.exports=class{constructor(t,e){this._id=Math.random(),this._database=t,this._storename=e,this._store=new n.Store(this._database,this._storename),this._lock=null}async has({margin:t=2e3}={}){if(this._lock&&this._lock.holder===this._id){const e=Date.now();return this._lock.expires>e+t||await this.renew()}return!1}async renew({ttl:t=5e3}={}){let e;return await n.update("lock",i=>{const n=Date.now()+t;return e=i&&i.holder===this._id,this._lock=e?{holder:this._id,expires:n}:i,this._lock},this._store),e}async acquire({ttl:t=5e3}={}){let e,i,s;if(await n.update("lock",n=>{const r=Date.now(),o=r+t;return i=n&&n.expires<r,e=void 0===n||i,s=n&&n.holder===this._id,this._lock=e?{holder:this._id,expires:o}:n,this._lock},this._store),s)throw new Error("Mutex double-locked");return e}async wait({interval:t=100,limit:e=6e3,ttl:i}={}){for(;e--;){if(await this.acquire({ttl:i}))return!0;await s(t)}throw new Error("Mutex timeout")}async release({force:t=!1}={}){let e,i,s;if(await n.update("lock",n=>(e=t||n&&n.holder===this._id,i=void 0===n,s=n&&n.holder!==this._id,this._lock=e?void 0:n,this._lock),this._store),await n.close(this._store),!e&&!t){if(i)throw new Error("Mutex double-freed");if(s)throw new Error("Mutex lost ownership")}return e}}},function(t,e){t.exports=class{constructor(t){this._id=Math.random(),this._database=t,this._has=!1,this._release=null}async has(){return this._has}async acquire(){return new Promise(t=>{navigator.locks.request(this._database+"_lock",{ifAvailable:!0},e=>(this._has=!!e,t(!!e),new Promise(t=>{this._release=t})))})}async wait({timeout:t=6e5}={}){return new Promise((e,i)=>{const n=new AbortController;setTimeout(()=>{n.abort(),i(new Error("Mutex timeout"))},t),navigator.locks.request(this._database+"_lock",{signal:n.signal},t=>(this._has=!!t,e(!!t),new Promise(t=>{this._release=t})))})}async release({force:t=!1}={}){this._has=!1,this._release?this._release():t&&navigator.locks.request(this._database+"_lock",{steal:!0},t=>!0)}}},function(t,e){t.exports=class{constructor(t){this.type=t.type,this.mode=t.mode,this.size=t.size,this.ino=t.ino,this.mtimeMs=t.mtimeMs,this.ctimeMs=t.ctimeMs||t.mtimeMs,this.uid=1,this.gid=1,this.dev=1}isFile(){return"file"===this.type}isDirectory(){return"dir"===this.type}isSymbolicLink(){return"symlink"===this.type}}}])});