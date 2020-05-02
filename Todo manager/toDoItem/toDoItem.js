import { LightningElement, api } from 'lwc';
import updateTodo from '@salesforce/apex/ToDoController.updateTodo';
import deleteTodo from '@salesforce/apex/ToDoController.deleteTodo';

export default class ToDoItem extends LightningElement {
    @api todoitem;
    connectedCallback(){
        console.log('ToDoItem.js connectedCallback=>', JSON.stringify(this.todoitem));
    }
    get containerClass(){
        return this.todoitem.done ? "todo completed" : "todo upcoming";
    }
    get iconName(){
        return this.todoitem.done ? "utility:check" : "utility:add";
    }
    updateHandler(){
        const todo = {
            todoId : this.todoitem.todoId,
            todoName : this.todoitem.todoName,
            done : !this.todoitem.done
        }
        updateTodo(
            {
                payload : JSON.stringify(todo)
            }
            ).then(response=>{
                console.log('updated successfully!') ;
                const updateEvent = new CustomEvent('update');
                this.dispatchEvent(updateEvent);
            }).catch(error=>{
                console.error('Error in updatehandler=>', error);
            });

            
    }
    deleteHandler(){
        deleteTodo({todoId: this.todoitem.todoId}).then(response=>{
            console.log('Deleted successfully!');
            const deleteEvent = new CustomEvent('deletetodo');
                this.dispatchEvent(deleteEvent);
                console.log('Deleted successfully!');
        }).catch(error=>{
            console.error('Error in deleteHandler=>', error);
        })
    }
}