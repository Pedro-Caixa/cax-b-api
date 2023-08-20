"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const noblox_js_1 = __importDefault(require("noblox.js"));
const node_cache_1 = __importDefault(require("node-cache"));
exports.router = (0, express_1.Router)();
const rankCache = new node_cache_1.default({ stdTTL: 30 });
exports.router.get('/', (req, res) => res.send('API started'));
exports.router.get('/b/gar/check-user/:userId', async (req, res) => {
    const userId = req.params.userId;
    const userIdNumber = parseInt(userId);
    try {
        const cachedData = rankCache.get(`userData_${userIdNumber}`);
        if (cachedData) {
            console.log('Using cached user data for user:', userIdNumber);
            res.json(cachedData);
            return;
        }
        console.log('Fetching user data from Roblox API for user:', userIdNumber);
        let rbxUsername;
        try {
            rbxUsername = await noblox_js_1.default.getUsernameFromId(userIdNumber);
        }
        catch (usernameError) {
            if (typeof usernameError.message === 'string' && usernameError.message.includes('User does not exist')) {
                return res.status(404).json({ error: 'User not found' });
            }
            throw usernameError;
        }
        const rankId = await noblox_js_1.default.getRankInGroup(5214183, userIdNumber);
        const isGarMember = rankId === 0 ? false : true;
        const isVip = rankId > 130 ? true : false;
        const divisionGroupsJSON = {
            "cg": 5369125,
            "rg": 5352039,
            "sg": 32072079,
            "barc": 6652666,
            "arc": 6018571,
            "rc": 5352093,
            "187th": 6286429,
            "7th": 6077194,
            "41st": 5810035,
            "327th": 5674426,
            "104th": 5668908,
            "501st": 5352023,
            "ri": 5352000,
            "senate": 12681565
        };
        const departmentGroupsJSON = {
            "trj": 14259016,
            "cet": 15319534,
        };
        const kosGroupsJSON = {
            "SOE": 6981749,
        };
        const userKosGroups = {};
        for (const kosGroupName in kosGroupsJSON) {
            if (Object.prototype.hasOwnProperty.call(kosGroupsJSON, kosGroupName)) {
                const groupId = kosGroupsJSON[kosGroupName];
                const userRankId = await noblox_js_1.default.getRankInGroup(groupId, userIdNumber);
                userKosGroups[kosGroupName] = userRankId >= 1;
            }
        }
        const userDivisions = {};
        const userDepartments = {};
        for (const divisionName in divisionGroupsJSON) {
            if (Object.prototype.hasOwnProperty.call(divisionGroupsJSON, divisionName)) {
                const groupId = divisionGroupsJSON[divisionName];
                const userRankId = await noblox_js_1.default.getRankInGroup(groupId, userIdNumber);
                const rankName = await noblox_js_1.default.getRankNameInGroup(groupId, userIdNumber);
                if (userRankId >= 1) {
                    userDivisions[divisionName] = { id: groupId, rank: rankName, rankId: userRankId };
                }
            }
        }
        for (const departmentName in departmentGroupsJSON) {
            if (Object.prototype.hasOwnProperty.call(departmentGroupsJSON, departmentName)) {
                const groupId = departmentGroupsJSON[departmentName];
                const userRankId = await noblox_js_1.default.getRankInGroup(groupId, userIdNumber);
                const rankName = await noblox_js_1.default.getRankNameInGroup(groupId, userIdNumber);
                if (userRankId >= 1) {
                    userDepartments[departmentName] = { id: groupId, rank: rankName, rankId: userRankId };
                }
            }
        }
        const userData = {
            id: userIdNumber,
            username: rbxUsername,
            isGarMember: isGarMember,
            isVip: isVip,
            isKos: Object.values(userKosGroups).some(value => value),
            isAos: false,
            isBlacklisted: false,
            divisions: Object.keys(userDivisions).length > 0 ? userDivisions : false,
            departments: Object.keys(userDepartments).length > 0 ? userDepartments : false,
        };
        // Armazenar os dados no cache
        rankCache.set(`userData_${userIdNumber}`, userData);
        res.json(userData);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});
exports.router.get('/b/check-user/:userId', async (req, res) => {
    const userId = req.params.userId;
    const userIdNumber = parseInt(userId);
    try {
        const cachedData = rankCache.get(`rankData_${userIdNumber}`);
        if (cachedData) {
            console.log('Using cached rank data for user:', userIdNumber);
            res.json(cachedData);
            return;
        }
        console.log('Fetching rank data from Roblox API for user:', userIdNumber);
        const username = await noblox_js_1.default.getUsernameFromId(userIdNumber);
        const userRank = await noblox_js_1.default.getRankInGroup(13320442, userIdNumber);
        const b_rank = userRank === 0 ? false : `${userRank}`;
        const departmentGroupsJSON = {
            "internal_affairs": 7036991,
            "moderation_team": 13639962,
        };
        const b_departments = {};
        for (const departmentName in departmentGroupsJSON) {
            if (Object.prototype.hasOwnProperty.call(departmentGroupsJSON, departmentName)) {
                const groupId = departmentGroupsJSON[departmentName];
                const userDepartmentRank = await noblox_js_1.default.getRankInGroup(groupId, userIdNumber);
                if (userDepartmentRank >= 1) {
                    b_departments[departmentName] = { id: groupId, rank: userDepartmentRank };
                }
            }
        }
        const userData = {
            id: userIdNumber,
            username: username,
            b_rank: b_rank,
            b_departments: Object.keys(b_departments).length > 0 ? b_departments : false,
        };
        rankCache.set(`rankData_${userIdNumber}`, userData);
        res.json(userData);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred!' });
    }
});
exports.default = exports.router;
