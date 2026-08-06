import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Caregiver } from '../caregiver/entities/caregiver.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Caregiver)
    private readonly caregiverRepository: Repository<Caregiver>,
    private readonly jwtService: JwtService,
  ) {}

  private buildToken(caregiver: Caregiver) {
    const payload = {
      sub: caregiver.id,
      email: caregiver.email,
      role: caregiver.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      caregiver: {
        id: caregiver.id,
        fullName: caregiver.fullName,
        email: caregiver.email,
        role: caregiver.role,
        avatar: caregiver.avatar,
      },
    };
  }

  async register(dto: RegisterDto) {
    const existing = await this.caregiverRepository.findOneBy({ email: dto.email });
    if (existing) {
      throw new ConflictException('Email đã được sử dụng');
    }

    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const caregiver = this.caregiverRepository.create({
      fullName: dto.fullName,
      email: dto.email,
      password: hashedPassword,
      phone: dto.phone,
    });

    const saved = await this.caregiverRepository.save(caregiver);
    return this.buildToken(saved);
  }

  async login(dto: LoginDto) {
    const caregiver = await this.caregiverRepository
      .createQueryBuilder('caregiver')
      .addSelect('caregiver.password')
      .where('caregiver.email = :email', { email: dto.email })
      .getOne();

    if (!caregiver) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    const passwordMatches = await bcrypt.compare(dto.password, caregiver.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    return this.buildToken(caregiver);
  }

  async validateCaregiverById(id: string) {
    return this.caregiverRepository.findOneBy({ id });
  }
}
