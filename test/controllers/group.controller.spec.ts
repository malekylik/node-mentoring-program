import 'regenerator-runtime/runtime';

import express from 'express';

import { getGroups } from 'app/controllers/group.controller';

jest.mock('app/services/group.service', () => {
    const mockGroups = [
        {
            id: '1',
            name: 'mock_group_name_1',
            permissions: ['READ', 'WRITE'],
        },
        {
            id: '2',
            name: 'mock_group_name_2',
            permissions: ['DELETE', 'SHARE'],
        },
    ];

    return {
        mockGroups,
        GroupService: {
            getGroups: jest.fn().mockResolvedValue(mockGroups),
        },
    };
});

describe('Group controller', () => {
    const mockModule = jest.requireMock('../../src/services/group.service');

    const mockGroups = mockModule.mockGroups;
    const mockGroupService = mockModule.GroupService;

    it('getGroups should return groups', async () => {
        const mockJson = jest.fn();

        const mockReq = {};
        const mockResp = {
            json: mockJson,
        }

        await getGroups(mockReq as express.Request, mockResp as unknown as express.Response);

        expect(mockJson).toBeCalledWith(mockGroups);
    });
});
