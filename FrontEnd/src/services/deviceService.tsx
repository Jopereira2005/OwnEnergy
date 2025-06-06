import { deviceAPI } from './server';

const deviceService =  {
  async list_device() {
    try {
      const response = await deviceAPI.get('/Device/all');
      return response;
    } catch (error: any) {
      return error.response.data;
    }
  },

  async create_device( roomId: string, power: number, name: string, isDimmable: boolean ) {
    const data = {
      roomId: roomId,
      name: name,
      powerWatts: power,
      isDimmable: isDimmable,
      deviceType: "Light"
    }

    try {
      await deviceAPI.post('/Device/create', data);
    } catch (error: any) {
      return error;
    }
  },

  async delete_device( id: string ) {
    try {
      const response = await deviceAPI.delete(`/Device/delete/${id}`);
      return response;
    } catch (error: any) {
      return error.response.data;
    }
  },

  async update_device_name( id: string, name: string ) {
    try {
      const response = await deviceAPI.put(`/Device/update/device_name/${id}`, { name });
      return response;
    } catch (error: any) {
      return error.response.data;
    }
  },

  async update_device_power( id: string, power: number ) {
    try {
      const response = await deviceAPI.put(`/Device/update/power_rate/${id}`, { powerWatts: power });
      return response;
    } catch (error: any) {
      return error.response.data;
    }
  },

  async update_device_room( id: string, roomId: string ) {
    try {
      const response = await deviceAPI.put(`/Device/update/device_room/${id}`, { roomId });
      return response;
    } catch (error: any) {
      return error.response.data;
    }
  },

  async update_device_dim( id: string, instensity: number ) {
    try {
      const response = await deviceAPI.post(`/DeviceAction/dim/${id}`, { brightness : instensity });
      return response;
    } catch (error: any) {
      return error.response.data;
    }
  },

  async device_switch( id: string ) {
    try {
      const response = await deviceAPI.post(`/DeviceAction/switch/${id}`);
      return response;
    } catch (error: any) {
      return error.response.data;
    }
  }
}

export default deviceService;