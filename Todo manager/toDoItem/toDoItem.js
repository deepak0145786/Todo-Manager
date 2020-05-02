import { LightningElement, api, wire } from 'lwc';
import updateTodo from '@salesforce/apex/ToDoController.updateTodo';
import deleteTodo from '@salesforce/apex/ToDoController.deleteTodo';
import { CurrentPageReference } from 'lightning/navigation';
import { fireEvent } from 'c/pubsub';

export default class ToDoItem extends LightningElement {
    @api todoitem;
    
    @wire(CurrentPageReference) pageRef;
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
                fireEvent(this.pageRef, 'refreshTodoList');
            }).catch(error=>{
                console.error('Error in updatehandler=>', error);
            });
    }
    deleteHandler(){
        deleteTodo({todoId: this.todoitem.todoId}).then(response=>{
            console.log('Deleted successfully!');
            const deleteEvent = new CustomEvent('deletetodo');
                this.dispatchEvent(deleteEvent);
                
                fireEvent(this.pageRef, 'refreshTodoList');
                console.log('Deleted successfully!');
        }).catch(error=>{
            console.error('Error in deleteHandler=>', error);
        })
    }
}