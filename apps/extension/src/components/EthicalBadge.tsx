import { useState, useEffect } from 'react';
import { Leaf, AlertTriangle, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { ApiClient } from '../services/apiClient';

interface EthicalReport {
    productId: string;
    score: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    materials: string[];
    origin: string;
    certifications: string[];
    flags: string[];
    summary: string;
}

export const EthicalBadge = ({ productId, title, description = '' }: { productId: string, title: string, description?: string }) => {
    const [report, setReport] = useState<EthicalReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        const fetchScan = async () => {
            const data = await ApiClient.scanEthical(productId, title, description);
            if (data) {
                setReport(data);
            }
            setLoading(false);
        };

        if (productId && title) {
            fetchScan();
        }
    }, [productId, title, description]);

    if (loading) return null; // Or a subtle pulse
    if (!report) return null;

    const getGradeColor = (grade: string) => {
        switch (grade) {
            case 'A': return 'text-green-500 border-green-500/30 bg-green-500/10';
            case 'B': return 'text-lime-400 border-lime-400/30 bg-lime-400/10';
            case 'C': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
            case 'D': return 'text-orange-500 border-orange-500/30 bg-orange-500/10';
            case 'F': default: return 'text-red-500 border-red-500/30 bg-red-500/10';
        }
    };

    const gradientClass = report.score >= 50 ? 'from-green-500/20' : 'from-red-500/20';

    return (
        <div className={`bg-black/90 backdrop-blur-xl border border-white/10 p-3 rounded-xl shadow-2xl w-[280px] font-sans text-white z-50 transition-all duration-300`}>
            {/* Header (Always visible) */}
            <div
                className="flex items-center justify-between cursor-pointer group"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-2">
                    <Leaf className={report.score >= 50 ? "text-green-400" : "text-red-400"} size={18} />
                    <h3 className="text-sm font-bold tracking-wide">Ethical Scan</h3>
                </div>

                <div className="flex items-center gap-2">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 font-black text-lg shadow-[0_0_10px_currentColor] \${getGradeColor(report.grade)}`}>
                        {report.grade}
                    </div>
                    {expanded ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
                </div>
            </div>

            {/* Details (Expandable) */}
            {expanded && (
                <div className={`mt-3 pt-3 border-t border-white/10 space-y-3 bg-gradient-to-b \${gradientClass} to-transparent rounded-b-lg -mx-3 -mb-3 p-3`}>

                    <p className="text-[11px] text-gray-300 leading-relaxed italic border-l-2 border-white/20 pl-2">
                        "{report.summary}"
                    </p>

                    {report.flags.length > 0 && (
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Flags</span>
                            {report.flags.map((flag, idx) => (
                                <div key={idx} className="flex items-start gap-1.5 text-red-400 text-xs">
                                    <AlertTriangle size={12} className="shrink-0 mt-0.5" />
                                    <span>{flag}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {report.certifications.length > 0 && (
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Certifications</span>
                            {report.certifications.map((cert, idx) => (
                                <div key={idx} className="flex items-start gap-1.5 text-green-400 text-xs">
                                    <CheckCircle size={12} className="shrink-0 mt-0.5" />
                                    <span>{cert}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-between items-end pt-2 border-t border-white/5">
                        <div className="space-y-0.5">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Materials</span>
                            <span className="text-xs text-gray-300">{report.materials.join(', ')}</span>
                        </div>
                        <span className="text-[20px] font-mono leading-none font-bold text-white/50">{report.score}<span className="text-[10px]">/100</span></span>
                    </div>

                </div>
            )}
        </div>
    );
};
