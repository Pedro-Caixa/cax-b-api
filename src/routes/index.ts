import { Router } from 'express';
import noblox from 'noblox.js';
import NodeCache from 'node-cache';

export const router = Router();

const userCache = new NodeCache({ stdTTL: 604800 }); // Cache dura 7 dias

router.get('/', (_, res) => res.send('API started'));

router.get('/b/gar/check-user/:userId', async (req, res) => {
  const userId = req.params.userId;
  const userIdNumber = parseInt(userId);

  try {
    const cachedData = userCache.get<any>(`userData_${userIdNumber}`);
    
    if (cachedData) {
      res.json(cachedData);
      return;
    }

    let rbxUsername;
    try {
      rbxUsername = await noblox.getUsernameFromId(userIdNumber);
    } catch (usernameError: any) {
      if (typeof usernameError.message === 'string' && usernameError.message.includes('User does not exist')) {
        return res.status(404).json({ error: 'User not found' });
      }
      throw usernameError;
    }
    
    const rankId = await noblox.getRankInGroup(5214183, userIdNumber);
    const isGarMember = rankId === 0 ? false : true;
    const isVip = rankId > 130 ? true : false;
    
    const divisionGroupsJSON: Record<string, number> = {
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

    const departmentGroupsJSON: Record<string, number> = {
        "trj": 14259016,
        "cet": 15319534,
        };

    const kosGroupsJSON: Record<string, number> = {
        "SOE": 6981749,
    };

    const userKosGroups: Record<string, boolean> = {};

    for (const kosGroupName in kosGroupsJSON) {
      if (Object.prototype.hasOwnProperty.call(kosGroupsJSON, kosGroupName)) {
        const groupId = kosGroupsJSON[kosGroupName];
        const userRankId = await noblox.getRankInGroup(groupId, userIdNumber);
        userKosGroups[kosGroupName] = userRankId >= 1;
      }
    }

    const userDivisions: Record<string, { id: number; rank: string; rankId: number }> = {};
    const userDepartments: Record<string, { id: number; rank: string; rankId: number }> = {};

    for (const divisionName in divisionGroupsJSON) {
      if (Object.prototype.hasOwnProperty.call(divisionGroupsJSON, divisionName)) {
        const groupId = divisionGroupsJSON[divisionName];
        const userRankId = await noblox.getRankInGroup(groupId, userIdNumber);
        const rankName = await noblox.getRankNameInGroup(groupId, userIdNumber);
        if (userRankId >= 1) {
          userDivisions[divisionName] = { id: groupId, rank: rankName, rankId: userRankId };
        }
      }
    }

    for (const departmentName in departmentGroupsJSON) {
      if (Object.prototype.hasOwnProperty.call(departmentGroupsJSON, departmentName)) {
        const groupId = departmentGroupsJSON[departmentName];
        const userRankId = await noblox.getRankInGroup(groupId, userIdNumber);
        const rankName = await noblox.getRankNameInGroup(groupId, userIdNumber);
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

    userCache.set(`userData_${userIdNumber}`, userData);
    
    res.json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.get('/b/check-user/:userId', async (req, res) => {
  const userId = req.params.userId;
  const userIdNumber = parseInt(userId);

  try {
    const cachedData = userCache.get<any>(`userData_${userIdNumber}`);
    
    if (cachedData) {
      res.json(cachedData);
      return;
    }

    const username = await noblox.getUsernameFromId(userIdNumber);
    const userRank = await noblox.getRankInGroup(13320442, userIdNumber);
    const b_rank = userRank === 0 ? false : `${userRank}`;
    
    const departmentGroupsJSON: Record<string, number> = {
        "internal_affairs": 7036991,
        "moderation_team": 13639962,
        };

    const b_departments: Record<string, { id: number; rank: number }> = {};

    for (const departmentName in departmentGroupsJSON) {
      if (Object.prototype.hasOwnProperty.call(departmentGroupsJSON, departmentName)) {
        const groupId = departmentGroupsJSON[departmentName];
        const userDepartmentRank = await noblox.getRankInGroup(groupId, userIdNumber);
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

    userCache.set(`userData_${userIdNumber}`, userData);
    
    res.json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred!' });
  }
});

export default router;
