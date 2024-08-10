import puppeteer from 'puppeteer';

export async function getCarsDetailWithRetry(carDetailUrl, retry = 3) {
    let data;
    for (let i = 0; i < retry; i++) {
        try {
            data = await getCarsDetail(carDetailUrl);
            break;
        } catch {
            // Do nothing
        }
    }

    if (data === undefined) {
        throw error;
    }

    return data;
}

export async function getCarsDetail(carDetailUrl) {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    
    await page.goto('https://www.appleauction.co.th/Home');
    await page.setViewport({width: 1080, height: 1024});
    await page.locator('#btn-login').click();
    await page.locator('#UserName').fill(process.env.APPLE_AUCTION_USERNAME);
    await page.locator('#Password').fill(process.env.APPLE_AUCTION_PASSWORD);
    await Promise.all([
        page.waitForNavigation(),
        page.locator('#btn-sign').click()
    ]);
    await page.goto(carDetailUrl)
    
    const data = await page.evaluate(() => {
        const t = document.querySelector('tbody').querySelectorAll('tr')
    
        return Array.from(t).map((tr) => {
            const td = tr.querySelectorAll('td');
            return Array.from(td).map((td) => td.textContent.trim()).filter((td) => td !== '');
        });
    });

    await browser.close();

    return data;
}
