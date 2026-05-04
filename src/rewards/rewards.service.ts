import { Injectable } from '@nestjs/common';

@Injectable()
export class RewardsService {
  // Add other necessary methods here (e.g., fetching scores from Oracle)

  async getStudentRewards(studentId: string) {
    // Example logic: in a real scenario, you'd query your Oracle DB for student performance
    const count = 5; // Placeholder for actual completed assessments count
    
    // FIX: Define the type so TypeScript doesn't assume it is 'never'
    const badges: { name: string; icon: string }[] = [];

    if (count >= 1) badges.push({ name: "Starter", icon: "⭐" });
    if (count >= 5) badges.push({ name: "Achiever", icon: "🏆" });
    if (count >= 10) badges.push({ name: "Pakachere Hero", icon: "🏅" });

    return {
      studentId,
      points: count * 10,
      badges: badges
    };
  }
}