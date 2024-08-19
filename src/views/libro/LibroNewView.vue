<template>
  <div>
    <h1>Registrar Cita</h1>
    <form @submit.prevent="submitForm">

      <div class="form-group">
        <label for="titulo">Nombre libro:</label>
        <input type="text" id="titulo" v-model="form.titulo" :class="{ 'is-invalid': errors.titulo }"
          placeholder="Ingrese el nombre" />
        <div v-if="errors.titulo" class="invalid-feedback">{{ errors.titulo }}</div>
      </div>

      <div class="form-group">
        <label for="genero">Genero:</label>
        <select id="genero" v-model="form.genero" :class="{ 'is-invalid': errors.genero }">
          <option :value="genero" v-for="(genero, index) in generoList" :key="`genero-${index}`">{{ genero }}</option>
        </select>
        <div v-if="errors.genero" class="invalid-feedback">{{ errors.genero }}</div>
      </div>

      <div class="form-group">
        <label for="autor">Autor:</label>
        <select id="autor" v-model="form.autorId" :class="{ 'is-invalid': errors.autorId }">
          <option :value="autor.id" v-for="(autor, index) in autorList" :key="`autor-${index}`">{{ autor.nombre }}
          </option>
        </select>
        <div v-if="errors.autorId" class="invalid-feedback">{{ errors.autorId }}</div>
      </div>

      <div class="form-group">
        <label for="editorial">Editorial:</label>
        <select id="editorial" v-model="form.editorialId" :class="{ 'is-invalid': errors.editorialId }">
          <option :value="editorial.id" v-for="(editorial, index) in editorialList" :key="`editorial-${index}`">{{ editorial.nombre }}
          </option>
        </select>
        <div v-if="errors.editorialId" class="invalid-feedback">{{ errors.editorialId }}</div>
      </div>

      <div class="form-group">
        <label for="numpaginas">Numero de Paginas:</label>
        <input type="number" id="numpaginas" v-model="form.numpaginas" :class="{ 'is-invalid': errors.numpaginas }"
          placeholder="Ingrese el numero de paginas" />
        <div v-if="errors.numpaginas" class="invalid-feedback">{{ errors.numpaginas }}</div>
      </div>
      
      <button type="submit" class="btn btn-primary">Registrar</button>
    </form>
  </div>
</template>
  
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: 'LibroNew',
  data() {
    return {
      autorList: [],
      editorialList: [],
      generoList: [
        "Ficción",
        "Drama",
        "Comic",
        "Poemas"
      ],
      form: {
        autorId: null,
        editorialId: null,
        genero: null,
        titulo:null,
        numpaginas:null,
  
      },
      errors: {}
    };
  },
  methods: {
    ...mapActions(['increment']),
    validateForm() {
      this.errors = {};

      if (!this.form.autorId) {
        this.errors.autorId = 'El Autor es obligatorio.';
      }

      if (!this.form.editorialId) {
        this.errors.editorialId = 'El Editorial es obligatoria.';
      }
      
      if (!this.form.genero) {
        this.errors.genero = 'La genero es obligatorio.';
      }

      if (!this.form.numpaginas) {
        this.errors.numpaginas = 'El numero de paginas es obligatorio.';
      }

      if (!this.form.titulo) {
        this.errors.titulo = 'El titulo es obligatorio.';
      }


      return Object.keys(this.errors).length === 0;
    },

    submitForm() {
      if (this.validateForm()) {
        // Enviar los datos al servidor
        this.save();
        // Reiniciar el formulario
        this.form = {
          editorialId: null
        };
      }
    },
    save() {
      const vm = this;
      this.axios.post(this.baseUrl + "/libros", this.form)
        .then(function (response) {
          if (response.status == '201') {
            vm.$emit('on-register', response.data);
          }
          vm.itemList = response.data;
        })
        .catch(function (error) {
          console.error(error);
        });
    },
    getAutorList() {
      const vm = this;
      this.axios.get(this.baseUrl + "/autores")
        .then(function (response) {
          vm.autorList = response.data;
        })
        .catch(function (error) {
          console.error(error);
        });
    },
    getEditorialList() {
      const vm = this;
      this.axios.get(this.baseUrl + "/editoriales")
        .then(function (response) {
          vm.editorialList = response.data;
        })
        .catch(function (error) {
          console.error(error);
        });
    },
  },
  computed: {
    // propiedades computadas que dependen de otras propiedades reactivas
    ...mapState(['count']),
    ...mapGetters(['doubleCount', 'getBaseUrl']),
    baseUrl() {
      return this.getBaseUrl
    }
  },
  mounted() {
    this.getEditorialList();
    this.getAutorList();
  },
}
</script>
  
<style scoped></style>
  