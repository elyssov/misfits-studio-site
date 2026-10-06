document.documentElement.classList.add("js");

const toggle=document.querySelector(".nav-toggle");
const nav=document.querySelector("#nav");
toggle?.addEventListener("click",()=>{
  const open=toggle.getAttribute("aria-expanded")==="true";
  toggle.setAttribute("aria-expanded",String(!open));
  nav.classList.toggle("open",!open);
});
nav?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{
  toggle?.setAttribute("aria-expanded","false");
  nav.classList.remove("open");
}));
document.addEventListener("keydown",e=>{
  if(e.key==="Escape"&&nav?.classList.contains("open")){
    toggle.setAttribute("aria-expanded","false");
    nav.classList.remove("open");
    toggle.focus();
  }
});

const year=document.querySelector("#year");
if(year)year.textContent=String(new Date().getFullYear());

// Reveal motion. Without IntersectionObserver everything simply stays visible.
const reveals=document.querySelectorAll(".reveal");
const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if(reduced||!("IntersectionObserver" in window)){
  reveals.forEach(el=>el.classList.add("is-visible"));
}else{
  const io=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add("is-visible");io.unobserve(entry.target)}
  }),{threshold:.12});
  reveals.forEach(el=>io.observe(el));
}

// Gallery: every [data-full] opens in one dialog; arrows step, Esc closes.
// Without JavaScript the enclosing link still opens the full image.
const box=document.querySelector(".lightbox");
const items=[...document.querySelectorAll("[data-full]")];
if(box&&items.length&&typeof box.showModal==="function"){
  const img=box.querySelector("img");
  const caption=box.querySelector(".lightbox-caption");
  let index=0;
  let opener=null;
  const show=i=>{
    index=(i+items.length)%items.length;
    const item=items[index];
    img.src=item.dataset.full;
    img.alt=item.querySelector("img")?.alt||"";
    caption.textContent=item.dataset.caption||img.alt;
  };
  items.forEach((item,i)=>item.addEventListener("click",e=>{
    e.preventDefault();
    opener=item;
    show(i);
    box.showModal();
  }));
  box.querySelector("[data-prev]").addEventListener("click",()=>show(index-1));
  box.querySelector("[data-next]").addEventListener("click",()=>show(index+1));
  box.querySelector("[data-close]").addEventListener("click",()=>box.close());
  box.addEventListener("keydown",e=>{
    if(e.key==="ArrowLeft")show(index-1);
    if(e.key==="ArrowRight")show(index+1);
  });
  box.addEventListener("click",e=>{if(e.target===box)box.close()});
  box.addEventListener("close",()=>opener?.focus());
}
