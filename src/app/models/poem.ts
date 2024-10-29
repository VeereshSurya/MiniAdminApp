export interface Poem {
    poemId: number;
    title?: string;
    publishedAt?: Date;
    readingTime?: number;
    categories?: string;
    background?: string;
    lines?: string; // Actual poem data
    summary?: string;
    coverImageUrl?: string;
    authorName?: string;
}
