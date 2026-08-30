import { ImageResponse } from "next/og";

export const alt =
  "Northova Digital - Websites built for credibility, clarity and growth";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        background:
          "linear-gradient(135deg, #5664f4 0%, #755def 55%, #617fe9 100%)",
        color: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "18px",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "18px",
            background: "rgba(255,255,255,0.16)",
            border: "1px solid rgba(255,255,255,0.25)",
            fontSize: "32px",
            fontWeight: 800,
          }}
        >
          N
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontSize: "28px",
              fontWeight: 800,
            }}
          >
            Northova
          </div>

          <div
            style={{
              marginTop: "3px",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.22em",
              opacity: 0.7,
            }}
          >
            DIGITAL
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          maxWidth: "920px",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontSize: "76px",
            fontWeight: 700,
            letterSpacing: "-0.055em",
            lineHeight: 0.98,
          }}
        >
          Build a digital presence people trust.
        </div>

        <div
          style={{
            marginTop: "30px",
            fontSize: "24px",
            lineHeight: 1.45,
            opacity: 0.78,
          }}
        >
          Strategy-led websites for U.S. businesses.
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid rgba(255,255,255,0.18)",
          paddingTop: "22px",
          fontSize: "16px",
          opacity: 0.7,
        }}
      >
        <div>Strategy · Design · Development</div>
        <div>Northova Digital</div>
      </div>
    </div>,
    size,
  );
}
