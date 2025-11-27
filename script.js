document.addEventListener('DOMContentLoaded', () => {

  // NAV SCROLL HIGHLIGHT
  const nav = document.querySelector('.nav');
  const navHeight = () => (nav ? nav.offsetHeight : 72);
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const href=a.getAttribute('href'); if(!href||href=='#') return;
      const target=document.querySelector(href); if(!target) return;
      e.preventDefault();
      const top=target.getBoundingClientRect().top+window.pageYOffset-navHeight()-12;
      window.scrollTo({top,behavior:'smooth'});
    });
  });
  const navLinks=Array.from(document.querySelectorAll('.nav-links a'));
  const sections=Array.from(document.querySelectorAll('section'));
  const io=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.target.id) return;
      const link=navLinks.find(l=>l.getAttribute('href')==`#${entry.target.id}`);
      if(!link) return;
      link.classList.toggle('active',entry.isIntersecting);
    });
  },{root:null, rootMargin:'-40% 0px -40% 0px', threshold:0});
  sections.forEach(s=>io.observe(s));

  // HERO TYPING ANIMATION
  const nameEl=document.getElementById('name');
  const words=["Surya","Prasath."];
  let wordIndex=0,charIndex=0;
  function typeWord(){
    if(wordIndex>=words.length) return;
    const current=words[wordIndex];
    if(charIndex<current.length){
      nameEl.textContent+=current.charAt(charIndex);
      charIndex++;
      setTimeout(typeWord,120);
    } else {
      wordIndex++; charIndex=0; nameEl.textContent+=' ';
      setTimeout(typeWord,300);
    }
  }
  typeWord();

  // PARTICLES + NEURON SPHERE
  const canvas=document.getElementById('neural-bg');
  const hero=document.querySelector('.hero');
  const ctx=canvas.getContext('2d',{alpha:true});
  let width=canvas.width=hero.offsetWidth;
  let height=canvas.height=hero.offsetHeight;

  const POINTS=250;
  const points=Array.from({length:POINTS},()=>({
    x:Math.random()*width, y:Math.random()*height,
    vx:(Math.random()-0.5)*0.3, vy:(Math.random()-0.5)*0.3,
    r:Math.random()*1.5+0.5, a:Math.random()*0.5+0.3
  }));

  const NEURON_POINTS=180;
  const R=Math.min(300,width*0.22);
  const neuronPoints=[];
  for(let i=0;i<NEURON_POINTS;i++){
    const u=Math.random(),v=Math.random();
    const theta=Math.acos(2*u-1);
    const phi=2*Math.PI*v;
    const x=R*Math.sin(theta)*Math.cos(phi);
    const y=R*Math.sin(theta)*Math.sin(phi);
    const z=R*Math.cos(theta);
    neuronPoints.push({x,y,z});
  }
  let angle=0;

  function render(){
    ctx.clearRect(0,0,width,height);
    for(let p of points){
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0||p.x>width) p.vx*=-1;
      if(p.y<0||p.y>height) p.vy*=-1;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(29,208,234,${p.a})`; ctx.fill();
    }
    for(let i=0;i<POINTS;i++){
      for(let j=i+1;j<Math.min(POINTS,i+20);j++){
        const dx=points[i].x-points[j].x;
        const dy=points[i].y-points[j].y;
        const dist=Math.hypot(dx,dy);
        if(dist<100){
          ctx.strokeStyle=`rgba(29,208,234,${0.12*(1-dist/100)})`;
          ctx.lineWidth=1; ctx.beginPath();
          ctx.moveTo(points[i].x,points[i].y);
          ctx.lineTo(points[j].x,points[j].y); ctx.stroke();
        }
      }
    }

    const cx=width/2, cy=height/2.6; angle+=0.002;
    const projected=neuronPoints.map(p=>{
      const cosA=Math.cos(angle), sinA=Math.sin(angle);
      const cosB=Math.cos(angle*0.4), sinB=Math.sin(angle*0.4);
      const x1=p.x*cosA-p.z*sinA;
      const z1=p.x*sinA+p.z*cosA;
      const y1=p.y*cosB-z1*sinB;
      const z2=p.y*sinB+z1*cosB;
      const scale=300/(300+z2);
      return {x:cx+x1*scale, y:cy+y1*scale, s:scale, depth:z2};
    });
    projected.sort((a,b)=>a.depth-b.depth);

    for(let i=0;i<projected.length;i++){
      const a=projected[i];
      for(let j=i+1;j<Math.min(projected.length,i+20);j++){
        const b=projected[j];
        const dx=a.x-b.x, dy=a.y-b.y;
        const dist=Math.hypot(dx,dy);
        if(dist<70){
          ctx.strokeStyle=`rgba(6,182,212,${0.08*(1-dist/70)*Math.min(a.s,b.s)})`;
          ctx.lineWidth=0.6*Math.min(a.s,b.s);
          ctx.beginPath();
          ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      }
      const glowR=5*a.s;
      const g=ctx.createRadialGradient(a.x,a.y,0,a.x,a.y,glowR);
      g.addColorStop(0,`rgba(6,182,212,${0.5*a.s})`);
      g.addColorStop(1,`rgba(6,182,212,0)`);
      ctx.fillStyle=g; ctx.beginPath();
      ctx.arc(a.x,a.y,glowR,0,Math.PI*2); ctx.fill();
      ctx.fillStyle=`rgba(230,245,255,${0.9*a.s})`; ctx.beginPath();
      ctx.arc(a.x,a.y,1.5*a.s,0,Math.PI*2); ctx.fill();
    }

    requestAnimationFrame(render);
  }

  render();
  window.addEventListener('resize',()=>{width=canvas.width=hero.offsetWidth;height=canvas.height=hero.offsetHeight;});

});
document.addEventListener('DOMContentLoaded', () => {

  /*** NAV SCROLL HIGHLIGHT ***/
  const nav = document.querySelector('.nav');
  const navHeight = () => (nav ? nav.offsetHeight : 72);

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight() - 12;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
  const sections = Array.from(document.querySelectorAll('section'));
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.target.id) return;
      const link = navLinks.find(l => l.getAttribute('href') === `#${entry.target.id}`);
      if (!link) return;
      link.classList.toggle('active', entry.isIntersecting);
    });
  }, { root: null, rootMargin: '-40% 0px -40% 0px', threshold: 0 });

  sections.forEach(s => io.observe(s));


  /*** HERO TYPING ANIMATION ***/
  const nameEl = document.getElementById('name');
  const words = ["Surya", "Prasath."];
  let wordIndex = 0, charIndex = 0;

  function typeWord() {
    if (wordIndex >= words.length) return;
    const current = words[wordIndex];
    if (charIndex < current.length) {
      nameEl.textContent += current.charAt(charIndex);
      charIndex++;
      setTimeout(typeWord, 120);
    } else {
      wordIndex++;
      charIndex = 0;
      nameEl.textContent += ' ';
      setTimeout(typeWord, 300);
    }
  }
  typeWord();


  /*** PARTICLES + NEURON SPHERE ***/
  const canvas = document.getElementById('neural-bg');
  const hero = document.querySelector('.hero');
  const ctx = canvas.getContext('2d', { alpha: true });
  let width = canvas.width = hero.offsetWidth;
  let height = canvas.height = hero.offsetHeight;

  const POINTS = 250;
  const points = Array.from({ length: POINTS }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    r: Math.random() * 1.5 + 0.5,
    a: Math.random() * 0.5 + 0.3
  }));

  const NEURON_POINTS = 180;
  const R = Math.min(300, width * 0.22);
  const neuronPoints = [];
  for (let i = 0; i < NEURON_POINTS; i++) {
    const u = Math.random(), v = Math.random();
    const theta = Math.acos(2 * u - 1);
    const phi = 2 * Math.PI * v;
    const x = R * Math.sin(theta) * Math.cos(phi);
    const y = R * Math.sin(theta) * Math.sin(phi);
    const z = R * Math.cos(theta);
    neuronPoints.push({ x, y, z });
  }

  let angle = 0;
  function render() {
    ctx.clearRect(0, 0, width, height);

    // Floating points
    for (let p of points) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(29,208,234,${p.a})`;
      ctx.fill();
    }

    // Connect points
    for (let i = 0; i < POINTS; i++) {
      for (let j = i + 1; j < Math.min(POINTS, i + 20); j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < 100) {
          ctx.strokeStyle = `rgba(29,208,234,${0.12 * (1 - dist / 100)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[j].x, points[j].y);
          ctx.stroke();
        }
      }
    }

    // Neuron sphere
    const cx = width / 2, cy = height / 2.6;
    angle += 0.002;
    const projected = neuronPoints.map(p => {
      const cosA = Math.cos(angle), sinA = Math.sin(angle);
      const cosB = Math.cos(angle * 0.4), sinB = Math.sin(angle * 0.4);
      const x1 = p.x * cosA - p.z * sinA;
      const z1 = p.x * sinA + p.z * cosA;
      const y1 = p.y * cosB - z1 * sinB;
      const z2 = p.y * sinB + z1 * cosB;
      const scale = 300 / (300 + z2);
      return { x: cx + x1 * scale, y: cy + y1 * scale, s: scale, depth: z2 };
    });
    projected.sort((a, b) => a.depth - b.depth);

    for (let i = 0; i < projected.length; i++) {
      const a = projected[i];
      for (let j = i + 1; j < Math.min(projected.length, i + 20); j++) {
        const b = projected[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 70) {
          ctx.strokeStyle = `rgba(6,182,212,${0.08 * (1 - dist / 70) * Math.min(a.s, b.s)})`;
          ctx.lineWidth = 0.6 * Math.min(a.s, b.s);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      const glowR = 5 * a.s;
      const g = ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, glowR);
      g.addColorStop(0, `rgba(6,182,212,${0.5 * a.s})`);
      g.addColorStop(1, `rgba(6,182,212,0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(a.x, a.y, glowR, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(230,245,255,${0.9 * a.s})`;
      ctx.beginPath();
      ctx.arc(a.x, a.y, 1.5 * a.s, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(render);
  }
  render();
  window.addEventListener('resize', () => {
    width = canvas.width = hero.offsetWidth;
    height = canvas.height = hero.offsetHeight;
  });


  /*** MOBILE NAV TOGGLE ***/
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-links');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      if (navMenu.style.display === 'flex') {
        navMenu.style.display = 'none';
      } else {
        navMenu.style.display = 'flex';
      }
    });
    // Close menu on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) navMenu.style.display = 'none';
      });
    });
  }

});
const aboutContent = document.querySelectorAll('.about-content'); // or the class you use for your about section blocks

const aboutObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('slide-in');
    }
  });
}, { threshold: 0.3 });

aboutContent.forEach(el => {
  aboutObserver.observe(el);
});