import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(await readFile(resolve(root, 'content/projects.json'), 'utf8'));
const { profile, projects } = data;
const featured = projects.filter(p => p.featured);
const expected = ['four-axis', 'doorbell', 'goai', 'trajectory'];
if (featured.length !== 4 || expected.some(id => !featured.find(p => p.id === id))) throw new Error('Four reviewed featured projects required.');
if (new Set(projects.map(p => p.repo)).size !== 17) throw new Error('Exactly 17 distinct public project repositories required.');
const escape = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const cleanList = values => values.map(escape);
const categories = new Set(['robotics','learning','embedded','control','vision','signals','electronics','fundamentals']);
for (const p of projects) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.id) || !/^https:\/\/github\.com\/wudi-tech\/[a-zA-Z0-9._-]+$/.test(p.repo)) throw new Error(`Invalid project identifier or repository: ${p.id}`);
  if (!categories.has(p.category)) throw new Error(`Unknown category: ${p.category}`);
  for (const lang of ['zh', 'en']) {
    if (!p[lang]?.title || !p[lang]?.summary || !p[lang]?.role || ['contributions', 'flow', 'results', 'scope'].some(k => !Array.isArray(p[lang][k]))) throw new Error(`Incomplete ${lang} project: ${p.id}`);
  }
}
const strings = {
  zh: {
    name: profile.nameZh, title: '从感知到行动，\n构建机器人系统。', description: profile.introZh,
    navProjects: '项目', navAbout: '关于', navContact: '联系', menu: '菜单', skip: '跳至正文', language: 'Switch to English', languageShort: 'EN',
    eyebrow: 'AUTOMATION / ROBOTICS / AUTONOMOUS SYSTEMS', explore: '查看项目', aboutLink: '关于我',
    selected: '精选项目', selectedHeading: '项目，是我理解系统的方式。', selectedIntro: '四项实践，连接视觉、控制、嵌入式与具身操作。',
    read: '阅读项目', allProjects: '查看全部项目', indexTitle: '完整项目索引', indexIntro: '17 个公开仓库，覆盖机器人系统、算法与课程实践。每项说明都保留个人贡献和验证范围。',
    schematic: '系统示意 · 非实物或运行记录', focus: '关注完整系统中的接口、实现与验证。',
    role: '本人角色', period: '项目时间', scene: '场景与目标', contributions: '我的贡献', flow: '系统流程', results: '已有结果', scope: '验证范围与限制', materials: '公开材料', repository: '查看 GitHub 仓库',
    scopeNote: '结果应与测量对象和验证条件一同阅读。历史记录、主机检查与真实设备验证分别说明。',
    skills: '由项目支撑的能力', skillsIntro: '把方法放回具体任务，在接口与实现中理解它们。',
    skillRows: [['感知与视觉', 'Python / OpenCV / YOLOv8', '目标检测、相机标定与平面坐标映射。'], ['运动学与控制', 'MATLAB / PID / PyBullet', '正逆运动学、轨迹规划、跟踪与仿真分析。'], ['嵌入式与通信', 'ESP-IDF / ESP32-P4/C5 / WebRTC', '板级移植、传感器接口与音视频系统联调。'], ['模型适配与评测', 'StarVLA / QwenOFT', '多视角与状态接口、训练流程及本地仿真评测。']],
    aboutTitle: '把算法连接到\n可以运行的系统。',
    about: '我是一名自动化专业本科生，关注机器人与自主系统。我希望把感知、规划和控制放在完整系统中理解，也重视清楚的接口、可追溯的实验记录，以及对真实设备与仿真结果的准确区分。',
    contact: '继续交流机器人\n与系统实践。', contactText: '项目源码、说明与验证范围均整理在 GitHub。', github: '访问 GitHub', footer: '吴迪 · 机器人与自主系统', footerNote: '基于公开项目与可追溯记录。',
    back: '返回完整项目索引', next: '下一个项目', all: '全部', filter: '按方向筛选', count: '个仓库', noResults: '当前分类没有项目。', archiveDetails: '查看贡献、结果与完整验证范围',
    categories: { robotics: '机器人', learning: '学习与定位', embedded: '嵌入式', control: '控制', vision: '视觉', signals: '信号', electronics: '电子设计', fundamentals: '编程基础' },
    notFound: '这一页没有连接上。', notFoundText: '可以回到首页，或从完整项目索引继续浏览。', home: '返回首页'
  },
  en: {
    name: profile.nameEn, title: 'Connecting perception\nto action.', description: profile.introEn,
    navProjects: 'Projects', navAbout: 'About', navContact: 'Contact', menu: 'Menu', skip: 'Skip to content', language: '切换到中文', languageShort: '中文',
    eyebrow: 'AUTOMATION / ROBOTICS / AUTONOMOUS SYSTEMS', explore: 'Explore projects', aboutLink: 'About me',
    selected: 'Selected work', selectedHeading: 'Learning through systems.', selectedIntro: 'Four projects across vision, control, embedded systems, and embodied policies.',
    read: 'Read project', allProjects: 'View all projects', indexTitle: 'Project index', indexIntro: '17 public repositories across robotics, algorithms, and coursework. Each description keeps personal contributions and validation scope in view.',
    schematic: 'System schematic · not a device photo or execution record', focus: 'Interfaces, implementation, and verification in complete systems.',
    role: 'My role', period: 'Period', scene: 'Context & objective', contributions: 'My contributions', flow: 'System flow', results: 'Recorded results', scope: 'Validation scope & limitations', materials: 'Public materials', repository: 'View GitHub repository',
    scopeNote: 'Read results alongside their measurement targets and conditions. Historical records, host checks, and device validation are distinguished.',
    skills: 'Skills grounded in projects', skillsIntro: 'Understanding methods through the tasks, interfaces, and systems that use them.',
    skillRows: [['Perception & vision', 'Python / OpenCV / YOLOv8', 'Object detection, camera calibration, and planar coordinate mapping.'], ['Kinematics & control', 'MATLAB / PID / PyBullet', 'Forward and inverse kinematics, trajectory planning, tracking, and simulation.'], ['Embedded & communication', 'ESP-IDF / ESP32-P4/C5 / WebRTC', 'Board porting, sensor interfaces, and audio/video integration.'], ['Policy adaptation & evaluation', 'StarVLA / QwenOFT', 'Multi-view and state interfaces, training workflows, and local simulation evaluation.']],
    aboutTitle: 'Connecting algorithms\nto working systems.',
    about: 'I am an undergraduate student in Automation interested in robotics and autonomous systems. I want to understand perception, planning, and control as parts of complete systems. I value clear interfaces, traceable experimental records, and an accurate distinction between physical-device and simulation results.',
    contact: 'Let’s talk robotics\nand systems.', contactText: 'Code, project notes, and validation boundaries are available on GitHub.', github: 'Visit GitHub', footer: 'Di Wu · Robotics & Autonomous Systems', footerNote: 'Built on public projects and traceable records.',
    back: 'Back to project index', next: 'Next project', all: 'All', filter: 'Filter by area', count: 'repositories', noResults: 'No projects in this category.', archiveDetails: 'Contributions, results & full validation scope',
    categories: { robotics: 'Robotics', learning: 'Learning & localization', embedded: 'Embedded', control: 'Control', vision: 'Vision', signals: 'Signals', electronics: 'Electronics', fundamentals: 'Programming' },
    notFound: 'This connection is missing.', notFoundText: 'Return to the homepage, or continue browsing the project index.', home: 'Back to home'
  }
};
const origin = 'https://wudi-tech.github.io';
const pathFor = (lang, page = '') => `${lang === 'en' ? '/en' : ''}/${page ? `${page}/` : ''}`;
const arrow = '<span aria-hidden="true">↗</span>';
const tags = values => `<ul class="tags" aria-label="Technologies">${cleanList(values).map(t => `<li>${t}</li>`).join('')}</ul>`;
const list = values => `<ul class="prose-list">${cleanList(values).map(v => `<li>${v}</li>`).join('')}</ul>`;
function diagram(lang, flow, { hero = false } = {}) {
  const s = strings[lang];
  const labels = flow ?? (lang === 'zh' ? ['视觉感知', '坐标映射', '运动控制', '系统交互'] : ['Perception', 'Coordinate mapping', 'Motion control', 'Interaction']);
  return `<figure class="system-figure ${hero ? 'hero-figure' : ''}">
    <div class="diagram-head"><span>${hero ? 'PERCEPTION → ACTION' : 'SYSTEM / FLOW'}</span><span aria-hidden="true">⊕</span></div>
    ${hero ? `<svg class="robot-schematic" viewBox="0 0 320 210" fill="none" aria-hidden="true"><path class="diagram-grid" d="M0 50H320M0 100H320M0 150H320M60 0V210M120 0V210M180 0V210M240 0V210M300 0V210"/><path class="diagram-axis" d="M45 177H280M65 195V25"/><path d="M65 177L136 127L185 57L251 87" stroke="currentColor" stroke-width="9" stroke-linejoin="round"/><path d="M57 177H100M253 76L271 90L263 109M251 87L266 98" stroke="currentColor" stroke-width="3"/><circle cx="136" cy="127" r="10" fill="#123E32" stroke="currentColor" stroke-width="2"/><circle cx="185" cy="57" r="10" fill="#123E32" stroke="currentColor" stroke-width="2"/><circle cx="251" cy="87" r="5" fill="#BDE0C7"/><path d="M145 160C180 145 204 127 235 115" stroke="#BDE0C7" stroke-dasharray="4 5"/><path d="M222 113L235 115L229 127" stroke="#BDE0C7"/><text x="276" y="192" fill="currentColor" font-size="10">x</text><text x="47" y="25" fill="currentColor" font-size="10">z</text></svg>` : ''}
    <ol class="diagram-flow">${labels.map((label, i) => `<li><span class="diagram-number">${String(i + 1).padStart(2, '0')}</span><span>${escape(label)}</span></li>`).join('')}</ol>
    <figcaption>${escape(s.schematic)}</figcaption>
  </figure>`;
}
function header(lang, page) {
  const s = strings[lang], other = lang === 'zh' ? 'en' : 'zh';
  return `<a class="skip-link" href="#main">${s.skip}</a><header class="site-header"><div class="container header-inner">
    <a class="wordmark" href="${pathFor(lang)}" aria-label="${escape(s.name)} — ${lang === 'zh' ? '首页' : 'Home'}"><span class="wordmark-symbol" aria-hidden="true">w.</span><span>${escape(s.name)}<small>ROBOTICS / SYSTEMS</small></span></a>
    <button class="menu-toggle" aria-expanded="false" aria-controls="site-nav" hidden><span>${s.menu}</span><span class="menu-lines" aria-hidden="true"></span></button>
    <nav id="site-nav" aria-label="${lang === 'zh' ? '主导航' : 'Main navigation'}"><a href="${page ? pathFor(lang,'projects') : `${pathFor(lang)}#projects`}"${page === 'projects' ? ' aria-current="page"' : ''}>${s.navProjects}</a><a href="${pathFor(lang)}#about">${s.navAbout}</a><a href="${pathFor(lang)}#contact">${s.navContact}</a><a class="language-link" href="${pathFor(other, page)}" lang="${other === 'zh' ? 'zh-CN' : 'en'}" hreflang="${other === 'zh' ? 'zh-CN' : 'en'}" data-language="${other}" aria-label="${s.language}">${s.languageShort}</a></nav>
  </div></header>`;
}
function footer(lang) {
  const s = strings[lang];
  return `<footer class="site-footer"><div class="container footer-inner"><span>${s.footer}</span><span>${s.footerNote}</span><a href="${escape(profile.github)}">GitHub ${arrow}</a></div></footer>`;
}
function document(lang, page, title, description, body) {
  const url = origin + pathFor(lang, page), other = lang === 'zh' ? 'en' : 'zh';
  return `<!doctype html>
<html lang="${lang === 'zh' ? 'zh-CN' : 'en'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light"><meta name="theme-color" content="#F7F8F7"><title>${escape(title)}</title><meta name="description" content="${escape(description)}"><link rel="canonical" href="${url}"><link rel="alternate" hreflang="zh-CN" href="${origin + pathFor('zh', page)}"><link rel="alternate" hreflang="en" href="${origin + pathFor('en', page)}"><link rel="alternate" hreflang="x-default" href="${origin + pathFor('zh', page)}"><meta property="og:type" content="website"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${url}"><meta property="og:locale" content="${lang === 'zh' ? 'zh_CN' : 'en_US'}"><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/assets/site.css"><script defer src="/assets/site.js"></script></head>
<body data-language="${lang}" data-alternate="${pathFor(other, page)}">${header(lang, page)}<main id="main" tabindex="-1">${body}</main>${footer(lang)}</body></html>\n`;
}
function home(lang) {
  const s = strings[lang];
  const rows = expected.map((id, i) => {
    const p = featured.find(p => p.id === id), c = p[lang];
    return `<article class="project-row"><div class="project-row-visual"><span class="project-number">0${i + 1} / ${escape(s.categories[p.category])}</span>${diagram(lang, c.flow)}</div><div class="project-row-copy"><h3><a href="${pathFor(lang, `projects/${p.id}`)}">${escape(c.title)}</a></h3><p class="project-summary">${escape(c.summary)}</p><dl class="project-meta"><div><dt>${s.role}</dt><dd>${escape(c.role)}</dd></div>${c.period ? `<div><dt>${s.period}</dt><dd>${escape(c.period)}</dd></div>` : ''}</dl>${tags(p.tags.slice(0, 4))}<p class="project-result">${escape(c.results[0] ?? '')}</p><a class="text-link" href="${pathFor(lang, `projects/${p.id}`)}">${s.read} <span aria-hidden="true">→</span></a></div></article>`;
  }).join('');
  return document(lang, '', `${s.name} | ${lang === 'zh' ? '机器人与自主系统' : 'Robotics & Autonomous Systems'}`, s.description,
    `<section class="hero container"><div class="hero-copy"><p class="eyebrow">${s.eyebrow}</p><h1>${s.title.split('\n').map(escape).join('<br>')}</h1><p class="hero-intro">${escape(s.description)}</p><div class="actions"><a class="button button-primary" href="#projects">${s.explore}<span aria-hidden="true">↓</span></a><a class="button button-secondary" href="#about">${s.aboutLink}</a></div><p class="hero-note"><span aria-hidden="true">01 /</span> ${s.focus}</p></div>${diagram(lang, null, {hero:true})}</section>
    <section class="section container" id="projects" aria-labelledby="selected-heading"><div class="section-heading"><p class="eyebrow">01 / ${s.selected}</p><h2 id="selected-heading">${s.selectedHeading}</h2><p>${s.selectedIntro}</p></div><div class="featured-projects">${rows}</div><a class="index-callout" href="${pathFor(lang, 'projects')}"><span>${s.allProjects}<small>${lang === 'zh' ? '17 个公开仓库 · 算法、系统与课程实践' : '17 public repositories · algorithms, systems, and coursework'}</small></span><span aria-hidden="true">↗</span></a></section>
    <section class="section skills-section" aria-labelledby="skills-heading"><div class="container"><div class="section-heading"><p class="eyebrow">02 / ${lang === 'zh' ? '能力' : 'Practice'}</p><h2 id="skills-heading">${s.skills}</h2><p>${s.skillsIntro}</p></div><div class="skills-list">${s.skillRows.map((row, i) => `<div class="skill-row"><span class="mono">0${i+1}</span><h3>${row[0]}</h3><div><p class="skill-tech">${row[1]}</p><p>${row[2]}</p></div></div>`).join('')}</div></div></section>
    <section class="section container about-section" id="about" aria-labelledby="about-heading"><div><p class="eyebrow">03 / ${lang === 'zh' ? '关于' : 'About'}</p><h2 id="about-heading">${s.aboutTitle.split('\n').join('<br>')}</h2></div><p class="about-copy">${s.about}</p></section>
    <section class="contact-section" id="contact" aria-labelledby="contact-heading"><div class="container contact-inner"><div><p class="eyebrow">04 / ${lang === 'zh' ? '联系' : 'Contact'}</p><h2 id="contact-heading">${s.contact.split('\n').join('<br>')}</h2><p>${s.contactText}</p></div><a class="button button-light" href="${escape(profile.github)}">${s.github} ${arrow}</a></div></section>`);
}
function projectPage(lang, p) {
  const s=strings[lang], c=p[lang], next=featured[(featured.findIndex(x=>x.id===p.id)+1)%featured.length];
  const sections=[['contributions',s.contributions,list(c.contributions)],['flow',s.flow,`<ol class="process-list">${c.flow.map((f,i)=>`<li><span class="mono">${String(i+1).padStart(2,'0')}</span><span>${escape(f)}</span></li>`).join('')}</ol>`],['results',s.results,list(c.results)],['scope',s.scope,`<p class="scope-note">${s.scopeNote}</p>${list(c.scope)}`]];
  return document(lang,`projects/${p.id}`,`${c.title} | ${s.name}`,c.summary,
    `<div class="container detail-container"><a class="back-link" href="${pathFor(lang,'projects')}"><span aria-hidden="true">←</span> ${s.back}</a><header class="detail-header"><p class="eyebrow">${escape(s.categories[p.category])} / SELECTED PROJECT</p><h1>${escape(c.title)}</h1><p class="detail-summary">${escape(c.summary)}</p><dl class="project-meta"><div><dt>${s.role}</dt><dd>${escape(c.role)}</dd></div>${c.period?`<div><dt>${s.period}</dt><dd>${escape(c.period)}</dd></div>`:''}</dl>${tags(p.tags)}</header>${diagram(lang,c.flow)}<div class="detail-body"><aside class="detail-nav" aria-label="${lang==='zh'?'本页目录':'On this page'}">${sections.map(([id,label])=>`<a href="#${id}">${label}</a>`).join('')}<a href="#materials">${s.materials}</a></aside><div class="detail-prose"><section class="prose-section"><p class="eyebrow">00 / ${s.scene}</p><p>${escape(c.summary)}</p></section>${sections.map(([id,label,body],i)=>`<section class="prose-section" id="${id}"><h2><span class="section-number">0${i+1}</span>${label}</h2>${body}</section>`).join('')}<section class="prose-section" id="materials"><h2><span class="section-number">05</span>${s.materials}</h2><a class="button button-primary" href="${escape(p.repo)}">${s.repository} ${arrow}</a></section></div></div><nav class="next-project" aria-label="${s.next}"><span>${s.next}</span><a href="${pathFor(lang,`projects/${next.id}`)}">${escape(next[lang].title)} <span aria-hidden="true">→</span></a></nav></div>`);
}
function index(lang) {
  const s=strings[lang], categories=Object.keys(s.categories).filter(k=>projects.some(p=>p.category===k));
  return document(lang,'projects',`${s.indexTitle} | ${s.name}`,s.indexIntro,
    `<section class="container index-section"><header class="index-header"><p class="eyebrow">PROJECT ARCHIVE / 17 REPOSITORIES</p><h1>${s.indexTitle}</h1><p>${s.indexIntro}</p></header><div class="project-filters" role="group" aria-label="${s.filter}" hidden><button type="button" class="filter-button" data-filter="all" aria-pressed="true">${s.all}</button>${categories.map(k=>`<button type="button" class="filter-button" data-filter="${k}" aria-pressed="false">${s.categories[k]}</button>`).join('')}</div><p class="index-count" aria-live="polite" aria-atomic="true"><span id="result-count">${projects.length}</span> ${s.count}</p><div class="repository-list">${projects.map((p,i)=>{const c=p[lang];return `<article class="repository-row" data-category="${escape(p.category)}"><span class="repository-number mono">${String(i+1).padStart(2,'0')}</span><div><p class="eyebrow">${escape(s.categories[p.category])}</p><h2><a href="${p.featured?pathFor(lang,`projects/${p.id}`):escape(p.repo)}">${escape(c.title)}</a></h2><p>${escape(c.summary)}</p><p class="repository-role"><span>${s.role}</span> ${escape(c.role)}</p><p class="repository-scope">${escape(c.scope[0]??'')}</p>${tags(p.tags)}<details class="archive-details"><summary>${s.archiveDetails}</summary><div><h3>${s.contributions}</h3>${list(c.contributions)}<h3>${s.results}</h3>${list(c.results)}<h3>${s.scope}</h3>${list(c.scope)}</div></details></div><a class="repo-link" href="${escape(p.repo)}" aria-label="GitHub: ${escape(c.title)}">GitHub ${arrow}</a></article>`;}).join('')}</div><p id="no-results" hidden>${s.noResults}</p></section>`);
}
async function emit(path, content) { const file=resolve(root,path); await mkdir(dirname(file),{recursive:true}); await writeFile(file,content); }
for (const lang of ['zh','en']) {
  const prefix=lang==='en'?'en/':'';
  await emit(`${prefix}index.html`,home(lang));
  await emit(`${prefix}projects/index.html`,index(lang));
  for (const p of featured) await emit(`${prefix}projects/${p.id}/index.html`,projectPage(lang,p));
}
await emit('404.html',document('zh','', '页面未找到 / Page not found | 吴迪', '返回吴迪的机器人与自主系统作品集。', `<section class="container not-found"><p class="eyebrow">404 / CONNECTION NOT FOUND</p><h1>这一页没有连接上。</h1><p lang="en">This connection is missing.</p><p>可以回到首页，或从完整项目索引继续浏览。</p><div class="actions"><a class="button button-primary" href="/">返回首页</a><a class="button button-secondary" href="/en/" lang="en">English home</a><a class="text-link" href="/projects/">完整项目索引 →</a></div></section>`));
await emit('.nojekyll','');
await emit('robots.txt',`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
const pages=['','projects',...featured.map(p=>`projects/${p.id}`)];
await emit('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['zh','en'].flatMap(lang=>pages.map(page=>`<url><loc>${origin+pathFor(lang,page)}</loc></url>`)).join('')}</urlset>\n`);
console.log(JSON.stringify({status:'PASS',mainPages:12,featured:featured.length,repositories:new Set(projects.map(p=>p.repo)).size,languages:['zh','en']}));
