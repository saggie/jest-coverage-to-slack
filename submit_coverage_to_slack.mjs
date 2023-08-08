import { readFileSync } from "fs";

const slackURL = process.argv[2];

// 引数チェック
if (slackURL === undefined) {
  console.error("引数 に Slack の Webhook URL 指定してください");
  process.exit(1);
}

// カバレッジ結果読み込み
const coverageSummary = JSON.parse(
  readFileSync("coverage/coverage-summary.json", "utf-8")
);

// カバレッジ対象のディレクトリ
const targetDirs = ["src/dir1/", "src/dir2/", "src/dir3/", "total"];

// ディレクトリごとにカバレッジを集計
const result = targetDirs.map((dir) => {
  let [covered, total] = [0, 0];
  for (const [path, coverage] of Object.entries(coverageSummary)) {
    if (path.includes(dir)) {
      covered += coverage.statements.covered;
      total += coverage.statements.total;
    }
  }

  return {
    dir: dir.padEnd(10, " "),
    pct: ((covered / total) * 100).toFixed(2),
    covered: covered,
    total: total,
  };
});

// Slack投稿用のメッセージを生成
const slackText = `XXXXXプロジェクトのC0カバレッジです:
\`\`\`
${
  result
    .map((it) => `${it.dir}: ${it.pct}% (${it.covered}/${it.total})`)
    .join("\n")
}
\`\`\``;

// Slackに投稿

fetch(slackURL, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ text: slackText }),
});
