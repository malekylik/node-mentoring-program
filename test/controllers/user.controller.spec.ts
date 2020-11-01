import 'regenerator-runtime/runtime';

import express from 'express';

import { getUsers } from 'app/controllers/user.controller';

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
        },
    };
});

describe('User controller', () => {
    const mockUsers = jest.requireMock('../../src/services/user.service').mockUsers;

    it('getUsers should return users', async () => {
        const mockJson = jest.fn();

        const mockReq = {};
        const mockResp = {
            json: mockJson,
        }

        await getUsers(mockReq as express.Request, mockResp as unknown as express.Response);

        expect(mockJson).toBeCalledWith(mockUsers);
    });
});
