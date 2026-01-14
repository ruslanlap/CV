/**
 * Email Templates
 * HTML and plain text email templates for contact form submissions
 */

interface EmailTemplateData {
    name: string;
    email: string;
    subject: string;
    message: string;
    language: "en" | "ua";
}

/**
 * Generate HTML email template
 * @param data - Contact form data
 * @returns HTML email string
 */
export function generateHTMLEmail(data: EmailTemplateData): string {
    const { name, email, subject, message, language } = data;

    const title = language === "ua" ? "Нове повідомлення з CV сайту" : "New Message from CV Website";
    const fromLabel = language === "ua" ? "Від" : "From";
    const emailLabel = language === "ua" ? "Email" : "Email";
    const subjectLabel = language === "ua" ? "Тема" : "Subject";
    const messageLabel = language === "ua" ? "Повідомлення" : "Message";

    return `
<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header {
      border-bottom: 3px solid #8839ef;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      margin: 0;
      color: #8839ef;
      font-size: 24px;
    }
    .field {
      margin-bottom: 20px;
    }
    .field-label {
      font-weight: 600;
      color: #666;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 5px;
    }
    .field-value {
      color: #333;
      font-size: 16px;
    }
    .message-box {
      background-color: #f8f9fa;
      border-left: 4px solid #8839ef;
      padding: 15px;
      border-radius: 4px;
      margin-top: 10px;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e0e0e0;
      font-size: 12px;
      color: #999;
      text-align: center;
    }
    a {
      color: #8839ef;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${title}</h1>
    </div>
    
    <div class="field">
      <div class="field-label">${fromLabel}</div>
      <div class="field-value">${escapeHtml(name)}</div>
    </div>
    
    <div class="field">
      <div class="field-label">${emailLabel}</div>
      <div class="field-value">
        <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>
      </div>
    </div>
    
    <div class="field">
      <div class="field-label">${subjectLabel}</div>
      <div class="field-value">${escapeHtml(subject)}</div>
    </div>
    
    <div class="field">
      <div class="field-label">${messageLabel}</div>
      <div class="message-box">${escapeHtml(message)}</div>
    </div>
    
    <div class="footer">
      ${language === "ua"
            ? "Це повідомлення надіслано через контактну форму на вашому CV сайті."
            : "This message was sent through the contact form on your CV website."}
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Generate plain text email template
 * @param data - Contact form data
 * @returns Plain text email string
 */
export function generatePlainTextEmail(data: EmailTemplateData): string {
    const { name, email, subject, message, language } = data;

    const title = language === "ua" ? "НОВЕ ПОВІДОМЛЕННЯ З CV САЙТУ" : "NEW MESSAGE FROM CV WEBSITE";
    const fromLabel = language === "ua" ? "Від" : "From";
    const emailLabel = language === "ua" ? "Email" : "Email";
    const subjectLabel = language === "ua" ? "Тема" : "Subject";
    const messageLabel = language === "ua" ? "Повідомлення" : "Message";
    const footer = language === "ua"
        ? "Це повідомлення надіслано через контактну форму на вашому CV сайті."
        : "This message was sent through the contact form on your CV website.";

    return `
${title}
${"=".repeat(title.length)}

${fromLabel}: ${name}
${emailLabel}: ${email}
${subjectLabel}: ${subject}

${messageLabel}:
${"-".repeat(messageLabel.length + 1)}
${message}

---
${footer}
  `.trim();
}

/**
 * Escape HTML special characters to prevent XSS
 * @param text - Text to escape
 * @returns Escaped text
 */
function escapeHtml(text: string): string {
    const map: Record<string, string> = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
    };
    return text.replace(/[&<>"']/g, (char) => map[char]);
}
