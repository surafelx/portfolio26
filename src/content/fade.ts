import type { Side } from "./site";

export const FADE_KEY = "fade";

/**
 * The Engineer–Artist crossfader is switched off for now: the whole site shows the engineer.
 * Set this to true to bring the slider back; everything it drives is still in place.
 */
export const FADER_ON = false;

export const sideFor = (fade: number): Side => (fade < 0.34 ? "engineer" : fade < 0.67 ? "middle" : "artist");

export function applyFade(fade: number) {
  const root = document.documentElement;
  root.style.setProperty("--fade", fade.toFixed(2));
  root.dataset.side = sideFor(fade);
}

/**
 * Runs in <head> before first paint, so the page never flashes the wrong side.
 * With the fader off it's always the engineer. Otherwise a visitor's own choice wins, then the hour in Addis
 * decides: the engineer by day, the artist at night.
 * Kept as a string because it is inlined, not bundled.
 */
export const fadeBootScript = `(function(){try{
var r=document.documentElement,f=null;r.dataset.fader="${FADER_ON ? "on" : "off"}";
if(${!FADER_ON}||location.pathname==="/work"){f=0}else{try{var s=localStorage.getItem("${FADE_KEY}");if(s!==null&&!isNaN(+s))f=+s}catch(e){}}
if(f===null){var h=+new Intl.DateTimeFormat("en-GB",{hour:"numeric",hourCycle:"h23",timeZone:"Africa/Addis_Ababa"}).format(new Date());f=(h>=7&&h<18)?0.15:(h>=18&&h<21)?0.5:0.82}
r.style.setProperty("--fade",f.toFixed(2));r.dataset.side=f<0.34?"engineer":f<0.67?"middle":"artist";
}catch(e){}})();`;
