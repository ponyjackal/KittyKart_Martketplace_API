import { Injectable, BadRequestException } from '@nestjs/common';
import { verifyMessage } from 'nestjs-ethers';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { checksumAddress } from '../utils/checkSumAddress';
@Injectable()
export class OfferService {
    constructor(
        private prisma: PrismaService
    ) {}

    create(address: string, createOfferDto: CreateOfferDto) {
        // validate user address and signature
        const message = process.env.MESSAGE;
        const derivedAddress = verifyMessage(message, createOfferDto.ownerSignature);
        if (checksumAddress(derivedAddress) !== checksumAddress(address)) {
            throw new BadRequestException('Invalid signature');
        }
        // validate typed signature
        
    }

    findAll() {
        return this.prisma.offer.findMany();
    }

    findOne(id: number) {
        return this.prisma.offer.findUnique({ where: { id } });
    }
}
