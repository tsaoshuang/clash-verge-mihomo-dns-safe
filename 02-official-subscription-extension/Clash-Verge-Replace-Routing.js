// Clash Verge Rev / Mihomo - subscription extension script
// Use together with Clash-Verge-Full-Extension.yaml on the same subscription.
// The YAML extension supplies DNS/TUN/groups/providers; this script runs later,
// keeps the airport's proxies, and removes the airport's groups and rules.

const OWN_GROUP_NAMES = [
  "PROXY",
  "AUTO",
  "🧭 全部节点",
  "🇭🇰 香港",
  "🇸🇬 新加坡",
  "🇯🇵 日本",
  "🇺🇸 美国",
  "🇹🇼 台湾",
  "🇰🇷 韩国",
  "🇪🇺 欧洲",
  "🤖 AI",
  "✈️ Telegram",
  "🎬 Streaming",
  "🍎 Apple",
  "🪟 Microsoft",
  "🚀 Speedtest",
  "🇨🇳 国内应用",
  "🛡️ 基础广告",
  "🧱 扩展广告",
  "🎣 钓鱼防护",
  "🔒 STUN 防护",
  "🏁 FINAL",
];

const OWN_PROVIDER_NAMES = [
  "reject_non_ip_drop",
  "reject_domainset",
  "reject_extra_domainset",
  "reject_phishing_domainset",
  "reject_non_ip",
  "reject_non_ip_no_drop",
  "reject_ip",
  "speedtest",
  "ai_non_ip",
  "apple_intelligence_non_ip",
  "ai_ip",
  "telegram_non_ip",
  "telegram_ip",
  "stream_us_non_ip",
  "stream_eu_non_ip",
  "stream_jp_non_ip",
  "stream_kr_non_ip",
  "stream_hk_non_ip",
  "stream_tw_non_ip",
  "stream_non_ip",
  "stream_us_ip",
  "stream_eu_ip",
  "stream_jp_ip",
  "stream_kr_ip",
  "stream_hk_ip",
  "stream_tw_ip",
  "stream_ip",
  "apple_cdn",
  "apple_services",
  "apple_cn",
  "microsoft_cdn",
  "microsoft_non_ip",
  "lan_non_ip",
  "lan_ip",
  "direct_non_ip",
  "domestic_non_ip",
  "domestic_ip",
  "china_ip",
  "global_non_ip",
  "blackmatrix_wechat",
  "blackmatrix_tencent",
  "meta_cn_domain",
  "meta_cn_ip",
];

const OWN_RULES = [
  "RULE-SET,lan_non_ip,DIRECT",
  "RULE-SET,lan_ip,DIRECT,no-resolve",
  "IP-CIDR6,::/0,REJECT,no-resolve",
  "DOMAIN-SUFFIX,openai.com,🤖 AI",
  "DOMAIN-SUFFIX,chatgpt.com,🤖 AI",
  "DOMAIN-SUFFIX,oaistatic.com,🤖 AI",
  "DOMAIN-SUFFIX,oaiusercontent.com,🤖 AI",
  "DOMAIN-SUFFIX,oaistatsig.com,🤖 AI",
  "DOMAIN-SUFFIX,openaimerge.com,🤖 AI",
  "DOMAIN-SUFFIX,sora.com,🤖 AI",
  "PROCESS-NAME,WeChat.exe,🇨🇳 国内应用",
  "PROCESS-NAME,Weixin.exe,🇨🇳 国内应用",
  "PROCESS-NAME,WeChatAppEx.exe,🇨🇳 国内应用",
  "PROCESS-NAME,WeChatBrowser.exe,🇨🇳 国内应用",
  "PROCESS-NAME,QQ.exe,🇨🇳 国内应用",
  "PROCESS-NAME,TIM.exe,🇨🇳 国内应用",
  "PROCESS-NAME,DingTalk.exe,🇨🇳 国内应用",
  "PROCESS-NAME,Feishu.exe,🇨🇳 国内应用",
  "DOMAIN-SUFFIX,wechat.com,🇨🇳 国内应用",
  "DOMAIN-SUFFIX,weixin.com,🇨🇳 国内应用",
  "DOMAIN-SUFFIX,weixinbridge.com,🇨🇳 国内应用",
  "DOMAIN-SUFFIX,qq.com,🇨🇳 国内应用",
  "DOMAIN-SUFFIX,qpic.cn,🇨🇳 国内应用",
  "DOMAIN-SUFFIX,qlogo.cn,🇨🇳 国内应用",
  "DOMAIN-SUFFIX,gtimg.com,🇨🇳 国内应用",
  "DOMAIN-SUFFIX,tencent.com,🇨🇳 国内应用",
  "DOMAIN-SUFFIX,qcloud.com,🇨🇳 国内应用",
  "DOMAIN-SUFFIX,myqcloud.com,🇨🇳 国内应用",
  "DOMAIN-SUFFIX,tencent-cloud.net,🇨🇳 国内应用",
  "RULE-SET,blackmatrix_wechat,🇨🇳 国内应用,no-resolve",
  "RULE-SET,blackmatrix_tencent,🇨🇳 国内应用,no-resolve",
  "DOMAIN-SUFFIX,browserleaks.com,PROXY",
  "DOMAIN-SUFFIX,browserleaks.net,PROXY",
  "DOMAIN-SUFFIX,dnsleaktest.com,PROXY",
  "DOMAIN-SUFFIX,ipleak.net,PROXY",
  "DOMAIN-SUFFIX,surfshark.com,PROXY",
  "DOMAIN-SUFFIX,whoer.net,PROXY",
  "DOMAIN-SUFFIX,ipify.org,PROXY",
  "DOMAIN-SUFFIX,ipinfo.io,PROXY",
  "DOMAIN-SUFFIX,whatismyipaddress.com,PROXY",
  "DOMAIN,whoami.akamai.net,PROXY",
  "DOMAIN,whatismyip.akamai.com,PROXY",
  "DOMAIN,dns.google,REJECT",
  "DOMAIN,cloudflare-dns.com,REJECT",
  "DOMAIN,dns.quad9.net,REJECT",
  "DOMAIN,dns.adguard-dns.com,REJECT",
  "DOMAIN,dns.nextdns.io,REJECT",
  "DOMAIN,doh.opendns.com,REJECT",
  "DOMAIN,doh.cleanbrowsing.org,REJECT",
  "DOMAIN,doh.pub,REJECT",
  "DOMAIN,dns.alidns.com,REJECT",
  "DST-PORT,853,REJECT",
  "AND,((NETWORK,UDP),(DST-PORT,784)),REJECT",
  "AND,((NETWORK,UDP),(DST-PORT,8853)),REJECT",
  "AND,((NETWORK,UDP),(DST-PORT,3478-3481)),🔒 STUN 防护",
  "AND,((NETWORK,UDP),(DST-PORT,19302-19309)),🔒 STUN 防护",
  "RULE-SET,reject_non_ip_drop,🛡️ 基础广告",
  "RULE-SET,reject_domainset,🛡️ 基础广告",
  "RULE-SET,reject_extra_domainset,🧱 扩展广告",
  "RULE-SET,reject_phishing_domainset,🎣 钓鱼防护",
  "RULE-SET,reject_non_ip,🛡️ 基础广告",
  "RULE-SET,reject_non_ip_no_drop,🛡️ 基础广告",
  "RULE-SET,speedtest,🚀 Speedtest",
  "RULE-SET,ai_non_ip,🤖 AI",
  "RULE-SET,apple_intelligence_non_ip,🤖 AI",
  "RULE-SET,telegram_non_ip,✈️ Telegram",
  "RULE-SET,stream_us_non_ip,🇺🇸 美国",
  "RULE-SET,stream_eu_non_ip,🇪🇺 欧洲",
  "RULE-SET,stream_jp_non_ip,🇯🇵 日本",
  "RULE-SET,stream_kr_non_ip,🇰🇷 韩国",
  "RULE-SET,stream_hk_non_ip,🇭🇰 香港",
  "RULE-SET,stream_tw_non_ip,🇹🇼 台湾",
  "RULE-SET,stream_non_ip,🎬 Streaming",
  "RULE-SET,apple_cn,DIRECT",
  "RULE-SET,apple_cdn,DIRECT",
  "RULE-SET,apple_services,🍎 Apple",
  "RULE-SET,microsoft_cdn,DIRECT",
  "RULE-SET,microsoft_non_ip,🪟 Microsoft",
  "RULE-SET,direct_non_ip,DIRECT",
  "RULE-SET,domestic_non_ip,DIRECT",
  "RULE-SET,meta_cn_domain,DIRECT",
  "RULE-SET,global_non_ip,PROXY",
  "RULE-SET,reject_ip,🛡️ 基础广告,no-resolve",
  "RULE-SET,ai_ip,🤖 AI,no-resolve",
  "RULE-SET,telegram_ip,✈️ Telegram,no-resolve",
  "RULE-SET,stream_us_ip,🇺🇸 美国,no-resolve",
  "RULE-SET,stream_eu_ip,🇪🇺 欧洲,no-resolve",
  "RULE-SET,stream_jp_ip,🇯🇵 日本,no-resolve",
  "RULE-SET,stream_kr_ip,🇰🇷 韩国,no-resolve",
  "RULE-SET,stream_hk_ip,🇭🇰 香港,no-resolve",
  "RULE-SET,stream_tw_ip,🇹🇼 台湾,no-resolve",
  "RULE-SET,stream_ip,🎬 Streaming,no-resolve",
  "RULE-SET,domestic_ip,DIRECT,no-resolve",
  "RULE-SET,china_ip,DIRECT,no-resolve",
  "RULE-SET,meta_cn_ip,DIRECT,no-resolve",
  "MATCH,🏁 FINAL",
];

function main(config, profileName) {
  const mergedGroups = Array.isArray(config["proxy-groups"])
    ? config["proxy-groups"]
    : [];
  const ownGroups = [];
  const missingGroups = [];

  for (const name of OWN_GROUP_NAMES) {
    const group = mergedGroups.find(
      (candidate) => candidate && candidate.name === name,
    );
    if (group) {
      ownGroups.push(group);
    } else {
      missingGroups.push(name);
    }
  }

  const mergedProviders = config["rule-providers"] || {};
  const ownProviders = {};
  const missingProviders = [];

  for (const name of OWN_PROVIDER_NAMES) {
    if (mergedProviders[name]) {
      ownProviders[name] = mergedProviders[name];
    } else {
      missingProviders.push(name);
    }
  }

  if (missingGroups.length || missingProviders.length) {
    throw new Error(
      "Routing replacement requires Clash-Verge-Full-Extension.yaml. " +
        "Missing groups: " +
        missingGroups.join(", ") +
        "; missing providers: " +
        missingProviders.join(", "),
    );
  }

  // Intentionally keep config.proxies from the airport subscription.
  config["proxy-groups"] = ownGroups;
  config["rule-providers"] = ownProviders;
  config.rules = OWN_RULES.slice();

  // Airport sub-rules are no longer referenced after replacing config.rules.
  delete config["sub-rules"];

  console.info(
    "Applied DNS-safe routing replacement to " +
      profileName +
      ": kept airport proxies, installed " +
      ownGroups.length +
      " groups and " +
      config.rules.length +
      " rules.",
  );
  return config;
}
