export interface StudentData {
  general: {
    matricula: string | undefined;
    name: string | undefined;
    paternalLastName: string | undefined;
    maternalLastName: string | undefined;
    academicStatus: string | undefined;
    nacionality: string | undefined;
  };
  academic: {
    unity: string | undefined;
    division: string | undefined;
    planName: string | undefined;
    planCode: string | undefined;
    planVersion: string | undefined;
    maxCredits: string | undefined;
    planDuration: string | undefined;
    minCredits: string | undefined;
    concentrationArea: string | undefined;
    subArea: string | undefined;
  };
  performance: {
    creditsCounter: string | undefined;
    naCount: string | undefined;
    conversionCount: string | undefined;
    enrollmentTrimester: string | undefined;
    lastActivityTrimester: string | undefined;
    lastEnrrolmentTrimester: string | undefined;
    lastTrimesterAvgActive: string | undefined;
    generalAvg: string | undefined;
  };
}
