
 

$( document ).ready(function() {
goalIDCounter = 0; //each new goal gets a new id

c = new Date()
console.log(c)

$( '#master' ).on("click","#submitTime",function(){  //must use .on() if you want to update updates. 
 



    let reviewTime = $('#reviewTime').val()
    console.log(String(reviewTime));
    let package = ({ 'reviewTime' : reviewTime}); 
    console.log(package)
     $.ajax({
         url:"/ajaxreviewtime",
         data: package,
         type: 'POST',
         contentType :  "application/x-www-form-urlencoded; charset=UTF-8",
     }).done(function(){
         console.log('updated time submitted')
        
     })//end done
     .fail(function( xhr, status, errorThrown ) {
      alert( "Sorry, there was a problem!" );
      console.log( "Error: " + errorThrown );
      console.log( "Status: " + status );
      console.dir( xhr );
    })

 
});

$('#master').append('<ul id="unordered"></ul>');

    //AJAX call for data
        $.ajax({
            url:"/ajax",
            data: 'dummy data',
            dataType : "text",
        }).done(    function laterFunction(response_set){
            let rows = JSON.parse(response_set)
            for (let i = 0; i < rows.length; i++){
              let preload = { };
              preload.title = rows[i].title;
              preload.content = rows[i].content;
              newGoal('#unordered',preload);
            }; //end for loop
            }) //end done.
        .fail(function( xhr, status, errorThrown ) {
         alert( "Sorry, there was a problem!" );
         console.log( "Error: " + errorThrown );
         console.log( "Status: " + status );
         console.dir( xhr );
       })
       // Code to run regardless of success or failure;
       .always(function( xhr, status ) {  
    });


     

$( '#master' ).on("click",".newGoal",function(){  //must use .on() if you want to update updates. 
 
    newGoal('#unordered');
 
});

function deleteGoal(thisID){
    grabber = "#" + thisID
    console.log(grabber)
    $(grabber).fadeOut(300,function(){$(grabber).remove()});
};

$( '#master' ).on("click",".deleteGoalclass",function(){  //must use .on() if you want to update updates. 
    let package = $(this).parents('form').serializeArray();
    let thisID = $(this).parents('li').attr('id');
    console.log(thisID)
    // package.push({name:'goal', value:'ID'}); 
    // x = package[2].value; 
   // console.log(String(x));
     $.ajax({
         url:"/deletegoal",
         data: package,
         type: 'POST',
         contentType :  "application/x-www-form-urlencoded; charset=UTF-8",
     }).done(function(){
         console.log('flag3')
         deleteGoal(thisID);
     })//end done
     .fail(function( xhr, status, errorThrown ) {
     //  alert( "Sorry, there was a problem!" );
      console.log( "Error: " + errorThrown );
      console.log( "Status: " + status );
      //console.dir( xhr );
    })
    // Code to run regardless of success or failure;
 //    .always(function( xhr, status ) {
 //      alert( "The request is complete!" );
 //    });
 //    function laterFunction(responset){
 //      console.log(responset)
 //  }
});


function newGoal(appendTo,preload){
    if(!preload){
        goalIDCounter++;
        goalID = 'goalId' + goalIDCounter;
        stringthis = '<li id =' + goalID + '><div id ='+'\'div'+goalID+'\'>'+'<form id = form'+goalID+'>\
        <label for="title">Title</label>\
            <input type="text" name="title"><br>\
            <label for="content">description<label><br>\
            <textarea name="content" ></textarea><br>\
            <button type ="button" class ="deleteGoalclass">delete</button>\
        </form>\
        <button type ="button" class ="submission">submit</button>\
        <button type ="button" class ="newGoal">new goal</button>\
         <input type= "checkbox" class = "checkbox">\
        </div></li>\
        '
        
        $(appendTo).append(stringthis);
        console.log(goalID)
}//end if
else{
    goalIDCounter++;
    goalID = 'goalId' + goalIDCounter;
    stringthis = '<li id =' + goalID + '><div id ='+'\'div'+goalID+'\'>'+'<form id = form'+goalID+'>\
    <label for="title">Title</label>\
        <input type="text" name="title" '+'value="'+preload.title +'"><br>\
        <label for="content">description<label><br>\
        <textarea name="content">'+preload.content+'</textarea><br>\
        <button type ="button" class ="deleteGoalclass">delete</button>\
    </form>\
    <button type ="button" class ="submission">submit</button>\
    <button type ="button" class ="newGoal">new goal</button>\
    <input type= "checkbox" class = "checkbox">\
    </div></li>\
    '
    $(appendTo).append(stringthis);
    console.log(goalID)
    };
};//end newGoal



//AJAX POST data

$( '#master' ).on("click",".submission",function(){  //must use .on() if you want to update updates. 
    let package = $(this).parents('form').serializeArray();
    let timestamp = new Date(Date.getTime() + Date.getTimezoneOffset()*60*1000);
    console.log(timestamp.toJSON());
    console.log(timestamp)
    package.push({name:'timestamp', value:timestamp}); 
    x = package[2].value; 
   console.log(String(x));
     $.ajax({
         url:"/postajax",
         data: package,
         type: 'POST',
         contentType :  "application/x-www-form-urlencoded; charset=UTF-8",
     }).done(function(){
         console.log('submission complete')
     })//end done
     .fail(function( xhr, status, errorThrown ) {
     //  alert( "Sorry, there was a problem!" );
      console.log( "Error: " + errorThrown );
      console.log( "Status: " + status );
      //console.dir( xhr );
    })
    // Code to run regardless of success or failure;
 //    .always(function( xhr, status ) {
 //      alert( "The request is complete!" );
 //    });
 //    function laterFunction(responset){
 //      console.log(responset)
 //  }



 });

 $( '#master' ).on("change",".checkbox",function(){  
  if ($('input.checkbox:checkbox').length == $('input.checkbox:checkbox:checked').length){
         console.log('all checked')
         console.log($('input.checkbox:checkbox').length)
         console.log( $('input.checkbox:checkbox:checked').length)
         let timestamp = new Date().toJSON();
         
         let package = []
         package.push({name:'timestamp', value:timestamp}); 
         x = package[0].value; 
        console.log(String(x));
          $.ajax({
              url:"/updatetime",
              data: package,
              type: 'POST',
              contentType :  "application/x-www-form-urlencoded; charset=UTF-8",
          }).done(function(){
              console.log('submission complete')
          })//end done
          .fail(function( xhr, status, errorThrown ) {
          //  alert( "Sorry, there was a problem!" );
           console.log( "Error: " + errorThrown );
           console.log( "Status: " + status );
           //console.dir( xhr );
         })

  }//end if
  else{
      console.log('not all checked')
      console.log($('input.checkbox:checkbox').length)
      console.log( $('input.checkbox:checkbox:checked').length)
     }
 });//end checkbox 



}); //end on load

// <button type ="button" id =' + 'button' + goalID +' OnClick= "deleteGoal(\'' + goalID+'\')">delete</button>\
/*
JQery, to select a class, use ".", to select by ID, use "#". These get passed into the $() object. https://learn.jquery.com/using-jquery-core/selecting-elements/
https://makeawebsitehub.com/jquery-mega-cheat-sheet/

$(#IDNAME).append('ADD HTML HERE')  //The append method puts this inside whatever element is #IDNAME. This is a good way to put li inside of ul. 
*/
