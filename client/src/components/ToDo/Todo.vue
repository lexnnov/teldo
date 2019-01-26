

<template>


  <div>


    <v-container fluid grid-list-xl>

      <CreateTask/>

      <v-layout row justify-space-around class="project-columns">
        <v-flex v-for="(items, key, index) in this.$store.state.tasks" :key="items.id" v-bind:id="'to_do'" class="project-column" sm4>

          <h4 class="project-column-name">
            <span>{{items.length}}</span>
            {{key}}
          </h4>
          <VuePerfectScrollbar class="scroll-area" :settings="options" >
            <Container v-if="rand" style="height: 90%; " group-name="1"
                       :get-child-payload="getPayload(key)"
                       @drop="onDrop(key, $event)">

              <Draggable v-for="item in items" :key="item.id" style="">

                <div v-bind:id="item.id" class="draggable-item"
                     style="background-color: white; padding: 10px; margin: 2px; border-radius: 10px; border: 1px solid rgb(212, 212, 212); ">
                  <ButtonDel v-bind:delItemId="item.id"/>

                  <h4 style="color: #0366d6;  padding: 0; line-height: 2; margin: 0px; ">
                    #{{item.tasknumber}} {{item.taskname}}</h4>
                  <div v-bind:id="item.id" class="draggable-item" style="padding: 10px 0">
                    {{item.taskcontent}}
                  </div>

                  <executer-select :keys="item.id" :value="item.executer" :users="$store.state.users.usersname"/>

                </div>

              </Draggable>

            </Container>


            <div v-else style="display: flex; height: 90%; align-items: center;  justify-content: center;">
              <div v-if="loading">
                <circle2/>

              </div >
              <div v-else>
                Нет задач
              </div>

            </div>
          </VuePerfectScrollbar>

        </v-flex>

      </v-layout>
    </v-container>

  </div>
</template>

<script>
  import VuePerfectScrollbar from 'vue-perfect-scrollbar';

  import { Circle2 } from 'vue-loading-spinner';
  import { Container, Draggable } from 'vue-smooth-dnd';
  import { applyDrag } from './helpers';
  import CreateTask from "../createTaskForm/CreateTask";
  import Logout from "../Logout/Logout";
  import ButtonDel from "../ButtonDel/ButtonDel";
  import ExecuterSelect from "../executerSelect/executerSelect";

  export default {
    name: 'ToDo',
    components: {
      ExecuterSelect,
      ButtonDel,
      CreateTask,
      Container,
      Draggable,
      Logout,
      Circle2,
      VuePerfectScrollbar
    },

    data() {

      return {
        from: "",
        to: "",
        taskPosition: '',
        options: {
          wheelSpeed: 0.4,
          swipeEasing: true,
        }
      };
    },
    methods: {


      getPayload(key) {
        return (
          key === 'to_do'
          ? this.getChildPayload1
          : key === 'in_progress'
          ? this.getChildPayload2
          : key === 'review'
          ? this.getChildPayload3
          : this.getChildPayload4
        );
      },

      onDrop(collection, dropResult) {

        this.$store.state.tasks[collection] = applyDrag(this.$store.state.tasks[collection], dropResult);

        if (dropResult.removedIndex !== null) {
          this.from = collection;
        }

        if (dropResult.addedIndex !== null) {
          this.to = collection;
          this.taskPosition = dropResult.addedIndex;

        }

        if (this.from && this.to) {
          this.setTask(this.from, this.to, dropResult.droppedElement.id, this.taskPosition);
          this.to = '';
          this.from = '';
          this.taskPosition = '';
        }
      },


      getChildPayload1(index) {
        return this.$store.state.tasks.to_do[index];
      },
      getChildPayload2(index) {
        return this.$store.state.tasks.in_progress[index];
      },
      getChildPayload3(index) {
        return this.$store.state.tasks.review[index];
      },
      getChildPayload4(index) {
        return this.$store.state.tasks.in_build[index];
      },

      addTask(taskName, taskContent) {

        this.$socket.emit("addTask", {
          task_name: taskName,
          task_content: taskContent,
          index: this.$store.state.tasks.to_do.length
        });
      },


      setTask(from, to, id, index) {
        this.$socket.emit("setTask", { from, to, id, index });
        // this.getTasks();
      },


      setTaskPosition(block, remove, add) {
        this.$socket.emit("setTaskPosition", { block, remove, add });
      }
    },

    computed: {
      rand() {

        if (this.$store.state.socket.isTasks) {
          console.log(true);
          return true;
        }
        console.log(false);
        return false; //ожидалось что app.rand будет давать случайное число
      },

      loading() {

        if (this.$store.state.socket.loading) {
          console.log(true);
          return true;
        }
        console.log(false);
        return false; //ожидалось что app.rand будет давать случайное число
      }

    }

  };
</script>

<style lang="scss">

  @import './Todo';

</style>
