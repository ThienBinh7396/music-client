<script>
/* eslint-disable */

import {
    Line
} from "vue-chartjs";

export default {
    extends: Line,
    props: {
        labels: {
            type: Array,
            default: []
        },
        colors: {
            type: Array,
            required: true
        },
        datasets: {
            type: Array,
            required: true
        },
    },
    data() {
        return {
            gradients: {}
        };
    },
    watch: {
        datasets: function(val){
            this.draw();
        }
    },
    methods: {
        draw: function(){
this.renderChart({
            labels: this.labels,
            datasets: this.mainDatasets,

        }, {
            legend: {
                labels: {
                    fontColor: '#888',
                    padding: 20,
                }
            },
            responsive: true,
            maintainAspectRatio: false,
             tooltips: {
        },
            title: {
                fontColor: '#666'
            },
            scales: {
                xAxes: [{
                    ticks: {
                        fontColor: "#999"
                    },
                    scaleLabel: {
                        display: true,
                        fontColor: '#999',
                        labelString: 'Month'
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

        });
        },
        initListGradient: function () {

            let gradientRed = this.$refs.canvas
                .getContext("2d")
                .createLinearGradient(0, 0, 0, 550);

            gradientRed.addColorStop(0, "rgba(255, 0,0, 0.5)");
            gradientRed.addColorStop(0.5, "rgba(255, 0, 0, 0.25)");
            gradientRed.addColorStop(1, "rgba(255, 0, 0, 0)");

            let gradientBlue = this.$refs.canvas
                .getContext("2d")
                .createLinearGradient(0, 0, 0, 550);

            gradientBlue.addColorStop(0, "rgba(0, 231, 255, 0.9)");
            gradientBlue.addColorStop(0.5, "rgba(0, 231, 255, 0.25)");
            gradientBlue.addColorStop(1, "rgba(0, 231, 255, 0)");

            let gradientYellow = this.$refs.canvas
                .getContext("2d")
                .createLinearGradient(0, 0, 0, 550);

            gradientYellow.addColorStop(0, "rgba(255, 255, 0, 0.9)");
            gradientYellow.addColorStop(0.5, "rgba(255, 255, 0, 0.35)");
            gradientYellow.addColorStop(1, "rgba(255, 255, 0, 0.15)");
           
           
           let gradientCyan = this.$refs.canvas
                .getContext("2d")
                .createLinearGradient(0, 0, 0, 550);

            gradientCyan.addColorStop(0, "rgba(80, 227, 194, 0.9)");
            gradientCyan.addColorStop(0.5, "rgba(80, 227, 194, 0.75)");
            gradientCyan.addColorStop(1, "rgba(80, 227, 194, 0.2)");

            this.gradients = {
                red: gradientRed,
                blue: gradientBlue,
                yellow: gradientYellow,
                cyan: gradientCyan
            }
        },
        initDataset: function () {
          
        }

    },
    computed: {
        mainDatasets: {
get(){
               return this.datasets ? this.datasets.map((it, index) => {
                   return Object.assign(it, {
                       borderColor: this.colors[index],
                   })
               }) : []
           },
           set(val){
             return val
           } 

        } 
    },
    created(){
        
        Chart.Legend.prototype.afterFit = function () {
            this.height = this.height + 18;
        };
    },
    mounted() {
        this.initListGradient();

        this.draw();


        
    }
};
</script>
