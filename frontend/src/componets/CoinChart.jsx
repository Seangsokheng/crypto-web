import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend, zoomPlugin);

const CoinChart = ({ chartData, period }) => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: `Price over ${period}`,
                color: '#fff',
                font: {
                    size: 18,
                },
            },
            tooltip: {
                enabled: true,
                mode: 'nearest',
                intersect: false,
            },
            zoom: {
                pan: {
                    enabled: true,
                    mode: 'x', // Pan along x-axis
                },
                zoom: {
                    wheel: {
                        enabled: true,
                        speed: 0.02, // Slower zoom speed
                        mode: 'x', // Zoom only on the x-axis (horizontal)
                    },
                    pinch: {
                        enabled: true,
                    },
                    mode: 'x',
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    color: '#fff',
                    maxTicksLimit: 8, // Control the number of ticks shown on the x-axis
                },
                grid: {
                    color: '#333',
                },
            },
            y: {
                ticks: {
                    color: '#fff',
                },
                grid: {
                    color: '#333',
                },
            },
        },
    };

    return <Line data={chartData} options={options} />;
};

export default CoinChart;
