import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import path from "path";

export const OG_SIZE = { width: 1200, height: 630 };

async function loadFonts() {
  const fontsDir = path.join(process.cwd(), "assets", "fonts");
  const [bold, regular] = await Promise.all([
    readFile(path.join(fontsDir, "Tajawal-Bold.ttf")),
    readFile(path.join(fontsDir, "Tajawal-Regular.ttf")),
  ]);
  return [
    { name: "Tajawal", data: bold, weight: 700 as const },
    { name: "Tajawal", data: regular, weight: 400 as const },
  ];
}

export async function renderOgImage(title: string, subtitle?: string) {
  const fonts = await loadFonts();
  const isLong = title.length > 40;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "linear-gradient(135deg, #0a0a0a 0%, #171717 100%)",
          fontFamily: "Tajawal",
          direction: "rtl",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "6px",
              background: "#22c55e",
            }}
          />
          <div style={{ fontSize: "36px", color: "#a3a3a3" }}>IQD Wiki</div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <div
            style={{
              fontSize: isLong ? "56px" : "76px",
              fontWeight: 700,
              color: "#fafafa",
              lineHeight: 1.25,
              maxWidth: "1000px",
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                fontSize: "32px",
                color: "#a3a3a3",
                lineHeight: 1.5,
                maxWidth: "1000px",
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
        <div style={{ fontSize: "28px", color: "#525252" }}>iqdwiki.com</div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
