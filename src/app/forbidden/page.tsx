import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(180deg, rgba(255,150,0,0.06) 0%, #FFFFFF 60%)",
        fontFamily: "'Nunito', -apple-system, BlinkMacSystemFont, sans-serif",
        padding: "40px 24px",
        textAlign: "center",
      }}
    >
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        .fb-icon-wrap {
          width: 96px;
          height: 96px;
          border-radius: 24px;
          background: rgba(255,150,0,0.10);
          border: 2px solid rgba(255,150,0,0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          animation: fadeUp 0.4s ease both;
        }
        .fb-lock-icon {
          width: 40px;
          height: 40px;
          color: var(--orange);
        }
        .fb-code {
          font-family: 'Fredoka One', cursive;
          font-size: clamp(72px, 16vw, 140px);
          line-height: 1;
          color: var(--orange);
          letter-spacing: -2px;
          animation: fadeUp 0.5s 0.04s ease both;
          opacity: 0;
        }
        .fb-title {
          font-size: 24px;
          font-weight: 800;
          color: var(--gray-text);
          margin: 8px 0 12px;
          animation: fadeUp 0.5s 0.1s ease both;
          opacity: 0;
        }
        .fb-desc {
          font-size: 16px;
          font-weight: 500;
          color: var(--gray-light);
          max-width: 400px;
          line-height: 1.7;
          margin-bottom: 32px;
          animation: fadeUp 0.5s 0.18s ease both;
          opacity: 0;
        }
        .fb-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
          animation: fadeUp 0.5s 0.26s ease both;
          opacity: 0;
        }
        .fb-btn-primary {
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
        }
        .fb-btn-primary:hover {
          background: var(--green-hover);
          transform: translateY(-2px);
          box-shadow: 0 6px 0 var(--green-shadow);
        }
        .fb-btn-primary:active {
          transform: translateY(4px);
          box-shadow: none;
        }
        .fb-btn-secondary {
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
        .fb-btn-secondary:hover {
          background: rgba(28,176,246,0.06);
          transform: translateY(-2px);
          box-shadow: 0 6px 0 var(--secondary-border);
        }
        .fb-btn-secondary:active {
          transform: translateY(4px);
          box-shadow: none;
        }
        .fb-reasons-card {
          margin-top: 28px;
          padding: 20px 24px;
          border-radius: 12px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          max-width: 400px;
          width: 100%;
          text-align: left;
          animation: fadeUp 0.5s 0.34s ease both;
          opacity: 0;
        }
        .fb-reasons-label {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--nav-text);
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .fb-reasons-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border-color);
        }
        .fb-reason-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 8px 0;
          border-bottom: 1px solid var(--border-color);
          font-size: 14px;
          font-weight: 600;
          color: var(--gray-light);
          line-height: 1.5;
        }
        .fb-reason-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .fb-reason-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--orange);
          margin-top: 7px;
          flex-shrink: 0;
        }
        .fb-footer-label {
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

      {/* Lock icon */}
      <div className="fb-icon-wrap">
        <svg
          className="fb-lock-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>

      {/* Error code */}
      <div className="fb-code">403</div>

      {/* Heading */}
      <h1 className="fb-title">Akses Ditolak</h1>

      {/* Description */}
      <p className="fb-desc">
        Kamu tidak memiliki izin untuk mengakses halaman ini. Coba login
        menggunakan akun yang sesuai.
      </p>

      {/* Actions */}
      <div className="fb-actions">
        <Link href="/login" className="fb-btn-primary">
          Login Sekarang
        </Link>
        <Link href="/" className="fb-btn-secondary">
          Kembali ke Beranda
        </Link>
      </div>

      {/* Reasons card */}
      <div className="fb-reasons-card">
        <div className="fb-reasons-label">Kemungkinan Penyebab</div>
        {[
          "Kamu belum login ke akun GradReady",
          "Sesi login sudah kadaluarsa, silakan login ulang",
          "Akun kamu tidak memiliki izin untuk halaman ini",
        ].map((reason, i) => (
          <div key={i} className="fb-reason-item">
            <span className="fb-reason-dot" />
            <span>{reason}</span>
          </div>
        ))}
      </div>

      {/* Footer label */}
      <p className="fb-footer-label">Error Code: 403 &mdash; Forbidden</p>
    </div>
  );
}
