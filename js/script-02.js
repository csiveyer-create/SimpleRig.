(()=>{
'use strict';
async function clearOldSimpleRigCaches(){
  try{
    if('serviceWorker' in navigator){
      const regs=await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(reg=>reg.unregister()));
    }
    if('caches' in window){
      const keys=await caches.keys();
      await Promise.all(keys.map(key=>caches.delete(key)));
    }
    const marker='simplerig-cache-cleared-v3';
    if(!sessionStorage.getItem(marker)){
      sessionStorage.setItem(marker,'1');
      const url=new URL(location.href);
      url.searchParams.set('build','simple-loads-v3');
      location.replace(url.toString());
    }
  }catch(error){
    console.warn('SimpleRig cache cleanup could not complete:',error);
  }
}
clearOldSimpleRigCaches();
})();
