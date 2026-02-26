import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import * as XLSX from 'xlsx';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ContentRow {
    url: string;
    creator: string;
    accountUrl: string;
    type: string;
    uploadDate: string;
    followers: number;
    views: number;
    likes: number;
    comments: number;
    shares: number;
}

export function downloadContentRankingExcel(contents: ContentRow[], title: string) {
    const sorted = [...contents].sort((a, b) => b.views - a.views);

    const rows = sorted.map((c, i) => ({
        'No.': i + 1,
        '콘텐츠 URL': c.url,
        '계정명': c.creator,
        '계정 URL': c.accountUrl,
        '콘텐츠 유형': c.type,
        '업로드 날짜': c.uploadDate,
        '팔로워 수': c.followers,
        '조회 수': c.views,
        '좋아요 수': c.likes,
        '댓글 수': c.comments,
        '공유 수': c.shares,
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '콘텐츠 랭킹');

    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    XLSX.writeFile(wb, `콘텐츠_랭킹_전체_${title}_${today}.xlsx`);
}
