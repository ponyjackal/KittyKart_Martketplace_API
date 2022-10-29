import { Injectable } from '@nestjs/common';
import { CreateSignatureDto } from './dto/create-signature.dto';

@Injectable()
export class SignatureService {
    async create(address: string, createSignatureDto: CreateSignatureDto) {
        
    }
}
