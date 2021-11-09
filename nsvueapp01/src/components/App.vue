<template>
  <Page>
    <ActionBar title="ToDoリスト" class="action-bar" />
    <TabView height="100%" androidTabsPosition="bottom">
      <TabViewItem title="ToDo入力">
        <StackLayout width="80%" height="25%">
          <TextField
            editable="true"
            hint="ToDo名"
            v-model="textFieldNameValue"
            class="m-b-20"
          />
          <TextField
            editable="true"
            hint="説明"
            v-model="textFieldDescriptionValue"
            class="m-b-20"
          />
          <Button text="ToDoリストに追加" @tap="onButtonTap" />
        </StackLayout>
      </TabViewItem>
      <TabViewItem title="ToDo確認">
        <ListView for="todo in ToDos" @itemTap="onDoneTap">
          <v-template>
            <Label
              id="active-task"
              :text="`${todo.name}:${todo.description}`"
              textWrap="true"
            />
          </v-template>
        </ListView>
      </TabViewItem>
    </TabView>
  </Page>
</template>

<script lang="ts">
import { action } from "@nativescript/core";

interface Todo {
  name: string;
  description: string;
}
export default {
  data(): {
    ToDos: Todo[];
    textFieldNameValue: string;
    textFieldDescriptionValue: string;
  } {
    return {
      ToDos: [],
      textFieldNameValue: "",
      textFieldDescriptionValue: "",
    };
  },
  methods: {
    async onButtonTap() {
      if (
        this.textFieldNameValue === "" ||
        this.textFieldDescriptionValue === ""
      )
        return;
      try {
        await alert({
          title: "追加メッセージ",
          message: `${this.textFieldNameValue}を追加しました`,
          okButtonText: "OK",
        });
      } catch (e) {
        console.error(e);
      }
      // ToDoを追加する
      this.ToDos.push({
        name: this.textFieldNameValue,
        description: this.textFieldDescriptionValue,
      });
      // ToDo追加後、テキストフィールドを空にする
      this.reset();
    },
    reset() {
      this.textFieldNameValue = "";
      this.textFieldDescriptionValue = "";
    },
    async onDoneTap(event: { index: number; item: Todo }): Promise<void> {
      const okMessage = "このToDoを削除しますか？";
      const cancelMessage = "戻る";
      const deleteToDoMessage = "ToDoリストから削除";
      try {
        const result: string = await action(okMessage, cancelMessage, [
          deleteToDoMessage,
        ]);
        switch (result) {
          case deleteToDoMessage:
            // event : https://nativescript-vue.org/ja/docs/elements/components/list-view/#events
            this.ToDos.splice(event.index, 1);
            break;
          case cancelMessage:
            break;
        }
      } catch (e) {
        console.error(e);
      }
    },
  },
};
</script>

<style scoped>
ActionBar {
  background-color: #53ba82;
  color: #ffffff;
}
#active-task {
  font-size: 20;
  color: black;
  margin-left: 10;
  padding-top: 5;
  padding-bottom: 10;
}
</style>
