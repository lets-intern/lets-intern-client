'use client';

import { useState } from 'react';
import { VOD_HOOK } from '../data/vodHook';
import { VOD_DETAIL_URL } from '../data/links';

// 4각 반짝임(sparkle) 별 — 이모지 대신 브랜드 컬러로 자연스럽게 녹여낸다.
function Sparkle({ className }: { className?: string }) {
  return (
    <svg
      className={`vod-sparkle ${className ?? ''}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M12 0c.95 6.6 4.45 10.1 11 11-6.55.9-10.05 4.4-11 11-.95-6.6-4.45-10.1-11-11C7.55 10.1 11.05 6.6 12 0Z" />
    </svg>
  );
}

// 멤버십 신청 시 현직자 공채 준비 VOD 무료 제공 훅 섹션 (다크, 디자인 시스템 정렬).
// 썸네일은 실제 이미지(thumbnailImage)를 우선 노출하고, 파일이 없으면 CSS 폴백 카드로 대체한다.
export default function VodHookSection() {
  const [thumbBroken, setThumbBroken] = useState(false);
  const showImage = Boolean(VOD_HOOK.thumbnailImage) && !thumbBroken;

  return (
    <>
      <section className="vod-hook">
        <div className="wrap">
          <div className="vod-head rv">
            <span className="eyebrow">{VOD_HOOK.eyebrow}</span>
            <h2>
              {VOD_HOOK.titleTop}
              <br />
              {VOD_HOOK.titleBottomLead}
              <span className="vod-free">
                <Sparkle className="vod-sparkle--sm" />
                <span className="vod-free-text">
                  {VOD_HOOK.titleBottomHighlight}
                </span>
                <Sparkle />
              </span>
              {VOD_HOOK.titleBottomTail}
            </h2>
          </div>

          <article className="vod-card rv">
            {showImage ? (
              <img
                className="vod-thumb-img"
                src={VOD_HOOK.thumbnailImage}
                alt={VOD_HOOK.thumbnailAlt}
                onError={() => setThumbBroken(true)}
              />
            ) : (
              <div className="vod-thumb" aria-hidden="true">
                <span className="vod-thumb-brand">
                  {VOD_HOOK.thumbnail.brand}
                </span>
                <div className="vod-thumb-body">
                  <strong>{VOD_HOOK.thumbnail.title}</strong>
                  <span>{VOD_HOOK.thumbnail.caption}</span>
                </div>
              </div>
            )}

            <div className="vod-info">
              <span className="vodhook-badge">{VOD_HOOK.badge}</span>
              <h3 className="vod-card-title">{VOD_HOOK.title}</h3>
              <ul className="vod-meta">
                {VOD_HOOK.meta.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
              <ul className="vod-bullets">
                {VOD_HOOK.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <div className="vod-cardfoot">
                <div className="vodhook-price">
                  <span className="vodhook-price-old">
                    {VOD_HOOK.priceOriginal}
                  </span>
                  <span className="vodhook-price-free">
                    {VOD_HOOK.priceFree}
                  </span>
                </div>
                <a
                  className="btn btn-blue vod-cta"
                  href={VOD_DETAIL_URL || undefined}
                  target={VOD_DETAIL_URL ? '_blank' : undefined}
                  rel={VOD_DETAIL_URL ? 'noopener noreferrer' : undefined}
                >
                  {VOD_HOOK.cta}
                </a>
              </div>
            </div>
          </article>

          <p className="vod-foot rv">
            {VOD_HOOK.footnoteLead}
            <b>{VOD_HOOK.footnoteStrong}</b>
            {VOD_HOOK.footnoteTail}
            <br />
            <span className="vod-foot-sub">{VOD_HOOK.footnoteSub}</span>
          </p>
        </div>
      </section>

      <div className="vod-promo">{VOD_HOOK.promoStrip}</div>
    </>
  );
}
