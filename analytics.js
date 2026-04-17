window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

// base GA init
gtag('js', new Date());
gtag('config', 'G-X68DQ4NPVR');

// detect source (Instagram or not)
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

// send custom event to Google Analytics
gtag('event', 'traffic_source_detected', {
  source: detectSource()
});