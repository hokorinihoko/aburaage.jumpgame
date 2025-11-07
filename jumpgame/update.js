const localVersion = "1.0";

async function checkUpdate() {
  try {
    const res = await fetch("https://raw.githubusercontent.com/hokorinihoko/aburaage.jumpgame/main/version.txt?" + Date.now());
    const latest = (await res.text()).trim();

    console.log("現在のバージョン:", localVersion, "最新:", latest);

    if (latest !== localVersion) {
      alert(`🆕 新しいバージョン(${latest})があります！最新版をダウンロードしてね。`);
    }
  } catch (err) {
    console.warn("更新チェック失敗:", err);
  }
}

checkUpdate();
