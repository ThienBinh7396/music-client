<template>
<v-container class="pa-4">
  <v-row>
    <v-col cols="12" md="8">
      <material-card color="orange" title="Employee Stats" text="New employees on 15th September, 2016">
        <v-data-table :headers="headers" :items="items" hide-default-footer />
      </material-card>
    </v-col>
    <v-col cols="12" md="4">
      <material-card class="v-card-profile">
        <v-avatar slot="offset" class="mx-auto d-block elevation-6" size="130">
          <img src="https://demos.creative-tim.com/vue-material-dashboard/img/marc.aba54d65.jpg">
        </v-avatar>
        <v-card-text class="text-center">
          <h6 class="overline mb-3">
            CEO / CO-FOUNDER
          </h6>

          <h4 class="font-weight-light">
            Alec Thompson
          </h4>

          <p class="font-weight-light">
            Don't be scared of the truth because we need to restart the human foundation in truth And I love you like Kanye loves Kanye I love Rick Owens’ bed design but the back is...
          </p>

          <v-btn color="success">
            Follow
          </v-btn>
        </v-card-text>
      </material-card>
    </v-col>
  </v-row>

</v-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      headers: [{
          sortable: false,
          text: 'ID',
          value: 'id'
        },
        {
          sortable: false,
          text: 'Name',
          value: 'name'
        },
        {
          sortable: false,
          text: 'Salary',
          value: 'salary',
          align: 'right'
        },
        {
          sortable: false,
          text: 'Country',
          value: 'country',
          align: 'right'
        },
        {
          sortable: false,
          text: 'City',
          value: 'city',
          align: 'right'
        }
      ],
      items: [{
          id: 1,
          name: 'Dakota Rice',
          country: 'Niger',
          city: 'Oud-Tunrhout',
          salary: '$35,738'
        },
        {
          id: 2,
          name: 'Minerva Hooper',
          country: 'Curaçao',
          city: 'Sinaai-Waas',
          salary: '$23,738'
        },
        {
          id: 3,
          name: 'Sage Rodriguez',
          country: 'Netherlands',
          city: 'Overland Park',
          salary: '$56,142'
        },
        {
          id: 4,
          name: 'Philip Chanley',
          country: 'Korea, South',
          city: 'Gloucester',
          salary: '$38,735'
        },
        {
          id: 5,
          name: 'Doris Greene',
          country: 'Malawi',
          city: 'Feldkirchen in Kārnten',
          salary: '$63,542'
        }
      ],
    }
  },
  computed: {
    ...mapState('app', ['axiosInstance'])
  },
  created(){
  }
}
</script>
