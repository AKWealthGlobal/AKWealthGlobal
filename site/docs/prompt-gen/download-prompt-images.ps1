# AK Wealth Global：下載提示詞示範圖並推送到 GitHub 支線
# 用法：在 PowerShell 輸入
#   powershell -ExecutionPolicy Bypass -File "$HOME\Downloads\download-prompt-images.ps1"
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
  23 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173709_0aa87e39-79c3-4576-80ef-f6fe2f26f1ee.png"
  24 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173712_f380ef9a-a873-44c6-8b87-16932377a5f5.png"
  25 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173709_06904422-1cde-4176-b41d-dea2d505f8af.png"
  26 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173713_89b5bbcf-d92b-4890-a05d-54b02cfa83a1.png"
  27 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173709_465cc0ab-d938-4ca6-8dd0-a1b10aa60d83.png"
  28 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173709_c166587d-2137-4327-aaee-ca75dda8ecea.png"
  29 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173709_420e791e-b138-4831-b3ce-3665b885477b.png"
  30 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173713_9c2bc528-a195-42d5-a6ac-aee70038684e.png"
  31 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173709_679a905a-d5b9-40cc-b7a6-4be65ca7583b.png"
  32 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173711_ad85ec7f-123c-422c-8224-73246b838d2c.png"
  33 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173709_0a9e68c7-7639-45fe-b7b5-561a11e40b78.png"
  34 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173712_0ff4ae2c-2a84-4da4-9b41-f76c0f65d96a.png"
  35 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173856_6349d762-2822-455f-909d-33ebcd186d03.png"
  36 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173855_b06dbbfb-a114-462c-9f11-aeb25217dc42.png"
  37 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173855_71288bd3-0393-4139-a795-9289bd8818b4.png"
  38 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173856_70235508-8c2c-4511-9f5c-136d388c3de4.png"
  39 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173855_b4a6e5e0-3ecb-40ad-85d4-7177e2cb42c7.png"
  40 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173856_9baf9aad-abdd-4915-a798-01d3d0fc1805.png"
  41 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173856_336b3d46-01e9-421a-88f9-4d1e71f6350a.png"
  42 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173857_88892a81-a92e-4004-aa73-91bc7a0b2398.png"
  43 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173857_b2c53370-8ecd-458a-9bd1-f3e115ec3e7e.png"
  44 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173856_8b9319dd-745f-48e9-bd02-831e3c30c517.png"
  45 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173855_8de22721-ad86-4d62-b6d2-7c40193e99a8.png"
  46 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173857_b61a3e51-fe53-4b6a-b638-c4f99146ba44.png"
  47 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_174048_41e35a76-661d-4595-aae6-9995277f84ab.png"
  48 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_174049_2e1e3cc2-9b46-4ae8-b673-6a78b45b6354.png"
  49 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_174048_1fd22f5d-f13f-437e-8931-803ca6afd877.png"
  50 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_174048_1b84a010-7191-49e4-ba11-84e75bb925ce.png"
  51 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_174049_96f3aa6b-eb23-48be-b8bd-dbb020eb399f.png"
  52 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_174050_7ef0c8eb-632b-4912-b8ce-7705fdc77177.png"
  53 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_174048_e0de3799-2ae7-403b-9469-aac253280777.png"
  54 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_174050_91d41f06-4fcb-4eb4-9889-aa5f63bace27.png"
  55 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_174048_8fa30757-4b8d-4225-9b75-02b13a9baead.png"
  56 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_174049_ad883c1c-9757-43f7-8554-c9a2c4ae59f4.png"
  57 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_174049_47364f1b-2a0a-44f6-8586-b385062ada63.png"
  58 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_174049_3965d5da-69a0-4043-9d4c-9eea0b0e83ff.png"
  59 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173707_b50b4c02-e13f-4a17-b007-c6db0f733bc3.png"
  60 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173711_f1e6a48a-2c99-48a1-bfa3-4c03a2b8621c.png"
  61 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173709_65fee7c6-07a5-4d7b-be89-31d07b974ec6.png"
  62 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173706_c1da84ea-4253-41f4-9120-53d4f4d97ad1.png"
  63 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173709_548c76d5-5a26-47e2-890b-2909c629637e.png"
  64 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173710_ee15de93-b425-49c6-8e52-1ec49a1b4759.png"
  65 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173709_a585f05f-3ff2-4a5d-b336-d618169b596a.png"
  66 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173708_ccdda25a-7d32-4367-8102-f806426bb1b9.png"
  67 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173709_bd913768-caa5-40ba-8ad0-8e21f230edce.png"
  68 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173711_8f4a0d15-25aa-4477-9a35-edf87815bd5f.png"
  69 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173709_a26caaca-d67c-45d8-ae97-a51f2928d0da.png"
  70 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173708_61ac67ec-2124-4f02-99a0-97e725c417e7.png"
  71 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_234009_4b4f98db-0736-4c75-88d8-a684909abacd.png"
  72 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_234009_8fbd6ff3-a5cc-4a59-ba33-d64903f4e9cb.png"
  73 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_234009_795c7501-90b5-4849-a228-e553ebcaae88.png"
  74 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_234011_1212d70e-4062-4389-b00f-6c62bd1422f7.png"
  75 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_234009_00ce5979-26fa-4855-960e-b0884a17c379.png"
  76 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_234009_5a089c41-a570-4e8a-a3e1-f92d20950687.png"
  77 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_234009_9dec1724-c00b-45d3-9e42-da51df587c1d.png"
  78 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_234009_96013ae2-374e-43f0-8dc6-00dd28b08ee7.png"
  79 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_234011_957c41ad-27e0-4640-b8f0-15142bedb8ef.png"
  80 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_234008_1e95caa3-ea2f-465d-9b84-1bb608c0c925.png"
  81 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_234008_c96e2ed6-27ab-4dc4-b1c6-04bd939b2a3e.png"
  82 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_234010_b6932d1c-7474-466b-a52e-4d58f98f9966.png"
  83 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173940_4e1a9c66-3b6e-416e-a955-56cdd2d49e0e.png"
  84 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173940_0034de6d-a615-4931-bd62-da3f29501235.png"
  85 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173938_e2f17482-6f3a-43e8-b98b-12851632398d.png"
  86 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173940_f36b02dc-a2a8-4389-a58f-7795402ba868.png"
  87 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173938_01f51daf-4ffe-440a-b212-421dd27650fd.png"
  88 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173939_e182f3ae-eb16-4ef5-ba3f-19a86ba66015.png"
  89 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173938_7a391e1f-8211-4e29-af2b-490378ce8a6a.png"
  90 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173939_391b876c-c1a6-4465-a81a-c6571f1bebce.png"
  91 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173938_a1dd8dfd-9a18-4b5f-b0e4-9955559820b5.png"
  92 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173940_dd95884e-2568-426c-afdb-e892e28edeec.png"
  93 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173938_aa3a3a42-dcf9-44ab-82d4-8c9f54f3e434.png"
  94 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173939_752704b2-1b80-4711-ae40-398557a16ff3.png"
  95 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173707_f21d6f5b-58f5-4ee4-87e3-ab82aa0be0a2.png"
  96 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173706_5a338853-786f-455a-85b2-a4b068a35cf7.png"
  97 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173707_8dd2975b-a7e9-4494-8fd6-8943687bc985.png"
  98 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173711_01df1424-dcc5-4d75-80f4-9def2708fdcd.png"
  99 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173706_e2a00474-4a02-4cae-b795-bd20baf34f32.png"
  100 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173712_e2c13d13-3e3d-4898-b8fd-fb87e719176f.png"
  101 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173706_aa71c7c4-6662-42bf-b50d-3c6bc83183fb.png"
  102 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173709_a342cc34-ca34-4954-9629-9b651313d6b9.png"
  103 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173706_cacf4929-a565-42e6-82bc-1a9865369427.png"
  104 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173708_b6645fde-8158-4ddc-80c2-54ab54fcd555.png"
  105 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173707_60352a4d-9d16-425e-918e-3815112d9bea.png"
  106 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173707_f157290d-00d8-44b0-bafa-7c1c29445842.png"
  107 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173850_fb77d368-4a76-48e3-ad1e-2b634588f061.png"
  108 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173849_d83b5bf8-425f-4c24-a4ea-56ffe0d23c5a.png"
  109 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173849_c96c4988-4cd5-4679-8651-7759b00943e8.png"
  110 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173850_8e938efc-abcd-4818-bcd4-e52d8f7e58c0.png"
  111 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173849_e08ed46e-b0a2-47e3-9afc-a91aaf82a20b.png"
  112 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173850_4d3e1543-76c4-4c9d-a47b-8c207ab560ec.png"
  113 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173849_92699ead-119e-4c46-81c7-c20f2bfdabc0.png"
  114 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173849_77ef8f45-1ddb-492b-b194-40857967e379.png"
  115 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173850_64f9f8a8-d94e-4a3f-b4ff-25bc4fb28ee9.png"
  116 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173850_ed44dbc1-d7d7-4811-909f-9b63bcdc4dac.png"
  117 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173850_d101c02c-6709-4394-80a3-8b573fdcc298.png"
  118 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_173850_a7bd7f9c-6c2c-42d5-bcea-2e035e42e933.png"
  119 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_174118_bdb4c798-51ba-4469-93ef-2d3095701f09.png"
  120 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_174118_4cb9ec23-4ed1-4e5a-b5d5-5e9f72bd8368.png"
  121 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_174118_690a8b92-8ce5-4920-b094-cab07dcb35b3.png"
  122 = "https://d8j0ntlcm91z4.cloudfront.net/user_3IxbdQHPn9de13wtgGvP6TicSKB/hf_20261012_174118_eba1be63-911b-4d4c-89c8-086432e973c6.png"
}

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$ep = New-Object System.Drawing.Imaging.EncoderParameters 1
$ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality, [long]82)
$tmp = Join-Path $env:TEMP "ak-prompt-dl"; New-Item -ItemType Directory -Force $tmp | Out-Null
$n = 0
foreach ($k in $urls.Keys) {
  $raw = Join-Path $tmp "$k.png"
  Invoke-WebRequest -Uri $urls[$k] -OutFile $raw -UseBasicParsing
  $img = [System.Drawing.Image]::FromFile($raw)
  $s = [Math]::Min(720 / $img.Width, 960 / $img.Height); if ($s -gt 1) { $s = 1 }
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
git -C $wt -c user.name="AKWealthGlobal" -c user.email="yanhongq1996@gmail.com" commit -m "Add prompt example images (Higgsfield)"
git -C $wt push origin "HEAD:$branch"
Write-Host "全部完成，已推送到 $branch。請回到 Claude 告訴我「圖片已推送」。" -ForegroundColor Green
