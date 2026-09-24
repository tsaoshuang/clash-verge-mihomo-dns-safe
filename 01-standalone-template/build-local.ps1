param(
    [Parameter(Mandatory = $false)]
    [string]$SubscriptionUrl,

    [Parameter(Mandatory = $false)]
    [string]$TemplateUrl,

    [Parameter(Mandatory = $false)]
    [string]$OutputPath
)

$ErrorActionPreference = 'Stop'
$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$placeholder = 'https://example.invalid/YOUR_FLOWER_SUBSCRIPTION_URL'

if ([string]::IsNullOrWhiteSpace($SubscriptionUrl)) {
    $SubscriptionUrl = $env:FLOWER_SUBSCRIPTION_URL
}

if ([string]::IsNullOrWhiteSpace($SubscriptionUrl)) {
    $secretFile = Join-Path $scriptDirectory 'subscription-url.txt'
    if (Test-Path -LiteralPath $secretFile) {
        $SubscriptionUrl = (Get-Content -LiteralPath $secretFile -Raw).Trim()
    }
}

if ([string]::IsNullOrWhiteSpace($SubscriptionUrl)) {
    throw '未找到订阅地址。请设置 FLOWER_SUBSCRIPTION_URL，或在本目录创建 subscription-url.txt。'
}

$parsedSubscriptionUri = $null
if (-not [Uri]::TryCreate($SubscriptionUrl, [UriKind]::Absolute, [ref]$parsedSubscriptionUri) -or
    $parsedSubscriptionUri.Scheme -ne 'https') {
    throw '订阅地址必须是完整的 HTTPS URL。'
}

if ([string]::IsNullOrWhiteSpace($TemplateUrl)) {
    $templatePath = Join-Path $scriptDirectory 'Clash-Verge-Mihomo-Template.yaml'
    if (-not (Test-Path -LiteralPath $templatePath)) {
        throw "未找到本地模板：$templatePath"
    }
    $template = Get-Content -LiteralPath $templatePath -Raw
}
else {
    $parsedTemplateUri = $null
    if (-not [Uri]::TryCreate($TemplateUrl, [UriKind]::Absolute, [ref]$parsedTemplateUri) -or
        $parsedTemplateUri.Scheme -ne 'https') {
        throw '模板地址必须是完整的 HTTPS URL。'
    }
    $template = (Invoke-WebRequest -Uri $TemplateUrl -UseBasicParsing).Content
}

$placeholderCount = ([regex]::Matches($template, [regex]::Escape($placeholder))).Count
if ($placeholderCount -ne 1) {
    throw "模板中的订阅占位符数量应为 1，实际为 $placeholderCount。"
}

if ([string]::IsNullOrWhiteSpace($OutputPath)) {
    $outputDirectory = Join-Path $scriptDirectory 'generated'
    $OutputPath = Join-Path $outputDirectory 'Clash-Verge-Mihomo-Local.yaml'
}
else {
    $OutputPath = [IO.Path]::GetFullPath($OutputPath)
    $outputDirectory = Split-Path -Parent $OutputPath
}

if (-not (Test-Path -LiteralPath $outputDirectory)) {
    New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null
}

# YAML 使用单引号包裹 URL；单引号本身需要写成两个单引号。
$yamlSafeSubscriptionUrl = $SubscriptionUrl.Replace("'", "''")
$result = $template.Replace($placeholder, $yamlSafeSubscriptionUrl)

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[IO.File]::WriteAllText($OutputPath, $result, $utf8NoBom)

Write-Host '本机配置已生成（订阅地址未显示）：'
Write-Host $OutputPath
Write-Host '请只把生成文件导入 Clash Verge Rev，不要上传到 GitHub。'
