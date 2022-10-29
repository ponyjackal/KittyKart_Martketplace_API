export class CreateOfferDto {
    collectionId: number;
    tokenId: number;
    price: string;
    txSignature: string;
    ownerSignature: string;
}
