import Script from "next/script";
import { exelyContextId, exelyLoaderHosts, getExelyLocale } from "@/config/exely";
import type { Locale } from "@/config/site";

export function ExelyScript({ locale }: { locale: Locale }) {
  const commands = [
    ["setContext", exelyContextId, getExelyLocale(locale)],
  ];

  const code = `
!function(e,n){
  var t="bookingengine",o="integration",i=e[t]=e[t]||{},a=i[o]=i[o]||{},r="__cq",c="__loader",d="getElementsByTagName";
  if(n=n||[],a[r]=a[r]?a[r].concat(n):n,!a[c]){
    a[c]=true;
    var l=e.document,g=l[d]("head")[0]||l[d]("body")[0];
    !function load(hosts){
      if(hosts.length===0)return;
      var script=l.createElement("script");
      script.type="text/javascript";
      script.async=true;
      script.src="https://"+hosts[0]+"/integration/loader.js";
      script.onerror=script.onload=function(current,next){
        return function(){
          if(!e.bookingengine||!e.bookingengine.integration||!e.bookingengine.integration.loaded){
            if(current.parentNode){current.parentNode.removeChild(current);}
            next();
          }
        };
      }(script,function(){load(hosts.slice(1));});
      g.appendChild(script);
    }(${JSON.stringify(exelyLoaderHosts)});
  }
}(window, ${JSON.stringify(commands)});
`;

  return (
    <Script id={`exely-booking-engine-${locale}`} strategy="beforeInteractive">
      {code}
    </Script>
  );
}
