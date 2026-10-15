// 生成《研发项目管理平台前端开发进展汇报》Word 文档（无第三方依赖，直接拼装 OOXML + ZIP）
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const { run, paragraph, heading, table } = require('./report_lib.cjs');

const B = (text) => paragraph(text, 80, 0, null, null, true); // 项目符号段落

const body = [];

// ---------------- 封面标题 ----------------
body.push(paragraph([run('研发项目管理平台（PMO Dashboard）', true, '1F3864', 44)], 40, 480, 'center', 360, false, 0, true));
body.push(paragraph([run('前端开发进展汇报', true, '2E5C9E', 34)], 80, 0, 'center', 340, false, 0, true));
body.push(paragraph('—— 平台框架搭建完成 · 21 个功能页面交付 · Jira 真实数据接入落地', 360, 0, 'center'));
body.push(paragraph('汇报单位：研发项目管理（PMO）小组', 20, 320, 'center'));
body.push(paragraph('汇报日期：2026 年 9 月', 400, 0, 'center'));

// ---------------- 一、项目概述 ----------------
body.push(heading('一、项目概述', 1));
body.push(paragraph('本项目旨在建设公司统一的研发项目管理平台（PMO 驾驶舱），将分散在各系统中的研发项目数据汇聚到统一入口，为管理层提供“一屏总览”的可视化决策支持，覆盖项目进度、质量、资源、风险与合规内控等核心管理领域。'));
body.push(paragraph('本期工作围绕前端展开：完成平台整体框架搭建、三大业务模块共 21 个功能页面（1 个项目总览页 + 20 个功能页）开发、主题与组件体系建设、Jira 故障数据真实接口对接，以及工程化与部署方案落地。核心技术选型如下：'));
body.push(table([
  ['技术项', '选型', '用途'],
  ['前端框架', 'React 18 + TypeScript 5', '页面开发、类型安全'],
  ['构建工具', 'Vite 5', '开发热更新、生产构建'],
  ['样式方案', 'Tailwind CSS 3', '原子化样式、深浅主题变量'],
  ['图表库', 'Recharts 2', '趋势折线图、进度环等可视化'],
  ['图标库', 'lucide-react', '导航与界面图标'],
], [1800, 3600, 3800]));

// ---------------- 二、系统整体架构 ----------------
body.push(heading('二、系统整体架构', 1));
body.push(paragraph('前端采用单页应用（SPA）分层组织，按“页面—组件—状态—接口—数据—类型”划分，各层职责清晰、复用度高：'));
body.push(table([
  ['层次', '目录', '说明'],
  ['页面层', 'src/pages', '总览页 + 项目管理 / 合规内控 / 系统配置三大模块共 21 个页面'],
  ['组件层', 'src/components', 'layout（布局导航）、ai（AI 助手）、charts（图表）、common（业务组件）、ui（基础控件）'],
  ['状态层', 'src/context', '主题上下文：深浅模式与主题色全局管理'],
  ['接口层', 'src/api', '统一 HTTP 封装（JSON 校验、错误提示）与项目/选项/故障记录接口'],
  ['数据层', 'src/data', '导航配置与演示数据（含通用页面配置）'],
  ['类型层', 'src/types', '全平台 TypeScript 类型定义，保障接口契约一致'],
], [1400, 2200, 5600]));
body.push(paragraph('页面切换采用 SPA 状态驱动：项目总览与 4 个重点页面为独立实现的专用页面，其余 15 个页面由“配置驱动的通用页面引擎”统一渲染（详见第四部分），新增功能页仅需补充一条配置即可上线。'));

// ---------------- 三、已完成的功能模块 ----------------
body.push(heading('三、已完成的功能模块', 1));

body.push(heading('3.1 项目总览（首页驾驶舱）', 2));
body.push(paragraph('平台首页面向管理层汇聚全局态势，包含五部分内容：', 80));
body.push(B('KPI 指标卡：在管项目、整体完成度等 4 项核心指标，内置迷你趋势图与环比说明；'));
body.push(B('整体完成度：环形进度图直观展示项目整体完成比例；'));
body.push(B('状态分布：按计划 / 预警 / 风险 / 已完成四类展示项目分布条形图；'));
body.push(B('进度趋势：1—6 月计划进度 vs 实际进度对比折线图；'));
body.push(B('重点风险与重点项目：高/中风险清单（含项目与风险描述）+ 重点项目进展明细表。'));

body.push(heading('3.2 项目管理模块（10 页）', 2));
body.push(B('项目进度（专用页）：KPI 指标卡、计划 vs 实际进度趋势图（1—6 月）、各项目计划与实际进度对比明细表；'));
body.push(B('人员投入（专用页）：3 项 KPI 指标、在研项目投入人数趋势图、按项目统计的人员分布条形图、人员负荷明细表（超载高亮预警）；'));
body.push(B('交付明细、CCB 变更、重点总结、质量健康、资源占用、SVT 专项、预算、激励：8 个页面由通用页面引擎统一渲染，每页均含 KPI 卡片 + 趋势图 + 明细表。'));

body.push(heading('3.3 合规内控模块（6 页）', 2));
body.push(paragraph('研发工时、项目清单、项目合规、物料去向、政府项目、成果转化与保护 6 个页面均已通过通用页面引擎落地，页面结构与交互统一，待后端数据接口就绪后可直接替换为真实数据。', 80));

body.push(heading('3.4 系统配置模块（4 页）', 2));
body.push(B('字段映射（专用页，已接入真实数据）：Jira 故障记录多条件查询，详见 4.4 节；'));
body.push(B('关注项目（专用页）：个人重点关注项目卡片墙，展示健康状态、进度条、负责人，并提供 Jira / Confluence 一键跳转；'));
body.push(B('人员分类、通知配置：通用页面，框架已就绪。'));

// ---------------- 四、关键技术亮点 ----------------
body.push(heading('四、关键技术亮点', 1));

body.push(heading('4.1 通用页面引擎（配置驱动）', 2));
body.push(paragraph('抽象出 GenericFeaturePage 通用组件与 GenericPageConfig 类型：新增功能页仅需在配置中补充 KPI、趋势系列、表格列与行数据，无需编写新组件。当前 15 个功能页均由该引擎渲染，大幅减少重复代码，同时保证全部页面风格与交互一致。'));

body.push(heading('4.2 统一组件体系', 2));
body.push(paragraph('沉淀 20 余个可复用组件，分为五类：', 80));
body.push(B('图表组件：TrendLineChart（多系列趋势）、ProgressRing（环形进度）、MiniSparkline（迷你趋势）；'));
body.push(B('业务组件：DashboardCard、MetricCard、ProjectTable、MultiSelectDropdown（多选下拉）、ProgressBar、StatusBadge、SectionHeader；'));
body.push(B('布局组件：Header 顶栏、TopNavigation 导航、MegaMenu 大菜单（悬停展开、延迟收起）、ThemeMenu 主题菜单；'));
body.push(B('AI 组件：AIAssistantButton 入口、AIChatDrawer 对话抽屉；'));
body.push(B('基础控件：shadcn 风格的 Button / Card / Input / Badge，统一变体与交互样式。'));

body.push(heading('4.3 主题系统', 2));
body.push(B('显示模式：浅色 / 深色 / 跟随系统三档，实时监听系统主题变化并自动切换；'));
body.push(B('主题色：蓝、紫、青三色，基于 CSS 变量驱动全局换肤，一键生效；'));
body.push(B('用户偏好经 localStorage 持久化，刷新后自动恢复。'));

body.push(heading('4.4 Jira 真实数据对接（字段映射页）', 2));
body.push(paragraph('字段映射页已完成与后端（端口 8080）三个核心接口的联调与对接，是当前平台首个接入真实数据的页面：', 80));
body.push(B('接口对接：项目列表 GET /api/v1/projects、字段选项 GET /api/v1/options、故障记录检索 POST /api/v1/issues/search（基于 JQL）；'));
body.push(B('多条件筛选：模块、填报人、经办人、状态、故障类型、触发因素、优先级、时间范围等 8 类条件，均支持多选（自研 MultiSelectDropdown）；'));
body.push(B('完整交互状态：加载中、空结果、接口异常提示、选项未就绪禁用态均已处理；'));
body.push(B('结果表格 10 列：编号、摘要、模块、填报人、经办人、状态、故障类型、触发因素、优先级、创建时间；'));
body.push(B('接口层统一封装 fetch（JSON 校验与错误提示），Vite 开发代理 /api → 8080，API 基地址支持环境变量配置，开发/生产环境无缝切换。'));

body.push(heading('4.5 AI 项目助手（框架就绪）', 2));
body.push(paragraph('右侧抽屉式 AI 对话窗口已完成：支持多轮消息气泡展示与快捷操作入口（项目风险分析、本周项目总结、人员投入分析、项目延期分析、生成项目周报 5 项）。当前回复为演示文案，真实数据分析能力将在下一阶段接入。'));

body.push(heading('4.6 工程化与部署', 2));
body.push(B('工程脚本：npm run dev（开发）/ build（tsc 类型检查 + Vite 构建）/ preview / lint（ESLint）；'));
body.push(B('生产静态服务：自研 server.mjs（约 60 行），支持 SPA 路由回退、完整 MIME 类型、端口 8080，可经 pm2 常驻，支持局域网访问；'));
body.push(B('构建产物：dist/ 与打包好的 dist.zip，具备直接发布条件。'));

// ---------------- 五、功能页面清单 ----------------
body.push(heading('五、功能页面清单', 1));
body.push(paragraph('平台共 21 个页面全部完成开发并可访问：', 80));
body.push(table([
  ['模块', '功能页面', '实现方式', '数据来源'],
  ['项目总览', '项目总览（驾驶舱）', '专用页', '演示数据'],
  ['项目管理', '项目进度', '专用页', '演示数据'],
  ['项目管理', '人员投入', '专用页', '演示数据'],
  ['项目管理', '交付明细', '通用页', '演示数据'],
  ['项目管理', 'CCB 变更', '通用页', '演示数据'],
  ['项目管理', '重点总结', '通用页', '演示数据'],
  ['项目管理', '质量健康', '通用页', '演示数据'],
  ['项目管理', '资源占用', '通用页', '演示数据'],
  ['项目管理', 'SVT 专项', '通用页', '演示数据'],
  ['项目管理', '预算', '通用页', '演示数据'],
  ['项目管理', '激励', '通用页', '演示数据'],
  ['合规内控', '研发工时', '通用页', '演示数据'],
  ['合规内控', '项目清单', '通用页', '演示数据'],
  ['合规内控', '项目合规', '通用页', '演示数据'],
  ['合规内控', '物料去向', '通用页', '演示数据'],
  ['合规内控', '政府项目', '通用页', '演示数据'],
  ['合规内控', '成果转化与保护', '通用页', '演示数据'],
  ['系统配置', '字段映射', '专用页', 'Jira 真实数据'],
  ['系统配置', '关注项目', '专用页', '演示数据（Jira/Confluence 链接）'],
  ['系统配置', '人员分类', '通用页', '演示数据'],
  ['系统配置', '通知配置', '通用页', '演示数据'],
], [1500, 2800, 2300, 3000]));

// ---------------- 六、当前状态与数据就绪度 ----------------
body.push(heading('六、当前状态与数据就绪度', 1));
body.push(B('字段映射页已接入 Jira 真实数据并通过前后端联调，可正常使用；'));
body.push(B('其余 20 个页面展示演示数据，页面结构、接口契约与交互均已定型，替换真实数据仅需实现对应后端接口；'));
body.push(B('AI 助手处于演示模式，对话流程与界面已就绪。'));

// ---------------- 七、存在的问题与风险 ----------------
body.push(heading('七、存在的问题与风险', 1));
body.push(B('其余 19 个页面的后端数据接口尚未就绪，平台全面上线依赖后端接口开发进度；'));
body.push(B('AI 助手暂无真实分析能力，若向用户开放可能产生预期落差；'));
body.push(B('平台尚未建设登录认证与角色权限体系，暂不具备对外网公开条件；'));
body.push(B('大数据量下的性能与多浏览器兼容性验证尚不充分。'));

// ---------------- 八、下一步工作计划 ----------------
body.push(heading('八、下一步工作计划', 1));
body.push(table([
  ['序号', '工作项', '说明'],
  ['1', '真实数据批量接入', '优先打通项目进度、人员投入、质量健康等高频页面数据，逐步替换演示数据'],
  ['2', 'AI 助手能力落地', '接入真实项目数据，支持风险分析、周总结与周报生成等快捷操作'],
  ['3', '认证与权限', '建设登录认证与角色权限体系，为正式发布做准备'],
  ['4', '通知渠道对接', '通知配置页对接企业微信 / 邮件推送通道'],
  ['5', '试运行', '组织试点团队试运行，收集使用反馈并迭代优化'],
], [1000, 2600, 5400]));

body.push(paragraph('', 120));
body.push(paragraph('以上为研发项目管理平台前端开发进展汇报，请领导审阅指正。'));
body.push(paragraph('研发项目管理（PMO）小组', 20, 0, 'right'));
body.push(paragraph('2026 年 9 月', 20, 0, 'right'));

// ---------------- OOXML 组装 ----------------
const numbering_xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:numbering xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:abstractNum w:abstractNumId="0"><w:multiLevelType w:val="hybridMultilevel"/><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="&#8226;"/><w:lvlJc w:val="left"/><w:ind w:left="420" w:hanging="200"/></w:lvl></w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num></w:numbering>';
const document_xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>' + body.join('') + '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="720" w:footer="720" w:gutter="0"/><w:cols w:space="708"/></w:sectPr></w:body></w:document>';
const styles_xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:eastAsia="微软雅黑"/><w:sz w:val="21"/><w:szCs w:val="21"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="300" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style><w:style w:type="table" w:styleId="TableGrid"><w:name w:val="Table Grid"/></w:style></w:styles>';
const content_types = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>';
const root_rels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>';
const doc_rels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/></Relationships>';
const core_xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>研发项目管理平台前端开发进展汇报</dc:title><dc:creator>研发项目管理（PMO）小组</dc:creator><cp:lastModifiedBy>研发项目管理（PMO）小组</cp:lastModifiedBy><dcterms:created xsi:type="dcterms:W3CDTF">2026-09-23T00:00:00Z</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">2026-09-23T00:00:00Z</dcterms:modified></cp:coreProperties>';
const app_xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>PMO Report Generator</Application></Properties>';

// ---------------- 纯 JS ZIP 打包（deflate） ----------------
function makeCrcTable() {
  const crcTable = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crcTable[n] = c;
  }
  return crcTable;
}
const CRC_TABLE = makeCrcTable();
function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ buf[i]) & 0xff];
  return (crc ^ -1) >>> 0;
}
function buildZip(entries) {
  const now = new Date();
  const dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);
  const dosDate = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
  const localChunks = [];
  const centralChunks = [];
  let offset = 0;
  for (const entry of entries) {
    const nameBuf = Buffer.from(entry.name, 'utf8');
    const data = Buffer.from(entry.data, 'utf8');
    const crc = crc32(data);
    const comp = zlib.deflateRawSync(data, { level: 9 });
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0, 6);
    local.writeUInt16LE(8, 8);
    local.writeUInt16LE(dosTime, 10);
    local.writeUInt16LE(dosDate, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(comp.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    local.writeUInt16LE(0, 28);
    localChunks.push(local, nameBuf, comp);

    const cd = Buffer.alloc(46);
    cd.writeUInt32LE(0x02014b50, 0);
    cd.writeUInt16LE(20, 4);
    cd.writeUInt16LE(20, 6);
    cd.writeUInt16LE(0, 8);
    cd.writeUInt16LE(8, 10);
    cd.writeUInt16LE(dosTime, 12);
    cd.writeUInt16LE(dosDate, 14);
    cd.writeUInt32LE(crc, 16);
    cd.writeUInt32LE(comp.length, 20);
    cd.writeUInt32LE(data.length, 24);
    cd.writeUInt16LE(nameBuf.length, 28);
    cd.writeUInt16LE(0, 30);
    cd.writeUInt16LE(0, 32);
    cd.writeUInt16LE(0, 34);
    cd.writeUInt16LE(0, 36);
    cd.writeUInt32LE(0, 38);
    cd.writeUInt32LE(offset, 42);
    centralChunks.push(cd, nameBuf);

    offset += local.length + nameBuf.length + comp.length;
  }
  const centralDir = Buffer.concat(centralChunks);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(centralDir.length, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20);
  return Buffer.concat([...localChunks, centralDir, eocd]);
}

const entries = [
  { name: '[Content_Types].xml', data: content_types },
  { name: '_rels/.rels', data: root_rels },
  { name: 'docProps/core.xml', data: core_xml },
  { name: 'docProps/app.xml', data: app_xml },
  { name: 'word/document.xml', data: document_xml },
  { name: 'word/styles.xml', data: styles_xml },
  { name: 'word/numbering.xml', data: numbering_xml },
  { name: 'word/_rels/document.xml.rels', data: doc_rels },
];

const outFile = path.join(process.cwd(), '研发项目管理平台前端开发进展汇报.docx');
fs.writeFileSync(outFile, buildZip(entries));
console.log('DOCX_WRITTEN', outFile, fs.statSync(outFile).size, 'bytes');
