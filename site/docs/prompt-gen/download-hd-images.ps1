# AK Wealth Global：下載 28 張高清（2K 放大）提示詞示範圖並推送到 GitHub 支線
# 用法：在 PowerShell 輸入
#   powershell -ExecutionPolicy Bypass -File "$HOME\Downloads\download-hd-images.ps1"
$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing
$desk   = [Environment]::GetFolderPath("Desktop")
$repo   = Join-Path $desk "AK-sync"
$wt     = Join-Path $desk "AK-prompt-images"
$branch = "claude/zealous-tesla-oixdne"

# 用獨立資料夾（worktree），不會影響 Codex 正在 AK-sync 裡做的工作
git -C $repo fetch origin $branch
if (!(Test-Path $wt)) { git -C $repo worktree add --detach $wt "origin/$branch" }
git -C $wt checkout --detach "origin/$branch"
$out = Join-Path $wt "site\public\media\prompt-examples"

$urls = [ordered]@{
  "1" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_011636_e3cfe0a4-9b63-4570-9dc6-f79d941bc538.png"
  "2" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_011637_38e45be0-53fe-413d-82da-a8a809f63f18.png"
  "3" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_011640_050af153-1bad-49c5-bec7-0e17292afbd1.png"
  "4" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_011642_8735476a-6b34-450c-a17e-439b7844ee9a.png"
  "5" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_011324_21201fd2-20a7-4959-a840-782211aba1ea.png"
  "6" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_011643_1c54e0ff-245b-4530-af21-41c00e22ba41.png"
  "7" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_011645_69a4cf1f-1e64-4005-8f0c-6975128ec1ef.png"
  "8" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_011647_2187aa8d-8450-4207-8f6e-d0833b4f89bd.png"
  "9" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_012004_8ed53e7a-77ce-4841-9d95-558f0c00bcab.png"
  "10" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_011651_8bb01fe5-2313-4df1-9133-9aeebe3ce062.png"
  "11" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_011655_3f1dda35-330b-4a66-b0e7-e5a2e003bb76.png"
  "12" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_011657_0b1f6f9b-96ce-48ed-a575-8dab9ff39168.png"
  "13" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_011659_ba8c7021-73dd-438e-b235-aef27edb4b27.png"
  "14" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_011700_1fc9526f-1316-45f0-81e1-084ca3f583ed.png"
  "15" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_012006_2f4cfbe3-cb28-4d58-9eac-e4cbaa332ac7.png"
  "16" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_011704_47fee480-7e7d-4dcd-9a12-767997c23116.png"
  "17" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_012242_ad0031f1-5769-4869-a328-740975455edc.png"
  "18" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_011707_bec56e22-e5c6-4379-8839-4a39d13d9f17.png"
  "19" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_011711_f00ccabc-48e2-4f4f-80a4-3225132fefce.png"
  "20" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_011713_9e8105bc-1de0-40bd-b4d0-b73d6d0bf32c.png"
  "21" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_011715_3417e2e8-a610-4681-9f22-d065f4c29fb0.png"
  "22" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_011716_313017c8-15ae-4cca-9ff7-499d19d4ba19.png"
  "123" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_011718_aa4d13b3-6c1b-4b27-9a13-f77a28930866.png"
  "124" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_011720_20a01348-3c91-434c-ba07-32950bd02ac9.png"
  "125" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_011721_ee54e41c-cc85-4bdd-9858-cda2c89d430f.png"
  "126" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_011723_6f9b8838-696f-4580-b796-f6ea1b719eef.png"
  "127" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_011725_20251836-48e3-4cc4-83a6-2473e06decd6.png"
  "128" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_011726_516569e0-3b1f-4e82-8ea9-d1124356feca.png"
}

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$ep = New-Object System.Drawing.Imaging.EncoderParameters 1
$ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality, [long]86)
$tmp = Join-Path $env:TEMP "ak-prompt-dl"; New-Item -ItemType Directory -Force $tmp | Out-Null
$n = 0
foreach ($k in @($urls.Keys)) {
  if (-not $urls[[string]$k]) { throw "找不到第 $k 張的網址" }
  $raw = Join-Path $tmp "$k.png"
  Invoke-WebRequest -Uri $urls[[string]$k] -OutFile $raw -UseBasicParsing
  $img = [System.Drawing.Image]::FromFile($raw)
  $s = 1600 / [Math]::Max($img.Width, $img.Height); if ($s -gt 1) { $s = 1 }
  $w = [int]($img.Width * $s); $h = [int]($img.Height * $s)
  $bmp = New-Object System.Drawing.Bitmap $w, $h
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($img, 0, 0, $w, $h)
  $bmp.Save((Join-Path $out ("example-{0:D2}.jpg" -f [int]$k)), $codec, $ep)
  $g.Dispose(); $bmp.Dispose(); $img.Dispose()
  $n++; Write-Host "完成 $n / $($urls.Count)：$k"
}

git -C $wt add site/public/media/prompt-examples
git -C $wt -c user.name="AKWealthGlobal" -c user.email="yanhongq1996@gmail.com" commit -m "HD prompt example images (Higgsfield 2K upscale)"
git -C $wt push origin "HEAD:$branch"
Write-Host "全部完成，已推送到 $branch。請回到 Claude 告訴我「圖片已推送」。" -ForegroundColor Green
