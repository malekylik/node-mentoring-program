import 'regenerator-runtime/runtime';

import express from 'express';

import { getGroups, createGroup, getGroupById, updateGroup } from 'app/controllers/group.controller';
import { GroupCreateRequest, GroupUpdateRequest } from 'app/schemas/group.schema';

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
            getGroupById: jest.fn().mockResolvedValue(mockGroups[0]),
            updateGroup: jest.fn(),
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

    describe('getGroupById', () => {
        it('getGroupById should return group by id', async () => {
            mockGroupService.getGroupById.mockResolvedValue(mockGroups[0]);

            const mockJson = jest.fn();

            const mockReq = { params: { id: '18' } };
            const mockResp = {
                json: mockJson,
            }

            await getGroupById(mockReq as unknown as GroupUpdateRequest, mockResp as unknown as express.Response);

            expect(mockGroupService.getGroupById).toBeCalledWith('18');
            expect(mockJson).toBeCalledWith(mockGroups[0]);
        });

        it('getGroupById should response with 404 if group is not found', async () => {
            mockGroupService.getGroupById.mockResolvedValue(undefined);

            const mockStatus = jest.fn().mockReturnThis();
            const mockEnd = jest.fn();

            const mockReq = { params: { id: '19' } };
            const mockResp = {
                status: mockStatus,
                end: mockEnd,
            }

            await getGroupById(mockReq as unknown as GroupUpdateRequest, mockResp as unknown as express.Response);

            expect(mockGroupService.getGroupById).toBeCalledWith('19');
            expect(mockStatus).toBeCalledWith(404);
            expect(mockEnd).toBeCalled();
        });
    });

    describe('updateGroup', () => {
        it('updateGroup should update group by id and respond with updated group', async () => {
            const mockStatus = jest.fn().mockReturnThis();
            mockGroupService.updateGroup.mockResolvedValue({ id: '3', name: 'group_name', permissions: ['READ', 'UPLOAD_FILES'] });

            const mockJson = jest.fn();
            const mockReq = { params: { id: '13' }, body: { name: 'group_name', permissions: ['READ', 'UPLOAD_FILES'] } };
            const mockResp = {
                status: mockStatus,
                json: mockJson,
            }

            await updateGroup(mockReq as unknown as GroupUpdateRequest, mockResp as unknown as express.Response);

            expect(mockGroupService.updateGroup).toBeCalledWith('13', { name: 'group_name', permissions: ['READ', 'UPLOAD_FILES'] });
            expect(mockJson).toBeCalledWith({ id: '3', name: 'group_name', permissions: ['READ', 'UPLOAD_FILES'] });
        });

        it('updateGroup should respond with 404 if group is not found', async () => {
            const mockStatus = jest.fn().mockReturnThis();
            mockGroupService.updateGroup.mockResolvedValue(undefined);

            const mockEnd = jest.fn();
            const mockReq = { params: { id: '11' }, body: { name: 'group_name', permissions: ['READ', 'UPLOAD_FILES'] } };
            const mockResp = {
                status: mockStatus,
                end: mockEnd,
            }

            await updateGroup(mockReq as unknown as GroupUpdateRequest, mockResp as unknown as express.Response);

            expect(mockGroupService.updateGroup).toBeCalledWith('11', { name: 'group_name', permissions: ['READ', 'UPLOAD_FILES'] });
            expect(mockStatus).toBeCalledWith(404);
            expect(mockEnd).toBeCalled();
        });
    });
});
