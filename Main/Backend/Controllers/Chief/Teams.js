const Team = require('../../Models/Teams');
const User = require('../../Models/Users');

exports.createTeam = async (req, res) => {
  try {
    const { name, members, taskId } = req.body;
    const chiefId = req.user.id;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ error: 'Team name is required' });
    }

    // Create new team
    const team = new Team({
      name,
      chief: chiefId,
      members: members || [],
      task: taskId || null
    });

    await team.save();

    // Populate the team with member details
    const populatedTeam = await Team.findById(team._id)
      .populate('members', 'name email role')
      .populate('task', 'title description')
      .populate('chief', 'name email');

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
    const teams = await Team.find({ chief: chiefId })
      .populate('members', 'name email role')
      .select('name description members');
    
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
      .select('name email role')
      .lean();
    
    // Add role indicators
    const membersWithRoles = members.map(member => ({
      ...member,
      role: member._id.toString() === team.chief.toString() ? 'chief' : 
            member.role || 'member'
    }));
    
    res.json(membersWithRoles);
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ error: error.message });
  }
};
