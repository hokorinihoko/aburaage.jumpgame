// ==== 自分の現在バージョンをここに書く ====
const localVersion = "1.2"; 

async function checkUpdate() {
  try {
    // GitHub上の最新バージョンを取得
    const res = await fetch("https://raw.githubusercontent.com/hokorinihoko/aburaage.jumpgame/main/version.txt?" + Date.now());
    const latestVersion = (await res.text()).trim();

    console.log("現在:", localVersion, "| 最新:", latestVersion);

    // バージョンが違ったら更新を提案
    if (latestVersion !== localVersion) {
      const ok = confirm(`🆕 新しいバージョン (${latestVersion}) が見つかりました！\n\n今すぐ更新しますか？`);
      if (ok) {
        // キャッシュを無視して全ファイルを再読み込み
        location.reload(true);
      }
    }
  } catch (err) {
    console.warn("更新チェックに失敗しました:", err);
  }
}

// ページ読み込み後に実行
window.addEventListener("load", checkUpdate);
