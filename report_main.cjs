// 汇总脚本：生成报告 OOXML 到临时目录，随后用 .NET 打包为 .docx
const fs = require('node:fs');
const path = require('node:path');
const { esc, run, paragraph, heading, cell, table } = require('./report_lib.cjs');

// -------- 报告正文 --------
const body = [];

// 标题
body.push(paragraph(run('研发项目管理平台（PMO Dashboard）', true, '1F3864', 44), spacing_after=40, spacing_before=480, align='center', line=360, raw=true));
body.push(paragraph(run('真实数据接入进展汇报', true, '2E5C9E', 34), spacing_after=80, align='center', line=340, raw=true));
body.push(paragraph('—— 前后端核心接口打通 · 故障记录真实查询落地', align='center', spacing_after=360));
body.push(paragraph('汇报部门：研发项目管理（PMO）小组', align='center', spacing_after=20));
body.push(paragraph('汇报日期：2026 年 9 月', align='center', spacing_after=400));

// 一、本期工作概述
body.push(heading('一、本期工作概述', 1));
body.push(paragraph('平台前端框架（React + TypeScript + Vite + Tailwind）已在前几期搭建完成，本期的核心任务是打通真实业务数据源，实现从“演示/示例数据”到“真实 Jira 数据”的落地。'));
body.push(paragraph('本期已完成后端（Java Spring Boot，服务端口 8080）三个核心接口与前端页面的对接，并完成一整套前后端联调问题的修复，主要包括：'));
body.push(paragraph('项目列表接口 GET /api/v1/projects——打通 7 个在管 Jira 项目；', bullet=true));
body.push(paragraph('字段选项接口 GET /api/v1/options?project=xx——打通各项目的模块、填报人、经办人、状态、优先级等下拉选项；', bullet=true));
body.push(paragraph('故障记录查询接口 POST /api/v1/issues/search——实现按字段条件真实查询并展示 Jira 故障记录。', bullet=true));

// 二、本期技术实现
body.push(heading('二、本期技术实现', 1));
body.push(heading('2.1 请求层统一封装', 2));
body.push(paragraph('在 src/api/http.ts 中提取统一的 requestJson，统一处理 GET/POST、Content-Type、JSON 内容类型校验与错误提示，供所有接口复用。', bullet=true));
body.push(paragraph('支持通过环境变量 VITE_API_BASE_URL 配置后端绝对地址；未配置时走前端代理，保持前端代码路径与后端一致。', bullet=true));
body.push(heading('2.2 前端代理配置', 2));
body.push(paragraph('在 vite.config.ts 中为 /api 前缀配置代理到 http://localhost:8080，前端以相对路径请求即可到达后端，规避浏览器跨域（CORS）限制。', bullet=true));
body.push(heading('2.3 接口对接', 2));
body.push(paragraph('项目列表：GET /api/v1/projects，返回 7 个项目（CORSICA / CORB / CRETE / CRETB0 / GTLIC / STRIC / SCLIC）。', bullet=true));
body.push(paragraph('字段选项：GET /api/v1/options?project=xx，按项目返回模块、填报人、经办人、状态、优先级、时间范围等可选项（含“全部”默认项）。', bullet=true));
body.push(paragraph('故障记录查询：POST /api/v1/issues/search，按字段条件真实查询 Jira 故障记录，后端按每页 80 条分页拉取并聚合。', bullet=true));
body.push(heading('2.4 数据解析问题修复', 2));
body.push(paragraph('排查并修复“接口未返回 JSON / 请求失败”两类误报：后端直接返回业务数据（纯数组或对象），并无 code / message / data 统一包装，前端不再强求该包装结构，改为直接返回并解析业务数据。', bullet=true));
body.push(paragraph('清除原先硬编码为空的故障记录接口占位实现，接入真实查询。', bullet=true));
body.push(heading('2.5 字段映射与默认语义', 2));
body.push(paragraph('后端每个筛选字段为单值（module / status / priority 等），前端为多选数组；对接时取“首个非‘全部’选项”作为后端筛选值。', bullet=true));
body.push(paragraph('未选择筛选条件时，前端控件默认显示“全部”，与后端“空条件 = 不筛选 = 全部”的语义保持一致，避免用户误以为未筛选会漏数据。', bullet=true));

// 三、真实数据验证
body.push(heading('三、真实数据验证', 1));
body.push(paragraph('以下为通过前端代理（http://localhost:5173）实测后端接口得到的结果，验证全链路（前端 → 代理 → 后端 → Jira MCP）已打通：'));
body.push(paragraph('项目列表：GET /api/v1/projects 返回 7 个在管项目，下拉选项可正常展示。', bullet=true));
body.push(paragraph('字段选项：GET /api/v1/options?project=CORSICA 返回模块（全部/CBB/CSUB/…）、填报人、经办人、状态、优先级等完整可选项。', bullet=true));
body.push(paragraph('故障记录：POST /api/v1/issues/search 在 CORSICA 项目下返回 total = 5220、fetched = 5220 条真实记录，含编号、摘要、模块、状态、填报人、经办人、优先级、创建时间等字段。', bullet=true));
const rows = [
  ['验证接口','请求方式','验证结果'],
  ['/api/v1/projects','GET','返回 7 个在管项目'],
  ['/api/v1/options','GET','返回各项目字段可选项（含“全部”）'],
  ['/api/v1/issues/search','POST','CORSICA 项目返回 5220 条真实故障记录'],
];
body.push(table(rows, [3000,1800,4900]));
body.push(paragraph('示例记录（CORSICA-7409）：摘要为“CLONE - 【腾讯对接】【PSP】memtester 压测过程中，叠加加解密压测脚本…”，模块 TOP、状态已关闭、经办人 Sam Huang、优先级 Highest、创建时间 2026-04-27 06:29:12 UTC，为真实的 Jira 数据。', spacing_before=160));

// 四、当前状态与下一步计划
body.push(heading('四、当前状态与下一步计划', 1));
body.push(heading('4.1 当前状态', 2));
body.push(paragraph('前端平台框架已完整，本期已完成项目列表、字段选项、故障记录查询三个核心接口的真实数据接入。', bullet=true));
body.push(paragraph('字段映射页面已能按选中的项目与筛选条件，真实查询并展示 Jira 故障记录。', bullet=true));
body.push(heading('4.2 下一步计划', 2));
body.push(paragraph('后端筛选字段目前为单值，计划扩展为多值（数组）筛选，进一步贴近前端多选体验；', bullet=true));
body.push(paragraph('完善大数据量下的分页与懒加载，提升 5000＋ 条记录场景的查询与展示性能；', bullet=true));
body.push(paragraph('继续推进工时、预算、成果转化等其余数据源的接入，并接入 AI 分析助手，支撑平台试运行与推广。', bullet=true));

body.push(paragraph('', spacing_after=120));
body.push(paragraph('以上为研发项目管理平台本期真实数据接入进展汇报，请领导审阅指正。', spacing_after=40));
body.push(paragraph('研发项目管理（PMO）小组', align='right', spacing_after=20));
body.push(paragraph('2026 年 9 月', align='right', spacing_after=20));

// -------- OOXML 组装 --------
const numbering_xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:numbering xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:abstractNum w:abstractNumId="0"><w:multiLevelType w:val="hybridMultilevel"/><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="&#8226;"/><w:lvlJc w:val="left"/><w:ind w:left="420" w:hanging="200"/></w:lvl></w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num></w:numbering>';
const document_xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>' + body.join('') + '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="720" w:footer="720" w:gutter="0"/><w:cols w:space="708"/></w:sectPr></w:body></w:document>';
const styles_xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:eastAsia="微软雅黑"/><w:sz w:val="21"/><w:szCs w:val="21"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="300" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style><w:style w:type="table" w:styleId="TableGrid"><w:name w:val="Table Grid"/></w:style></w:styles>';
const content_types = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>';
const root_rels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>';
const doc_rels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/></Relationships>';
const core_xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>研发项目管理平台真实数据接入进展汇报</dc:title><dc:creator>研发项目管理（PMO）小组</dc:creator><cp:lastModifiedBy>研发项目管理（PMO）小组</cp:lastModifiedBy><dcterms:created xsi:type="dcterms:W3CDTF">2026-09-23T00:00:00Z</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">2026-09-23T00:00:00Z</dcterms:modified></cp:coreProperties>';
const app_xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>PMO Report Generator</Application></Properties>';

const parts = {
  '[Content_Types].xml': content_types,
  '_rels/.rels': root_rels,
  'docProps/core.xml': core_xml,
  'docProps/app.xml': app_xml,
  'word/document.xml': document_xml,
  'word/styles.xml': styles_xml,
  'word/numbering.xml': numbering_xml,
  'word/_rels/document.xml.rels': doc_rels,
};

const outDir = path.join(process.cwd(), '_report_tmp');
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(path.join(outDir, '_rels'), { recursive: true });
fs.mkdirSync(path.join(outDir, 'docProps'), { recursive: true });
fs.mkdirSync(path.join(outDir, 'word', '_rels'), { recursive: true });
for (const [p, xml] of Object.entries(parts)) {
  fs.writeFileSync(path.join(outDir, p), xml, 'utf8');
}
console.log('PARTS_WRITTEN', parts.length);



