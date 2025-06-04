export interface Device {
  id?: string,
  roomId: string,
  name: string,
  isDimmable?: boolean,
  intensity?: number,
  power?: number,
  status?: string
}