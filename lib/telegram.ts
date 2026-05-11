const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || ''

/**
 * Strip HTML tags and decode entities to plain text
 */
function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<li>/gi, '• ')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/**
 * Post article to Telegram channel with featured image + full text
 */
export async function postToTelegram({
  title,
  slug,
  featuredImage,
  categoryName,
  authorName,
  content,
}: {
  title: string
  slug: string
  featuredImage?: string | null
  categoryName?: string
  authorName?: string
  content?: string
}) {
  if (!process.env.TELEGRAM_BOT_TOKEN || !CHANNEL_ID) {
    console.warn('[Telegram] Bot token or channel ID missing, skipping.')
    return
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://smenews.com'
  const postUrl = `${siteUrl}/news/${slug}`

  // Strip HTML from content to get plain text
  const plainContent = content ? stripHtml(content) : ''

  // Build HTML caption — title bold, content regular
  const captionParts: string[] = [`📰 <b>${escapeHtml(title)}</b>`]

  if (plainContent) {
    captionParts.push(escapeHtml(plainContent))
  }

  let metaLine = ''
  if (categoryName) metaLine += `📂 ${escapeHtml(categoryName)}`
  if (authorName) metaLine += `  ✍️ ${escapeHtml(authorName)}`
  if (metaLine) captionParts.push(metaLine)

  captionParts.push(`🔗 <a href="${postUrl}">អានបន្ថែម</a>\n🔗 <a href="https://www.facebook.com/smenewscambodia">SMENews Facebook</a>\n🔗 <a href="https://www.facebook.com/hkcarinspectioncambodia">HK Car Inspection</a>`)

  const caption = captionParts.join('\n\n')

  // Telegram photo caption limit = 1024 chars
  // Trim content to fit if needed, keeping title + footer intact
  if (featuredImage) {
    const footer = buildFooter(categoryName, authorName, postUrl)
    const titlePart = `📰 <b>${escapeHtml(title)}</b>`
    const maxContentLen = 1024 - titlePart.length - footer.length - 20
    let trimmedContent = escapeHtml(plainContent)
    if (trimmedContent.length > maxContentLen && maxContentLen > 0) {
      trimmedContent = trimmedContent.substring(0, maxContentLen).trimEnd() + '...'
    }
    const parts = [titlePart]
    if (trimmedContent) parts.push(trimmedContent)
    const finalCaption = parts.join('\n\n') + '\n\n' + footer

    try {
      await sendTelegram('sendPhoto', {
        chat_id: CHANNEL_ID,
        photo: featuredImage,
        caption: finalCaption,
        parse_mode: 'HTML',
      })
    } catch (error) {
      console.error('[Telegram] Error posting:', error)
    }
  } else {
    // No image — 4096 char limit, send full text
    try {
      await sendTelegram('sendMessage', {
        chat_id: CHANNEL_ID,
        text: caption,
        parse_mode: 'HTML',
      })
    } catch (error) {
      console.error('[Telegram] Error posting:', error)
    }
  }
}

function buildFooter(categoryName?: string, authorName?: string, postUrl?: string): string {
  let footer = ''
  if (categoryName) footer += `📂 ${escapeHtml(categoryName)}`
  if (authorName) footer += `  ✍️ ${escapeHtml(authorName)}`
  footer += `\n\n🔗 <a href="${postUrl}">អានបន្ថែម</a>`
  footer += `\n🔗 <a href="https://www.facebook.com/smenewscambodia">SMENews Facebook</a>`
  footer += `\n🔗 <a href="https://www.facebook.com/hkcarinspectioncambodia">HK Car Inspection</a>`
  return footer
}

async function sendTelegram(method: string, body: any) {
  const res = await fetch(`${TELEGRAM_API}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!data.ok) {
    console.error(`[Telegram] ${method} failed:`, data.description)
  } else {
    console.log(`[Telegram] ${method} success`)
  }
  return data
}
