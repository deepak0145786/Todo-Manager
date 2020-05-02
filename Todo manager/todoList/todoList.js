import { LightningElement, wire, track } from "lwc";
import getAllTodos from "@salesforce/apex/ToDoController.getAllTodos";
import { CurrentPageReference } from 'lightning/navigation';
import { registerListener, unregisterAllListeners, fireEvent } from 'c/pubsub';
import { refreshApex } from '@salesforce/apex';

export default class TodoList extends LightningElement {
    @track todos = [];
    @track loading = true;
    todoList;
    /** Wired Apex result so it can be refreshed programmatically */
    wiredTodoResult;
    @wire(CurrentPageReference) pageRef;
    @wire(getAllTodos)
    wiredData(result) {
        this.wiredTodoResult = result;
        console.log('Result=>',JSON.parse(JSON.stringify(result)));
        console.log(result.data);
        this.loading = false;
        if (result.data) {
            this.todoList = result.data;
            this.groupTodo(result.data);
        } else if (result.error) {
            console.error(result.error);
        }
        
    }
    connectedCallback() {
        // subscribe to refreshTodoList event
        registerListener('refreshTodoList', this.reloadTodoList, this);
    }

    disconnectedCallback() {
        // unsubscribe from refreshTodoList event
        unregisterAllListeners(this);
    }
    reloadTodoList() {
        return refreshApex(this.wiredTodoResult);
    }
    groupTodo(todos){
        let todosMap = new Map();
        todos.map(todo=>{
            if (!todosMap.has(todo.todoDate)) {
                todosMap.set(todo.todoDate, []);
            }
            todosMap.get(todo.todoDate).push(todo);
        });
        let todoList = [];
        for (let key of todosMap.keys()) {
            const todoItem = { date: key, items: todosMap.get(key) };
            todoList.push(todoItem);
        }
        this.todos = todoList;
        this.loading = false;
    }
}