export enum ComponentStatus {
  OPERATIONAL = 'Operational',
  PARTIALOUTAGE = 'Partial Outage',
  MINOROUTAGE = 'Minor Outage',
  MAJOROUTAGE = 'Major Outage',
}

export interface Group {
  id: string;
  name: string;
  description: string;
}

export interface Component {
  id: string;
  name: string;
  description: string;
  status: ComponentStatus;
  group?: Group;
}

export interface IArbitrumStatus {
  components: Component[];
}
