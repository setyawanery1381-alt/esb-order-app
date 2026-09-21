$token = (gh auth token).Trim()
$remoteUrl = "https://setyawanery1381-alt:$token@github.com/setyawanery1381-alt/esb-order-app.git"
git remote set-url origin $remoteUrl
git add .
git commit -m "Fix checkout submitOrder bug and integrate Firebase Firestore cloud sync"
git push -u origin main
git remote set-url origin "https://github.com/setyawanery1381-alt/esb-order-app.git"
Remove-Item -Force .\push.ps1
