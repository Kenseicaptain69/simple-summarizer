import React from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
import GlassCard from '../ui/GlassCard'

Chart.register(...registerables)

const KeywordsChart = ({ data }) => {
  const topKeywords = data.top_keywords.slice(0, 10)

  const chartData = {
    labels: topKeywords.map((k) => k.word),
    datasets: [
      {
        label: 'Frequency',
        data: topKeywords.map((k) => k.count),
        backgroundColor: (context) => {
          const colors = [
            '#6c63ff',
            '#5b52e8',
            '#4f46e5',
            '#00d4ff',
            '#00a8cc',
            '#008099',
            '#6c63ff',
            '#5b52e8',
            '#4f46e5',
            '#00d4ff',
          ]
          return colors[context.dataIndex % colors.length]
        },
        borderRadius: 8,
        barThickness: 'flex',
        maxBarThickness: 50,
      },
    ],
  }

  const options = {
    indexAxis: 'y',
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
      x: {
        ticks: {
          color: '#8888aa',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
      },
      y: {
        ticks: {
          color: '#8888aa',
        },
        grid: {
          display: false,
        },
      },
    },
  }

  return (
    <GlassCard>
      <h3 className="text-lg font-bold mb-2 text-text-primary">Top Keywords</h3>
      <p className="text-sm text-text-muted mb-6">Most frequent content words</p>
      <div style={{ height: '300px' }}>
        <Bar data={chartData} options={options} />
      </div>
    </GlassCard>
  )
}

export default KeywordsChart
