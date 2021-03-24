import { VercelRequest, VercelResponse } from "@vercel/node";
import chromium from "chrome-aws-lambda";

import * as template from "./_lib/template";

const isDev = process.env.NODE_ENV === "development";

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const props = {
      title: req.query["title"] as string,
      info: req.query["info"] as string,
    };
    const html = template.render(props);

    const viewport = { width: 1200, height: 630 };
    const browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();
    await page.setViewport(viewport);
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    await page.evaluateHandle('document.fonts.ready');

    const image = await page.screenshot({ type: "png" });
    await browser.close();

    res.statusCode = 200;
    res.setHeader("Cache-Control", "s-maxage=31536000, stale-while-revalidate");
    res.setHeader("Content-Type", "image/png");
    res.end(image);
  } catch (err) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/html");
    res.end("<h1>Internal Error</h1><p>Sorry, there was a problem</p>");
    console.error(err);
  }
};
