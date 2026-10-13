# AK Wealth Global：下載 100 張皮克斯 3D 故事插畫示範圖並推送到 GitHub 支線
# 用法：在 PowerShell 輸入
#   powershell -ExecutionPolicy Bypass -File "$HOME\Downloads\download-pixar-images.ps1"
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
  "129" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032253_69cf442f-6f5b-4492-8808-e10b320552bd.png"
  "130" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032251_7745c2c1-37b1-46ed-9218-f69de22f6302.png"
  "131" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032253_960b7671-8d90-4a6a-9e03-486dc2fc7932.png"
  "132" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032251_38f1ecd2-785b-4db0-9d65-ca8539ed0011.png"
  "133" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032252_6c429078-20d9-4de4-8ff3-7a95a174f490.png"
  "134" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032252_565a63b4-d2af-4eb1-a92b-7b650bdb0d25.png"
  "135" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032250_380ba342-04cc-4f2d-b157-6060ba3b0d08.png"
  "136" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032253_7cb36c35-61ba-4dbe-9adf-b6cb8c204ec3.png"
  "137" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032253_fafdee41-bcec-4f35-ae49-fb011f2d8a00.png"
  "138" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032253_ab4f99d0-4f7c-4e67-b198-cec55be49563.png"
  "139" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032253_d91d965f-b6cc-4cc6-ba22-997b7d2be1d4.png"
  "140" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032251_465b9c6d-7aa6-4669-b721-fdcfc27bad5d.png"
  "141" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032344_f440273b-1605-4448-a1f3-70410bc0f322.png"
  "142" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032344_30716456-0f7d-461b-a167-0642b7e7f948.png"
  "143" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032348_01f714e7-3300-4088-b863-ab29b8b02c28.png"
  "144" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032348_f7cff351-d3f6-46c9-b217-d9428729a79f.png"
  "145" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032347_0ae91cbd-2a8e-403c-ab41-0e1344a87f11.png"
  "146" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032345_b5c7ca12-dfc9-41cc-a50d-661582fccba2.png"
  "147" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032345_a9ac0eae-141e-4275-a800-a06a7638111b.png"
  "148" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032346_cb2daf62-da23-4c80-9cfb-e52d5190c6e8.png"
  "149" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032345_3026310a-8dbc-45b8-b598-f4fa83ef1a38.png"
  "150" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032347_c48bde7e-0951-4add-b3e8-3366c2e74319.png"
  "151" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032346_3bc4329e-8c1b-4533-a0aa-be23fcbcc356.png"
  "152" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032346_aad37996-0430-4ce3-9720-a3f5eb881e4a.png"
  "153" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032558_57f259fc-d488-4e51-86d2-893ca695123a.png"
  "154" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032557_a8356d61-a4b3-46da-92d5-b42e6b662b46.png"
  "155" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032556_2a23e727-e57e-4ce1-aa51-40a31ce2f31c.png"
  "156" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032558_830ee8ea-2e94-48d5-a301-7c66f2cc64d2.png"
  "157" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032556_34d77cb3-7db9-4f82-8392-7bf3a5923cc8.png"
  "158" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032556_af35dedf-ccbd-453b-911a-23a2448d1f7d.png"
  "159" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032558_1a8f16c1-37d0-470f-849d-bbe16c339d31.png"
  "160" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032558_66b0ac85-4649-42d2-bb75-476125d2f1c6.png"
  "161" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032557_56acd7d6-089c-4eb0-9e7c-2be8348c8a3b.png"
  "162" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032557_34da56bc-aa45-497d-af4c-85a6ad37ea52.png"
  "163" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032557_dbcff300-0005-4432-a3d8-d93f49e02f9c.png"
  "164" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032557_80439b2b-10f5-457f-ba41-c861f852da5f.png"
  "165" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032300_7bcdf1d4-ffad-4570-9ec5-77c299a8b00b.png"
  "166" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032301_e51e6ae1-73df-40a2-a90e-13c07ae3b6d8.png"
  "167" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032301_3a1ef0d6-584f-43d3-9989-002440a6b64d.png"
  "168" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032301_9e8d97ad-0d22-4534-b195-069b69a56bd1.png"
  "169" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032300_e08188d5-b8ac-4ec9-9027-5ee2b309964e.png"
  "170" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032302_4e2b0b95-274a-4b11-9e84-01484b71cd8c.png"
  "171" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032302_ae63f805-9760-4f7b-9e85-4186cd0c0f21.png"
  "172" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032259_a16b3742-9372-4833-9a98-9a82f52a9b6b.png"
  "173" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032300_436abbfb-77d8-461b-b8cb-63dc201226fe.png"
  "174" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032301_7096ff4e-39d3-409e-bdcd-7ca1ff007d8b.png"
  "175" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032301_c90368c4-9610-4e3f-8bae-b44fa837b1ab.png"
  "176" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032300_0bbdd724-903a-4589-9792-605e45d3201e.png"
  "177" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032403_360d755c-0dec-493a-9127-d5092ea6040f.png"
  "178" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032403_ad860d7c-7ce2-492b-906c-30af269ddaa9.png"
  "179" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032404_1dfccc03-f025-425c-ac74-3036fa1ca64c.png"
  "180" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032404_a00dda57-fad8-465b-95ce-5e6f30c73b6c.png"
  "181" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032405_d8c7d513-b104-4610-be17-ebd501251266.png"
  "182" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032403_4e19618a-66ae-4153-b3aa-20b953b08544.png"
  "183" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032402_99493ac9-51b3-45c1-a220-736e21304689.png"
  "184" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032403_41acef27-8685-4f57-8a65-65e4bf873443.png"
  "185" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032404_1af46252-84d3-4245-94b6-d98f6ec95c5e.png"
  "186" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032402_a54ef2e7-772d-47d7-9165-50b677029be2.png"
  "187" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032404_7da10a43-006e-4a88-a32d-daffefd3031b.png"
  "188" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032405_c5d66daf-5292-4886-b3b6-4cc58087b362.png"
  "189" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032507_ad72da4c-e95b-4681-bb81-0237fd831ae4.png"
  "190" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032507_53d1ea14-2789-4fc9-8034-e36a98c61238.png"
  "191" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032506_0ef6863b-f7e7-442f-96b8-647425a83b31.png"
  "192" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032507_58a1eaa5-f554-47a7-b813-537eb8593a50.png"
  "193" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032505_f225ab55-0f3d-488f-bf30-72ecf60e2cb9.png"
  "194" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032507_19c2e7b3-8c65-4f92-8a80-dbf9dc7fbb69.png"
  "195" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032506_4188f97c-9754-415d-a397-f039349b0f75.png"
  "196" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032506_477d0ec3-3c69-452a-8751-b097e405909c.png"
  "197" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032506_a13a230d-127f-443f-9e47-c914abba8092.png"
  "198" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032508_909a748c-3cf4-4d2a-86b9-d8e9401eeb12.png"
  "199" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032506_91066784-32be-40d5-a114-9aac79b237e8.png"
  "200" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032505_80c6e8da-c093-42fe-b3ab-26ed30bde947.png"
  "201" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032245_5845abe0-577b-4b08-8c24-56bb2b9e40dc.png"
  "202" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032245_ed60dd5f-6925-468f-834f-09a1b3036419.png"
  "203" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032246_f25db1d1-45f7-4438-add7-6a3fcedf5d4b.png"
  "204" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032247_c775ad64-50eb-4eac-83d9-a4279171bd1b.png"
  "205" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032245_20390ed6-ec36-44cf-82e5-356646409190.png"
  "206" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032247_ea11bc62-03eb-46e4-bf1d-fafb8e0c5dfb.png"
  "207" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032246_eec2c75d-1b20-495f-a637-c3e92ec3b7b8.png"
  "208" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032247_d5c41ff2-a051-45d9-81d4-411949ebfcf8.png"
  "209" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032245_b45aea1d-85d5-46cc-9aed-6147f302dd36.png"
  "210" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032246_f5900815-7b89-4bbb-8f0e-fbb5388cc1f7.png"
  "211" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032247_c886b11b-1651-4042-b14a-604645688f02.png"
  "212" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032246_cb8920cb-303e-4bcc-99b7-932ac1f5b6d0.png"
  "213" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032343_bcf9054b-841d-434a-a43b-bea97295e2f7.png"
  "214" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032347_3e6d6222-444b-465e-8347-c5e0a2d34dc4.png"
  "215" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032342_c16be73d-b77f-4ec6-b29d-10258e968820.png"
  "216" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032345_56caf041-822c-494d-83d6-958cd97abff3.png"
  "217" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032343_f1f509a6-5c47-4390-992e-9a6bc2b391f5.png"
  "218" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032344_b2a0fe0f-78ed-47fa-98be-ea7c52bc34ae.png"
  "219" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032347_4401a710-8202-4810-9d0b-5c08c1edcd88.png"
  "220" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032342_f78bcd6d-9c2b-468e-b23b-f8a1b61c0ca5.png"
  "221" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032346_15eaeba1-dd5c-4cc2-a8c6-646f34c51a6e.png"
  "222" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032343_d19434f5-1449-4ff5-bd4f-c59ab2531ce4.png"
  "223" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032343_3abc31f1-a39b-4232-a809-db61763b3627.png"
  "224" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032344_342e536b-e942-4135-86ca-8dd2f8152f4a.png"
  "225" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032351_f62c43b0-3f9b-4289-8508-5388ce58d134.png"
  "226" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032350_3b99a3d3-03ec-486e-b1b4-13a01b716f0c.png"
  "227" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032350_452a2442-052a-4c87-b959-f8bc0822b3ec.png"
  "228" = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261013_032350_8904c5c9-a4fb-4a1c-a36e-d442bc7882a6.png"
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
git -C $wt -c user.name="AKWealthGlobal" -c user.email="yanhongq1996@gmail.com" commit -m "Pixar 3D story example images (Higgsfield)"
git -C $wt push origin "HEAD:$branch"
Write-Host "全部完成，已推送到 $branch。請回到 Claude 告訴我「圖片已推送」。" -ForegroundColor Green
