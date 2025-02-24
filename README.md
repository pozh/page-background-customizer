# Page Background Customizer

A simple Obsidian plugin to set custom background images and text colors for individual pages.

## How to Use

1. **Set Background Image:**

   - Open the command palette (Ctrl/Cmd + P).
   - Run "Set Page Background Image" and enter a JPG or PNG URL (e.g., https://example.com/image.jpg).
   - Alternatively, add `page_background: <url>` to the note’s properties.

2. **Set Text Color:**

   - Open the command palette.
   - Run "Page background - set custom text color" and enter a hex code (e.g., #FFFFFF).
   - Alternatively, add `text_color: <hex>` to the note’s properties.

3. **Remove Settings:**
   - Manually delete `page_background` or `text_color` from the properties panel to reset.

## Notes

- Changes apply instantly.
- Background images use `cover` sizing (full page, maintaining aspect ratio).
- Text color overrides all theme styles.
- Invalid URLs fail silently; hex codes are applied as entered.
