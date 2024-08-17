<template>
  <div>
    <h1>Editar Libro</h1>
    <form @submit.prevent="submitForm" v-if="form">
      <div class="form-group">
        <label for="editorial">Editorial:</label>
        <select id="editorial" v-model="form.editorialId" :class="{ 'is-invalid': errors.editorialId }">
          <option :value="editorial.id" v-for="(editorial, index) in editorialList" :key="`editorial-${index}`">{{ editorial.nombre }}
          </option>
        </select>
        <div v-if="errors.editorialId" class="invalid-feedback">{{ errors.editorialId }}</div>
      </div>

      <div class="form-group">
        <label for="name">Nombre libro:</label>
        <input type="text" id="name" v-model="form.titulo" :class="{ 'is-invalid': errors.titulo }"
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
        <label for="paginas">Numero de Paginas:</label>
        <input type="number" id="paginas" v-model="form.paginas" :class="{ 'is-invalid': errors.paginas }"
          placeholder="Ingrese el numero de paginas" />
        <div v-if="errors.paginas" class="invalid-feedback">{{ errors.paginas }}</div>
      </div>
      <button type="submit" class="btn btn-primary">Registrar</button>
    </form>
  </div>
</template>
  
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  name: 'LibrosEdit',
  data() {
    return {
      editorialList: [],
      autorList: [],
      generoList: [
        "Ficción",
        "Drama"
      ],
      errors: {}
    };
  },
  methods: {
    ...mapActions(['increment']),
    validateForm() {
      this.errors = {};

      if (!this.form.titulo) {
        this.errors.titulo = 'El nombre es obligatorio.';
      }

      if (!this.form.genero) {
        this.errors.genero = 'El genero es obligatorio.';
      }

      if (!this.form.autor) {
        this.errors.autor = 'El autor es obligatorio.';
      }

      if (!this.form.paginas) {
        this.errors.paginas = 'La cantidad de paginas es obligatoria.';
      }

      if (!this.form.editorialId) {
        this.errors.editorialId = 'La editorial es obligatoria.';
      }

      return Object.keys(this.errors).length === 0;
    },

    submitForm() {
      if (this.validateForm()) {
        // Enviar los datos al servidor
        this.save();
        // Reiniciar el formulario
        this.form = {
          titulo: '',
          genero: '',
          autor: '',
          paginas: '',
          editorialId: null
        };
      }
    },
    save() {
      const vm = this;
      this.axios.patch(this.baseUrl + "/Libros/" + this.item.id, this.form)
        .then(function (response) {
          if (response.status == '200') {
            vm.$emit('on-update', response.data);
          }
          vm.itemList = response.data;
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
  },
  computed: {
    // propiedades computadas que dependen de otras propiedades reactivas
    ...mapState(['count']),
    ...mapGetters(['doubleCount', 'getBaseUrl']),
    baseUrl() {
      return this.getBaseUrl
    },
    form() {
      return Object.assign({},this.item);
    }
  },
  mounted() {
    this.getEditorialList();
    this.getAutorList();
  },
  props: ['item']
}
</script>
  
<style scoped></style>
  