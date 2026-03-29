import Project from "../models/Projects.js";
import Organizations from "../models/Organizations.js";

export const getDashboardSummary = async (req, res, next) => {
  console.log("Dashboard Summary API hit");

  try {
    const userId = req.user.id;

    const totalProjects = await Project.countDocuments({ userId });
    const totalOrgs = await Organizations.countDocuments({ userId });

    const completedOrgs = await Organizations.countDocuments({
      userId,
      status: "Completed",
    });

     const completedProjects = await Project.countDocuments({
      userId,
      status: "Completed",
    });

    const activeOrgs = await Organizations.countDocuments({
      userId,
      status: { $ne: "Completed" },
    });

   const activeProjects = await Project.countDocuments({
  userId,
  status: { $ne: "Completed" },
});

    res.status(200).json({
      status: true,
      code: 0,
      data: {
        totalProjects,
        totalOrgs,
        completedOrgs,
        activeOrgs,
        completedProjects,
        activeProjects,
      },
    });
  } catch (err) {
    console.log("Error in getDashboardSummary:", err);
    next(err);
  }
};

export const getCareerGrowth = async (req, res, next) => {
  console.log("Career Growth API hit");

  try {
    const userId = req.user.id;

    const orgs = await Organizations.find({ userId }).sort({ startDate: 1 });

    let growthData = [];

    orgs.forEach((org) => {
      // Starting role
      growthData.push({
        date: org.startDate,
        title: org.role,
        type: "START",
        organization: org.organizationName,
      });

      // Promotions
      org.promotions?.forEach((promo) => {
        growthData.push({
          date: promo.date,
          title: promo.title,
          type: "PROMOTION",
          organization: org.organizationName,
        });
      });
    });

    growthData.sort((a, b) => new Date(a.date) - new Date(b.date));

    res.status(200).json({
      status: true,
      code: 0,
      data: growthData,
    });
  } catch (err) {
    console.log("Error in getCareerGrowth:", err);
    next(err);
  }
};

export const getTechStats = async (req, res, next) => {
  console.log("Tech Stats API hit");

  try {
    const userId = req.user.id;

    const projects = await Project.find({ userId });
    // const orgs = await Organizations.find({ userId });

    let techMap = {};

    const processTech = (techString) => {
      if (!techString) return;

      techString.split(",").forEach((tech) => {
        const t = tech.trim().toLowerCase();
        if (!t) return;

        techMap[t] = (techMap[t] || 0) + 1;
      });
    };

    projects.forEach((p) => processTech(p.techUsed));
    // orgs.forEach((o) => processTech(o.techUsed));

    res.status(200).json({
      status: true,
      code: 0,
      data: techMap,
    });
  } catch (err) {
    console.log("Error in getTechStats:", err);
    next(err);
  }
};

export const getFullTimeline = async (req, res, next) => {
  console.log("Full Timeline API hit");

  try {
    const userId = req.user.id;

    const projects = await Project.find({ userId });
    const orgs = await Organizations.find({ userId });

    let timeline = [];

    projects.forEach((p) => {
      p.timeline?.forEach((t) => {
        timeline.push({
          action: t.action,
          description: t.description,
          timestamp: t.timestamp,
          source: "PROJECT",
          name: p.projectName,
        });
      });
    });

    orgs.forEach((o) => {
      o.timeline?.forEach((t) => {
        timeline.push({
          action: t.action,
          description: t.description,
          timestamp: t.timestamp,
          source: "ORG",
          name: o.organizationName,
        });
      });
    });

    timeline.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.status(200).json({
      status: true,
      code: 0,
      data: timeline,
    });
  } catch (err) {
    console.log("Error in getFullTimeline:", err);
    next(err);
  }
};