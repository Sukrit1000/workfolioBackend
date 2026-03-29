import Organizations from "../models/Organizations.js"; // adjust path if needed
import Project from "../models/Projects.js"; // adjust path
import User from "../models/User.js"; // adjust path
import isEqual from "lodash-es/isEqual.js";

const normalizePromotions = (data) => {
  if (!data) return [];
  return data.map((item) => ({
    title: item.title || "",
    date: item.date ? new Date(item.date).toISOString() : "",
  }));
};

export const createOrganization = async (req, res,next) => {
  console.log("Create Organization endpoint hit with data:", req.body);

  try {
    // 🔥 destructure to clean + safe handling
    const {
      organizationName,
      role,
      startDate,
      endDate,
      status,
      location,
      techUsed,
      about,
      promotions,
    } = req.body;

    const user = await User.findOne({ _id: req.user.id });

    const organization = new Organizations({
      organizationName,
      role,
      startDate,
      endDate,
      status,
      location,
      techUsed,
      about,
      promotions, // [{title, date}]
      timeline: [
        {
          action: "CREATED",
          description: `Organization created by user ${user.firstName} ${user.lastName}`,
        },
      ],
      userId: req.user.id, // same as your structure
    });

    const organizationSaved = await organization.save();

    if (organizationSaved) {
      res.status(201).json({
        status: true,
        code: 0,
        data: organizationSaved,
      });
    } else {
      console.log("Error saving organization:", organizationSaved);
      res.status(500).json({
        status: false,
        code: 1,
        message: "Error saving organization",
      });
    }
  } catch (err) {
    console.log("Error in createOrganization:", err);
    next(err); // Pass error to global error handler
  }
};


export const updateOrganization = async (req, res, next) => {
  console.log("Update Organization endpoint hit with data:", req.body);

  const { _id, ...updateData } = req.body;

  try {
    const user = await User.findById(req.user.id);

    const organization = await Organizations.findOne({
      _id,
      userId: req.user.id,
    });

    if (!organization) {
      console.log("Organization not found for update:", _id);
      return res.status(404).json({
        status: false,
        code: 1,
        message: "Organization not found",
      });
      
    }

    const timelineEntries = [];

    // 🔥 field comparisons
    if (
      updateData.organizationName &&
      updateData.organizationName !== organization.organizationName
    ) {
      timelineEntries.push({
        action: "UPDATED",
        description: `Organization name changed from "${organization.organizationName}" to "${updateData.organizationName}" by ${user.firstName} ${user.lastName}`,
      });
    }

    if (updateData.role && updateData.role !== organization.role) {
      timelineEntries.push({
        action: "UPDATED",
        description: `Role updated from "${organization.role}" to "${updateData.role}" by ${user.firstName} ${user.lastName}`,
      });
    }

    if (updateData.status && updateData.status !== organization.status) {
      timelineEntries.push({
        action: "UPDATED",
        description: `Status updated from "${organization.status}" to "${updateData.status}" by ${user.firstName} ${user.lastName}`,
      });
    }

   if (
  updateData.startDate &&
  new Date(updateData.startDate).getTime() !==
    new Date(organization.startDate).getTime()
) {
  timelineEntries.push({
    action: "UPDATED",
    description: `Start date updated to "${updateData.startDate}" by ${user.firstName} ${user.lastName}`,
  });
}

    if (
  updateData.endDate &&
  new Date(updateData.endDate).getTime() !==
    new Date(organization.endDate).getTime()
) {
  timelineEntries.push({
    action: "UPDATED",
    description: `End date updated to "${updateData.endDate}" by ${user.firstName} ${user.lastName}`,
  });
}

    if (updateData.location && updateData.location !== organization.location) {
      timelineEntries.push({
        action: "UPDATED",
        description: `Location updated from "${organization.location}" to "${updateData.location}" by ${user.firstName} ${user.lastName}`,
      });
    }

    // 🧠 array compare (techUsed)
   if (
  updateData.techUsed &&
  !isEqual(updateData.techUsed, organization.techUsed)
) {
  timelineEntries.push({
    action: "UPDATED",
    description: `Tech stack updated by ${user.firstName} ${user.lastName}`,
  });
}

    if (updateData.about && updateData.about !== organization.about) {
      timelineEntries.push({
        action: "UPDATED",
        description: `Description updated by ${user.firstName} ${user.lastName}`,
      });
    }

    // 🚀 promotions compare
  const incomingPromotions = normalizePromotions(updateData.promotions);
const existingPromotions = normalizePromotions(organization.promotions);

if (
  updateData.promotions &&
  JSON.stringify(incomingPromotions) !==
    JSON.stringify(existingPromotions)
) {
  timelineEntries.push({
    action: "PROMOTION_UPDATED",
    description: `Promotions updated by ${user.firstName} ${user.lastName}`,
  });
}

    // 🔥 only push if changes exist
    if (timelineEntries.length > 0) {
      updateData.$push = {
        timeline: { $each: timelineEntries },
      };
    }

    const updatedOrganization = await Organizations.findOneAndUpdate(
      { _id, userId: req.user.id },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedOrganization) {
      console.log("Organization not found for update console 2:", _id);
      return res.status(404).json({
        status: false,
        code: 1,
        message: "Organization not found",
      });
      
    }

    res.status(200).json({
      status: true,
      code: 0,
      data: updatedOrganization,
    });
    console.log("Organization updated successfully:", updatedOrganization);
  } catch (err) {
    console.log("Error in updateOrganization:", err);
    next(err);
  }
};



export const getOrganizations = async (req, res,next) => {
  console.log(
    "Get Organizations endpoint hit for user:",
    req.user.id,
   
  );

  

  try {
    const organizations = await Organizations.find({
      userId: req.user.id,
    })

    if (!organizations || organizations.length === 0) {
      console.log("No organizations found for user:", req.user.id);
      return res.status(200).json({
        status: false,
        code: 1,
        message: "No organizations found",
        data: [],
      });
    }

    const organizationsWithProjects = await Promise.all(
      organizations.map(async (org) => {
        const projects = await Project.find({ organizationId: org._id }).select(
          "projectName"
        ); // only get projectName
        return {
          ...org._doc, // spread the org document
          projects: projects.map((p) => p.projectName), // array of names
        };
      })
    );

   

    res.status(200).json({
      status: true,
      code: 0,
      data: organizationsWithProjects,
   
    });
  } catch (err) {
    console.log("Error in getOrganizations:", err);
    next(err); // Pass error to global error handler
  }
};



// export const getProjects = async (req, res) => {
//   console.log("Get Projects endpoint hit for user:", req.user.id, req.body); // Debug log
//   const { page = 1, limit = 10 } = req.body; // Optional filter
//   try {
//     const projects = await Project.find({ userId: req.user.id }).skip((page - 1) * limit).limit(limit);
//     if (!projects) {
//       console.log("No projects found for user:", req.user.id);
//       return res.status(201).json({status:false,code:1, message: "No projects found" });
//     }
//     res.status(200).json({status:true,code:0, data: projects, totalPages: projects.length, currentPage: page });
//   } catch (err) {
//     console.log("Error in getProjects:", err); // Debug log
//     res.status(500).json({status:false,code:1, message: err.message });
//   }
// };