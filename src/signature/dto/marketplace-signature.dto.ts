export class MarketplaceSignatureDto {
    user: string;
    collection: string;
    tokenId: number;
    price: number;
    actionType: number;
    nonce: number;
    expiry: number;
}