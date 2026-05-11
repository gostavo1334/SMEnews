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

interface Comment {
  id: string
  parentId: string | null
  authorName: string
  profileUrl: string
  profileImage: string
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

export async function scrapeFacebookComments(postUrl: string): Promise<ScrapeResult> {
  console.log(`[INVESTIGATED-SCRAPER] Target: ${postUrl}`)

  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-notifications']
    })
    
    const page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 1600 })
    
    // Set a realistic User-Agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
    
    // Go to URL
    await page.goto(postUrl.trim(), { waitUntil: 'networkidle2', timeout: 60000 })

    // Wait for the modal/comments to settle
    await new Promise(r => setTimeout(r, 6000))

    // Diagnostic screenshot
    const screenshot = await page.screenshot({ fullPage: true })
    const debugPath = join(process.cwd(), 'public', 'last-scrape-debug.png')
    writeFileSync(debugPath, screenshot)

    // EXTRACTION WITH VERIFIED SELECTORS
    const extractedData = await page.evaluate(() => {
      const results: any[] = [];
      
      // Target the specific article structures or their wrappers
      const articles = Array.from(document.querySelectorAll('div[role="article"]'));
      
      articles.forEach((article: any, index) => {
        // 1. Author Link & Name (Verified Path: a[role="link"] span span)
        const authorLink = article.querySelector('a[role="link"]');
        const authorSpan = authorLink?.querySelector('span span');
        const authorName = authorSpan?.innerText?.trim() || authorLink?.innerText?.trim() || "Anonymous";
        
        // 2. Content Extraction (Trailing text nodes or dir="auto")
        // We look for the main text container within the article
        const contentEl = article.querySelector('div[dir="auto"], span[dir="auto"]');
        let content = contentEl?.innerText?.trim() || "";

        // 3. Sticker Filter (Verified aria-label check)
        const isSticker = article.querySelector('div[role="button"][aria-label*="sticker"], i[style*="background-image"]');
        if (isSticker) return;

        // 4. Noise Filter (UI Fragments)
        const lowerContent = content.toLowerCase();
        if (!content || content.length < 2) return;
        if (authorName === "Log In" || authorName === "User") return;
        if (lowerContent.includes('log in') || lowerContent.includes('forgot account')) return;

        // 5. Unique ID & Map
        results.push({
          id: `fb_inv_${Date.now()}_${index}`,
          parentId: null,
          authorName,
          profileUrl: authorLink?.href || "",
          profileImage: article.querySelector('img')?.src || "",
          content,
          timestamp: "Recently",
          likes: 0,
          depth: 0
        });
      });
      
      return results;
    });

    await browser.close()

    // Deduplicate and final check
    const finalResults = extractedData.filter((item, index, self) => 
      index === self.findIndex((t) => t.content === item.content)
    );

    if (finalResults.length === 0) {
      return { success: false, error: "No comments detected with verified selectors. Check screenshot." }
    }

    return {
      success: true,
      data: finalResults
    }

  } catch (error) {
    console.error(`[INVESTIGATED-SCRAPER ERROR] ${error}`)
    if (browser) await browser.close()
    return {
      success: false,
      error: error instanceof Error ? error.message : "Investigation-based extraction failed"
    }
  }
}
