import Investor from "../models/Investor";

export const findMatches = async (io: any) => {
  const investors = await Investor.find({ role: "Investor" });
  const landowners = await Investor.find({ role: "Landowner" });
  const matches: any[] = [];

  for (const investor of investors) {
    for (const landowner of landowners) {
      // Simple direct match conditions
      const sameLocation =
        investor.preferredLocation &&
        investor.preferredLocation === landowner.preferredLocation;

      const sameType =
        investor.investmentType &&
        investor.investmentType === landowner.projectType;

      const sameBudget =
        investor.budgetRange &&
        investor.budgetRange === landowner.budgetRange;

      // If at least two of the main fields match, consider it a match
      const matchedConditions = [sameLocation, sameType, sameBudget].filter(Boolean).length;

      if (matchedConditions >= 2) {
        matches.push({ investor, landowner });

        // Real-time notifications
        const investorId = String((investor as any)._id);
        const landownerId = String((landowner as any)._id);

        io.to(investorId).emit("matchFound", {
          message: `🎉 You’ve been matched with ${landowner.fullName}!`,
        });

        io.to(landownerId).emit("matchFound", {
          message: `💼 ${investor.fullName} is interested in your property.`,
        });

        console.log(`✅ Match: ${investor.fullName} ↔ ${landowner.fullName}`);
      }
    }
  }

  return matches;
};
