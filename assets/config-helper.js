$(document).ready(() => {

    /**
     * 
     * Adding the city
     */
    document.getElementById("click-city").onclick = () => {
        alert('hello city!'); 
        var input = document.getElementById("city-input").value;
        document.getElementById("city-input").value = "";
    
        $.ajax({
            type: 'POST',
            url: '/config',
            data: {city : input},
            success: (data) => {
                console.log('as1');
            }
        });
    };
/**
 * 
 * Adding the moto
 */
    document.getElementById("click-moto").onclick = () => {
        alert('hello moto!'); 
        var input = document.getElementById("moto-input").value;
        document.getElementById("moto-input").value = "";
    
        $.ajax({
            type: 'POST',
            url: '/config',
            data: {moto : input},
            success: (data) => {
                console.log('as2');
            }
        });
    };
/**
 * 
 *  Adding the todo
 */
    document.getElementById("click-todo").onclick = () => { 
        alert('hello todo!'); 
        var input = document.getElementById("todo-input").value;
        document.getElementById("todo-input").value = "";
    
        $.ajax({
            type: 'POST',
            url: '/config',
            data: {todo : input},
            success: (data) => {
                console.log('sssas');
            }
        });
    };


});