export class CreateSignatureDto {
    collection: string;
    tokenId: number;
    price: number;
    actionType: number;
    txSignature: string;
    ownerSignature: string;
}