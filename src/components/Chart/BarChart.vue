<script>
/* eslint-disable */
import {
    Bar
} from "vue-chartjs";
    export default {
  extends: Bar,
   props: {
        data: {
            type: Object,
            required: true
        },
     
    },
  data: () => ({
    chartdata: {
      labels: ['January', 'Feb12', 'Fe12b12','ruary'],
      datasets: [
        {
          label: 'Data One',
          backgroundColor: '#f87979',
          data: [40, 52, 30, 30]
        }
      ]
    },
    options: {
         legend: {
                labels: {
                    fontColor: '#888',
                    padding: 20,
                }
            },
      responsive: true,
      maintainAspectRatio: false,
       scales: {
                xAxes: [{
                    ticks: {
                        fontColor: "#999"
                    },
                    scaleLabel: {
                        display: true,
                        fontColor: '#999',
                    }
                }],
                yAxes: [{
                    ticks: {
                        fontColor: "#999"
                    },
                    scaleLabel: {
                        display: true,
                        fontColor: '#999'
                    }
                }]
            }
    }
  }),
    watch: {
        data: function(val){

            this.renderChart(this.data, this.options)
        }
    },
  mounted () {
    this.renderChart(this.data, this.options)
  }
}
</script>