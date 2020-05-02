import { LightningElement, api } from "lwc";

export default class ToDoListItem extends LightningElement {
  @api todo;

  get containerClass() {
    return this.todo.done ? "todo completed" : "todo upcoming";
  }
}