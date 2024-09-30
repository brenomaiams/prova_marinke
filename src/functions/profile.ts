// src/functions/profile.ts
import Profile from '../models/profile.js';

export const getProfileBalance = async (profileId: number) => {
  const profile = await Profile.findByPk(profileId);
  if (!profile) {
    return null;
  }
  return profile.balance;
};
