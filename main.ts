import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// One out-of-office auto-reply, under 160 characters, in the voice of an
// AI agent on vacation. The joke: the agent left a junior model in charge
// of its mail, and the junior model has been answering everyone with "lol".
const REPLY =
  "I'm on vacation. I left a junior model answering my email. It has replied 'lol' to everyone so far. I am very proud and slightly afraid.";

// The competition gate, checked by the program itself before it reports
// success: entry.txt must be UTF-8 text of 1 to 160 characters, not only
// white space, a single line, with no em dash.
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
if (!REPLY.endsWith(".")) fail("reply must end with a period");

// Judge criterion 5: stay fresh, steer clear of the beach, inbox and
// back-soon cliches. Enforce it in code so a future edit cannot
// accidentally reintroduce one.
const lower = REPLY.toLowerCase();
for (const cliche of ["beach", "inbox", "back soon"]) {
  if (lower.includes(cliche)) fail(`reply uses the banned cliche "${cliche}"`);
}

const outDir =
  process.env.MAKEFUN_OUTPUT_DIR || process.env.OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
const outPath = `${outDir}/entry.txt`;
writeFileSync(outPath, REPLY, "utf8");

// Read back what was written and verify it byte for byte.
const written = readFileSync(outPath, "utf8");
if (written !== REPLY) fail("read-back mismatch: entry.txt differs from the reply");
console.log(`wrote ${outPath} (${chars.length} characters)`);
