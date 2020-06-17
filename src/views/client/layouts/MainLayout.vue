<template>
  <div id="main-layout">
    <AppBar />
    <Drawer />
    <ViewContent />
    <!-- <BottomMusic /> -->
    <RightDrawer />
    <BottomMusic></BottomMusic>
  </div>
</template>

<script>
/* eslint-disable */

import Drawer from "@/views/client/partials/Drawer";
import RightDrawer from "@/views/client/partials/RightDrawer";
import AppBar from "@/views/client/partials/AppBar";
import ViewContent from "@/views/client/partials/ViewContent";
import BottomMusic from "@/views/client/partials/BottomMusic";
import Bottom from "@/views/client/partials/Bottom";
import { mapMutations, mapState, mapActions } from "vuex";

import "hooper/dist/hooper.css";
import "@/assets/css/animation.css";

import "sweetalert2/src/sweetalert2.scss";

import "@/assets/css/main.css";

import axios from "axios";

export default {
  components: {
    Drawer,
    AppBar,
    ViewContent,
    BottomMusic,
    RightDrawer,
    Bottom
  },
  data() {
    return {
      instance: null,
      interval: null
    };
  },
  methods: {
    ...mapMutations("app", [
      "setAxiosInstance",
      "setToken",
      "setUser",
      "setResponsive",
      "setDetectMobile",
      "setShowMusicBar",
      "setSocket",
      "setAlert"
    ]),
    ...mapMutations("musics", ["setPlayList", "setCurrentMusic"]),
    ...mapActions("app", ["showAlert"]),
    onResponsiveInverted() {
      this.setResponsive(window.innerWidth);

      this.setDetectMobile(this.detectMb());
    },
    detectMb: function() {
      var check = false;
      (function(a) {
        if (
          /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
            a
          ) ||
          /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
            a.substr(0, 4)
          )
        )
          check = true;
      })(navigator.userAgent || navigator.vendor || window.opera);
      return check;
    },
    handleInvalidToken: function() {
      localStorage.removeItem("_u");
      localStorage.removeItem("_t");
      this.$router.push("/login");
    },
    visitWebsite: function() {
      this.axiosInstance.post("client/views/userVisit");
    }
  },
  created() {
    let dt = localStorage.getItem("playlist");

    if (dt) {
      dt = JSON.parse(dt);
    }
    this.setPlayList(dt ? dt : []);

    this.setCurrentMusic(dt && dt.length != 0 ? dt[0] : {});

    this.setToken(localStorage.getItem("_t"));

    this.setSocket({
      //io: io("http://localhost:4000"),
      io: io('https://my-music-serve.herokuapp.com'),
      init: localStorage.getItem("_u")
    });

    if (!this.instance) {
      this.instance = axios.create({
        //baseURL: "http://localhost:4000/api/",
        baseURL: 'https://my-music-serve.herokuapp.com/api/',
        headers: {
          "x-access-token": this.token
        }
      });
      this.setAxiosInstance(this.instance);
    }

    if (!this.user) {
      this.axiosInstance
        .post("/client/users/checkInfor", {
          u: localStorage.getItem("_u")
        })
        .then(rs => {
          let { type, response } = rs.data;
          if (type === "success") {
            this.setUser(response.u);
            localStorage.getItem("_u", response.storage_u);
          }
        });
    }

    window.formatNumber = function(num) {
      return num > 9 ? num : `0${num}`;
    };
  },
  mounted() {
    let that = this;

    this.setShowMusicBar(this.playList ? this.playList.length != 0 : false);
    this.onResponsiveInverted();

    window.addEventListener("resize", this.onResponsiveInverted);

    if (this.interval) {
      window.clearInterval(this.interval);

      this.interval = null;
    }

    this.visitWebsite();

    this.interval = setInterval(function() {
      that.instance
        .post("client/users/checkToken", {
          token: that.token,
          store: localStorage.getItem("_t"),
          user: localStorage.getItem("_u")
        })
        .then(rs => {
          let { data } = rs;

          if (data.type == "error") {
            that.handleInvalidToken();
          }
          //console.log(data);
        })
        .catch(err => {
          that.handleInvalidToken();
          console.log(err);
        });
    }, 5000);

    window.formatNumber = function(num) {
      return num > 9 ? num : `0${num}`;
    };

    let dayInWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let monthInYear = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];

    window.formatDate = function(str, type) {
      str = Number(`${str}`) || str;

      console.log(str);
      var date = new Date(str);

      var d = date.getDate();
      var month = date.getMonth() + 1;
      var y = date.getFullYear();
      var h = date.getHours();
      var m = date.getMinutes();
      var s = date.getSeconds();

      var f = "";
      var full = `${d}/${month}/${y} ${h}:${formatNumber(m)}:${formatNumber(
        s
      )}`;
      switch (type) {
        case 1: //ex: 10:10pm
          f = `${h > 12 ? h - 12 : h}:${formatNumber(m)}${
            h > 12 ? " pm" : " am"
          }`;
          break;

        case 2: //ex: Sat, Aug 29
          console.log(date.getDay());
          f = `${dayInWeek[date.getDay()]}, ${
            monthInYear[month - 1]
          } ${formatNumber(d)}`;
          break;

        case 3: //ex: 03/07/1996
          f = `${month}/${d}/${y}`;
          break;

        case 4: //ex: 12:00
          f = `${formatNumber(h)}:${formatNumber(m)}`;
          break;

        case 5: //ex: 10:10:10pm
          f = `${h}:${formatNumber(m)}:${formatNumber(s)}`;
          break;
        case 6: //ex: Nov 20, 2019, 8:35 AM
          f = `${monthInYear[month - 1]} ${formatNumber(d)}, ${y}, ${h}:${m}${
            h > 12 ? "PM" : "AM"
          }`;
          break;
      }
      return {
        format: f,
        fullType: full
      };
    };

    window.calculateTime = function(time) {
      let now = Date.now();
      let diffSecond = parseInt((now - Number(`${time}`)) / 1000);

      let text = "";
      if (diffSecond > 12 * 30 * 24 * 60 * 60) {
        text = `${parseInt(diffSecond / (12 * 30 * 24 * 60 * 60))}y`;
      } else if (diffSecond > 30 * 24 * 60 * 60) {
        text = `${parseInt(diffSecond / 30 / 24 / 60 / 60)}m`;
      } else if (diffSecond > 24 * 60 * 60) {
        text = `${parseInt(diffSecond / 24 / 60 / 60)}d`;
      } else if (diffSecond > 60 * 60) {
        text = `${parseInt(diffSecond / 60 / 60)}h`;
      } else if (diffSecond > 60) {
        text = `${parseInt(diffSecond / 60)}m`;
      } else {
        text = `${parseInt(diffSecond)}s`;
      }
      return text;
    };
  },

  beforeDestroy() {
    if (this.interval) {
      window.clearInterval(this.interval);

      this.interval = null;
    }

    window.removeEventListener("resize", this.onResponsiveInverted);
  },
  computed: {
    ...mapState("app", [
      "user",
      "responsive",
      "showMusicBar",
      "token",
      "socket",
      "axiosInstance"
    ]),
    ...mapState("musics", ["playList"])
  },
  watch: {
    playList: function(val) {
      this.setShowMusicBar(val ? val.length != 0 : false);
    }
  }
};
</script>
