import { deviceAPI } from './server';

const generatorService =  {
  async list_generator() {
    try {
      const response = await deviceAPI.get('/Generator/all-user');
      return response;
    } catch (error: any) {
      return error.response.data;
    }
  },

  async list_generatorType() {
    try {
      const response = await deviceAPI.get('/GeneratorType/all');
      return response;
    } catch (error: any) {
      return error.response.data;
    }
  },

  async create_generator( name: string, type: string, power: number ) {
    const data = {
      name: name,
      typeName: type,
      generationRateWattsPerHour:  power
    }

    try {
      await deviceAPI.post('/Generator', data);
    } catch (error: any) {
      return error.response.data;
    }
  },

  async delete_generator( id: string ) {
    try {
      const response = await deviceAPI.delete(`/Generator/${id}`);
      return response;
    } catch (error: any) {
      return error.response.data;
    }
  },

  async update_generator_name( id: string, name: string ) {
    try {
      const response = await deviceAPI.put(`/Generator/${id}`, { name });
      return response;
    } catch (error: any) {
      return error.response.data;
    }
  },

  async update_generator_power( id: string, power: number ) {
    try {
      const response = await deviceAPI.put(`/Generator/${id}/power-rate`, { generationRateWattsPerHour: power });
      return response;
    } catch (error: any) {
      return error.response.data;
    }
  },

  async generator_active( id: string ) {
    try {
      const response = await deviceAPI.put(`/Generator/${id}/activate`);
      return response;
    } catch (error: any) {
      return error.response.data;
    }
  },

  async generator_desactive( id: string ) {
    try {
      const response = await deviceAPI.put(`/Generator/${id}/deactivate`);
      return response;
    } catch (error: any) {
      return error.response.data;
    }
  }
}

export default generatorService;