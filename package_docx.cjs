const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

// CRC32 table
let CRC_TABLE = null;
function makeCrcTable() {
  if (CRC_TABLE) return CRC_TABLE;
  CRC_TABLE = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    CRC_TABLE[n] = c;
  }
  return CRC_TABLE;
}
function crc32(buf) {
  const t = makeCrcTable();
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = t[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function dosDateTime(d = new Date()) {
  const time = (d.getHours() << 11) | (d.getMinutes() << 5) | Math.floor(d.getSeconds() / 2);
  const date = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
  return { time: time & 0xffff, date: date & 0xffff };
}

// Build a zip from { name: Buffer|string } entries (name uses forward slashes)
function buildZip(entries) {
  const localParts = [];
  const centralParts = [];
  let offset = 0;
  const dt = dosDateTime();

  for (const ent of entries) {
    const nameBuf = Buffer.from(ent.name, 'utf8');
    const data = Buffer.isBuffer(ent.data) ? ent.data : Buffer.from(ent.data, 'utf8');
    const deflated = zlib.deflateRawSync(data, { level: 9 });
    const crc = crc32(data);

    // local file header
    const lfh = Buffer.alloc(30);
    lfh.writeUInt32LE(0x04034b50, 0);
    lfh.writeUInt16LE(20, 4);            // version needed
    lfh.writeUInt16LE(0x0800, 6);        // flags: UTF-8 names
    lfh.writeUInt16LE(8, 8);             // method: deflate
    lfh.writeUInt16LE(dt.time, 10);
    lfh.writeUInt16LE(dt.date, 12);
    lfh.writeUInt32LE(crc, 14);
    lfh.writeUInt32LE(deflated.length, 18);
    lfh.writeUInt32LE(data.length, 22);
    lfh.writeUInt16LE(nameBuf.length, 26);
    lfh.writeUInt16LE(0, 28);            // extra len
    localParts.push(lfh, nameBuf, deflated);

    const localHeaderLen = 30 + nameBuf.length;
    const localOffset = offset;
    offset += localHeaderLen + deflated.length;

    // central directory header
    const cdh = Buffer.alloc(46);
    cdh.writeUInt32LE(0x02014b50, 0);
    cdh.writeUInt16LE(20, 4);            // version made by
    cdh.writeUInt16LE(20, 6);            // version needed
    cdh.writeUInt16LE(0x0800, 8);        // flags
    cdh.writeUInt16LE(8, 10);            // method
    cdh.writeUInt16LE(dt.time, 12);
    cdh.writeUInt16LE(dt.date, 14);
    cdh.writeUInt32LE(crc, 16);
    cdh.writeUInt32LE(deflated.length, 20);
    cdh.writeUInt32LE(data.length, 24);
    cdh.writeUInt16LE(nameBuf.length, 28);
    cdh.writeUInt16LE(0, 30);            // extra
    cdh.writeUInt16LE(0, 32);            // comment
    cdh.writeUInt16LE(0, 34);            // disk start
    cdh.writeUInt16LE(0, 36);            // internal attrs
    cdh.writeUInt32LE(0, 38);            // external attrs
    cdh.writeUInt32LE(localOffset, 42);
    centralParts.push(cdh, nameBuf);
  }

  const centralStart = offset;
  const centralData = Buffer.concat(centralParts);
  const centralSize = centralData.length;
  const totalEntries = entries.length;

  // end of central directory
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(totalEntries, 8);
  eocd.writeUInt16LE(totalEntries, 10);
  eocd.writeUInt32LE(centralSize, 12);
  eocd.writeUInt32LE(centralStart, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([...localParts, centralData, eocd]);
}

// --- gather parts from _report_tmp ---
const dir = path.join(process.cwd(), '_report_tmp');
function walk(d) {
  const out = [];
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const full = path.join(d, e.name);
    if (e.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}
const files = walk(dir);
// ensure deterministic order
files.sort();
const entries = files.map((f) => {
  const rel = path.relative(dir, f).split(path.sep).join('/');
  return { name: rel, data: fs.readFileSync(f) };
});

const zipBuf = buildZip(entries);
const outFile = path.join(process.cwd(), 'PMO研发项目管理平台_真实数据接入进展汇报.docx');
fs.writeFileSync(outFile, zipBuf);
console.log('DOCX_WRITTEN bytes=' + zipBuf.length + ' entries=' + entries.length);
