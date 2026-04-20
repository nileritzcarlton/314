window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-X68DQ4NPVR');

function detectSource() {
  const ref = document.referrer || "";

  if (
    ref.includes("instagram.com") ||
    ref.includes("l.instagram.com")
  ) {
    return "instagram";
  }
  
  return "other";
}

gtag('event', 'traffic_source_detected', {
  source: detectSource()
});