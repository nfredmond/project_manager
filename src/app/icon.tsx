export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/svg+xml";

const svg = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" rx="8" fill="#111827" />
  <path d="M9 22.5v-13h3.4l4.15 7.52 4.05-7.52H24v13h-3.2l.05-8.06-4.61 8.06h-1.5l-4.7-8.22v8.22z" fill="#F9FAFB" />
</svg>`;

export default function Icon() {
  return new Response(svg, {
    headers: {
      "Content-Type": contentType,
    },
  });
}
