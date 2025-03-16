import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import jQuery from "jquery";
//import "../../node_modules/datatables.net-dt/css/dataTables.dataTables.min.css";
//import "../../node_modules/datatables.net-dt/css/dataTables.dataTables.min.css";
import "datatables.net-dt/css/dataTables.dataTables.min.css";
import "./api"; // Import API configuration

window.$ = window.jQuery = jQuery;

createApp(App).use(router).mount("#app");
