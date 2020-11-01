import 'regenerator-runtime/runtime';

import express from 'express';

import { getUsers, getUserById, createUser, updateUser, deleteUser, getAutoSuggestUsers } from 'app/controllers/user.controller';
import { UserCreateRequest, UserUpdateRequest } from 'app/schemas/user.schema';

jest.mock('app/services/user.service', () => {
    const mockUsers = [
        {
            id: '1',
            login: 'mock_login_1',
            password: 'mock_pass_1',
            age: 12,
            groups: [
                {
                    id: '1',
                    name: 'group_1',
                    permissions: ['READ', 'WRITE'],
                },
            ]
        },
        {
            id: '2',
            login: 'mock_login_2',
            password: 'mock_pass_2',
            age: 18,
            groups: [
                {
                    id: '1',
                    name: 'group_1',
                    permissions: ['READ', 'WRITE'],
                },
                {
                    id: '2',
                    name: 'group_2',
                    permissions: ['DELETE', 'SHARE'],
                },
            ]
        },
    ];

    return {
        mockUsers,
        UserService: {
            getUsers: jest.fn().mockResolvedValue(mockUsers),
            getUserById: jest.fn().mockResolvedValue(mockUsers[0]),
            saveUser: jest.fn().mockImplementation(({ login, password, age }) => ({ ...mockUsers[0], login, password, age })),
            updateUser: jest.fn(),
            deleteUser: jest.fn(),
            getAutoSuggestUsers: jest.fn().mockResolvedValue(mockUsers),
        },
    };
});

describe('User controller', () => {
    const mockModule = jest.requireMock('../../src/services/user.service');

    const mockUsers = mockModule.mockUsers;
    const mockUserService = mockModule.UserService;

    it('getUsers should return users', async () => {
        const mockJson = jest.fn();

        const mockReq = {};
        const mockResp = {
            json: mockJson,
        }

        await getUsers(mockReq as express.Request, mockResp as unknown as express.Response);

        expect(mockJson).toBeCalledWith(mockUsers);
    });

    describe('getUserById', () => {
        it('getUserById should return user by id', async () => {
            mockUserService.getUserById.mockResolvedValue(mockUsers[0]);

            const mockJson = jest.fn();

            const mockReq = { params: { id: '12' } };
            const mockResp = {
                json: mockJson,
            }

            await getUserById(mockReq as unknown as UserUpdateRequest, mockResp as unknown as express.Response);
    
            expect(mockUserService.getUserById).toBeCalledWith('12');
            expect(mockJson).toBeCalledWith(mockUsers[0]);
        });

        it('getUserById should response with 404 if user is not found', async () => {
            mockUserService.getUserById.mockResolvedValue(undefined);

            const mockStatus = jest.fn().mockReturnThis();
            const mockEnd = jest.fn();

            const mockReq = { params: { id: '14' } };
            const mockResp = {
                status: mockStatus,
                end: mockEnd,
            }

            await getUserById(mockReq as unknown as UserUpdateRequest, mockResp as unknown as express.Response);
    
            expect(mockUserService.getUserById).toBeCalledWith('14');
            expect(mockStatus).toBeCalledWith(404);
            expect(mockEnd).toBeCalled();
        });
    });

    it('createUser should save user with passed data and respond with 201 status', async () => {
        const mockStatus = jest.fn().mockReturnThis();
        const mockJson = jest.fn();

        const mockReq = { body: { login: 'some_login', password: 'some_password', age: '32' } };
        const mockResp = {
            status: mockStatus,
            json: mockJson,
        }

        await createUser(mockReq as unknown as UserCreateRequest, mockResp as unknown as express.Response);

        expect(mockStatus).toBeCalledWith(201);
        expect(mockUserService.saveUser).toBeCalledWith({ login: 'some_login', password: 'some_password', age: 32 });
        expect(mockJson).toBeCalledWith({ ...mockUsers[0], login: 'some_login', password: 'some_password', age: 32 });
    });

    describe('updateUser', () => {
        it('updateUser should update user by id and respond with updated user', async () => {
            const mockStatus = jest.fn().mockReturnThis();
            mockUserService.updateUser.mockResolvedValue({ ...mockUsers[0], login: 'new_some_login', password: 'new_some_password', age: '36' });

            const mockJson = jest.fn();
            const mockReq = { params: { id: '24' }, body: { login: 'new_some_login', password: 'new_some_password', age: '36' } };
            const mockResp = {
                status: mockStatus,
                json: mockJson,
            }

            await updateUser(mockReq as unknown as UserUpdateRequest, mockResp as unknown as express.Response);
    
            expect(mockUserService.updateUser).toBeCalledWith('24', { login: 'new_some_login', password: 'new_some_password', age: 36 });
            expect(mockJson).toBeCalledWith({ ...mockUsers[0], login: 'new_some_login', password: 'new_some_password', age: '36' });
        });

        it('updateUser should respond with 404 if user is not found', async () => {
            const mockStatus = jest.fn().mockReturnThis();
            mockUserService.updateUser.mockResolvedValue(undefined);

            const mockEnd = jest.fn();
            const mockReq = { params: { id: '28' }, body: { login: 'new_some_login', password: 'new_some_password', age: '36' } };
            const mockResp = {
                status: mockStatus,
                end: mockEnd,
            }

            await updateUser(mockReq as unknown as UserUpdateRequest, mockResp as unknown as express.Response);
    
            expect(mockUserService.updateUser).toBeCalledWith('28', { login: 'new_some_login', password: 'new_some_password', age: 36 });
            expect(mockStatus).toBeCalledWith(404);
            expect(mockEnd).toBeCalled();
        });
    });

    describe('deleteUser', () => {
        it('deleteUser should update user by id and respond with updated user and 202 status', async () => {
            const mockStatus = jest.fn().mockReturnThis();
            mockUserService.deleteUser.mockResolvedValue(true);

            const mockEnd = jest.fn();
            const mockReq = { params: { id: '45' } };
            const mockResp = {
                status: mockStatus,
                end: mockEnd,
            }

            await deleteUser(mockReq as unknown as UserUpdateRequest, mockResp as unknown as express.Response);
    
            expect(mockUserService.deleteUser).toBeCalledWith('45');
            expect(mockStatus).toBeCalledWith(202);
            expect(mockEnd).toBeCalled();
        });

        it('deleteUser should respond with 404 if user is not found', async () => {
            const mockStatus = jest.fn().mockReturnThis();
            mockUserService.deleteUser.mockResolvedValue(false);

            const mockEnd = jest.fn();
            const mockReq = { params: { id: '27' } };
            const mockResp = {
                status: mockStatus,
                end: mockEnd,
            }

            await deleteUser(mockReq as unknown as UserUpdateRequest, mockResp as unknown as express.Response);
    
            expect(mockUserService.deleteUser).toBeCalledWith('27');
            expect(mockStatus).toBeCalledWith(404);
            expect(mockEnd).toBeCalled();
        });
    });

    it('getAutoSuggestUsers should return users as suggestion', async () => {
        const mockJson = jest.fn();
        const mockReq = { query: { login_substring: 'some_user_name', limit: '22' } };
        const mockResp = {
            json: mockJson,
        };

        await getAutoSuggestUsers(mockReq as unknown as express.Request , mockResp as unknown as express.Response);

        expect(mockUserService.getAutoSuggestUsers).toBeCalledWith('some_user_name', 22);
        expect(mockJson).toBeCalledWith(mockUsers);
    });
});
