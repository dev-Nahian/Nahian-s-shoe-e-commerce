import { ImageResponse } from "next/og";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 18,
          background: "linear-gradient(135deg, #111827 0%, #030712 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#f59e0b",
          borderRadius: "8px",
          fontWeight: 800,
          fontFamily: "system-ui, sans-serif",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.15)",
        }}
      >
        N
      </div>
    ),
    {
      ...size,
    }
  );
}
