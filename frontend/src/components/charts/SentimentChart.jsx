import React from 'react'
import { Line } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
import GlassCard from '../ui/GlassCard'

Chart.register(...registerables)

const SentimentChart = ({ data }) => {
  const chartData = {
    labels: data.sentiment_arc.map((_, i) => i + 1),
    datasets: [
      {
        label: 'Sentiment',
        data: data.sentiment_arc,
        borderColor: '#6c63ff',
        backgroundColor: (context) => {
          const value = context.raw
          return value > 0
            ? 'rgba(0, 255, 136, 0.1)'
            : 'rgba(255, 68, 102, 0.1)'
        },
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointBackgroundColor: '#6c63ff',
        fill: true,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(26, 26, 46, 0.9)',
        titleColor: '#f0f0ff',
        bodyColor: '#8888aa',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        min: -1,
        max: 1,
        ticks: {
          color: '#8888aa',
          stepSize: 0.5,
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
      },
      x: {
        ticks: {
          color: '#8888aa',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false,
        },
      },
    },
  }

  return (
    <GlassCard>
      <h3 className="text-lg font-bold mb-2 text-text-primary">Sentiment Arc</h3>
      <p className="text-sm text-text-muted mb-6">How tone shifts across the video</p>
      <div style={{ height: '300px' }}>
        <Line data={chartData} options={options} />
      </div>
    </GlassCard>
  )
}

export default SentimentChart
