# Clash Verge Rev / Mihomo：DNS 防泄漏与分流模板

本仓库提供两个明确分开的版本。两者都不包含真实节点、密码、UUID、Token 或私人订阅地址。

## 应该选哪个版本

| 版本 | 节点来源 | DNS 与分流来源 | 适合情况 |
| --- | --- | --- | --- |
| `01-standalone-template` | 模板中的 `proxy-providers` | 完整模板 | 订阅地址能直接返回 Clash/Mihomo `proxies:` YAML |
| `02-official-subscription-extension` | 机场官方远程订阅 | 扩展配置 | 官方配置能用，但单独放进 `proxy-providers` 会无节点或 Timeout |

如果机场官方配置可以正常使用，推荐第二版。它会保留官方节点，只用扩展接管 DNS、策略组和分流。

## 两个版本共同的软件设置

在 Clash Verge Rev 的“设置”页面完成：

1. 开启“虚拟网卡模式 / TUN”。如果软件显示服务模式或管理员服务，请先安装并启用。
2. 点击 TUN 旁边的齿轮：
   - TUN 堆栈：`Mixed`
   - 自动设置全局路由：开启
   - 严格路由：开启
   - 自动选择流量出口接口：开启
   - DNS 劫持：`any:53,tcp://any:53`
   - 最大传输单元：`1500`
3. Clash 设置中的 IPv6：关闭。
4. DNS 覆写：关闭，让配置文件中的 DNS 生效。
5. 系统代理：使用 TUN 时可以关闭；只有不使用 TUN 时才需要打开。
6. 运行模式保持 `Rule / 规则`。

Clash Verge Rev 的应用设置优先级高于扩展配置，因此 TUN、IPv6 等项目必须在软件界面中正确设置。

## 第一版：独立完整模板

目录：[`01-standalone-template`](./01-standalone-template/)

这个版本自身包含 DNS、策略组、规则提供器和分流规则，通过一个 `proxy-provider` 获取节点。

### 使用方法

1. 下载仓库并进入 `01-standalone-template` 文件夹。
2. 新建 `subscription-url.txt`，只在第一行粘贴私人订阅地址。
3. 在该文件夹打开 PowerShell，运行：

```powershell
powershell -ExecutionPolicy Bypass -File .\build-local.ps1
```

4. 导入生成的文件：

```text
generated\Clash-Verge-Mihomo-Local.yaml
```

5. 在“订阅”页面激活该本地配置，然后检查“代理”页面是否已经出现节点。

### 从 GitHub 获取最新模板再生成

```powershell
powershell -ExecutionPolicy Bypass -File .\build-local.ps1 -TemplateUrl "https://raw.githubusercontent.com/tsaoshuang/clash-verge-mihomo-dns-safe/main/01-standalone-template/Clash-Verge-Mihomo-Template.yaml"
```

### 更新订阅地址

修改本机 `subscription-url.txt`，重新运行脚本，再把生成文件重新导入或替换原本地配置。

不要上传 `subscription-url.txt` 或 `generated` 文件夹。

## 第二版：机场官方订阅 + 完整扩展

目录：[`02-official-subscription-extension`](./02-official-subscription-extension/)

这是推荐版本。机场官方订阅只负责提供节点；扩展负责：

- Fake-IP 与加密 DNS
- 节点域名的独立引导解析
- 国内直连、全球代理
- AI、Telegram、Streaming、Apple、Microsoft、Speedtest 策略组
- SukkaW 规则提供器
- 可选广告、钓鱼和 STUN 防护
- 微信及腾讯图片/文件域名的兼容处理

扩展不包含 `proxies` 和私人订阅地址。地区策略组通过 `include-all` 动态读取官方订阅中的节点。

### 使用方法

1. 在 Clash Verge Rev 的“订阅”页面导入机场官方订阅地址，类型选择“远程”。
2. 先单独激活官方订阅，确认节点能够正常测速和联网。
3. 下载 [`Clash-Verge-Full-Extension.yaml`](./02-official-subscription-extension/Clash-Verge-Full-Extension.yaml)。
4. 打开官方订阅卡片的右键或三点菜单，选择“扩展覆写配置 / 订阅扩展配置”。
5. 如果界面要求选择扩展文件，导入上述 YAML；如果直接打开编辑器，则粘贴该文件全部内容并保存。
6. 将这个扩展绑定到机场官方订阅，点击“重新激活”或重新选择该订阅。
7. 按照上面的“共同软件设置”开启 TUN、严格路由和 DNS 劫持。

不同版本的菜单名称可能略有区别：新版通常称为“扩展覆写配置”或“扩展配置”，旧版可能显示为 `Merge`。

### 更新节点或更换订阅地址

- 节点正常更新：在机场官方订阅卡片上点击“更新”。
- 机场重置了订阅地址：打开官方订阅的“编辑信息”，替换订阅地址并保存。
- DNS 和分流扩展会继续绑定，不需要修改扩展文件。

### 检查是否真正生效

在“订阅”页面打开“查看运行配置”，确认：

```yaml
dns:
  enhanced-mode: fake-ip
  respect-rules: true
  use-system-hosts: false
```

同时确认：

- `proxy-groups` 中出现 `PROXY`、`AUTO`、AI、Telegram、Streaming 等组。
- `rule-providers` 中存在 SukkaW 规则地址。
- `proxies` 仍然来自机场官方订阅。
- TUN 运行设置中的 `strict-route` 为 `true`。

## DNS 检测说明

DNS 泄漏测试显示多个 Google、Cloudflare、阿里或运营商递归解析出口，不一定代表系统 DNS 泄漏。重点检查是否出现当前宽带或 Wi-Fi 自动分配的本地 DNS，以及运行配置是否仍在使用系统 DNS。

修改配置后建议重新激活订阅并重启浏览器，再进行 DNS 测试。

## 安全提醒

- 真实订阅地址相当于账户凭据，不要提交到公开仓库。
- 不要上传机场官方完整配置或脚本生成的本机配置。
- 如果订阅地址曾经公开，请立即在机场后台重置。
