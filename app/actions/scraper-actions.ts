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
/**
 * Filters out comments from staff members based on a list of staff names.
 * @param comments - Array of scraped comments.
 * @param staffNames - Array of staff names to exclude.
 * @returns Filtered array of comments, excluding staff.
 */
export async function filterOutStaffComments(comments: Comment[], staffNames: string[]): Promise<Comment[]> {
  return comments.filter(
    (comment) => !staffNames.some(
      (staffName) => comment.authorName.toLowerCase().includes(staffName.toLowerCase())
    )
  );
}
 
export async function scrapeFacebookComments(
  postUrl: string,
  staffNames: string[] = ['Meak Lida'] // Add staffNames as an optional parameter
): Promise<ScrapeResult> {
  console.log(`[SCRAPER] Target: ${postUrl}`);
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-notifications',
        '--disable-blink-features=AutomationControlled',
      ],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 1600 });

    // Set a realistic User-Agent
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    // Navigate to the post
    await page.goto(postUrl.trim(), {
      waitUntil: 'networkidle2',
      timeout: 60000,
    });

    // Scroll to load all comments
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      let lastHeight = document.body.scrollHeight;
      while (true) {
        window.scrollTo(0, document.body.scrollHeight);
        new Promise((resolve) => setTimeout(resolve, 2000));
        let newHeight = document.body.scrollHeight;
        if (newHeight === lastHeight) break;
        lastHeight = newHeight;
      }
    });

    // Take a debug screenshot
    const screenshot = await page.screenshot({ fullPage: true });
    const debugPath = join(process.cwd(), 'public', 'last-scrape-debug.png');
    writeFileSync(debugPath, screenshot);

    // Extract all comments
    const extractedData = await page.evaluate(() => {
      const results: Comment[] = [];
      const commentElements = Array.from(
        document.querySelectorAll('div[data-commentid], div[role="article"]')
      );

      commentElements.forEach((commentEl) => {
        if (!commentEl.textContent?.trim()) return;

        const authorLink = commentEl.querySelector(
          'a[href*="/profile.php?id="], a[href*="facebook.com/"]'
        );
        const authorName = authorLink?.textContent?.trim() || 'Anonymous';
        const profileUrl = authorLink?.href || '';
        const authorAvatar = commentEl.querySelector('img')?.src || '';
        const contentEl = commentEl.querySelector(
          'div[data-commentbody], div[dir="auto"], span[dir="auto"]'
        );
        const content = contentEl?.textContent?.trim() || '';

        if (!content || content.length < 2) return;
        if (authorName === 'Log In' || authorName === 'User') return;
        if (content.toLowerCase().includes('log in')) return;

        const timestampEl = commentEl.querySelector('abbr[title], span[class*="timestamp"]');
        const timestamp = timestampEl?.getAttribute('title') || 'Recently';

        const likesEl = commentEl.querySelector(
          'span[class*="like"], a[aria-label*="reactions"]'
        );
        const likesText = likesEl?.textContent?.trim() || '0';
        const likes = parseInt(likesText.replace(/\D/g, '')) || 0;

        const depth = commentEl.getAttribute('data-depth')
          ? parseInt(commentEl.getAttribute('data-depth')!)
          : 0;

        const parentId = commentEl.getAttribute('data-parent-id') || null;

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
        });
      });

      return results;
    });

    await browser.close();

    // Deduplicate results
    const finalResults = extractedData.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.content === item.content && t.authorName === item.authorName)
    );

    // Filter out staff comments
    const filteredResults = await filterOutStaffComments(finalResults, staffNames);

    if (filteredResults.length === 0) {
      return {
        success: false,
        error: 'No comments detected after filtering. Check the screenshot and selectors.',
      };
    }

    return {
      success: true,
      data: filteredResults,
    };
  } catch (error) {
    console.error(`[SCRAPER ERROR] ${error}`);
    if (browser) await browser.close();
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Scraping failed',
    };
  }
}