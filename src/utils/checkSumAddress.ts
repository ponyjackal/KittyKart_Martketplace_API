import { getAddress } from 'nestjs-ethers';

export const checksumAddress = (address) => {
  try {
    return getAddress(address.toLowerCase());
  } catch {}

  return address;
};
