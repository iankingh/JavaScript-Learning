import { deflateSync } from 'node:zlib';
import { mkdir, writeFile, unlink } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const bytes = Buffer.concat([Buffer.from(type), data]);
  const length = Buffer.alloc(4);
  const checksum = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  checksum.writeUInt32BE(crc32(bytes));
  return Buffer.concat([length, bytes, checksum]);
}

const directory = new URL('./fixtures/', import.meta.url);
await mkdir(directory, { recursive: true });
const pngPath = fileURLToPath(new URL('generated.png', directory));
const heicPath = fileURLToPath(new URL('generated.heic', directory));
const header = Buffer.alloc(13);
header.writeUInt32BE(32, 0);
header.writeUInt32BE(24, 4);
header[8] = 8;
header[9] = 2;
const pixels = Buffer.alloc(24 * (1 + 32 * 3));
for (let y = 0; y < 24; y++) {
  for (let x = 0; x < 32; x++) {
    const offset = y * 97 + 1 + x * 3;
    pixels[offset] = x < 16 ? 220 : 30;
    pixels[offset + 1] = y < 12 ? 180 : 40;
    pixels[offset + 2] = 100;
  }
}
await writeFile(pngPath, Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  chunk('IHDR', header), chunk('IDAT', deflateSync(pixels)), chunk('IEND', Buffer.alloc(0)),
]));
try {
  execFileSync('/usr/bin/sips', ['-s', 'format', 'heic', pngPath, '--out', heicPath], { stdio: 'inherit' });
} finally {
  await unlink(pngPath);
}
