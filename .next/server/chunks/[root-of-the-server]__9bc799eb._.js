module.exports=[18622,(e,t,a)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},32319,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},20635,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/action-async-storage.external.js",()=>require("next/dist/server/app-render/action-async-storage.external.js"))},24725,(e,t,a)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},70406,(e,t,a)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},93695,(e,t,a)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},30056,e=>e.a(async(t,a)=>{try{let t=await e.y("pg");e.n(t),a()}catch(e){a(e)}},!0),79058,e=>e.a(async(t,a)=>{try{e.s(["query",()=>s]);var r=e.i(30056),n=t([r]);[r]=n.then?(await n)():n;let i=new r.Pool({host:"localhost",user:"irfanzzs",password:"",database:"comit_db",port:5432});async function s(e,t=[]){return await i.query(e,t)}a()}catch(e){a(e)}},!1),70020,(e,t,a)=>{},7125,e=>e.a(async(t,a)=>{try{e.s(["GET",()=>i]);var r=e.i(79058),n=e.i(89171),s=t([r]);async function i(e){let{searchParams:t}=new URL(e.url),a=((parseInt(t.get("page"))||1)-1)*10;try{let e=[],s=[],i=1;t.get("name")&&(e.push(`ui.nama ILIKE $${i}`),s.push(`%${t.get("name")}%`),i++),t.get("posisi")&&(e.push(`ui.posisi = $${i}`),s.push(t.get("posisi")),i++),t.get("status_absen")&&(e.push(`a.status_absen = $${i}`),s.push(t.get("status_absen")),i++),t.get("acara")&&(e.push(`a.acara = $${i}`),s.push(t.get("acara")),i++);let o=e.length?`WHERE ${e.join(" AND ")}`:"",u=`
            SELECT COUNT(*) 
            FROM attendance a 
            INNER JOIN users_info ui ON a.user_id = ui.user_id
            ${o}
        `,d=`
            SELECT a.acara
            FROM attendance a 
            INNER JOIN users_info ui ON a.user_id = ui.user_id
        `,l=`
            SELECT 
                ui.nama,
                COUNT(a.id) FILTER (WHERE a.status_absen = 'Hadir') AS hadir,
                COUNT(a.id) FILTER (WHERE a.status_absen = 'Izin') AS izin,
                COUNT(a.id) FILTER (WHERE a.status_absen = 'Sakit') AS sakit,
                COUNT(a.id) AS total_data
            FROM users_info ui
            LEFT JOIN attendance a ON ui.user_id = a.user_id
            GROUP BY ui.id, ui.nama
            ORDER BY hadir DESC, nama ASC
            LIMIT 3
        `,p=`
            SELECT 
                ui.nama,
                COUNT(a.id) FILTER (WHERE a.status_absen = 'Hadir') AS hadir,
                COUNT(a.id) FILTER (WHERE a.status_absen = 'Izin') AS izin,
                COUNT(a.id) FILTER (WHERE a.status_absen = 'Sakit') AS sakit,
                COUNT(a.id) AS total_data
            FROM users_info ui
            LEFT JOIN attendance a ON ui.user_id = a.user_id
            ${o}
            GROUP BY ui.id, ui.nama
            ORDER BY hadir DESC, nama ASC
            LIMIT $${i} OFFSET $${i+1}
        `,c=`
            SELECT 
                ui.nama,
                COUNT(a.id) FILTER (WHERE a.status_absen = 'Hadir') AS hadir,
                COUNT(a.id) FILTER (WHERE a.status_absen = 'Izin') AS izin,
                COUNT(a.id) FILTER (WHERE a.status_absen = 'Sakit') AS sakit,
                COUNT(a.id) AS total_data
            FROM users_info ui
            LEFT JOIN attendance a ON ui.user_id = a.user_id
            GROUP BY ui.id, ui.nama
            ORDER BY hadir DESC, nama ASC
        `,R=(await (0,r.query)(l)).rows,E=(await (0,r.query)(p,[...s,10,a])).rows,h=(await (0,r.query)(c)).rows,x=await (0,r.query)(u,s),C=parseInt(x.rows[0].count),O=Math.ceil(C/10),g=(await (0,r.query)(d)).rows,m=`
           SELECT 
            a.id, 
            ui.nama, 
            ui.posisi, 
            a.status_absen, 
            a.keterangan, 
            a.acara,
            TO_CHAR(a.created_at, 'DD-MM-YYYY HH24:MI') as waktu_absen
            FROM attendance a 
            INNER JOIN users_info ui ON a.user_id = ui.user_id
            ${o}
            ORDER BY a.created_at DESC
            LIMIT $${i} OFFSET $${i+1}
        `,T=await (0,r.query)(m,[...s,10,a]);return n.NextResponse.json({users:T.rows,totalPages:O,totalUsers:C,leaderboard:R,leaderboardAll:E,totalLeaderboard:h,acara:g})}catch(e){return console.error(e),n.NextResponse.json({error:"Gagal mengambil data pengguna"},{status:500})}}[r]=s.then?(await s)():s,a()}catch(e){a(e)}},!1),86270,e=>e.a(async(t,a)=>{try{e.s(["handler",()=>w,"patchFetch",()=>T,"routeModule",()=>_,"serverHooks",()=>y,"workAsyncStorage",()=>N,"workUnitAsyncStorage",()=>v]);var r=e.i(47909),n=e.i(74017),s=e.i(96250),i=e.i(59756),o=e.i(61916),u=e.i(69741),d=e.i(16795),l=e.i(87718),p=e.i(95169),c=e.i(47587),R=e.i(66012),E=e.i(70101),h=e.i(26937),x=e.i(10372),C=e.i(93695);e.i(52474);var O=e.i(220),g=e.i(7125),m=t([g]);[g]=m.then?(await m)():m;let _=new r.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/userAttendance/route",pathname:"/api/userAttendance",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/userAttendance/route.js",nextConfigOutput:"",userland:g}),{workAsyncStorage:N,workUnitAsyncStorage:v,serverHooks:y}=_;function T(){return(0,s.patchFetch)({workAsyncStorage:N,workUnitAsyncStorage:v})}async function w(e,t,a){var r;let s="/api/userAttendance/route";s=s.replace(/\/index$/,"")||"/";let g=await _.prepare(e,t,{srcPage:s,multiZoneDraftMode:!1});if(!g)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:m,params:T,nextConfig:w,isDraftMode:N,prerenderManifest:v,routerServerContext:y,isOnDemandRevalidate:f,revalidateOnlyGenerated:A,resolvedPathname:S}=g,I=(0,u.normalizeAppPath)(s),b=!!(v.dynamicRoutes[I]||v.routes[S]);if(b&&!N){let e=!!v.routes[S],t=v.dynamicRoutes[I];if(t&&!1===t.fallback&&!e)throw new C.NoFallbackError}let H=null;!b||_.isDev||N||(H=S,H="/index"===H?"/":H);let U=!0===_.isDev||!b,F=b&&!U,$=e.method||"GET",k=(0,o.getTracer)(),q=k.getActiveScopeSpan(),L={params:T,prerenderManifest:v,renderOpts:{experimental:{cacheComponents:!!w.experimental.cacheComponents,authInterrupts:!!w.experimental.authInterrupts},supportsDynamicResponse:U,incrementalCache:(0,i.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:null==(r=w.experimental)?void 0:r.cacheLife,isRevalidate:F,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,r)=>_.onRequestError(e,t,r,y)},sharedContext:{buildId:m}},M=new d.NodeNextRequest(e),P=new d.NodeNextResponse(t),j=l.NextRequestAdapter.fromNodeNextRequest(M,(0,l.signalFromNodeResponse)(t));try{let r=async a=>_.handle(j,L).finally(()=>{if(!a)return;a.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=k.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=r.get("next.route");if(n){let e=`${$} ${n}`;a.setAttributes({"next.route":n,"http.route":n,"next.span_name":e}),a.updateName(e)}else a.updateName(`${$} ${e.url}`)}),u=async o=>{var u,d;let l=async({previousCacheEntry:n})=>{try{if(!(0,i.getRequestMeta)(e,"minimalMode")&&f&&A&&!n)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let s=await r(o);e.fetchMetrics=L.renderOpts.fetchMetrics;let u=L.renderOpts.pendingWaitUntil;u&&a.waitUntil&&(a.waitUntil(u),u=void 0);let d=L.renderOpts.collectedTags;if(!b)return await (0,R.sendResponse)(M,P,s,L.renderOpts.pendingWaitUntil),null;{let e=await s.blob(),t=(0,E.toNodeOutgoingHttpHeaders)(s.headers);d&&(t[x.NEXT_CACHE_TAGS_HEADER]=d),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==L.renderOpts.collectedRevalidate&&!(L.renderOpts.collectedRevalidate>=x.INFINITE_CACHE)&&L.renderOpts.collectedRevalidate,r=void 0===L.renderOpts.collectedExpire||L.renderOpts.collectedExpire>=x.INFINITE_CACHE?void 0:L.renderOpts.collectedExpire;return{value:{kind:O.CachedRouteKind.APP_ROUTE,status:s.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:r}}}}catch(t){throw(null==n?void 0:n.isStale)&&await _.onRequestError(e,t,{routerKind:"App Router",routePath:s,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isRevalidate:F,isOnDemandRevalidate:f})},y),t}},p=await _.handleResponse({req:e,nextConfig:w,cacheKey:H,routeKind:n.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:v,isRoutePPREnabled:!1,isOnDemandRevalidate:f,revalidateOnlyGenerated:A,responseGenerator:l,waitUntil:a.waitUntil});if(!b)return null;if((null==p||null==(u=p.value)?void 0:u.kind)!==O.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==p||null==(d=p.value)?void 0:d.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,i.getRequestMeta)(e,"minimalMode")||t.setHeader("x-nextjs-cache",f?"REVALIDATED":p.isMiss?"MISS":p.isStale?"STALE":"HIT"),N&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let C=(0,E.fromNodeOutgoingHttpHeaders)(p.value.headers);return(0,i.getRequestMeta)(e,"minimalMode")&&b||C.delete(x.NEXT_CACHE_TAGS_HEADER),!p.cacheControl||t.getHeader("Cache-Control")||C.get("Cache-Control")||C.set("Cache-Control",(0,h.getCacheControlHeader)(p.cacheControl)),await (0,R.sendResponse)(M,P,new Response(p.value.body,{headers:C,status:p.value.status||200})),null};q?await u(q):await k.withPropagatedContext(e.headers,()=>k.trace(p.BaseServerSpan.handleRequest,{spanName:`${$} ${e.url}`,kind:o.SpanKind.SERVER,attributes:{"http.method":$,"http.target":e.url}},u))}catch(t){if(t instanceof C.NoFallbackError||await _.onRequestError(e,t,{routerKind:"App Router",routePath:I,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isRevalidate:F,isOnDemandRevalidate:f})}),b)throw t;return await (0,R.sendResponse)(M,P,new Response(null,{status:500})),null}}a()}catch(e){a(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__9bc799eb._.js.map