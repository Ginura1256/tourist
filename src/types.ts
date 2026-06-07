export interface Destination {
  _id?: string;
  name: string;
  isCrowded: boolean;
  crowdLevel: number;
  alternativeDestination: string;
  description: string;
  category: string;
  image: string;
  alternativeDesc: string;
}

export interface RouteStatus {
  primaryDestination: string;
  alternativeDestination: string;
  currentDestinationName: string;
  isRedirected: boolean;
  crowdLevel: number;
  isCrowded: boolean;
  timestamp: string;
}
