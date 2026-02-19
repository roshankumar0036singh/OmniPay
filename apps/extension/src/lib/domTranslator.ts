export interface TranslationNode {
    id: string;
    originalText: string;
    node: Node;
    parentElement: HTMLElement | null;
}

export class DomTranslator {
    private observedRoot: HTMLElement;

    constructor(root: HTMLElement = document.body) {
        this.observedRoot = root;
    }

    public extractTextNodes(): TranslationNode[] {
        const walker = document.createTreeWalker(
            this.observedRoot,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: (node) => {
                    const parent = node.parentElement;
                    if (!parent) return NodeFilter.FILTER_REJECT;

                    // Skip hidden or irrelevant tags
                    const tagName = parent.tagName.toLowerCase();
                    if (['script', 'style', 'noscript', 'code', 'pre', 'input', 'textarea'].includes(tagName)) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    if (node.textContent?.trim().length === 0) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    // Heuristic: Skip purely numeric or symbol-only nodes
                    if (/^[0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/.test(node.textContent || '')) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        const nodes: TranslationNode[] = [];
        let currentNode: Node | null;

        while (currentNode = walker.nextNode()) {
            const text = currentNode.textContent?.trim();
            if (text) {
                nodes.push({
                    id: Math.random().toString(36).substr(2, 9),
                    originalText: text,
                    node: currentNode,
                    parentElement: currentNode.parentElement
                });
            }
        }

        return nodes;
    }

    public replaceNodeWithTranslation(node: TranslationNode, translatedText: string) {
        if (!node.parentElement || !node.node.parentElement) return;

        // Create a wrapper span for the hover effect
        const wrapper = document.createElement('span');
        wrapper.className = 'omnipay-translated-text group relative cursor-help border-b border-dashed border-lingo-green/50 hover:bg-lingo-green/10 transition-colors inline-block';
        wrapper.textContent = translatedText;
        wrapper.dataset.original = node.originalText;

        // Tooltip (hidden by default, shown on group-hover)
        const tooltip = document.createElement('span');
        tooltip.className = 'invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-lingo-dark/90 text-white text-xs rounded shadow-lg whitespace-nowrap z-[10000] border border-white/10 pointer-events-none transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 opacity-0 group-hover:opacity-100';
        tooltip.innerText = `Original: ${node.originalText}`;
        wrapper.appendChild(tooltip);

        // Replace the original text node with our wrapper
        try {
            node.node.parentNode?.replaceChild(wrapper, node.node);
        } catch (e) {
            console.warn('[OmniPay] Failed to replace node:', e);
        }
    }
}
