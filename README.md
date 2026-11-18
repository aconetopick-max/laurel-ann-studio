# Laurel Ann Studio website

A custom, mobile-friendly website for Laurel Ann Studio, a window painting and hand-painted artwork business serving Canton, Georgia and nearby communities.

## What's included

- Custom circular **LA** branding and editorial layout
- Seven window painting and art services
- Four flexible painting packages (no made-up prices)
- Five honest photo placeholders, plus two owner portrait placeholders
- Filterable portfolio, real reviews section (hidden until reviews exist), and FAQ
- Netlify quote form with **two optional image upload inputs**, preferred date, and spam honeypot
- GitHub-backed content editing with **Pages CMS** (`.pages.yml`)
- No paid dependencies, no build command, no API keys

## Publish with Netlify

1. Sign in to [Netlify](https://app.netlify.com/).
2. Choose **Add new project → Import an existing project → GitHub**.
3. Select `aconetopick-max/laurel-ann-studio` and approve Netlify's GitHub access if asked.
4. Use the detected **publish directory** `.` and **leave the build command blank**. Deploy.
5. In **Forms**, make sure form detection is enabled. Submit one test quote on your live `.netlify.app` URL and check the result in your Netlify dashboard. Your local preview will not send submissions to Netlify.
6. In **Forms → Submission notifications**, add the email address that should receive new inquiries. This requires you to choose an inbox in your own Netlify account.
7. If you connect a custom domain later, configure it under Domain management in Netlify.

Each push to the repository automatically redeploys your site *once the repo is linked*.

## Add and edit your photos without touching code

1. Visit [Pages CMS](https://app.pagescms.org/), sign in with GitHub, and grant access to this repository.
2. Open `laurel-ann-studio` and choose **Edit Laurel Ann Studio**.
3. Edit **Portfolio pictures** to upload a photo for each of the 5 placeholders. You can add more projects with the **Add** control.
4. Edit **Meet the artists and photos** to add Leighann's and Laurel's portraits.
5. Add your actual business email and social URLs when ready. The site hides blank links automatically.
6. Save your changes in Pages CMS. They are committed to GitHub; Netlify republishes after the next deployment.

The entire editable content model is `data/site.json` and the editor definition is `.pages.yml`. Media uploads are saved to `/media/` in GitHub.

## Form details and privacy

The HTML form is present in `index.html` at deploy time so Netlify can detect it. Submission uses native POST to Netlify and redirects to `/thank-you/` only after successful processing. `name="quote-request"`, `data-netlify="true"`, a matching hidden `form-name`, and a bot honeypot are included. Photo fields are separate because Netlify accepts one file per field. Each is limited to 3.5 MB in client-side validation to fit the Netlify 8 MB request limit. Only JPG, PNG and WebP are accepted. If a user's phone produces HEIC/HEIF files, they must export them as JPG/PNG first. The message field is required; photos are optional.

**Do not** put customer submission photos, addresses, phone numbers or other private inquiries into the public GitHub repository. They should remain in Netlify's private Forms dashboard. No fake reviews are included.

## Local preview

Run `python3 -m http.server 8000` from the root of this folder and visit `http://localhost:8000`. The portfolio, CMS content, and layout work locally; Netlify Forms submissions only work on the deployed site with Forms enabled.
