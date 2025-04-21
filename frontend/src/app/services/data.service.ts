// src/app/services/data.service.ts
import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() {}

  async getData(): Promise<any> {
    try {
      const response = await axios.get('https://api.example.com/data');
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
}
