'use strict';
const $ = (selector, parent = document) => parent.querySelector(selector);
const safeText = (value, fallback = '') => typeof value === 'string' ? value : fallback;
const make = (tag, className = '', text = '') => { const el = document.createElement(tag); if(className) el.className = className; if(text) el.textContent = text; return el; };
const setText = (selector, text) => { const el = $(selector); if(el && typeof text === 'string') el.textContent = text; };
const validImage = value => typeof value === 'string' && (value.startsWith('/media/') || value.startsWith('media/')) && !value.includes('..') && !/[<>"']/.test(value);

function renderServices(items) {
  if (!Array.isArray(items) || !items.length) return;
  const icons = ['✳','✺','✎','✿','❋','↻','✷'];
  const grid = $('#services-grid'); grid.replaceChildren();
  items.forEach((item, i) => {
    const card = make('article', 'service-card');
    const no = make('span', 'service-no', String(i + 1).padStart(2, '0'));
    const icon = make('div', 'service-icon', icons[i % icons.length]); icon.setAttribute('aria-hidden','true');
    const h = make('h3', '', safeText(item.title));
    const p = make('p', '', safeText(item.description));
    const a = make('a', '', 'Let\'s talk ↗'); a.href='#quote'; a.setAttribute('aria-label', `Request a quote for ${safeText(item.title,'artwork')}`);
    card.append(no, icon, h, p, a); grid.append(card);
  });
}
function renderPackages(items) {
  if (!Array.isArray(items) || !items.length) return;
  const grid = $('#packages-grid'); grid.replaceChildren();
  items.forEach(item => {
    const card = make('article', 'package-card');
    const tag = make('span', '', safeText(item.tag));
    const title = make('h3','',safeText(item.title));
    const p = make('p','',safeText(item.description));
    const a = make('a','','Request pricing ↗'); a.href='#quote';
    card.append(tag,title,p,a); grid.append(card);
  });
}
function renderArtists(items) {
  if (!Array.isArray(items) || !items.length) return;
  const grid=$('#artist-grid');grid.replaceChildren();
  items.forEach(item => {
    const card=make('article','artist-card');const picture=make('div','artist-image');
    if(validImage(item.photo)) {const img=make('img');img.src=item.photo;img.alt=`Portrait of ${safeText(item.name,'artist')}`;img.loading='lazy';picture.append(img);} else {picture.classList.add('blank-photo');picture.append(make('span','','YOUR PHOTO HERE'));}
    const meta=make('div','artist-meta');const info=make('div');info.append(make('h3','',safeText(item.name)),make('p','',safeText(item.title)));const star=make('span','','✳');star.setAttribute('aria-hidden','true');meta.append(info,star);card.append(picture,meta);grid.append(card);
  });
}
let projects=[];
let currentFilter='All';
function renderPortfolio() {
  const grid=$('#portfolio-grid'); grid.replaceChildren();
  const visible=projects.filter(p=>currentFilter==='All'||p.category===currentFilter);
  if(!visible.length){const empty=make('div','gallery-empty');empty.append(make('h3','','A little more art is on its way.'),make('p','','We haven\'t added any work to this category just yet.'));grid.append(empty);return;}
  visible.forEach((item,i)=>{
    const card=make('article','portfolio-item'); const art=make('div','portfolio-art');const real=validImage(item.image);
    if(real){const img=make('img');img.src=item.image;img.loading='lazy';img.alt=safeText(item.description,`${safeText(item.title,'Painted window project')} by Laurel Ann Studio`);art.append(img);}else{const place=make('div','portfolio-placeholder');place.append(make('span','',String(projects.indexOf(item)+1).padStart(2,'0')),make('strong','','YOUR NEXT MASTERPIECE'),make('small','','PORTFOLIO PHOTO COMING SOON'));art.append(place);}
    const caption=make('div','portfolio-caption');const names=make('div');names.append(make('h3','',real?safeText(item.title,'Our artwork'):'A little art is coming'),make('p','',real?safeText(item.category,'Custom artwork'):'Future studio project'));
    const number=make('span','portfolio-index',String(projects.indexOf(item)+1).padStart(2,'0'));caption.append(names,number);card.append(art,caption);grid.append(card);
  });
}
function renderReviews(items) {
  const section=$('#reviews');const grid=$('#reviews-grid');grid.replaceChildren();
  if(!Array.isArray(items)||!items.length){section.hidden=true;return;}
  const publicReviews=items.filter(x=>x && typeof x.quote==='string' && x.quote.trim() && typeof x.name==='string' && x.name.trim());
  if(!publicReviews.length){section.hidden=true;return;}
  section.hidden=false;
  publicReviews.forEach(item=>{const card=make('article','review-card');const block=make('blockquote','',`“${item.quote}”`);const cite=make('cite','',`— ${item.name}`);card.append(block,cite);grid.append(card);});
}
function renderFaq(items) {
  if(!Array.isArray(items)||!items.length)return;
  const list=$('#faq-list');list.replaceChildren();
  items.forEach(item=>{const details=make('details');const summary=make('summary');summary.append(document.createTextNode(safeText(item.question)),make('span','','+'));const p=make('p','',safeText(item.answer));details.append(summary,p);list.append(details);});
}
function updateContact(data) {
  const phone=String(data.phone||'4708412728').replace(/\D/g,'');if(phone.length===10){document.querySelectorAll('a[href^="tel:"]').forEach(a=>{a.href=`tel:+1${phone}`;a.textContent=`(${phone.slice(0,3)}) ${phone.slice(3,6)}-${phone.slice(6)}${a.closest('.quote-aside')?' ↗':''}`;});}
  const email=$('#email-link');if(typeof data.email==='string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)){email.href=`mailto:${data.email}`;email.textContent=data.email;email.hidden=false;}else email.hidden=true;
  const social=$('#social-links');social.replaceChildren();
  ['instagram','facebook'].forEach(key=>{const url=data[key];if(typeof url==='string' && /^https:\/\/(www\.)?(instagram\.com|facebook\.com|www\.facebook\.com)\//i.test(url)){const a=make('a','',key==='instagram'?'Instagram ↗':'Facebook ↗');a.href=url;a.target='_blank';a.rel='noopener noreferrer';social.append(a);}});
}
async function loadContent(){try{const res=await fetch('/data/site.json',{cache:'no-cache'});if(!res.ok)throw Error('Content unavailable');const data=await res.json();setText('#hero-description',data.hero_description);setText('#intro-description',data.intro_description);setText('#studio-story',data.studio_story);renderServices(data.services);renderPackages(data.packages);renderArtists(data.artists);projects=Array.isArray(data.portfolio)?data.portfolio:[];renderPortfolio();renderReviews(data.reviews);renderFaq(data.faqs);updateContact(data);}catch(e){console.warn('Could not load editable site content:',e);}}
const menuButton=$('.menu-toggle');const mobileMenu=$('#mobile-menu');
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!open));menuButton.setAttribute('aria-label',open?'Open navigation menu':'Close navigation menu');mobileMenu.hidden=open;});
mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobileMenu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open navigation menu');}));
$('#gallery-filters').addEventListener('click',e=>{const button=e.target.closest('button[data-filter]');if(!button)return;currentFilter=button.dataset.filter;$('#gallery-filters').querySelectorAll('button').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});renderPortfolio();});
$('#copyright-year').textContent=String(new Date().getFullYear());
const dateInput=$('#preferred-date');dateInput.min=new Date(new Date().getTime()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,10);
const MAX_IMAGE=3.5*1024*1024;const MAX_TOTAL=7.3*1024*1024;const acceptedTypes=['image/jpeg','image/png','image/webp'];
const uploadIds=[['window-photo','window-preview'],['inspiration-photo','inspiration-preview']];
function showError(text){const el=$('#form-error');el.textContent=text;el.hidden=!text;}
function validateFile(file){if(!file)return '';if(!acceptedTypes.includes(file.type))return 'Please use a JPG, PNG, or WebP image.';if(file.size>MAX_IMAGE)return 'Each photo must be 3.5 MB or smaller. Please choose a smaller image.';return '';}
for(const [inputId,previewId] of uploadIds){const input=$('#'+inputId);const preview=$('#'+previewId);input.addEventListener('change',()=>{preview.replaceChildren();const file=input.files?.[0];const err=validateFile(file);if(err){showError(err);input.value='';return;}showError('');if(!file)return;preview.append(make('span','',file.name));const img=make('img');img.alt='Selected image preview';const url=URL.createObjectURL(file);img.src=url;img.onload=()=>URL.revokeObjectURL(url);preview.append(img);});}
$('#quote-form').addEventListener('submit',event=>{showError('');const files=uploadIds.map(([id])=>$('#'+id).files?.[0]).filter(Boolean);for(const file of files){const err=validateFile(file);if(err){event.preventDefault();showError(err);return;}}if(files.reduce((sum,file)=>sum+file.size,0)>MAX_TOTAL){event.preventDefault();showError('Your photos are too large together. Please choose smaller images (under 7 MB total).');return;}const submit=$('.btn-submit');submit.disabled=true;submit.textContent='Sending your request…';});
loadContent();
