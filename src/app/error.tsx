"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  const isProduction = process.env.NODE_ENV === "production";

  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(180deg, rgba(255,75,75,0.05) 0%, #FFFFFF 60%)",
        fontFamily: "'Nunito', -apple-system, BlinkMacSystemFont, sans-serif",
        padding: "40px 24px",
        textAlign: "center",
      }}
    >
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        .err-illustration {
          animation: float 5s ease-in-out infinite;
          filter: drop-shadow(0 16px 32px rgba(255,75,75,0.15));
        }
        .err-code {
          font-family: 'Fredoka One', cursive;
          font-size: clamp(72px, 16vw, 140px);
          line-height: 1;
          color: var(--red);
          letter-spacing: -2px;
          animation: fadeUp 0.5s ease both;
        }
        .err-title {
          font-size: 24px;
          font-weight: 800;
          color: var(--gray-text);
          margin: 8px 0 12px;
          animation: fadeUp 0.5s 0.1s ease both;
          opacity: 0;
        }
        .err-desc {
          font-size: 16px;
          font-weight: 500;
          color: var(--gray-light);
          max-width: 400px;
          line-height: 1.7;
          margin-bottom: 32px;
          animation: fadeUp 0.5s 0.18s ease both;
          opacity: 0;
        }
        .err-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
          animation: fadeUp 0.5s 0.26s ease both;
          opacity: 0;
        }
        .err-btn-retry {
          display: inline-flex;
          align-items: center;
          height: 48px;
          padding: 0 28px;
          border-radius: 12px;
          background: var(--green);
          color: #ffffff;
          font-family: 'Nunito', sans-serif;
          font-size: 15px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          text-decoration: none;
          border: none;
          box-shadow: 0 4px 0 var(--green-shadow);
          transition: all 0.12s ease;
          cursor: pointer;
        }
        .err-btn-retry:hover {
          background: var(--green-hover);
          transform: translateY(-2px);
          box-shadow: 0 6px 0 var(--green-shadow);
        }
        .err-btn-retry:active {
          transform: translateY(4px);
          box-shadow: none;
        }
        .err-btn-home {
          display: inline-flex;
          align-items: center;
          height: 48px;
          padding: 0 28px;
          border-radius: 12px;
          background: transparent;
          color: var(--blue);
          font-family: 'Nunito', sans-serif;
          font-size: 15px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          text-decoration: none;
          border: 2px solid var(--secondary-border);
          box-shadow: 0 4px 0 var(--secondary-border);
          transition: all 0.12s ease;
        }
        .err-btn-home:hover {
          background: rgba(28,176,246,0.06);
          transform: translateY(-2px);
          box-shadow: 0 6px 0 var(--secondary-border);
        }
        .err-btn-home:active {
          transform: translateY(4px);
          box-shadow: none;
        }
        .err-detail-box {
          margin-top: 28px;
          padding: 16px 20px;
          border-radius: 12px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          max-width: 460px;
          width: 100%;
          text-align: left;
          animation: fadeUp 0.5s 0.34s ease both;
          opacity: 0;
        }
        .err-detail-label {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--nav-text);
          margin-bottom: 8px;
        }
        .err-detail-msg {
          font-size: 13px;
          font-weight: 600;
          color: var(--red);
          font-family: monospace;
          word-break: break-all;
        }
        .err-detail-digest {
          font-size: 11px;
          color: var(--nav-text);
          margin-top: 6px;
          font-family: monospace;
        }
        .err-footer-label {
          margin-top: 40px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--nav-text);
          animation: fadeUp 0.5s 0.42s ease both;
          opacity: 0;
        }
      `}</style>

      {/* Illustration */}
      <div className="err-illustration" style={{ marginBottom: 4 }}>
        <Image
          src="/error-illustration.png"
          alt="Terjadi kesalahan"
          width={200}
          height={200}
          style={{ objectFit: "contain" }}
          priority
        />
      </div>

      {/* Error code */}
      <div className="err-code">500</div>

      {/* Heading */}
      <h1 className="err-title">Terjadi Kesalahan pada Server</h1>

      {/* Description */}
      <p className="err-desc">
        Server kami mengalami masalah dan tidak dapat memproses permintaan ini.
        Coba lagi, atau kembali ke beranda.
      </p>

      {/* Actions */}
      <div className="err-actions">
        <button onClick={reset} className="err-btn-retry">
          Coba Lagi
        </button>
        <Link href="/" className="err-btn-home">
          Kembali ke Beranda
        </Link>
      </div>

      {/* Error detail */}
      {!isProduction && error?.message && (
        <div className="err-detail-box">
          <p className="err-detail-label">Detail Error</p>
          <p className="err-detail-msg">{error.message}</p>
          {error.digest && (
            <p className="err-detail-digest">Digest: {error.digest}</p>
          )}
        </div>
      )}
      {isProduction && error.digest && (
        <p className="err-detail-digest">Digest: {error.digest}</p>
      )}

      {/* Footer label */}
      <p className="err-footer-label">Error Code: 500 &mdash; Internal Server Error</p>
    </div>
  );
}
