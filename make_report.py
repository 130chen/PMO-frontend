import zipfile, os

def esc(text):
    return (str(text).replace('&','&amp;').replace('<','&lt;')
            .replace('>','&gt;').replace('"','&quot;'))

def run(text, bold=False, color=None, size=None, font='微软雅黑'):
    rpr = '<w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:eastAsia="%s"/>' % font
    if bold: rpr += '<w:b/>'
    if color: rpr += '<w:color w:val="%s"/>' % color
    if size: rpr += '<w:sz w:val="%d"/><w:szCs w:val="%d"/>' % (size, size)
    rpr += '</w:rPr>'
    return '<w:r>%s<w:t xml:space="preserve">%s</w:t></w:r>' % (rpr, esc(text))

def paragraph(runs, spacing_after=120, spacing_before=0, align=None, line=None,
              bullet=False, indent=0, raw=False):
    ppr = '<w:pPr>'
    if align: ppr += '<w:jc w:val="%s"/>' % align
    ppr += '<w:spacing w:before="%d" w:after="%d" w:line="%d" w:lineRule="auto"/>' % (
        spacing_before, spacing_after, line or 300)
    if bullet:
        ppr += '<w:ind w:left="420" w:hanging="200"/><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr>'
    elif indent:
        ppr += '<w:ind w:left="%d" w:firstLine="%d"/>' % (indent, indent)
    ppr += '</w:pPr>'
    if not raw:
        if isinstance(runs, str):
            runs = [run(runs)]
        else:
            runs = [run(x) for x in runs]
    return '<w:p>%s%s</w:p>' % (ppr, ''.join(runs))

def heading(text, level=1):
    sizes = {1:32,2:26,3:22}; colors = {1:'1F3864',2:'2E5C9E',3:'3A6EA5'}
    before = {1:360,2:240,3:160}; after = {1:200,2:120,3:100}
    r = run(text, bold=True, color=colors[level], size=sizes[level])
    return paragraph([r], spacing_before=before[level], spacing_after=after[level], line=320, raw=True)

def cell(text, bold=False, fill=None, align=None):
    shd = '<w:shd w:val="clear" w:color="auto" w:fill="%s"/>' % fill if fill else ''
    tcpr = '<w:tcPr>%s<w:tcMar><w:top w:w="60" w:type="dxa"/><w:bottom w:w="60" w:type="dxa"/><w:left w:w="80" w:type="dxa"/><w:right w:w="80" w:type="dxa"/></w:tcMar></w:tcPr>' % shd
    rpr = '<w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:eastAsia="微软雅黑"/>'
    if bold: rpr += '<w:b/>'
    rpr += '<w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr>'
    ppr = '<w:pPr><w:spacing w:before="20" w:after="20" w:line="240" w:lineRule="auto"/>'
    if align: ppr += '<w:jc w:val="%s"/>' % align
    ppr += '</w:pPr>'
    return '<w:tc>%s<w:p>%s<w:r>%s<w:t xml:space="preserve">%s</w:t></w:r></w:p></w:tc>' % (tcpr, ppr, rpr, esc(text))

def table(rows, widths=None):
    ncols = len(rows[0]); total = sum(widths) if widths else ncols*1800
    grid = ''.join('<w:gridCol w:w="%d"/>' % (w or total//ncols) for w in (widths or []))
    trs = []
    for ri,row in enumerate(rows):
        tcs = [cell(v, bold=(ri==0), fill=('2E5C9E' if ri==0 else None), align=('center' if ri==0 else None)) for v in row]
        trs.append('<w:tr>%s</w:tr>' % ''.join(tcs))
    tbl = ('<w:tbl><w:tblPr><w:tblStyle w:val="TableGrid"/><w:tblW w:w="%d" w:type="dxa"/>'
           '<w:tblBorders><w:top w:val="single" w:sz="4" w:color="9DB2D0"/><w:left w:val="single" w:sz="4" w:color="9DB2D0"/>'
           '<w:bottom w:val="single" w:sz="4" w:color="9DB2D0"/><w:right w:val="single" w:sz="4" w:color="9DB2D0"/>'
           '<w:insideH w:val="single" w:sz="4" w:color="9DB2D0"/><w:insideV w:val="single" w:sz="4" w:color="9DB2D0"/></w:tblBorders>'
           '</w:tblPr><w:tblGrid>%s</w:tblGrid>%s</w:tbl>' % (total, grid, ''.join(trs)))
    return '<w:p>%s<w:pPr><w:spacing w:after="120"/></w:pPr></w:p>' % tbl

body = []

def title_run(txt, **kw):
    return paragraph([run(txt, **kw)], raw=True, align='center')

body.append(title_run('研发项目管理平台（PMO Dashboard）', bold=True, color='1F3864', size=44), spacing_before=200, spacing_after=80)
body.append(title_run('近期开发进展汇报', bold=True, color='2E5C9E', size=32), spacing_after=240)
body.append(title_run('汇报单位：研发项目管理（PMO）小组', size=22), spacing_after=40)
body.append(title_run('汇报日期：2026 年 9 月', size=22), spacing_after=300)

body.append(heading('一、项目概述', 1))
body.append(paragraph('研发项目管理平台（PMO Dashboard）是一套面向研发管理团队的"一站式项目管理驾驶舱"，统一汇聚研发项目在进度、质量、资源、人员、预算、合规等维度的关键指标，帮助管理层快速掌握整体运行状况、识别风险并辅助决策。'))
body.append(paragraph('平台以单页应用形式承载，覆盖"项目总览、项目进度、人员投入、关注项目"四个核心页面，并以统一模板批量支撑"交付明细、CCB 变更、重点总结、质量健康、资源占用、SVT 专项、预算、激励、研发工时、项目清单、项目合规、物料去向、政府项目、成果转化、字段映射、人员分类、通知配置"等 20 余项管理子模块。'))

body.append(heading('二、技术方案', 1))
body.append(paragraph('平台采用当前主流的现代前端技术栈，兼顾开发效率、可维护性与视觉体验。', bullet=True))
body.append(paragraph('开发框架：React 18 + TypeScript，组件化、类型安全;', bullet=True))
body.append(paragraph('构建工具：Vite 5，实现秒级热更新与快速生产构建;', bullet=True))
body.append(paragraph('样式方案：Tailwind CSS，统一设计变量，支持浅色/深色主题切换;', bullet=True))
body.append(paragraph('可视化图表：Recharts，内置完成率环形图、进度趋势折线图、KPI 迷你走势图等;', bullet=True))
body.append(paragraph('图标体系：lucide-react，风格统一、体积轻量;', bullet=True))
body.append(paragraph('部署方式：自研 Node 静态服务（server.mjs），通过 PM2 常驻运行。', bullet=True))

body.append(heading('三、本期已完成工作', 1))
body.append(heading('3.1 核心页面', 2))
body.append(paragraph('项目总览：集成 KPI 指标卡、整体完成率、项目状态分布、计划/实际进度趋势及重点风险清单，构建全局驾驶舱。', bullet=True))
body.append(paragraph('项目进度：展示各项目计划与实际进度对比、里程碑与延期情况，服务于进度管控。', bullet=True))
body.append(paragraph('人员投入：呈现项目投入人数趋势、各项目人员分布及人员负荷情况，辅助资源配置。', bullet=True))
body.append(paragraph('关注项目：支持个人重点关注项目管理，并集成 Jira / Confluence 快捷跳转链接，便于日常跟踪。', bullet=True))
body.append(heading('3.2 通用子模块（统一模板批量支撑）', 2))
body.append(paragraph('通过通用页面模板（指标卡 + 趋势图 + 明细表）实现了 20 余项管理子模块，覆盖研发管理全流程，主要包括：'))
body.append(paragraph('交付明细、CCB 变更、重点总结、质量健康、资源占用、SVT 专项、预算、激励;', bullet=True))
body.append(paragraph('研发工时、项目清单、项目合规、物料去向、政府项目、成果转化;', bullet=True))
body.append(paragraph('字段映射、人员分类、通知配置等系统配置类功能。', bullet=True))
body.append(heading('3.3 平台级能力', 2))
body.append(paragraph('AI 智能助手：内置项目风险分析、本周项目总结、人员投入分析、项目延期分析、生成周报等快捷能力，提升分析效率。', bullet=True))
body.append(paragraph('主题与视觉：支持浅色/深色/跟随系统主题及多种主题色，满足不同演示与使用场景。', bullet=True))
body.append(paragraph('交互与体验：顶部导航 + 巨型菜单、全局搜索、响应式布局，桌面与不同屏幕均可良好呈现。', bullet=True))

body.append(heading('四、平台核心能力与当前指标', 1))
body.append(paragraph('平台当前已沉淀并展示的若干核心管理指标如下：'))
rows = [
    ['维度','关键指标','当前值'],
    ['项目总体','项目总数 / 在研项目','42 / 26'],
    ['项目进度','整体完成率 / 本月里程碑','68% / 18 项'],
    ['风险管控','需重点关注风险项目','5 个'],
    ['质量健康','平均质量得分 / 严重缺陷','87 分 / 12 个'],
    ['研发投入','人员总数 / 平均工时填报率','186 人 / 94%'],
    ['预算执行','预算执行率 / 剩余预算','67.2% / 1050 万元'],
    ['成果转化','专利申请 / 软著登记','56 / 34 件'],
]
body.append(table(rows, widths=[2200,3900,2600]))

body.append(heading('五、系统部署与运行情况', 1))
body.append(paragraph('已完成生产构建（Vite build），产物 dist 包约 680 KB，并通过 dist.zip 分发;', bullet=True))
body.append(paragraph('自研 Node 静态服务在 0.0.0.0:8080 提供访问，PM2 常驻，支持局域网内部分发使用;', bullet=True))
body.append(paragraph('服务内置路径越权防护与 MIME 类型处理，保障基础访问安全与稳定。', bullet=True))

body.append(heading('六、当前风险与下一步计划', 1))
body.append(heading('6.1 当前关注点', 2))
body.append(paragraph('数据接入：当前页面数据为演示/示例数据，需与真实业务数据源（Jira、ERP、工时等）打通;', bullet=True))
body.append(paragraph('AI 助手：目前为示例回复，后续需接入大模型接口与真实数据分析能力;', bullet=True))
body.append(paragraph('权限体系：人员分类与权限配置尚待与统一认证（SSO）体系对接。', bullet=True))
body.append(heading('6.2 下一步计划', 2))
body.append(paragraph('完成真实数据源接入与字段映射，实现数据自动同步;', bullet=True))
body.append(paragraph('接入大模型，完善 AI 智能分析与周报/总结自动生成能力;', bullet=True))
body.append(paragraph('完善权限分级与通知规则，推进平台在研发团队内的试运行与推广。', bullet=True))

body.append(paragraph('', spacing_after=120))
body.append(paragraph('以上为研发项目管理平台近期的开发进展汇报，请领导审阅指正。', spacing_after=40))
body.append(paragraph('研发项目管理（PMO）小组', align='right', spacing_after=20))
body.append(paragraph('2026 年 9 月', align='right', spacing_after=20))

numbering_xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:numbering xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:abstractNum w:abstractNumId="0"><w:multiLevelType w:val="hybridMultilevel"/><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="&#8226;"/><w:lvlJc w:val="left"/><w:ind w:left="420" w:hanging="200"/></w:lvl></w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num></w:numbering>'

document_xml = ('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>' + ''.join(body) + '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="720" w:footer="720" w:gutter="0"/><w:cols w:space="708"/></w:sectPr></w:body></w:document>')

styles_xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:eastAsia="微软雅黑"/><w:sz w:val="21"/><w:szCs w:val="21"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="300" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style><w:style w:type="table" w:styleId="TableGrid"><w:name w:val="Table Grid"/></w:style></w:styles>'

content_types = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>'

root_rels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>'

doc_rels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/></Relationships>'

core_xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>研发项目管理平台（PMO Dashboard）近期开发进展汇报</dc:title><dc:creator>研发项目管理（PMO）小组</dc:creator><cp:lastModifiedBy>研发项目管理（PMO）小组</cp:lastModifiedBy><dcterms:created xsi:type="dcterms:W3CDTF">2026-09-23T00:00:00Z</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">2026-09-23T00:00:00Z</dcterms:modified></cp:coreProperties>'

app_xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>PMO Report Generator</Application></Properties>'

out = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'PMO研发项目管理平台_近期进展汇报.docx')
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
    z.writestr('[Content_Types].xml', content_types)
    z.writestr('_rels/.rels', root_rels)
    z.writestr('docProps/core.xml', core_xml)
    z.writestr('docProps/app.xml', app_xml)
    z.writestr('word/document.xml', document_xml)
    z.writestr('word/styles.xml', styles_xml)
    z.writestr('word/numbering.xml', numbering_xml)
    z.writestr('word/_rels/document.xml.rels', doc_rels)
import sys
sys.stdout.write('OK')
