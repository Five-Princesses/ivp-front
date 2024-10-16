export enum ComponentStatus {
  OPERATIONAL = 'Operational',
  PARTIALOUTAGE = 'Partial Outage',
  MINOROUTAGE = 'Minor Outage',
  MAJOROUTAGE = 'Major Outage',
}

export interface IGroup {
  id: string;
  name: string;
  description: string;
}

export interface IComponent {
  id: string;
  name: string;
  description: string;
  status: ComponentStatus;
  group?: IGroup;
}

export interface IArbitrumStatus {
  components: IComponent[];
}

export interface TabItem {
  value: string;
  label: string;
}

export interface TabsManagerProps {
  sectionsRef: {
    header: React.RefObject<HTMLDivElement>;
    [key: string]: React.RefObject<HTMLDivElement>;
  };
  tabs: TabItem[];
}
