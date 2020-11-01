import 'regenerator-runtime/runtime';

import express from 'express';

import { getUsers, getUserById, createUser } from 'app/controllers/user.controller';
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
});
