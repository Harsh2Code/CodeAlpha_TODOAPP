const Team = require('../../Models/Teams');
const User = require('../../Models/Users');

exports.createTeam = async (req, res) => {
  try {
    const { name, members, taskId } = req.body;
    const chiefId = req.user.id;
    console.log('Creating team with chiefId:', chiefId);

    // Validate required fields
    if (!name) {
      return res.status(400).json({ error: 'Team name is required' });
    }

    // Ensure chief is included in members array
    const memberIds = members || [];
    if (!memberIds.includes(chiefId)) {
      memberIds.push(chiefId);
    }

    // Create new team
    const team = new Team({
      name,
      chief: chiefId,
      members: memberIds,
      task: taskId || null
    });

    await team.save();
    console.log('Team saved to database:', team);

    // Populate the team with member details
    const populatedTeam = await Team.findById(team._id)
      .populate('members', 'username email role')
      .populate('task', 'title description')
      .populate('chief', 'username email');

    // Transform members to include 'name' field for frontend compatibility
    populatedTeam.members = populatedTeam.members.map(member => ({
      id: member._id.toString(),
      name: member.username,
      email: member.email,
      role: member.role,
    }));

    res.status(201).json({
      success: true,
      message: 'Team created successfully',
      team: populatedTeam
    });
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(500).json({ 
      error: 'Failed to create team',
      details: error.message 
    });
  }
};

exports.getTeams = async (req, res) => {
  try {
    const chiefId = req.user.id;
    console.log('Fetching teams for chiefId:', chiefId);
    const teams = await Team.find({ chief: chiefId })
      .populate('members', 'username email role')
      .populate('chief', 'username email')
      .select('name description members chief');

    // Transform members to include 'name' field for frontend compatibility
    teams.forEach(team => {
      team.members = team.members.map(member => ({
        id: member._id.toString(),
        name: member.username,
        email: member.email,
        role: member.role,
      }));
    });
    console.log('Raw teams from query:', teams);
    console.log('Teams found:', teams);
    
    res.json(teams);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ 
      error: 'Failed to fetch teams',
      details: error.message 
    });
  }
};

exports.getTeamMembers = async (req, res) => {
  try {
    const { teamId } = req.params;
    const chiefId = req.user.id;
    
    // Verify the team belongs to the chief
    const team = await Team.findOne({ _id: teamId, chief: chiefId });
    if (!team) {
      return res.status(404).json({ error: 'Team not found or access denied' });
    }
    
    // Get all team members including the chief
    const memberIds = [...team.members, team.chief];
    const members = await User.find({ _id: { $in: memberIds } })
      .select('username email role')
      .lean();
    
    const membersWithRoles = members.map(member => {
      let assignedRole = member.role || 'member'; // Default to 'member' if user's own role is not set

      if (member._id.toString() === team.chief.toString()) {
        assignedRole = 'chief';
      } else if (team.leader && member._id.toString() === team.leader.toString()) { // Check if this member is the team's leader
        assignedRole = 'leader';
      }
      return {
        ...member,
        role: assignedRole
      };
    });
    
    console.log('Members with roles being sent to frontend:', membersWithRoles);
    res.json(membersWithRoles);
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { members } = req.body;
    const chiefId = req.user.id;

    // Verify the team belongs to the chief
    const team = await Team.findOne({ _id: teamId, chief: chiefId });
    if (!team) {
      return res.status(404).json({ error: 'Team not found or access denied' });
    }

    team.members = members;
    await team.save();

    const populatedTeam = await Team.findById(team._id)
      .populate('members', 'username email role')
      .populate('chief', 'username email');

    // Transform members to include 'name' field for frontend compatibility
    populatedTeam.members = populatedTeam.members.map(member => ({
      id: member._id.toString(),
      name: member.username,
      email: member.email,
      role: member.role,
    }));

    res.json({ success: true, message: 'Team updated successfully', team: populatedTeam });
  } catch (error) {
    console.error('Error updating team:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.removeMemberFromTeam = async (req, res) => {
  try {
    const { teamId, memberId } = req.params;
    const chiefId = req.user.id;

    // Verify the team belongs to the chief
    const team = await Team.findOne({ _id: teamId, chief: chiefId });
    if (!team) {
      return res.status(404).json({ error: 'Team not found or access denied' });
    }

    // Prevent chief from being removed
    if (memberId === chiefId) {
      return res.status(400).json({ error: 'Chief cannot be removed from the team' });
    }

    team.members = team.members.filter((member) => member.toString() !== memberId);
    await team.save();

    const populatedTeam = await Team.findById(team._id)
      .populate('members', 'username email role')
      .populate('chief', 'username email');

    // Transform members to include 'name' field for frontend compatibility
    populatedTeam.members = populatedTeam.members.map(member => ({
      id: member._id.toString(),
      name: member.username,
      email: member.email,
      role: member.role,
    }));

    res.json({ success: true, message: 'Member removed successfully', team: populatedTeam });
  } catch (error) {
    console.error('Error removing member:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.promoteMemberToLeader = async (req, res) => {
  console.log('promoteMemberToLeader called');
  try {
    const { teamId, memberId } = req.params;
    const chiefId = req.user.id;

    // Verify the team belongs to the chief
    const team = await Team.findOne({ _id: teamId, chief: chiefId });
    if (!team) {
      return res.status(404).json({ error: 'Team not found or access denied' });
    }

    // Find the user to promote
    const user = await User.findById(memberId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Set the team leader
    team.leader = user._id;
    await team.save();

    const populatedTeam = await Team.findById(team._id)
      .populate('members', 'username email role')
      .populate('chief', 'username email');

    res.json({ success: true, message: 'Member promoted successfully', team: populatedTeam });
  } catch (error) {
    console.error('Error promoting member:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getTeamById = async (req, res) => {
  try {
    const { teamId } = req.params;
    const chiefId = req.user.id; // Assuming the chief's ID is available in req.user.id

    const team = await Team.findOne({ _id: teamId, chief: chiefId })
      .populate('members', 'username email role') // Populate members with username, email, and role
      .populate('chief', 'username email'); // Populate chief with username and email

    if (!team) {
      return res.status(404).json({ error: 'Team not found or access denied' });
    }

    res.json(team);
  } catch (error) {
    console.error('Error fetching team by ID:', error);
    res.status(500).json({ error: 'Failed to fetch team details', details: error.message });
  }
};
