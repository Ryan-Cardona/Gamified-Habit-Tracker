import { useState } from 'react'
import './InAppBrowserModal.css'

export function isInAppBrowser() {
  const ua = navigator.userAgent || ''

  // Named in-app browsers (Android + iOS)
  if (
    /FBAN|FBAV|FBIOS|FB_IAB|FBDV/i.test(ua) ||         // Facebook
    /Instagram/i.test(ua) ||                              // Instagram
    /Twitter/i.test(ua) ||                                // Twitter / X
    /Discord/i.test(ua) ||                                // Discord (Android)
    /Snapchat/i.test(ua) ||                               // Snapchat
    /musical_ly|BytedanceWebview|TikTok/i.test(ua) ||    // TikTok
    /LinkedIn/i.test(ua) ||                               // LinkedIn
    /MicroMessenger/i.test(ua) ||                         // WeChat
    /GSA\//i.test(ua) ||                                  // Google Search App (Gmail on iOS)
    // Generic Android WebView — Chrome UA with the "wv" flag
    (/Android/i.test(ua) && /\bwv\b/.test(ua))
  ) return true

  // Generic iOS in-app browser (WKWebView) — has iPhone/iPad but lacks Safari/
  // Regular Safari and Chrome on iOS both include "Safari/" at the end; WKWebView does not.
  if (/iPhone|iPad/i.test(ua) && !/Safari\//i.test(ua)) return true

  return false
}

export function InAppBrowserModal({ onDismiss }) {
  const [copied, setCopied] = useState(false)
  const url = window.location.href

  function handleCopy() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  return (
    <div className="iab-overlay">
      <div className="iab-card">
        <div className="iab-icon">🌐</div>
        <h2 className="iab-title">Open in your browser</h2>
        <p className="iab-body">
          Slurp works best in a full browser like Chrome or Safari. Some features
          may not work correctly in this in-app browser.
        </p>
        <p className="iab-body">
          Tap <strong>Copy Link</strong>, then paste it into Chrome or Safari.
        </p>

        <button className="iab-btn" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy Link'}
        </button>

        <button className="iab-btn iab-btn--secondary" onClick={onDismiss}>
          Continue anyway
        </button>
      </div>
    </div>
  )
}
