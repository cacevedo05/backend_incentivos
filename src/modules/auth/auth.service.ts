import bycript from 'bcrypt';
import { AuthRepository } from './auth.repository';
import { LoginDTO } from './auth.dto';
import { generateToken } from '../../shared/utils/jwt';

export class AuthService {
    constructor(private repo: AuthRepository){}
    async login (data: LoginDTO){
        const user = await this.repo.findByEmail(data.email);
        if (!user){
            throw new Error('Credenciales inválidas');
        }        
        if (!user?.active){
            throw new Error ('El usuario no está activo');
        }
        const isPasswordValid = await bycript.compare(data.password, user.password);

        if (!isPasswordValid){
            throw new Error('Tus credenciales inválidas');
        }

        const token = generateToken ({
            id: user.id,
            role: user.role,
        })

        return {
            token,
            user:{
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        }
    }
}