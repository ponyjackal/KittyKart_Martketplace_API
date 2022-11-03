export class CreateSignatureDto {
  collection: string;
  tokenId: number;
  price: number;
  actionType: number;
  // 0: LIST
  // 1: BUY
  // 2: OFFER
  // 3: ACCEPT_OFFER
}
