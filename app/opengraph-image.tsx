import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { invitation } from "@/constants";

export const alt = `${invitation.names} — Wedding Invitation`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const [sloopFontBuffer, geistFontBuffer, envelopeBuffer] = await Promise.all([
    readFile(join(process.cwd(), "public/fonts/Sloop-ScriptThree.ttf")),
    readFile(
      join(
        process.cwd(),
        "node_modules/next/dist/compiled/@vercel/og/Geist-Regular.ttf",
      ),
    ),
    readFile(join(process.cwd(), "public/images/envelope-1.png")),
  ]);

  const sloopFont = sloopFontBuffer.buffer.slice(
    sloopFontBuffer.byteOffset,
    sloopFontBuffer.byteOffset + sloopFontBuffer.byteLength,
  );
  const geistFont = geistFontBuffer.buffer.slice(
    geistFontBuffer.byteOffset,
    geistFontBuffer.byteOffset + geistFontBuffer.byteLength,
  );
  const envelopeSrc = `data:image/png;base64,${envelopeBuffer.toString("base64")}`;

  const img = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f4f1e8",
          fontFamily: "Geist",
          padding: "36px 48px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Geist",
            fontSize: 13,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "#8a8f7e",
            marginBottom: 8,
          }}
        >
          {invitation.eyebrow}
        </div>

        <div
          style={{
            display: "flex",
            fontFamily: "Sloop Script Three",
            fontSize: 64,
            lineHeight: 1.15,
            color: "#7f8c72",
            marginBottom: 18,
          }}
        >
          {invitation.names}
        </div>

        <img
          src={envelopeSrc}
          alt=""
          width={500}
          height={349}
          style={{
            objectFit: "contain",
            filter: "drop-shadow(0 24px 36px rgba(80, 90, 66, 0.28))",
          }}
        />

        <div
          style={{
            display: "flex",
            fontFamily: "Geist",
            marginTop: 18,
            fontSize: 14,
            letterSpacing: "0.18em",
            color: "#8a8f7e",
          }}
        >
          {`Open the invitation · ${invitation.date}`}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Geist",
          data: geistFont,
          style: "normal",
          weight: 400,
        },
        {
          name: "Sloop Script Three",
          data: sloopFont,
          style: "normal",
          weight: 400,
        },
      ],
    },
  );

  return img;
}
