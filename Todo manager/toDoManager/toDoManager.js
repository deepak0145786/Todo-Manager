import { LightningElement, track, wire } from 'lwc';
import addTodo from '@salesforce/apex/ToDoController.addTodo';
import getCurrentTodos from '@salesforce/apex/ToDoController.getCurrentTodos';
import { CurrentPageReference } from 'lightning/navigation';
import { fireEvent } from 'c/pubsub';
export default class ToDoManager extends LightningElement {
    @track time = "8:12 AM";
    greeting = "Good Evening";
    @track todos = [];
    @wire(CurrentPageReference) pageRef;

    connectedCallback(){
        this.setGreetingAndTime();
        
        //this.populateTodos();
        setInterval(()=>{
            this.setGreetingAndTime();
        },1000);
        this.fetchTodos();
    }

    setGreetingAndTime(){
        let todaDate = new Date();
        let hours = todaDate.getHours();
        this.time = todaDate.toLocaleTimeString({ hour12: true});
        if(hours <12){
            this.greeting = "Good Morning";
        }else if(hours >= 12 && hours <17){
            this.greeting = "Good Afternoon";
        }else{
            this.greeting = "Good Evening";
        }
    }
    handleClick(){
        const inputBox = this.template.querySelector('lightning-input');
        const todo = {
            todoId : this.todos.length,
            todoName: inputBox.value,
            done:false,
            //todoDate : new Date()
        }
        addTodo({
            payload: JSON.stringify(todo)
        }).then(response=>{
            console.log('Inserted Successfully!');
            this.fetchTodos();
            fireEvent(this.pageRef, 'refreshTodoList');
        }).catch(error=>{
            console.error('Error in addTodo=>', error);
        });
        //this.todos.push(todo);
        inputBox.value = '';
    }
    
    get upcomingTasks(){
        return this.todos.filter((todo)=> !todo.done );
    }
    get completedTasks(){
        return this.todos.filter((todo)=> todo.done );
    }
    populateTodos(){
        const todos = [
            {
                todoId : 0,
                todoName : "Wash the car",
                done : false,
                todoDate : new Date()
            },
            {
                todoId : 1,
                todoName : "Feed the dog",
                done : false,
                todoDate : new Date()
            },
            {
                todoId : 2,
                todoName : "send email to manager",
                done : true,
                todoDate : new Date()
            },

        ];
        this.todos = todos;
    }
    fetchTodos(){
        getCurrentTodos().then(response=>{
            console.log(response.length);
            console.log(JSON.stringify(response));
            if(response){
                this.todos = response;
            }
        }).catch(error=>{
            console.error('Error in getCurrentTodos', error);
        })
    }
    updateHandler(){
        this.fetchTodos();
    }
    deleteHandler(){
        console.log('deleteHandler');
        this.fetchTodos();
    }
}