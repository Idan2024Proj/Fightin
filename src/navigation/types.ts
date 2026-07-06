export type RootStackParamList = {
  Auth: undefined;
  ProfileSetup: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Cards: undefined;
  Matches: undefined;
  Profile: undefined;
  Settings: undefined;
};

export type MainStackParamList = {
  Tabs: undefined;
  Chat: { matchId: string; partnerName: string };
};
