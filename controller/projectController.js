import Project from "../models/Projects.js";
import User from "../models/User.js"

export const createProject = async (req, res,next) => {
  console.log("Create Project endpoint hit with data:", req.body); // Debug log
  try {

    const user= await User.findOne({ _id: req.user.id });

    console.log("User found for project creation:", user); // Debug log

    const project = new Project({
      ...req.body,
      userId: req.user.id,

      timeline: [
        {
          action: "CREATED",
          description: `Project created by  ${user.firstName} ${user.lastName}`,
        },
      ],
    });

    const projectSaved = await project.save();

    if(projectSaved){
      res.status(201).json({status:true,code:0, data: projectSaved });
    }
    else {
      console.log("Error saving project:", projectSaved); // Debug log
      res.status(500).json({status:false,code:1, message: "Error saving project" });
    }

    
  } catch (err) {
    console.log("Error in createProject:", err); // Debug log
    next(err); // Pass error to global error handler
  }
};

export const updateProject = async (req, res) => {
  console.log("Update Project endpoint hit with data:", req.body); // Debug log

  const { _id, ...updateData } = req.body;
  try {

    const user= await User.findOne({ _id: req.user.id });


      const project = await Project.findOne({
      _id,
      userId: req.user.id,
    });

    if (!project) {
      return res.status(404).json({
        status: false,
        code: 1,
        message: "Project not found",
      });
    }

    const timelineEntries=[];

    if (updateData.projectName && updateData.projectName !== project.projectName) {
      timelineEntries.push({
        action: "UPDATED",
        description: `Project name updated from "${project.projectName}" to "${updateData.projectName}" by ${user.firstName} ${user.lastName}`,
      });
    }
      if (updateData.status && updateData.status !== project.status) {
      timelineEntries.push({
        action: "UPDATED",
        description: `Project status updated from "${project.status}" to "${updateData.status}" by ${user.firstName} ${user.lastName}`,
      });
    }
    if (updateData.duration && updateData.duration !== project.duration) {
      timelineEntries.push({
        action: "UPDATED",
        description: `Project duration updated from "${project.duration}" to "${updateData.duration}" by ${user.firstName} ${user.lastName}`,
      });
    }
      if (updateData.organizationId && updateData.organizationId.toString() !== project.organizationId?.toString()) {
      timelineEntries.push({
        action: "ORG_ASSIGNED",
        description: `Project assigned to new organization with ID "${updateData.organizationId}" by ${user.firstName} ${user.lastName}`,
      });
    }
    if (updateData.techUsed && updateData.techUsed !== project.techUsed) {
      timelineEntries.push({
        action: "UPDATED",
        description: `Project tech stack updated from "${project.techUsed}" to "${updateData.techUsed}" by ${user.firstName} ${user.lastName}`,
      });
    }
    if (updateData.about && updateData.about !== project.about) {
      timelineEntries.push({
        action: "UPDATED",
        description: `Project description updated by ${user.firstName} ${user.lastName}`,
      });
    }
      updateData.$push = { timeline: { $each: timelineEntries } };

     const updatedProject = await Project.findOneAndUpdate(
      { _id, userId: req.user.id }, // 👈 ensures user owns project
      updateData,
      {
        new: true, // 👈 return updated doc
        runValidators: true,
      }
    );

      if (!updatedProject) {
      return res.status(201).json({
        status: false,
        code:1,
        message: "Project not found",
      });
    }

    if(updatedProject){
      res.status(201).json({status:true,code:0, data: updatedProject });
    }
    else {
      console.log("Error updating project:", updatedProject); // Debug log
      res.status(500).json({status:false,code:1, message: "Error updating project" });
    }

    
  } catch (err) {
    console.log("Error in updateProject:", err); // Debug log
    next(err); // Pass error to global error handler
  }
};

export const getProjects = async (req, res,next) => {
  console.log("Get Projects endpoint hit for user:", req.user.id, req.body); // Debug log
  const { page = 1, limit = 10 } = req.body; // Optional filter
  try {
    const projects = await Project.find({ userId: req.user.id }).skip((page - 1) * limit).limit(limit);
    if (!projects) {
      console.log("No projects found for user:", req.user.id);
      return res.status(201).json({status:false,code:1, message: "No projects found" });
    }
    res.status(200).json({status:true,code:0, data: projects, totalPages: projects.length, currentPage: page });
  } catch (err) {
    console.log("Error in getProjects:", err); // Debug log
    next(err); // Pass error to global error handler
  }
};