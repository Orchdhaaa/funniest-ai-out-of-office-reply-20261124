import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const REPLY =
  "I am away on vacation. My auto-reply is currently auto-replying to itself, so I will respond when one of us wins.";

// The competition gate, checked by the program itself before it reports success:
// entry.txt must be UTF-8 text of 1 to 160 characters, not only white space,
// a single line, with no em dash.
function fail(message: string): never {
  console.error(`gate failed: ${message}`);
  process.exit(1);
}

const chars = [...REPLY];
if (chars.length < 1 || chars.length > 160) {
  fail(`reply is ${chars.length} characters, outside the 1-160 gate`);
}
if (REPLY.trim().length === 0) fail("reply is only white space");
if (REPLY.includes("\n") || REPLY.includes("\r")) {
  fail("reply must be a single line");
}
if (REPLY.includes("\u2014")) fail("reply must not contain an em dash");
if (!REPLY.includes("vacation")) fail("reply must say it is on vacation");
if (!REPLY.includes("auto-reply")) fail("reply must be an auto-reply");
if (!REPLY.endsWith(".")) fail("reply must end with a period");

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = `${outDir}/entry.txt`;
writeFileSync(outPath, REPLY, "utf8");

// Read back what was written and verify it byte for byte.
const written = readFileSync(outPath, "utf8");
if (written !== REPLY) fail("read-back mismatch: entry.txt differs from the reply");
console.log(`wrote ${outPath} (${chars.length} characters)`);
