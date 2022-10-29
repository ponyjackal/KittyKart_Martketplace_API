export const MARKETPLACE_SIGN_DOMAIN = 'KittyKartMarketplaceVoucher';
export const MARKETPLACE_SIGN_VERSION = '1';
export const MARKETPLACE_SIGN_TYPES = {
  KittyKartMarketplaceVoucher: [
    { name: 'user', type: 'address' },
    { name: 'collection', type: 'uint256' },
    { name: 'tokenId', type: 'uint256' },
    { name: 'price', type: 'uint256' },
    { name: 'actionType', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
    { name: 'expiry', type: 'uint256' },
  ],
};
