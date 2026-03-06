const User = require("../models/User");
const Gig = require("../models/Gig");
const Job = require("../models/Job");
const Event = require("../models/Event");
const DeletedUser = require("../models/DeletedUser");

/**
 * Utility to hard-delete a user, cascade-delete their content, 
 * and archive their basic profile to `DeletedUsers`.
 * 
 * @param {String} userId - The object ID of the user being deleted
 * @param {String} deletedBy - Either "self" or "admin"
 * @param {String} reason - Reasion for deletion
 */
const deleteUserAndCascade = async (userId, deletedBy = "self", reason = "Requested") => {
  // 1. Find user
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // 2. Archive to DeletedUser collection
  const archivedUser = new DeletedUser({
    originalId: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
    deletedBy: deletedBy,
    reason: reason,
    bioSnapshot: user.bio,
    collegeSnapshot: user.college
  });
  await archivedUser.save();

  // 3. Cascade Delete Generated Content
  // Gigs
  await Gig.deleteMany({ createdBy: user._id });
  
  // Jobs (Alumni/Faculty posting jobs)
  await Job.deleteMany({ postedBy: user._id });

  // Events (Faculty/Admin organizing events)
  await Event.deleteMany({ organizedBy: user._id });

  // Optionally, you might want to handle Orders, Messages, or Reviews differently.
  // Standard practice is to keep Orders/Messages but mark user as "Deleted User" in the UI 
  // via populate null checks, unless strictly legally required to drop them.

  // 4. Finally, delete the actual User record
  await User.findByIdAndDelete(userId);

  return archivedUser;
};

module.exports = {
  deleteUserAndCascade
};
