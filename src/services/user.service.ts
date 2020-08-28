import { User } from 'app/types';
import { UserModel } from 'app/models/user.model';

class UserService {
    private userModel: UserModel;

    constructor (userModel?: UserModel) {
        this.userModel = userModel;
    }

    setUserModel(userModel: UserModel): void {
        this.userModel = userModel;
    }

    async getUsers(): Promise<Array<User>> {
        return this.userModel.getUsers();
    }

    async getUserById(id: string | number): Promise<User | null> {
        return this.userModel.getUserById(id);
    }

    async saveUser(userParams: Partial<User>): Promise<User> {
        return this.userModel.saveUser(userParams);
    }

    async updateUser(id: string | number, userParams: Partial<User>): Promise<User | null> {
        return this.userModel.updateUser(id, userParams);
    }

    async deleteUser(id: string): Promise<boolean> {
        return this.userModel.deleteUser(id);
    }

    async getAutoSuggestUsers(loginSubstring: string, limit: number): Promise<Array<User>> {
        return this.userModel.getAutoSuggestUsers(loginSubstring, limit);
    }
}

const userService = new UserService();

export { userService as UserService };
