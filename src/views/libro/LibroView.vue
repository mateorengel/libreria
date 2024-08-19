<template>
    <div>
        <Modal v-model:modelValue="showModalNuevo">
            <LibroNewView @on-register="onRegister()" />
        </Modal>
        <Modal v-model:modelValue="showModalEdit">
            <LibroEditView @on-update="onUpdate()" :item="itemToEdit" />
        </Modal>
        <h1>Lista de Libros</h1>
        <button @click="showModalNuevo = true" class="btn btn-primary">Nuevo</button>
        <button @click="buscar()" class="btn btn-lith" style="float:right">Buscar</button>
        <input type="search" style="float:right" v-model="textToSearch" @search="buscar()">
        <div style="margin: 20px 0;">
            <h3>Filtros:</h3>
            <form @submit.prevent="filtrar()">

                <label for="autor"> Autor: </label>
                <select id="autor" v-model="filter.autorId">
                    <option value="">Todos</option>
                    <option :value="autor.id" v-for="(autor, index) in autorList" :key="`autor-${index}`">{{ autor.nombre }}
                    </option>
                  </select>
                <button type="submit" class="btn btn-lith">Fitrar</button>
            </form>
        </div>
        <table>
            <thead>
                <tr>
                    <th>No.</th>
                    <th>Titulo</th>
                    <th>Genero</th>
                    <th>Autor</th>
                    <th>Numero de Paginas</th>
                    <th>Editorial</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in itemList" :key="index">
                    <td>{{ 1 + index }}</td>
                    <td>{{ item.titulo }}</td>
                    <td>{{ item.genero }}</td>
                    <td>{{ item.autor ? item.autor.nombre : 'Autor desconocido' }}</td>
                    <td>{{ item.numpaginas }}</td>
                    <td>{{ item.editorial.nombre }}</td>

                    <td>
                        <button @click="edit(item)" class="btn btn-dark" style="margin-right: 15px;">Editar</button>
                        <button @click="Eliminar(item.id)" class="btn btn-danger">Eliminar</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
  
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import Modal from '../../components/Modal.vue'
import LibroNewView from './LibroNewView.vue'
import LibroEditView from './LibroEditView.vue'
import AutorView from '../autor/AutorView.vue';


export default {
    name: 'Libro',
    data() {
        return {
            currentPage: 1,
            totalPages: 100, // Este valor debe ser calculado según tus datos
            showModalNuevo: false,
            showModalEdit: false,
            itemToEdit: null,
            textToSearch: '',
            textToFilter: '',
            itemList: [],
            autorList: [],
            path: '',
            filter: {
                
                autorId:''
            }
        }
    },
    components: {
        // Registro de componentes que se utilizaran.
        Modal,
        LibroNewView,
        LibroEditView,
        AutorView,
    },
    methods: {
        // métodos que se pueden llamar desde la plantilla o desde otras partes del componente.
        ...mapActions(['increment']),
        getList() {
            const vm = this;
            this.path = this.baseUrl + "/libros?_expand=editorial" + this.textToFilter + "&q=" + this.textToSearch;
            this.axios.get(this.path)
                .then(function (response) {
                    // Almacena la lista de libros obtenida
                    vm.itemList = response.data;
                    
                    // Asocia manualmente los autores a los libros
                    vm.itemList.forEach(libro => {
                        const autor = vm.autorList.find(a => a.id === libro.autorId);
                        libro.autor = autor || { nombre: 'Autor desconocido' };

                        const editorial = vm.editorialList.find(e => e.id === libro.editorialId);
                        libro.editorial = editorial || { nombre: 'Editorial desconocida' };
                    });
                })
                .catch(function (error) {
                    console.error(error);
                });
        },
        getAutorList() {
            return this.axios.get(this.baseUrl + "/autores")
                .then(response => {
                    this.autorList = response.data;
                })
                .catch(error => {
                    console.error(error);
                });
        },
        getEditorialList() {
            return this.axios.get(this.baseUrl + "/editoriales")
                .then(response => {
                    this.editorialList = response.data;
                })
                .catch(error => {
                    console.error(error);
                });
        },

        edit(item) {
            this.itemToEdit = Object.assign({}, item);
            this.showModalEdit = true;
        },
        Eliminar(id) {
            if (confirm("¿Esta Seguro de eliminar el registro?")) {
                const vm = this;
                this.axios.delete(this.baseUrl + "/libros/" + id)
                    .then(function (response) {
                        vm.getList();
                        vm.$toast.show("Registro eliminado.", "danger");
                    })
                    .catch(function (error) {
                        console.error(error);
                    });
            }

        },
        buscar() {
            this.getList();
        },
        filtrar() {
            this.textToFilter = '';
            
            if (this.filter.autorId != null && this.filter.autorId != '') {
                this.textToFilter += "&autorId=" + this.filter.autorId;
            }
            this.getList();
        },
        onRegister(event) {
            this.getList();
            this.showModalNuevo = false;
            this.$toast.show('Registro exitoso', 'success');
        },
        onUpdate(event) {
            this.getList();
            this.showModalEdit = false;
            this.itemToEdit = null;
            this.$toast.show('Edicion exitosa', 'info');
        },
        showToast(message, type) {
            this.$toast.show(message, type);
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
    props: {
        // propiedades que el componente puede recibir.
    },
    mounted() {
        const vm = this;
        // Cargar autores y editoriales antes de cargar los libros
        Promise.all([this.getAutorList(), this.getEditorialList()])
        .then(() => {
            vm.getList();
        });
    },
    emits: [] // los eventos personalizados que el componente puede emitir.
}
</script>
  
<style></style>