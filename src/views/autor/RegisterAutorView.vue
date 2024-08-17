<template>
  <div>
    <h1>Registrar Autor</h1>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="name">Nombre:</label>
        <input type="text" id="name" v-model="form.nombre" :class="{ 'is-invalid': errors.nombre }"
          placeholder="Ingrese el nombre" />
        <div v-if="errors.nombre" class="invalid-feedback">{{ errors.nombre }}</div>
      </div>

      <div class="form-group">
        <label for="phone">Teléfono:</label>
        <input type="tel" id="phone" v-model="form.telefono" :class="{ 'is-invalid': errors.telefono }"
          placeholder="Ingrese el teléfono" />
        <div v-if="errors.telefono" class="invalid-feedback">{{ errors.telefono }}</div>
      </div>

      <div class="form-group">
        <label for="nacionalidad">Nacionalidad:</label>
        <textarea id="nacionalidad" v-model="form.nacionalidad" :class="{ 'is-invalid': errors.nacionalidad }"
          placeholder="Ingrese la nacionalidad"></textarea>
        <div v-if="errors.nacionalidad" class="invalid-feedback">{{ errors.nacionalidad }}</div>
      </div>

      <button type="submit" class="btn btn-primary">Registrar</button>
    </form>
  </div>
</template>
  
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: 'RegisterAutor',
  data() {
    return {
      form: {
        nombre: '',
        telefono: '',
        nacionalidad: ''
      },
      errors: {}
    };
  },
  methods: {
    ...mapActions(['increment']),
    validateForm() {
      this.errors = {};

      if (!this.form.nombre) {
        this.errors.nombre = 'El nombre es obligatorio.';
      }

      if (!this.form.telefono) {
        this.errors.telefono = 'El teléfono es obligatorio.';
      } else if (!/^(\+?\d{1,4}[-.\s]?)?(\(?\d{1,4}\)?[-.\s]?)?\d{1,4}([-.\s]?\d{1,9})+$/.test(this.form.telefono)) {
        this.errors.telefono = 'El teléfono no es válido.';
      }

      if (!this.form.nacionalidad) {
        this.errors.nacionalidad = 'La nacionalidad es obligatoria.';
      }

      return Object.keys(this.errors).length === 0;
    },

    submitForm() {
      if (this.validateForm()) {
        // Enviar los datos al servidor
        this.save();
        // Reiniciar el formulario
        this.form = {
          nombre: '',
          telefono: '',
          nacionalidad: ''
        };
      }
    },
    save() {
      const vm = this;
      this.axios.post(this.baseUrl + "/autores", this.form)
        .then(function (response) {
          if (response.status == '201') {
            vm.$emit('on-register', response.data);
          }
          console.log(response); vm.itemList = response.data;
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  },
  computed: {
    // propiedades computadas que dependen de otras propiedades reactivas
    ...mapState(['count']),
    ...mapGetters(['doubleCount', 'getBaseUrl']),
    baseUrl() {
      return this.getBaseUrl
    }
  },
}
</script>
  
<style scoped></style>
  