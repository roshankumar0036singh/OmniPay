# OmniPay 🌍💳

**The Universal Commerce Layer for the Internet.**
*"Shop the world like a local."*

OmniPay is a browser extension and proxy service that flattens cross-border e-commerce into a single, seamless experience. It removes the three "Great Barriers" of international shopping: **Language**, **Payment**, and **Logistics**.

![OmniPay Banner](https://via.placeholder.com/1200x400?text=OmniPay+Global+Cart) <!-- Placeholder for actual banner -->

## 🚀 What is OmniPay?
Imagine browsing **Amazon Japan**, **Taobao (China)**, or **Mercari (Germany)**, but seeing everything in English, paying in USD, and having a single account for all of them.

OmniPay injects a "Universal Layer" on top of foreign sites:
-   **Reads:** Translates product data, sizing, and reviews instantly.
-   **Buys:** Handling the foreign checkout for you via our proxy service.
-   **Ships:** Consolidates packages to your doorstep.

## 🌟 Key Features
For a deep dive into our feature set, see [FEATURES.md](./FEATURES.md).

-   **🛒 Universal Checkout:** Add items from multiple global stores to **one cart**.
-   **🌐 Global Search:** Search "Vintage Camera" in English -> Find results in Tokyo, Berlin, and Paris.
-   **⚖️ Ethical Scanner:** Supply chain transparency powered by AI translation.
-   **📉 Price Arbitrage:** Automatically find cheaper prices for the same SKU in other countries.
-   **🗣️ Sentiment Analysis:** Read "Meta-Reviews" summarized from local buyers.

## 🛠️ Architecture
OmniPay uses a "Man-in-the-Middle" architecture:
1.  **Frontend (Extension):** Scrapes & Translates via **Lingo.dev**.
2.  **Backend (Proxy):** Handles payments via **Stripe Connect** and automates purchasing via headless browsers.

## 📦 Developer Setup (Monorepo)

### Prerequisites
-   Node.js v18+
-   pnpm or npm

### Installation
1.  **Clone the repo**
    ```bash
    git clone https://github.com/omni-pay/omni-pay.git
    cd omni-pay
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Start Development**
    -   **Backend:** `cd apps/backend && npm run dev`
    -   **Extension:** `cd apps/extension && npm run dev`

## 🤝 Contributing
We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## 📄 License
MIT
