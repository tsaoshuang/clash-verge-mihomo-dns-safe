# Clash Verge Rev / Mihomo DNS 防泄漏模板

这是可放入公开 GitHub 仓库的版本。模板不包含节点、密码、UUID、令牌或真实订阅地址。

## 公开仓库中只提交

- `Clash-Verge-Mihomo-Template.yaml`
- `build-local.ps1`
- `.gitignore`
- `README.md`

不要上传 `subscription-url.txt`、`generated/`、机场官方配置或合并后的完整配置。

## 在本机生成可导入配置

1. 在本目录新建 `subscription-url.txt`。
2. 只在第一行粘贴 flower 订阅地址并保存。
3. 在本目录打开 PowerShell，运行：

```powershell
.\build-local.ps1
```

生成文件位于：

```text
generated/Clash-Verge-Mihomo-Local.yaml
```

把这个生成文件导入 Clash Verge Rev。它含有私人订阅地址，只能保存在本机。

也可以临时用环境变量，不建立文本文件：

```powershell
$env:FLOWER_SUBSCRIPTION_URL = '在这里粘贴你的订阅地址'
.\build-local.ps1
Remove-Item Env:FLOWER_SUBSCRIPTION_URL
```

## 每次从 GitHub 下载最新版模板再生成

把下面地址换成仓库中模板文件的 Raw 链接：

```powershell
.\build-local.ps1 -TemplateUrl 'https://raw.githubusercontent.com/你的用户名/你的仓库/main/Clash-Verge-Mihomo-Template.yaml'
```

脚本只会在本机写入订阅地址，不会把地址上传回 GitHub，也不会在终端显示地址。

## 重要兼容性说明

这个模板使用 Mihomo 的 `proxy-providers` 读取订阅。flower 订阅必须直接返回 Clash/Mihomo YAML，并含有 `proxies:` 列表。如果机场只允许其官方配置，或返回的是 Base64/网页/受鉴权重定向内容，节点仍可能为空或全部超时。

已经验证可用的“机场官方配置 + 防泄漏/分流合并版”包含真实节点凭据，必须保持私有，不能提交到公开仓库。
