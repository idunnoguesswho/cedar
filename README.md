# Dale's Custom Cedar Furniture: website demo

A one-page, mobile-first website for Dale's Custom Cedar Furniture (Bruderheim, AB).
Customers can see examples of Dale's work and ask him for a price.

**Live demo:** https://idunnoguesswho.github.io/cedar/

## What's on the page

| Section | Purpose |
|---|---|
| Header + phone-only bottom bar | "Call" and "Ask for a price" are always one tap away |
| Hero | Who Dale is, what he makes |
| Dale's work | Photo gallery; tap a photo to enlarge (arrow keys / swipe buttons to browse) |
| What he builds | Planters, seating, tables, custom |
| Pricing | Explains that every piece is quoted, in three plain steps |
| Ask for a price | The quote request form |
| Contact | Phone, email, workshop address + directions, Facebook |

No build step, no frameworks, no tracking. It is plain HTML, CSS and JavaScript.

## Preview it on your computer (Windows)

Open the folder in VS Code and either:

- install the **Live Server** extension, right-click `index.html`, choose **Open with Live Server**, or
- in a terminal inside the folder run: `py -m http.server 8000` and open http://localhost:8000

(Double-clicking `index.html` also works for a quick look, but a local server matches how the live site behaves.)

## The quote form: demo mode vs live mode

The form currently runs in **demo mode** (`formEndpoint` is empty in `js/main.js`):
when a visitor presses *Ask for a price*, their own email app opens with the message
already written, addressed to Dale. That needs no setup, but it only works if the visitor
has an email app set up on their device, which many people don't.

**Before launch, switch to live mode** so requests land directly in Dale's inbox:

1. Create a free form at [Formspree](https://formspree.io) (or [Web3Forms](https://web3forms.com)) using Dale's email address.
2. Copy the endpoint address it gives you (looks like `https://formspree.io/f/abcd1234`).
3. Paste it into `formEndpoint` at the top of `js/main.js`:
   ```js
   var CONFIG = {
     formEndpoint: 'https://formspree.io/f/abcd1234',
     ...
   };
   ```
4. Commit and push. The page's security policy already allows Formspree and Web3Forms. If you use a different service, add its address to `connect-src` and `form-action` in the `<meta http-equiv="Content-Security-Policy">` tag in `index.html`.

The form also has a hidden "spam trap" field that bots fill in and people never see.

## Editing content

| To change... | Edit... |
|---|---|
| Phone, email, address | `index.html` (search for `780-984-5917`, `dl.thompson@shaw.ca`, `5031-50 Avenue`) and the `CONFIG` block in `js/main.js` |
| Photos | Replace files in `images/` (keep the same file names, or update `index.html`). Keep photos around 1200px wide so the page stays fast |
| Colours and fonts | The `:root { ... }` block at the top of `css/styles.css` |
| Wording | `index.html`; every section is labelled with a comment |

## To confirm with Dale before launch

- The wording on the page (what he builds, the line about cedar) was written from his photos and business card. Please have him read it over.
- He is happy for these photos and his contact details to be public.
- The **Facebook link** currently goes to a Facebook *search* for "Dale's Custom Cedar Furniture". Swap in his actual page address once known.
- The share-preview image (`images/share.jpg`) and the address in `index.html` assume the GitHub Pages address above. If the site moves to its own domain, update the `og:image` and structured-data URLs.

## Publishing notes

Hosted with GitHub Pages straight from the `main` branch, root folder. GitHub Pages on a free account requires a **public** repository, so only put public business information in here (it already is: phone, email and address come from Dale's business card).
To use a custom domain later: *Settings → Pages → Custom domain*, then add the DNS record GitHub shows.

## Credits

- Photos and logo: Dale's Custom Cedar Furniture.
- Fonts (hosted in `fonts/`): Bevan and Source Sans 3, both under the SIL Open Font License (see `fonts/LICENSE-OFL.txt`).
