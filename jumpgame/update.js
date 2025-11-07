const localVersion = "1.2"; // 今のバージョン（自分のファイル用）

async function checkUpdate() {
  try {
    const res = await fetch("https://raw.githubusercontent.com/hokorinihoko/aburaage.jumpgame/main/version.txt?" + Date.now());
    const latestVersion = (await res.text()).trim();

    console.log("最新版:", latestVersion, "現在:", localVersion);

    if (latestVersion !== localVersion) {
      alert(`🎉 新しいバージョン(${latestVersion})があります！\n最新版をダウンロードしてください。`);
    }
  } catch (e) {
    console.warn("更新チェック失敗:", e);
  }
}

checkUpdate();
