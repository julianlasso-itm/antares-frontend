export interface IFullConfiguration {
  configurationLevelId: string;
  name: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
  ratingScales: RatingScale[];
  configurationPerLevels: ConfigurationPerLevel[];
}

export interface ConfigurationPerLevel {
  configurationPerLevelId: string;
  configurationLevelId: string;
  levelId: string;
  position: number;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  level: Level;
}

export interface Level {
  levelId: string;
  name: string;
  weight: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}

export interface RatingScale {
  ratingScaleId: string;
  configurationLevelId: string;
  name: string;
  description: string;
  value: string;
  position: number;
  status: boolean;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}
