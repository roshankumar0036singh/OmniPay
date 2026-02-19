import { APP_NAME } from "@omnipay/shared"

export const LingoService = {
    async translate(text: string, targetLang: string) {
        // Mock implementation for Phase 1/2
        console.log(`[${APP_NAME}] Translating "${text}" to ${targetLang}`)
        return text + " (" + targetLang + ")"
    },

    async batchTranslate(texts: string[], targetLang: string) {
        return texts.map(t => t + " (" + targetLang + ")")
    }
}
