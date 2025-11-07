<script>
const version = "1.2"; // 今のバージョン

fetch("https://raw.githubusercontent.com/hokorinihoko/aburaage.jumpgame/main/version.txt")
  .then(res => res.text())
  .then(latest => {
    if (latest.trim() !== version) {
      alert("新しいバージョンがあります！更新してください。");
      location.reload(); // or 自動で最新に書き換える処理
    }
  })
  .catch(err => console.log("更新チェック失敗", err));
</script>
