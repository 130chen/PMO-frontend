const zlib = require('node:zlib');

function esc(text) {
  return String(text).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function run(text, bold=false, color=null, size=null, font='微软雅黑') {
  let rpr = `<w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:eastAsia="${font}"/>`;
  if (bold) rpr += '<w:b/>';
  if (color) rpr += `<w:color w:val="${color}"/>`;
  if (size) rpr += `<w:sz w:val="${size}"/><w:szCs w:val="${size}"/>`;
  rpr += '</w:rPr>';
  return `<w:r>${rpr}<w:t xml:space="preserve">${esc(text)}</w:t></w:r>`;
}
function paragraph(runs, spacing_after=120, spacing_before=0, align=null, line=null, bullet=false, indent=0, raw=false) {
  let ppr = '<w:pPr>';
  if (align) ppr += `<w:jc w:val="${align}"/>`;
  ppr += `<w:spacing w:before="${spacing_before}" w:after="${spacing_after}" w:line="${line||300}" w:lineRule="auto"/>`;
  if (bullet) ppr += '<w:ind w:left="420" w:hanging="200"/><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr>';
  else if (indent) ppr += `<w:ind w:left="${indent}" w:firstLine="${indent}"/>`;
  ppr += '</w:pPr>';
  if (!raw) {
    if (typeof runs === 'string') runs = [run(runs)];
    else runs = runs.map(x => run(x));
  }
  return `<w:p>${ppr}${runs.join('')}</w:p>`;
}
function heading(text, level=1) {
  const sizes={1:32,2:26,3:22}, colors={1:'1F3864',2:'2E5C9E',3:'3A6EA5'};
  const before={1:360,2:240,3:160}, after={1:200,2:120,3:100};
  const r = run(text, true, colors[level], sizes[level]);
  return paragraph([r], spacing_before=before[level], spacing_after=after[level], line=320, raw=true);
}
function cell(text, bold=false, fill=null, align=null) {
  const shd = fill ? `<w:shd w:val="clear" w:color="auto" w:fill="${fill}"/>` : '';
  const tcpr = `<w:tcPr>${shd}<w:tcMar><w:top w:w="60" w:type="dxa"/><w:bottom w:w="60" w:type="dxa"/><w:left w:w="80" w:type="dxa"/><w:right w:w="80" w:type="dxa"/></w:tcMar></w:tcPr>`;
  const rpr = `<w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:eastAsia="微软雅黑"/>${bold?'<w:b/>':''}<w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr>`;
  const ppr = `<w:pPr><w:spacing w:before="20" w:after="20" w:line="240" w:lineRule="auto"/>${align?`<w:jc w:val="${align}"/>`:''}</w:pPr>`;
  return `<w:tc>${tcpr}<w:p>${ppr}<w:r>${rpr}<w:t xml:space="preserve">${esc(text)}</w:t></w:r></w:p></w:tc>`;
}
function table(rows, widths=null) {
  const ncols = rows[0].length, total = widths ? widths.reduce((a,b)=>a+b,0) : ncols*1800;
  const grid = '<w:gridCol w:w="' + (widths||[]).map(w=>w||Math.floor(total/ncols)).join('"/><w:gridCol w:w="') + '"/>';
  let trs='';
  rows.forEach((row,ri)=>{
    trs += '<w:tr>' + row.map(v=>cell(v, ri===0, ri===0?'2E5C9E':null, ri===0?'center':null)).join('') + '</w:tr>';
  });
  return `<w:tbl><w:tblPr><w:tblStyle w:val="TableGrid"/><w:tblW w:w="${total}" w:type="dxa"/><w:tblBorders><w:top w:val="single" w:sz="4" w:color="9DB2D0"/><w:left w:val="single" w:sz="4" w:color="9DB2D0"/><w:bottom w:val="single" w:sz="4" w:color="9DB2D0"/><w:right w:val="single" w:sz="4" w:color="9DB2D0"/><w:insideH w:val="single" w:sz="4" w:color="9DB2D0"/><w:insideV w:val="single" w:sz="4" w:color="9DB2D0"/></w:tblBorders><w:tblLook w:val="04A0"/></w:tblPr><w:tblGrid>${grid}</w:tblGrid>${trs}</w:tbl>`;
}

const body = [];

module.exports = { esc, run, paragraph, heading, cell, table };

