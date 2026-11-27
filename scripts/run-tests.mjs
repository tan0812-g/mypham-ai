import { spawnSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reportDirectory = join(root, "reports");
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const checks = [
  { name: "Kiểm thử backend", directory: "server", args: ["test"] },
  { name: "Kiểm tra mã frontend", directory: "client", args: ["run", "lint"] },
  { name: "Tạo bản build frontend", directory: "client", args: ["run", "build"] },
];

function escapeMarkdown(value) {
  return value.replaceAll("```", "` ` `");
}

const startedAt = new Date();
const results = checks.map((check) => {
  const start = Date.now();
  const processResult = spawnSync(npm, check.args, {
    cwd: join(root, check.directory),
    encoding: "utf8",
    env: process.env,
    maxBuffer: 10 * 1024 * 1024,
  });
  const output = [processResult.stdout, processResult.stderr, processResult.error?.message].filter(Boolean).join("\n").trim();
  const exitCode = processResult.status ?? 1;
  const tests = check.directory === "server" ? Number(output.match(/(?:^|\n)ℹ tests (\d+)/)?.[1] || 0) : null;
  return {
    name: check.name,
    command: `cd ${check.directory} && npm ${check.args.join(" ")}`,
    passed: exitCode === 0,
    exitCode,
    durationMs: Date.now() - start,
    tests,
    output,
  };
});

const finishedAt = new Date();
const passed = results.filter((result) => result.passed).length;
const date = new Intl.DateTimeFormat("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", dateStyle: "full", timeStyle: "medium" }).format(finishedAt);
const markdown = [
  "# Báo cáo kiểm thử Mỹ Phẩm AI",
  "",
  `- Thời gian chạy: ${date} (Việt Nam)`,
  `- Kết quả: **${passed}/${results.length} bước đạt**${passed === results.length ? "" : " — cần sửa lỗi"}`,
  `- Node.js: ${process.version}`,
  "",
  "## Kết quả tự động",
  "",
  "| Bước | Lệnh | Kết quả | Thời gian |",
  "| --- | --- | --- | ---: |",
  ...results.map((result) => `| ${result.name}${result.tests !== null ? ` (${result.tests} bài)` : ""} | \`${result.command}\` | ${result.passed ? "Đạt" : `Lỗi (mã ${result.exitCode})`} | ${result.durationMs} ms |`),
  "",
  "## Kết quả chi tiết",
  "",
  ...results.flatMap((result) => [
    `### ${result.name}`,
    "",
    "```text",
    escapeMarkdown(result.output || "Không có đầu ra."),
    "```",
    "",
  ]),
  "## Phạm vi chưa kiểm thử tự động",
  "",
  "Các thao tác đăng nhập trên trình duyệt, đặt/hủy đơn, phân quyền nhân viên, ảnh tải lên, xuất báo cáo và đối chiếu tiền về ngân hàng cần được thử riêng. Báo cáo này không xác nhận các luồng đó đã đạt.",
  "",
  "## Cách chạy lại",
  "",
  "Từ thư mục dự án, chạy `cd server && npm run test:report`. Lệnh sẽ ghi đè báo cáo và dữ liệu kết quả bằng lần chạy mới nhất.",
  "",
].join("\n");

await mkdir(reportDirectory, { recursive: true });
await writeFile(join(reportDirectory, "test-report.md"), markdown);
await writeFile(join(reportDirectory, "test-results.json"), `${JSON.stringify({ startedAt: startedAt.toISOString(), finishedAt: finishedAt.toISOString(), passed, total: results.length, results }, null, 2)}\n`);
for (const result of results) console.log(`${result.passed ? "ĐẠT" : "LỖI"} ${result.name} (${result.durationMs} ms)`);
console.log(`Báo cáo: ${join(reportDirectory, "test-report.md")}`);
if (passed !== results.length) process.exitCode = 1;
