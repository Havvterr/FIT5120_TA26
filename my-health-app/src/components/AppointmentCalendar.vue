<template>
  <div>
    <h2>Appointment Calendar</h2>

    <!-- New appointment form -->
    <form @submit.prevent="addAppointment" class="appointment-form">
      <div v-if="newAppointment">
        <input
          v-model="newAppointment.title"
          placeholder="Appointment Title"
          class="form-input"
        />
        <input type="date" v-model="newAppointment.date" class="form-input" />
      </div>
      <button type="submit" class="form-button">Add Appointment</button>
    </form>

    <!-- Calendar Component -->
    <VueCal :events="appointments" :editable="true" class="styled-calendar" />

    <p>Test Appointment Title: {{ newAppointment.title }}</p>
    <p>Test Appointment Date: {{ newAppointment.date }}</p>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import VueCal from "vue-cal"; // Import VueCal
import "vue-cal/dist/vuecal.css"; // VueCal's styles
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "@/firebase/init.js"; // Ensure the path is correct

export default {
  name: "AppointmentCalendar",
  components: {
    VueCal, // Register VueCal
  },
  setup() {
    const appointments = ref([]);
    const newAppointment = ref({
      title: "",
      date: "",
    });

    // Fetch existing appointments from Firestore
    const fetchAppointments = async () => {
      const querySnapshot = await getDocs(collection(db, "appointments"));
      appointments.value = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        let appointmentDate;

        // Ensure valid date conversion for VueCal
        if (data.date && typeof data.date.toDate === "function") {
          appointmentDate = data.date.toDate();
        } else if (data.date && !isNaN(new Date(data.date))) {
          appointmentDate = new Date(data.date);
        } else {
          appointmentDate = new Date(); // Fallback to current date
        }

        return {
          id: doc.id,
          title: data.title,
          start: appointmentDate,
          end: appointmentDate, // Assuming single-day events
        };
      });
    };

    // Add a new appointment to Firestore
    const addAppointment = async () => {
      // Show confirmation message before any operations
      alert("Appointment is being created!");

      console.log("Add Appointment button clicked"); // Debugging log
      try {
        const appointmentDate = new Date(newAppointment.value.date);

        // Ensure the date string is valid before proceeding
        if (!newAppointment.value.date || isNaN(appointmentDate.getTime())) {
          console.error("Invalid date format"); // Debugging log
          throw new Error("Invalid date format");
        }

        console.log("Appointment Date: ", appointmentDate); // Debugging log
        console.log("Appointment Title: ", newAppointment.value.title); // Debugging log

        // Try to add the appointment to Firestore
        const docRef = await addDoc(collection(db, "appointments"), {
          title: newAppointment.value.title,
          date: appointmentDate.toISOString(), // Store the date as a string in ISO format
        });

        console.log("Document written with ID: ", docRef.id); // Debugging log

        // Reset form
        newAppointment.value = { title: "", date: "" };
        fetchAppointments(); // Refresh the appointments list
      } catch (error) {
        console.error("Error adding appointment: ", error); // Debugging log
      }
    };

    onMounted(fetchAppointments); // Fetch appointments when the component is mounted

    return {
      appointments,
      newAppointment,
      addAppointment,
    };
  },
};
</script>

<style scoped>
/* Form styles */
.appointment-form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.form-input {
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.form-button {
  padding: 10px 15px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.form-button:hover {
  background-color: #45a049;
}

/* Calendar styling */
.styled-calendar {
  width: 100%;
  border-collapse: collapse;
  font-family: Arial, sans-serif;
  background-color: #ffffff;
}

.styled-calendar .vuecal__cell {
  border: 3px solid #333;
  text-align: center;
  padding: 12px;
  font-size: 18px;
  height: 120px;
  color: #333;
}

.styled-calendar .vuecal__header,
.vuecal__column-header {
  background-color: #333;
  color: white;
  font-weight: bold;
  padding: 18px 0;
  font-size: 20px;
}

.styled-calendar .vuecal__cell-today {
  background-color: #ffcc00;
  font-weight: bold;
  border-radius: 12px;
  border: 3px solid #ff9900;
}

.styled-calendar .vuecal__cell:hover {
  background-color: #f0f0f0;
  cursor: pointer;
}

.vuecal__event {
  background-color: #d9534f;
  color: white;
  padding: 6px;
  border-radius: 8px;
  font-size: 16px;
}
</style>
