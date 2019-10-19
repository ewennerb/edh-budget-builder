export enum Color {
    WHITE = 'w',
    BLUE = 'u',
    BLACK = 'b',
    RED = 'r',
    GREEN = 'g',
    COLORLESS = 'c'
}

export enum SearchOrder {
    Name = 'name',
    Set = 'set',
    Usd = 'usd',
    CMC = 'cmc',
    Pow = 'pow',
    Tou = 'tou',
    Rarity = 'rarity',
    Color = 'color',
    EDHRec = 'edhrec'
}

export enum SearchOrderFormat {
    Name = 'Name',
    Set= 'Set/Number',
    Usd= 'Price: USD',
    CMC = 'CMC',
    Pow = 'Power',
    Tou = 'Toughness',
    Rarity = 'Rarity',
    Color = 'Color/ID',
    EDHRec = 'EDHREC Rank'
}

export interface SearchTerms {
    q: string;
    order: SearchOrder;
    page: number;
    name: string;
    type: string;
    allowPartialTypeMatch: boolean;
    formats: string[];
    commanderIdentity: string[];
    rarities: string[];
}
