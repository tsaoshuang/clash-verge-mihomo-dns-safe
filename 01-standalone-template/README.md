# 第一版：独立完整模板

本版本通过 `proxy-providers.flower` 获取节点，并由模板自身提供 DNS、策略组和分流规则。

适合订阅地址能够直接返回 Clash/Mihomo YAML，并且返回内容中含有 `proxies:` 列表的情况。

## 使用

1. 在本目录创建 `subscription-url.txt`，第一行粘贴订阅地址。
2. 运行：

```powershell
powershell -ExecutionPolicy Bypass -File .\build-local.ps1
```

3. 将 `generated\Clash-Verge-Mihomo-Local.yaml` 作为本地配置导入 Clash Verge Rev。
4. 激活配置并检查代理页面是否出现节点。

## 更新

更换订阅地址时，修改 `subscription-url.txt` 并重新运行脚本。该文件和生成目录已被根目录 `.gitignore` 排除。

如果机场官方配置能用，而本版本无节点或全部 Timeout，请改用仓库中的第二版。
