<template>
    <div class="panel">
        <v-form ref="form" >
            <v-layout  row justify-start>
                <v-flex sm3>
                    <v-text-field
                            ref="taskName"
                            @keyup.enter="addTask"
                            v-model="taskName"
                            label="Task name"
                            single-line
                            :rules="[() => !!taskName || 'Необходимо ввести название задачи!']"
                    ></v-text-field>
                </v-flex>

                <v-flex  xs12 sm3>
                    <v-text-field
                            ref="taskContent"
                            @keyup.enter="addTask"
                            v-model="taskContent"
                            label="Task content"
                            single-line
                            :rules="[() => !!taskContent || 'Необходимо ввести описание задачи!']"
                            required
                    ></v-text-field>
                </v-flex>
            </v-layout>
        </v-form>
    </div>
</template>

<script>
    export default {
        name: 'CreateTask',
        data() {
            return {
                taskName: "",
                taskContent: ""
            }
        },
        methods: {
            addTask() {
                let taskContent = this.taskContent.trim();
                let taskName = this.taskName.trim();
                if (taskContent && taskName) {
                    console.log(this.$refs)
                    this.$refs.taskName.validate(true)
                    this.$refs.taskContent.validate(true)
                    this.$parent.addTask(this.taskName, this.taskContent)
                    this.$socket.emit("getTasks");
                    this.taskName = "";
                    this.taskContent = "";
                }
            }
        }
    }
</script>
