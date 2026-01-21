const currentYear = new Date().getFullYear()
const logoUrl = 'YOUR_LOGO_URL_HERE' // Upload to your storage and replace

type EmailButton = {
  label: string
  url: string
}

export type BrandedEmailOptions = {
  heading: string
  paragraphs: string[]
  button?: EmailButton
  fallbackLink?: string
  signature?: string
}

export function renderBrandedEmail({
  heading,
  paragraphs,
  button,
  fallbackLink,
  signature,
}: BrandedEmailOptions) {
  const paragraphsHtml = paragraphs
    .map(
      (p) =>
        `<p style="font-size:16px; line-height:1.5; color:#333333; margin:0 0 20px;">${p}</p>`
    )
    .join('\n')

  const buttonHtml = button
    ? `
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="left" style="margin:0 0 25px;">
        <tr>
          <td align="center" bgcolor="#000000" style="border-radius:4px;">
            <a href="${button.url}" target="_blank" style="font-size:16px; font-weight:bold; color:#ffffff; text-decoration:none; padding:12px 24px; display:inline-block; border-radius:4px;">${button.label}</a>
          </td>
        </tr>
      </table>`
    : ''

  const signatureHtml = signature
    ? `<div style="clear:both; height:1px;"></div>
       <p style="font-size:16px; line-height:1.5; color:#333333; margin:20px 0 30px;">${signature}</p>`
    : ''

  const fallbackUrl = fallbackLink ?? button?.url
  const fallbackHtml = fallbackUrl
    ? `<p style="font-size:13px; color:#666666; line-height:1.5; margin:0;">
         If the button doesn't work, copy this link:<br>
         <a href="${fallbackUrl}" style="color:#000000; text-decoration:underline; word-break:break-all;">${fallbackUrl}</a>
       </p>`
    : ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${heading}</title>
</head>
<body style="margin:0; padding:0; background-color:#f5f6f7; font-family:Arial, sans-serif;">
  <table role="presentation" width="100%">
    <tr>
      <td align="center" style="padding:40px 15px;">
        <table role="presentation" width="600" style="max-width:600px; background-color:#ffffff; border-radius:6px;">
          <tr>
            <td style="padding:40px; text-align:left;">
              <img src="${logoUrl}" alt="Travelama" width="120" style="display:block; margin-bottom:30px;">
              <h1 style="margin:0 0 20px; font-size:24px; color:#111111;">${heading}</h1>
              ${paragraphsHtml}${buttonHtml}${signatureHtml}${fallbackHtml}
            </td>
          </tr>
        </table>
        <table role="presentation" width="600" style="max-width:600px;">
          <tr>
            <td style="padding:20px 40px; font-size:12px; color:#999999;">
              &copy;${currentYear} Travelama
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
