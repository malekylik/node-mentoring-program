import 'regenerator-runtime/runtime';

import express from 'express';

import { getGroups, createGroup } from 'app/controllers/group.controller';
import { GroupCreateRequest } from 'app/schemas/group.schema';

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
            saveGroup: jest.fn().mockImplementation(({ name, permissions }) => ({ id: '3', name, permissions })),
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

    it('createGroup should save group with passed data', async () => {
        const mockStatus = jest.fn().mockReturnThis();
        const mockJson = jest.fn();

        const mockReq = { body: { name: 'group_name', permissions: ['READ', 'UPLOAD_FILES'] } };
        const mockResp = {
            status: mockStatus,
            json: mockJson,
        }

        await createGroup(mockReq as unknown as GroupCreateRequest, mockResp as unknown as express.Response);

        expect(mockGroupService.saveGroup).toBeCalledWith({ name: 'group_name', permissions: ['READ', 'UPLOAD_FILES'] });
        expect(mockJson).toBeCalledWith({ id: '3', name: 'group_name', permissions: ['READ', 'UPLOAD_FILES'] });
    });
});
