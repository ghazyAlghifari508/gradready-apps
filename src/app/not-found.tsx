import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(180deg, rgba(88,204,2,0.06) 0%, #FFFFFF 60%)",
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
        .nf-illustration {
          animation: float 5s ease-in-out infinite;
          filter: drop-shadow(0 16px 32px rgba(88,204,2,0.18));
        }
        .nf-code {
          font-family: 'Fredoka One', cursive;
          font-size: clamp(72px, 16vw, 140px);
          line-height: 1;
          color: var(--green);
          letter-spacing: -2px;
          animation: fadeUp 0.5s ease both;
        }
        .nf-title {
          font-size: 24px;
          font-weight: 800;
          color: var(--gray-text);
          margin: 8px 0 12px;
          animation: fadeUp 0.5s 0.1s ease both;
          opacity: 0;
        }
        .nf-desc {
          font-size: 16px;
          font-weight: 500;
          color: var(--gray-light);
          max-width: 400px;
          line-height: 1.7;
          margin-bottom: 32px;
          animation: fadeUp 0.5s 0.18s ease both;
          opacity: 0;
        }
        .nf-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
          animation: fadeUp 0.5s 0.26s ease both;
          opacity: 0;
        }
        .nf-btn-primary {
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
        .nf-btn-primary:hover {
          background: var(--green-hover);
          transform: translateY(-2px);
          box-shadow: 0 6px 0 var(--green-shadow);
        }
        .nf-btn-primary:active {
          transform: translateY(4px);
          box-shadow: none;
        }
        .nf-btn-secondary {
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
        .nf-btn-secondary:hover {
          background: rgba(28,176,246,0.06);
          transform: translateY(-2px);
          box-shadow: 0 6px 0 var(--secondary-border);
        }
        .nf-btn-secondary:active {
          transform: translateY(4px);
          box-shadow: none;
        }
        .nf-footer-label {
          margin-top: 48px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--nav-text);
          animation: fadeUp 0.5s 0.36s ease both;
          opacity: 0;
        }
      `}</style>

      {/* Error code */}
      <div className="nf-code">404</div>

      {/* Heading */}
      <h1 className="nf-title">Halaman Tidak Ditemukan</h1>

      {/* Description */}
      <p className="nf-desc">
        Halaman yang kamu cari tidak ada, sudah dipindah, atau memang tidak pernah
        dibuat. Cek kembali URL yang kamu ketik.
      </p>

      {/* Actions */}
      <div className="nf-actions">
        <Link href="/" className="nf-btn-primary">
          Kembali ke Beranda
        </Link>
        <Link href="/dashboard" className="nf-btn-secondary">
          Ke Dashboard
        </Link>
      </div>

      {/* Footer label */}
      <p className="nf-footer-label">Error Code: 404 &mdash; Page Not Found</p>
    </div>
  );
}
