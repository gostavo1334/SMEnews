'use server'

import puppeteer from 'puppeteer'
import { join } from 'path'
import { writeFileSync } from 'fs'

/**
 * Facebook Scraper - Investigated Engine
 * 
 * Uses verified selectors found during live DOM investigation.
 * Specifically targets the logged-out modal view structure.
 */

export interface Comment {
  id: string
  parentId: string | null
  authorName: string
  profileUrl: string
  authorAvatar: string
  content: string
  timestamp: string
  likes: number
  depth: number
}
interface ScrapeResult {
  success: boolean
  data?: Comment[]
  error?: string
}

// Helper: Random delay to mimic human behavior
const randomDelay = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min

export async function scrapeFacebookComments(postUrl: string): Promise<ScrapeResult> {
  console.log(`[SCRAPER] Target: ${postUrl}`)
  let browser

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-notifications',
        '--disable-blink-features=AutomationControlled', // Avoid detection
      ],
    })

    const page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 1600 })

    // Set a realistic User-Agent
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    )

    // Load cookies if available (for authenticated sessions)
    // Replace with your actual cookies if you have them
    // const cookies = [...]; // Load from a file or database
    // await page.setCookie(...cookies);

    // Navigate to the post
    await page.goto(postUrl.trim(), {
      waitUntil: 'networkidle2',
      timeout: 60000,
    })

    // --- FIX 1: Scroll to load all comments ---
    await page.evaluate(() => {
      window.scrollTo(0, 0)
      let lastHeight = document.body.scrollHeight
      while (true) {
        window.scrollTo(0, document.body.scrollHeight)
        // Wait for new content to load
        new Promise((resolve) => setTimeout(resolve, 2000))
        let newHeight = document.body.scrollHeight
        if (newHeight === lastHeight) break
        lastHeight = newHeight
      }
    })

    // Random delay to avoid rate limiting
    await page.waitForTimeout(randomDelay(1000, 3000))

    // --- FIX 2: Take a debug screenshot ---
    const screenshot = await page.screenshot({ fullPage: true })
    const debugPath = join(process.cwd(), 'public', 'last-scrape-debug.png')
    writeFileSync(debugPath, screenshot)

    // --- FIX 3: Extract all comments, likes, and user details ---
    const extractedData = await page.evaluate(() => {
      const results: Comment[] = []

      // Target all comment containers (updated selector)
      const commentElements = Array.from(
        document.querySelectorAll('div[data-commentid], div[role="article"]')
      )

      commentElements.forEach((commentEl) => {
        // Skip if it's not a comment (e.g., ads, login prompts)
        if (!commentEl.textContent?.trim()) return

        // Extract author details
        const authorLink = commentEl.querySelector(
          'a[href*="/profile.php?id="], a[href*="facebook.com/"]'
        )
        const authorName = authorLink?.textContent?.trim() || 'Anonymous'
        const profileUrl = authorLink?.href || ''

        // Extract author avatar
        const authorAvatar = commentEl.querySelector('img')?.src || ''

        // Extract comment content
        const contentEl = commentEl.querySelector(
          'div[data-commentbody], div[dir="auto"], span[dir="auto"]'
        )
        const content = contentEl?.textContent?.trim() || ''

        // Skip empty or noise content
        if (!content || content.length < 2) return
        if (authorName === 'Log In' || authorName === 'User') return
        if (content.toLowerCase().includes('log in')) return

        // Extract timestamp
        const timestampEl = commentEl.querySelector('abbr[title], span[class*="timestamp"]')
        const timestamp = timestampEl?.getAttribute('title') || 'Recently'

        // Extract likes
        const likesEl = commentEl.querySelector(
          'span[class*="like"], a[aria-label*="reactions"]'
        )
        const likesText = likesEl?.textContent?.trim() || '0'
        const likes = parseInt(likesText.replace(/\D/g, '')) || 0

        // Extract depth (for nested replies)
        const depth = commentEl.getAttribute('data-depth')
          ? parseInt(commentEl.getAttribute('data-depth')!)
          : 0

        // Extract parent ID (for replies)
        const parentId = commentEl.getAttribute('data-parent-id') || null

        // Push to results
        results.push({
          id: commentEl.getAttribute('data-commentid') || `fb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          parentId,
          authorName,
          profileUrl,
          authorAvatar,
          content,
          timestamp,
          likes,
          depth,
        })
      })

      return results
    })

    await browser.close()

    // Deduplicate results
    const finalResults = extractedData.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.content === item.content && t.authorName === item.authorName)
    )

    if (finalResults.length === 0) {
      return {
        success: false,
        error: 'No comments detected. Check the screenshot and selectors.',
      }
    }

    return {
      success: true,
      data: finalResults,
    }
  } catch (error) {
    console.error(`[SCRAPER ERROR] ${error}`)
    if (browser) await browser.close()
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Scraping failed',
    }
  }
}