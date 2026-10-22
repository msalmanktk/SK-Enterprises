# SK Enterprises — Website Starter

Premium black-and-gold static website for car rental and property inquiries. Built with HTML, CSS, and vanilla JavaScript.

## Run locally
1. Extract this folder.
2. Open `sk-enterprises-website` in VS Code.
3. Install/use the VS Code **Live Server** extension, then right-click `index.html` and choose **Open with Live Server**. You can also open `index.html` directly, but a local server is better for testing.

## Before publishing
- Replace the sample/demo listing images and text with your actual inventory.
- Replace the WhatsApp and phone placeholders in `js/config.js`.
- Before publishing, replace `https://example.uk` in `js/config.js`, `robots.txt`, and `sitemap.xml` with your actual domain. These are placeholders because the live domain was not provided when this package was prepared.
- Add your actual logo in `images/branding/` and update the header branding if desired.
- Review privacy, rental, and property terms for your actual business.
- Check every page and link on mobile and desktop.

## Google Sheets setup
1. Create a Google Sheet with a `Cars` tab and a `Properties` tab.
2. Use these exact column headers (lowercase is easiest):
   - Cars: `id,name,price_per_day,image_url,transmission,seats,description,status`
   - Properties: `id,title,price,purpose,location,bedrooms,image_url,status`
3. Add only public listing information. Set `status` to `Active` or `Hidden`.
4. Use Google Sheets **File → Share → Publish to web** and publish each tab as CSV (or publish separate spreadsheets if preferred).
5. Paste each published CSV URL into `carsCsvUrl` and `propertiesCsvUrl` in `js/config.js`.
6. Test the published URLs in a private browser window and then test your site. Public sheets are visible to others; never put private data there.

When a published CSV URL is configured, the listing pages use active rows from Sheets. If the URL is empty, built-in demo listings appear. Detail pages resolve the `id` query parameter and fall back to the first demo item if an ID is unknown.

## WhatsApp and phone
Use international digits without `+`, spaces, or dashes, e.g. replace the placeholder with your real country code and number. Do not leave `*` in the real published config. A customer must press **Send** in WhatsApp. This is an inquiry only; no backend means the site cannot lock inventory or confirm bookings automatically.

## Hosting
Deploy this folder to Cloudflare Pages or Netlify as a static site. Add your custom domain in the hosting dashboard and follow the DNS instructions provided by that host and your domain registrar. Wait for HTTPS/SSL to activate before sharing the site.

## Files
- `css/components.css`: reusable UI components
- `css/style.css`: main design
- `css/responsive.css`: all responsive breakpoints
- `js/config.js`: business contact details and Google Sheets CSV URLs
- `js/main.js`: navigation and shared helpers
- `js/cars.js`, `js/properties.js`: listing pages
- `js/details.js`: car/property details
- `js/booking.js`, `js/contact.js`, `js/construction.js`: WhatsApp inquiry forms

## Construction services
The project now includes `construction.html` and a project inquiry form that prepares a WhatsApp message. Construction service categories and photos are examples only: confirm the client's actual services and replace the imagery/text before publishing.


### Homepage hero slider
The homepage now has a 3-slide automatic hero slider for car rental, construction, and real estate. Temporary Unsplash image URLs are used in `index.html` for now. Replace these with your own optimized `.webp` files later by updating the `--slide-image` URLs in the three `.sk-enterprises-slide` elements. Slider changes every 5 seconds and includes arrow/dot controls.
