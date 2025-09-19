export interface SearchSchema {
    keyword: string,
    page: number,
    limit: number,
    order: 'asc' | 'desc'
}