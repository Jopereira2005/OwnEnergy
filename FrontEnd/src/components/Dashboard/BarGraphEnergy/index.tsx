import styled from './style.module.scss'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface BarGraphEnergy {
}

const BarGraphEnergy = () => {  
  const data = {
    labels: [''],
    datasets: [
      {
        label: 'Elétrica',
        data: [20],
        backgroundColor: '#007bff',
        barThickness: 20,
        borderRadius: {
          topLeft: 10,
          bottomLeft: 10,
        },
        borderSkipped: false,
      },
      {
        label: 'Não Renováveis',
        data: [10],
        backgroundColor: '#ef4444',
        barThickness: 20,
      },
      {
        label: 'Renováveis',
        data: [70],
        backgroundColor: '#4caf50',
        barThickness: 20,
        borderRadius: {
          topRight: 10,
          bottomRight: 10,
          topLeft: 0,
          bottomLeft: 0,
        },
        borderSkipped: false, // necessário pra borderRadius funcionar bem
      }
    ],
  };

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#fff',
          font: {
            size: 14,
            family: "Rubik"
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        display: false,
        max: 100,
      },
      y: {
        stacked: true,
        display: false,
      },
    },
  };

  return (
    <div className={ styled.graph }>
      <Bar data={data} options={options} />
    </div>
  );
}

export default BarGraphEnergy