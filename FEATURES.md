# OmniPay Features: Deep Dive 🚀

OmniPay isn't just a translator; it's a **Universal Commerce Layer**. Here is a detailed breakdown of the 5 core features that power the platform.

## 1. 🛒 Universal Checkout (The "Money" Feature)
**The Problem:** Buying from 5 different international sites means managing 5 different accounts, 5 payment methods, and 5 shipping addresses.
**The Solution:** One cart. One payment. One account.

### How it Works:
1.  **Frontend:** The browser extension injects an "Add to Global Cart" button next to the native "Buy" button on Amazon JP, Rakuten, etc.
2.  **Scraping:** When clicked, it scrapes the product schema (Price, Image, Title, SKU).
3.  **Proxy:** The item is added to your OmniPay Cart.
4.  **Payment:** You checkout on OmniPay using Apple Pay/Stripe in your local currency (USD).
5.  **Fulfillment:** Our backend automatically purchases the item from the foreign site and ships it to our consolidation warehouse.

---

## 2. 🌐 Global Search (Discovery Engine)
**The Problem:** You can't search for "Vintage Kimono" on a Japanese site if you don't speak Japanese. English results are often 3x the price.
**The Solution:** Search in English, browse globally.

### How it Works:
1.  **Query Translation:** You type "Sony Noise Cancelling Headphones".
2.  **Lingo.dev:** Translates this to:
    *   🇯🇵 "Sony ノイズキャンセリングヘッドホン"
    *   🇩🇪 "Sony Geräuschunterdrückende Kopfhörer"
3.  **Aggregation:** We scrape real-time results from Amazon JP, eBay Kleinanzeigen, and Mercari.
4.  **Normalization:** Prices are converted to USD and ranked by "Total Landed Cost" (Item + Shipping).

---

## 3. ⚖️ The Ethical Scanner (Transparency)
**The Problem:** Fast fashion brands hide behind foreign languages to obscure their supply chain. "Piel" sounds fancy, but it just means "Leather" (or sometimes fake leather).
**The Solution:** Instant supply chain X-Ray.

### How it Works:
1.  **Keyword Extraction:** The extension scans the page for hidden tabs like "Material", "Origin", "Factory".
2.  **Lingo.dev:** Translates technical fabric terms (e.g., "Synthetikfaser" -> "Synthetic Fiber").
3.  **Database Match:** Cross-references the brand with ethical directories (e.g., Good On You).
4.  **UI:** Displays a "Sustainability Score" overlay on the product image.

---

## 4. 📉 Global Price Arbitrage (Savings)
**The Problem:** Brands segment markets. A Zara jacket might be €40 in Spain but $90 in the US.
**The Solution:** Always pay the "Local" price.

### How it Works:
1.  **Image Recognition:** Identifies the product via image hash or Model Number.
2.  **Multi-Region Poll:** Checks the price of that exact item on the brand's sites in IT, ES, FR, JP, and US.
3.  **Alert:** "⚠️ Save $40 by buying this from the Spanish store!"

---

## 5. 🗣️ Community Sentiment (Social Proof)
**The Problem:** "5 Stars" is universal, but the *text* of the review holds the truth (e.g., "This runs very small").
**The Solution:** Summarized, translated consensus.

### How it Works:
1.  **Selection:** Selects the top 20 "Most Helpful" reviews in the native language.
2.  **Lingo.dev:** Translates them to English.
3.  **Summarization:** Uses an LLM to generate a meta-review:
    *   *"Consensus: Great build quality, but the sleeves are short. Shipping took 2 weeks."*
