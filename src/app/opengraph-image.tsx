import { ImageResponse } from "next/og";

// Site-wide default social share image, inherited by every route that doesn't
// define its own. 1200x630 is the standard OG/Twitter card size.
export const alt = "deoochform — AI-native form builder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#1c1917",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "linear-gradient(135deg, #65a30d, #0d9488)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Satori renders plain SVG children; keep in sync with app/icon.svg. */}
            <svg width={40} height={40} viewBox="8 8 30 32" fill="#ffffff">
              <path
                fillRule="evenodd"
                d="M11 9h11a15 15 0 0 1 0 30H11a2 2 0 0 1-2-2V11a2 2 0 0 1 2-2Zm5.5 8.5h16a1.75 1.75 0 0 1 0 3.5h-16a1.75 1.75 0 0 1 0-3.5Zm0 9.5h10a1.75 1.75 0 0 1 0 3.5h-10a1.75 1.75 0 0 1 0-3.5Z"
              />
            </svg>
          </div>
          <div style={{ fontSize: 40, fontWeight: 800 }}>deoochform</div>
        </div>
        <div style={{ marginTop: 48, fontSize: 76, fontWeight: 800, lineHeight: 1.05, maxWidth: 960 }}>
          Powerful forms that build themselves.
        </div>
        <div style={{ marginTop: 28, fontSize: 34, color: "#a8a29e", maxWidth: 900 }}>
          Describe a form in plain English — collect responses and export to Excel.
        </div>
      </div>
    ),
    { ...size },
  );
}
