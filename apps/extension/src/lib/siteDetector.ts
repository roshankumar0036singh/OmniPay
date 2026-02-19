export enum SupportedSite {
    AmazonJP = 'amazon_jp',
    Rakuten = 'rakuten',
    Mercari = 'mercari',
    Unknown = 'unknown'
}

export const detectSite = (url: string): SupportedSite => {
    if (url.includes('amazon.co.jp')) return SupportedSite.AmazonJP;
    if (url.includes('rakuten.co.jp')) return SupportedSite.Rakuten;
    if (url.includes('mercari.com') || url.includes('jp.mercari.com')) return SupportedSite.Mercari;
    return SupportedSite.Unknown;
}
